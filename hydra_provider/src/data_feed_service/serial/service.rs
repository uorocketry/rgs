use log::info;
use serialport::{available_ports, SerialPortType};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::{async_trait, Code, Request, Response, Status};

use crate::data_feed_service::proto::serial_data_feed_server::*;
use crate::data_feed_service::proto::{
    Empty, ListAvailablePortsResponse, SerialDataFeedConfig, SerialDataFeedStatus,
};
use crate::data_feed_service::serial::iterator::SerialDataFeedIterator;
use crate::database_service::DatabaseService;
use crate::mavlink_service::MavlinkService;

#[derive(Clone)]
pub struct SerialDataFeedService {
    iterator: SerialDataFeedIterator,
    database_service: Arc<Mutex<DatabaseService>>,
    mavlink_service: Arc<Mutex<MavlinkService>>,
}

impl SerialDataFeedService {
    pub fn new(
        database_service: Arc<Mutex<DatabaseService>>,
        mavlink_service: Arc<Mutex<MavlinkService>>,
    ) -> SerialDataFeedService {
        SerialDataFeedService {
            iterator: SerialDataFeedIterator {
                is_running: Arc::new(AtomicBool::new(false)),
                mavlink_service: mavlink_service.clone(),
                config: Arc::new(Mutex::new(None)),
            },
            database_service,
            mavlink_service: mavlink_service.clone(),
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
            while let Some(message) = iterator.next().await {
                // SHOULD DO: figure out how to handle database save errors better
                let _ = database_service.lock().await.save(message).await;
            }
            info!("SerialDataFeedService has stopped.");
        });

        Ok(Response::new(Empty {}))
    }

    async fn stop(&self, _request: Request<Empty>) -> Result<Response<Empty>, Status> {
        self.iterator.is_running.store(false, Ordering::Relaxed);
        Ok(Response::new(Empty {}))
    }

    async fn list_available_ports(
        &self,
        _request: Request<Empty>,
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
        let result = self.mavlink_service
            .lock()
            .await
            .reconnect(config.port, config.baud_rate);

        match result {
            Ok(_) => Ok(Response::new(Empty {})),
            Err(error) => Err(Status::new(Code::Internal, format!("{error:?}"))),
        }
    }

    async fn get_status(
        &self,
        _request: Request<Empty>,
    ) -> Result<Response<SerialDataFeedStatus>, Status> {
        Ok(Response::new(SerialDataFeedStatus {
            is_running: self.iterator.is_running.load(Ordering::Relaxed),
            config: self.iterator.config.lock().await.clone(),
        }))
    }
}
