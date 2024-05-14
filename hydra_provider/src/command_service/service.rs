use std::sync::Arc;

use messages::command::{
    Command, CommandData, DeployDrogue, DeployMain, PowerDown, RadioRate, RadioRateChange,
};
use messages::mavlink::uorocketry::{MavMessage, POSTCARD_MESSAGE_DATA};
use messages::sender::Sender;
use messages::Message;
use tokio::sync::Mutex;
use tonic::{async_trait, Request, Response, Status};

use super::commands;
use crate::command_service::proto;
use crate::command_service::proto::{command_dispatcher_server::CommandDispatcher, CommandName};
use crate::mavlink_service::MavlinkService; // Import traits

pub struct CommandService {
    mavlink_service: Arc<Mutex<MavlinkService>>,
}

#[async_trait]
impl CommandDispatcher for CommandService {
    async fn dispatch(
        &self,
        request: Request<proto::Command>,
    ) -> Result<Response<proto::Empty>, Status> {
        let request: proto::Command = request.into_inner();
        let command = self.map_proto_command_to_command(request);
        let mavlink_message = self.build_mavlink_message_from_command(command);
        self.mavlink_service.lock().await.write(&mavlink_message);
        Ok(Response::new(proto::Empty {}))
    }
}

impl CommandService {
    pub fn new(mavlink_service: Arc<Mutex<MavlinkService>>) -> CommandService {
        CommandService { mavlink_service }
    }

    fn build_mavlink_message_from_command(&self, command: Command) -> MavMessage {
        let message: Message = Message {
            timestamp: 0, // SHOULD DO: figure out if hydra is
            sender: Sender::GroundStation,
            data: command.into(),
        };

        MavMessage::POSTCARD_MESSAGE(POSTCARD_MESSAGE_DATA {
            message: postcard::to_vec(&message).ok().unwrap(),
        })
    }

    fn map_proto_command_to_command(&self, request: proto::Command) -> Command {
        let command_data = match request.name() {
            CommandName::PowerDown => {
                let board = self.map_proto_board_to_sender(request.data.unwrap().board());
                CommandData::PowerDown(PowerDown { board })
            }
            CommandName::DeployDrogue => CommandData::DeployDrogue(DeployDrogue { val: true }),
            CommandName::DeployMain => CommandData::DeployMain(DeployMain { val: true }),
            CommandName::RadioRateChange => CommandData::RadioRateChange(RadioRateChange {
                rate: self.map_proto_radio_rate_to_radio_rate(request.data.unwrap().radio_rate()),
            }),
        };

        Command { data: command_data }
    }

    // Maps the enum from proto for boards to our enum for boards
    fn map_proto_board_to_sender(&self, board: proto::Board) -> Sender {
        match board {
            proto::Board::Sensor => Sender::SensorBoard,
            proto::Board::Recovery => Sender::RecoveryBoard,
            proto::Board::Communication => Sender::CommunicationBoard,
            proto::Board::Power => Sender::PowerBoard,
            proto::Board::Camera => Sender::CameraBoard,
        }
    }

    // Maps the enum from proto for RadioRate to our enum for RadioRate
    fn map_proto_radio_rate_to_radio_rate(&self, radio_rate: proto::RadioRate) -> RadioRate {
        match radio_rate {
            proto::RadioRate::Fast => RadioRate::Fast,
            proto::RadioRate::Slow => RadioRate::Slow,
        }
    }
}
