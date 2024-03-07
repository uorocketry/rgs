use log::info;
use messages::mavlink::connect;
use serialport::{available_ports, SerialPortType};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tonic::{async_trait, Request, Response, Status};

use crate::data_feed_service::proto::serial_data_feed_server::*;
use crate::data_feed_service::proto::{
    Empty, ListAvailablePortsResponse, SerialDataFeedConfig, SerialDataFeedStatus,
};
use crate::data_feed_service::serial::iterator::SerialDataFeedIterator;
use crate::database_service::service::DatabaseService;

use messages::mavlink::uorocketry::MavMessage;

pub struct SerialDataFeedService {
    iterator: SerialDataFeedIterator,
    database_service: Arc<DatabaseService>,
}

impl SerialDataFeedService {
    pub fn new(database_service: Arc<DatabaseService>) -> SerialDataFeedService {
        SerialDataFeedService {
            iterator: SerialDataFeedIterator {
                is_running: Arc::new(AtomicBool::new(false)),
                mavlink: Arc::new(Mutex::new(None)),
                config: Arc::new(Mutex::new(None)),
            },
            database_service,
        }
    }
}

#[async_trait]
impl SerialDataFeed for SerialDataFeedService {
    async fn start(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(true, Ordering::Relaxed);

        let mut iterator = self.iterator.clone();
        let database_service = self.database_service.clone();

        tokio::spawn(async move {
            info!("SerialDataFeedService has started.");
            while let Some(message) = iterator.next() {
                database_service.save(message);
            }
        });

        Ok(Response::new(Empty {}))
    }

    async fn stop(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(false, Ordering::Relaxed);
        Ok(Response::new(Empty {}))
    }

    async fn list_available_ports(
        &self,
        request: Request<Empty>,
    ) -> Result<Response<ListAvailablePortsResponse>, Status> {
        let ports = available_ports()
            .unwrap()
            .iter()
            .filter(|port| matches!(port.port_type, SerialPortType::UsbPort(_)))
            .map(|port| port.port_name.clone())
            .collect::<Vec<String>>();
        Ok(Response::new(ListAvailablePortsResponse { ports }))
    }

    async fn configure(
        &self,
        request: Request<SerialDataFeedConfig>,
    ) -> Result<Response<Empty>, Status> {
        let config = request.into_inner();

        let mut mavlink = self.iterator.mavlink.lock().unwrap();
        *mavlink = Some(
            connect::<MavMessage>(format!("serial:{}:{}", config.port, config.baud_rate).as_str())
                .unwrap(),
        );

        Ok(Response::new(Empty {}))
    }

    async fn get_status(
        &self,
        request: Request<Empty>,
    ) -> Result<Response<SerialDataFeedStatus>, Status> {
        Ok(Response::new(SerialDataFeedStatus {
            is_running: self.iterator.is_running.load(Ordering::Relaxed),
            config: self.iterator.config.lock().unwrap().clone(),
        }))
    }
}
