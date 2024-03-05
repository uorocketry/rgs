use std::vec;

use log::info;
use serialport::available_ports;

use self::connection_manager_server::ConnectionManager;
use crate::hydra_provider_proto::hydra_provider_proto::*;

#[derive(Default)]
pub struct ConnectionManagerImpl {}

#[tonic::async_trait]
impl ConnectionManager for ConnectionManagerImpl {
    async fn check_connection(
        &self,
        request: tonic::Request<Empty>,
    ) -> Result<tonic::Response<CheckConnectionReply>, tonic::Status> {
        info!("[check_connection] Got a request: {:?}", request);
        let reply = CheckConnectionReply {
            connected: true,
            connection_type: ConnectionType::Serial as i32,
            errors: vec![],
        };
        Ok(tonic::Response::new(reply))
    }

    async fn get_connection_type(
        &self,
        request: tonic::Request<Empty>,
    ) -> Result<tonic::Response<ConnectionTypeMessage>, tonic::Status> {
        info!("[get_connection_type] Got a request: {:?}", request);
        let reply = ConnectionTypeMessage {
            connection_type: ConnectionType::Serial as i32,
        };
        Ok(tonic::Response::new(reply))
    }

    async fn set_connection_type(
        &self,
        request: tonic::Request<ConnectionTypeMessage>,
    ) -> Result<tonic::Response<Empty>, tonic::Status> {
        info!("[set_connection_type] Got a request: {:?}", request);
        Ok(tonic::Response::new(Empty {}))
    }

    async fn get_serial_ports(
        &self,
        request: tonic::Request<Empty>,
    ) -> Result<tonic::Response<GetSerialPortsReply>, tonic::Status> {
        info!("ConnectionManager:get_serial_ports called");

        let serial_ports = available_ports()
            .unwrap()
            .iter()
            // .filter(|x| matches!(x.port_type, SerialPortType::UsbPort(_)))
            .map(|x| x.port_name.clone())
            .collect::<Vec<String>>();

        Ok(tonic::Response::new(GetSerialPortsReply {
            ports: serial_ports,
        }))
    }

    async fn set_preferred_serial_port(
        &self,
        request: tonic::Request<SetSerialConnectionRequest>,
    ) -> Result<tonic::Response<Empty>, tonic::Status> {
        info!("[set_preferred_serial_port] Got a request: {:?}", request);
        Ok(tonic::Response::new(Empty {}))
    }
}
