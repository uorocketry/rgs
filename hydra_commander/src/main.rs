use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use std::io;

use clap::Parser;
use mavlink::uorocketry::MavMessage;
use mavlink::{connect, MavConnection, MavHeader};
use tracing::{error, info};
use tracing_subscriber;

fn get_connection(
    address: &str,
    port: u16,
) -> io::Result<Box<dyn MavConnection<MavMessage> + Sync + Send>> {
    let connection_string = format!("tcpout:{}:{}", address, port);
    info!("Connecting to MAVLink on {:?}", connection_string);

    match connect::<MavMessage>(&connection_string) {
        Ok(connection) => {
            info!("Successfully connected");
            return Ok(connection);
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error);
        }
    };
}

#[get("/deploy_drogue")]
async fn deploy_drogue() -> impl Responder {
    let args = Args::parse();
    let connection = match get_connection(&args.mav_address, args.mav_port) {
        Ok(connection) => connection,
        Err(error) => {
            error!("Failed to connect to MAVLink: {}", error);
            return HttpResponse::InternalServerError()
                .body(format!("Failed to connect to MAVLink: {}", error));
        }
    };

    let deploy_cmd = messages::Message::new(
        0,
        messages::sender::Sender::GroundStation,
        messages::command::Command::new(messages::command::DeployDrogue { val: true }),
    );

    let mut buf = [0u8; 255];
    let data = postcard::to_slice(&deploy_cmd, &mut buf).unwrap();
    let mut fixed_payload = [0u8; 255];
    let len = data.len().min(255);
    fixed_payload[..len].copy_from_slice(&data[..len]);

    let send_msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
        message: fixed_payload,
    });

    match connection.send(
        &MavHeader {
            component_id: 0,
            sequence: 0,
            system_id: 0,
        },
        &send_msg,
    ) {
        Ok(_) => {
            return HttpResponse::Ok().body("Message sent successfully");
        }
        Err(err) => {
            return HttpResponse::InternalServerError()
                .body(format!("Failed to send message: {}", err));
        }
    }
}

#[get("/deploy_main")]
async fn deploy_main() -> impl Responder {
    let args = Args::parse();
    let connection = match get_connection(&args.mav_address, args.mav_port) {
        Ok(connection) => connection,
        Err(error) => {
            error!("Failed to connect to MAVLink: {}", error);
            return HttpResponse::InternalServerError()
                .body(format!("Failed to connect to MAVLink: {}", error));
        }
    };

    let deploy_cmd = messages::Message::new(
        0,
        messages::sender::Sender::GroundStation,
        messages::command::Command::new(messages::command::DeployMain { val: true }),
    );

    let mut buf = [0u8; 255];
    let data = postcard::to_slice(&deploy_cmd, &mut buf).unwrap();
    let mut fixed_payload = [0u8; 255];
    let len = data.len().min(255);
    fixed_payload[..len].copy_from_slice(&data[..len]);

    let send_msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
        message: fixed_payload,
    });

    match connection.send(
        &MavHeader {
            component_id: 0,
            sequence: 0,
            system_id: 0,
        },
        &send_msg,
    ) {
        Ok(_) => {
            return HttpResponse::Ok().body("Message sent successfully");
        }
        Err(err) => {
            return HttpResponse::InternalServerError()
                .body(format!("Failed to send message: {}", err));
        }
    }
}

#[derive(Deserialize)]
struct PowerDownParams {
    board: String,
}

