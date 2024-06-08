use std::sync::Arc;

use messages::command::{
    Command, CommandData, DeployDrogue, DeployMain, PowerDown, RadioRate, RadioRateChange,
};
use messages::mavlink::error::MessageWriteError;
use messages::mavlink::uorocketry::{MavMessage, POSTCARD_MESSAGE_DATA};
use messages::sender::Sender;
use messages::Message;
use tokio::sync::Mutex;
use tonic::{async_trait, Code, Request, Response, Status};

use crate::command_service::proto;
use crate::command_service::proto::{
    command_dispatcher_server::CommandDispatcher, DeployDrogueData, DeployMainData, PowerDownData,
    RadioRateChangeData,
};
use crate::mavlink_service::MavlinkService; // Import traits

pub struct CommandService {
    mavlink_service: Arc<Mutex<MavlinkService>>,
}

#[async_trait]
impl CommandDispatcher for CommandService {
    async fn dispatch_deploy_drogue(
        &self,
        request: Request<DeployDrogueData>,
    ) -> Result<Response<proto::Empty>, Status> {
        let result = self
            .dispatch_command(Command {
                data: CommandData::DeployDrogue(DeployDrogue {
                    val: request.into_inner().val,
                }),
            })
            .await;

        match result {
            Ok(_) => Ok(Response::new(proto::Empty {})),
            Err(error) => Err(Status::new(Code::Internal, format!("{error:?}"))),
        }
    }

    async fn dispatch_deploy_main(
        &self,
        request: Request<DeployMainData>,
    ) -> Result<Response<proto::Empty>, Status> {
        let result = self
            .dispatch_command(Command {
                data: CommandData::DeployMain(DeployMain {
                    val: request.into_inner().val,
                }),
            })
            .await;

        match result {
            Ok(_) => Ok(Response::new(proto::Empty {})),
            Err(error) => Err(Status::new(Code::Internal, format!("{error:?}"))),
        }
    }

    async fn dispatch_power_down(
        &self,
        request: Request<PowerDownData>,
    ) -> Result<Response<proto::Empty>, Status> {
        let result = self
            .dispatch_command(Command {
                data: CommandData::PowerDown(PowerDown {
                    board: match request.into_inner().board() {
                        proto::Board::Sensor => Sender::SensorBoard,
                        proto::Board::Recovery => Sender::RecoveryBoard,
                        proto::Board::Communication => Sender::CommunicationBoard,
                        proto::Board::Power => Sender::PowerBoard,
                        proto::Board::Camera => Sender::CameraBoard,
                    },
                }),
            })
            .await;

        match result {
            Ok(_) => Ok(Response::new(proto::Empty {})),
            Err(error) => Err(Status::new(Code::Internal, format!("{error:?}"))),
        }
    }

    async fn dispatch_radio_rate_change(
        &self,
        request: Request<RadioRateChangeData>,
    ) -> Result<Response<proto::Empty>, Status> {
        let result = self
            .dispatch_command(Command {
                data: CommandData::RadioRateChange(RadioRateChange {
                    rate: match request.into_inner().rate() {
                        proto::RadioRate::Fast => RadioRate::Fast,
                        proto::RadioRate::Slow => RadioRate::Slow,
                    },
                }),
            })
            .await;

        match result {
            Ok(_) => Ok(Response::new(proto::Empty {})),
            Err(error) => Err(Status::new(Code::Internal, format!("{error:?}"))),
        }
    }
}

impl CommandService {
    pub fn new(mavlink_service: Arc<Mutex<MavlinkService>>) -> CommandService {
        CommandService { mavlink_service }
    }

    async fn dispatch_command(&self, command: Command) -> Result<usize, MessageWriteError> {
        let message: Message = Message {
            timestamp: 0, // SHOULD DO: figure out if hydra is
            sender: Sender::GroundStation,
            data: command.into(),
        };

        let mavlink_message = MavMessage::POSTCARD_MESSAGE(POSTCARD_MESSAGE_DATA {
            message: postcard::to_vec(&message).ok().unwrap(),
        });

        self.mavlink_service.lock().await.write(&mavlink_message)
    }
}