#[get("/power_down/{board}")]
async fn power_down(path: web::Path<PowerDownParams>) -> impl Responder {
    let board = path.into_inner();
    let board = match board.board.as_str() {
        "GroundStation" => messages::sender::Sender::GroundStation,
        "SensorBoard" => messages::sender::Sender::SensorBoard,
        "RecoveryBoard" => messages::sender::Sender::RecoveryBoard,
        "CommunicationBoard" => messages::sender::Sender::CommunicationBoard,
        "PowerBoard" => messages::sender::Sender::PowerBoard,
        "CameraBoard" => messages::sender::Sender::CameraBoard,
        "BeaconBoard" => messages::sender::Sender::BeaconBoard,
        _ => {
            return HttpResponse::BadRequest().body("Invalid board name");
        }
    };

    let args = Args::parse();
    let connection = match get_connection(&args.mav_address, args.mav_port) {
        Ok(connection) => connection,
        Err(error) => {
            error!("Failed to connect to MAVLink: {}", error);
            return HttpResponse::InternalServerError()
                .body(format!("Failed to connect to MAVLink: {}", error));
        }
    };

    let power_down_cmd = messages::Message::new(
        0,
        messages::sender::Sender::GroundStation,
        messages::command::Command::new(messages::command::PowerDown { board }),
    );

    let mut buf = [0u8; 255];
    let data = postcard::to_slice(&power_down_cmd, &mut buf).unwrap();
    let mut fixed_payload = [0u8; 255];
    let len = data.len().min(255);
    fixed_payload[..len].copy_from_slice(&data[..len]);

    let send_msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
        message: fixed_payload,
    });

    match connection.send(
        &MavHeader {
            component_id: 0,
            sequence: 0,
            system_id: 0,
        },
        &send_msg,
    ) {
        Ok(_) => {
            return HttpResponse::Ok().body("Message sent successfully");
        }
        Err(err) => {
            return HttpResponse::InternalServerError()
                .body(format!("Failed to send message: {}", err));
        }
    }
}

#[derive(Deserialize)]
struct RadioRateChangeParams {
    rate: String,
}

#[get("/radio_rate_change/{rate}")]
async fn radio_rate_change(path: web::Path<RadioRateChangeParams>) -> impl Responder {
    let rate = path.into_inner();
    let rate = match rate.rate.as_str() {
        "Fast" => messages::command::RadioRate::Fast,
        "Slow" => messages::command::RadioRate::Slow,
        _ => {
            return HttpResponse::BadRequest().body("Invalid rate name");
        }
    };

    let args = Args::parse();
    let connection = match get_connection(&args.mav_address, args.mav_port) {
        Ok(connection) => connection,
        Err(error) => {
            error!("Failed to connect to MAVLink: {}", error);
            return HttpResponse::InternalServerError()
                .body(format!("Failed to connect to MAVLink: {}", error));
        }
    };

    let radio_rate_change_cmd = messages::Message::new(
        0,
        messages::sender::Sender::GroundStation,
        messages::command::Command::new(messages::command::RadioRateChange { rate }),
    );

    let mut buf = [0u8; 255];
    let data = postcard::to_slice(&radio_rate_change_cmd, &mut buf).unwrap();
    let mut fixed_payload = [0u8; 255];
    let len = data.len().min(255);
    fixed_payload[..len].copy_from_slice(&data[..len]);

    let send_msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
        message: fixed_payload,
    });

    match connection.send(
        &MavHeader {
            component_id: 0,
            sequence: 0,
            system_id: 0,
        },
        &send_msg,
    ) {
        Ok(_) => {
            return HttpResponse::Ok().body("Message sent successfully");
        }
        Err(err) => {
            return HttpResponse::InternalServerError()
                .body(format!("Failed to send message: {}", err));
        }
    }
}

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(long, default_value = "127.0.0.1")]
    mav_address: String,

    #[arg(long, default_value = "127.0.0.1")]
    address: String,

    #[arg(long, default_value_t = 6565)]
    port: u16,

    #[arg(long, default_value_t = 5656)]
    mav_port: u16,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::ERROR)
        .init();

    let args = Args::parse();

    info!("Starting web server on {}:{}", args.address, args.port);

    HttpServer::new(|| {
        App::new()
            .service(deploy_drogue)
            .service(deploy_main)
            .service(power_down)
            .service(radio_rate_change)
    })
    .bind((args.address, args.port))?
    // allow cors
    .run()
    .await?;
    Ok(())
}
