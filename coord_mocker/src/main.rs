use clap::Parser;
use messages::mavlink::uorocketry::MavMessage;
use messages::mavlink::{self, MAVLinkV2MessageRaw};
use messages::sensor::GpsPos;
use messages::sensor_status::GpsPositionStatus;
use messages::FormattedNaiveDateTime;
use std::io::Write;
use std::net::{TcpListener, TcpStream};
use std::sync::Mutex;
use tracing::{error, info};
use tracing_subscriber;

#[derive(Debug, Clone, Copy)]
struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
    pub altitude: f64,
}

#[derive(Debug, Clone)]
struct State {
    pub coords: DynamicCoordinates,
    pub mode: String,
}

#[derive(Debug, Clone, Copy)]
struct DynamicCoordinates {
    internal_clock: f64,
    transition_time: f64,
    pub start_coordinates: Coordinates,
    pub end_coordinates: Coordinates,
}

impl DynamicCoordinates {
    pub fn new(start: Coordinates) -> Self {
        DynamicCoordinates {
            internal_clock: 0.0,
            transition_time: 1.0,
            start_coordinates: start,
            end_coordinates: start,
        }
    }

    pub fn get_coordinates(&mut self) -> Coordinates {
        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs_f64();

        let diff = current_time - self.internal_clock;

        let diff_ratio = (diff / self.transition_time).min(1.0).max(0.0);

        let lat_diff = self.end_coordinates.latitude - self.start_coordinates.latitude;
        let lon_diff = self.end_coordinates.longitude - self.start_coordinates.longitude;
        let alt_diff = self.end_coordinates.altitude - self.start_coordinates.altitude;

        let lat = self.start_coordinates.latitude + (lat_diff * diff_ratio);
        let lon = self.start_coordinates.longitude + (lon_diff * diff_ratio);
        let alt = self.start_coordinates.altitude + (alt_diff * diff_ratio);

        Coordinates {
            latitude: lat,
            longitude: lon,
            altitude: alt,
        }
    }

    pub fn set_new_coordinates(&mut self, new_coordinates: Coordinates) {
        self.start_coordinates = self.get_coordinates();
        self.end_coordinates = new_coordinates;
        self.internal_clock = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs_f64();
    }
}

static BASE_ALTITUDE: f64 = 277.0;

static WASP_SHACK: Coordinates = Coordinates {
    latitude: 48.5382784,
    longitude: -80.5816727,
    altitude: BASE_ALTITUDE,
};

static GARAGE: Coordinates = Coordinates {
    latitude: 48.5380497,
    longitude: -80.5815106,
    altitude: BASE_ALTITUDE,
};

static FRONT_DOOR: Coordinates = Coordinates {
    latitude: 48.5381356,
    longitude: -80.5817587,
    altitude: BASE_ALTITUDE,
};

static SPOT_1: Coordinates = Coordinates {
    latitude: 48.5381308,
    longitude: -80.5815960,
    altitude: BASE_ALTITUDE,
};

static SPOT_2: Coordinates = Coordinates {
    latitude: 48.5382968,
    longitude: -80.5818807,
    altitude: BASE_ALTITUDE,
};

static ROAD_FAR_LEFT: Coordinates = Coordinates {
    latitude: 48.5380031,
    longitude: -80.5509779,
    altitude: BASE_ALTITUDE,
};

static ROAD_FAR_RIGHT: Coordinates = Coordinates {
    latitude: 48.5377917,
    longitude: -80.5942963,
    altitude: BASE_ALTITUDE,
};

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,

    // sleep time in ms
    #[arg(short, long, default_value_t = 100)]
    interval: u64,

    // Mode: JSON or MAVLink (defaults to json)
    #[arg(short, long, default_value = "json")]
    mode: String,
}

fn handle_connection(stream: &mut TcpStream, interval: u64, state: std::sync::Arc<Mutex<State>>) {
    let peer_addr = match stream.peer_addr() {
        Ok(addr) => addr.to_string(),
        Err(e) => {
            error!("Failed to get peer address, not accepting: {:?}", e);
            String::from("Unknown")
        }
    };

    loop {
        let t = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32;
        let coords = state.lock().unwrap().coords.get_coordinates();
        let mode = state.lock().unwrap().mode.clone();

        if mode.eq("json") {
            // region:JSON Sending Mode
            // { "lat": ..., "lon": ..., "alt": ... }\n

            let json = format!(
                "{{ \"lat\": {}, \"lon\": {}, \"alt\": {} }}\n",
                coords.latitude, coords.longitude, coords.altitude
            );

            if let Err(e) = stream.write_all(json.as_bytes()) {
                error!(
                    "Failed to send message to client {:?}. REASON: {:?}",
                    peer_addr, e
                );
                break;
            }

            // endregion
        } else {
            // region:Mavlink Sending Mode
            let msg: MavMessage = {
                // let lat_lon_msg = SensorData::GpsPos1(GpsPos1 {
                //     latitude: Some(coords.latitude),
                //     longitude: Some(coords.longitude),
                // });
                // let data = messages::Data::Sensor(Sensor::new(lat_lon_msg));
                let data = messages::RadioData::Sbg(messages::sensor::SbgData::GpsPos(GpsPos {
                    latitude: Some(coords.latitude),
                    longitude: Some(coords.longitude),
                    time_of_week: None,
                    undulation: None,
                    altitude: Some(coords.altitude),
                    time_stamp: t,
                    status: GpsPositionStatus::new(0),
                    latitude_accuracy: None,
                    longitude_accuracy: None,
                    altitude_accuracy: None,
                    num_sv_used: None,
                    base_station_id: None,
                    differential_age: None,
                }));

                let msg = messages::RadioMessage::new(
                    FormattedNaiveDateTime {
                        0: chrono::Utc::now().naive_utc(),
                    },
                    // TODO: Replace by GroundStation node when it is implemented
                    messages::node::Node::PressureBoard,
                    // messages::node::Node::GroundStation,
                    data,
                );

                let mut buf = [0u8; 255];
                postcard::to_slice(&msg, &mut buf).unwrap();
                MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
                    message: buf,
                })
            };

            let mut message_raw = MAVLinkV2MessageRaw::new();
            message_raw.serialize_message(
                mavlink::MavHeader {
                    system_id: 0,
                    component_id: 0,
                    sequence: 0,
                },
                &msg,
            );

            if let Err(e) = stream.write_all(&message_raw.raw_bytes()) {
                error!(
                    "Failed to send message to client {:?}. REASON: {:?}",
                    peer_addr, e
                );
                break;
            }
            // endregion
        }
        std::thread::sleep(std::time::Duration::from_millis(interval));
    }
}

// takes arc mutex of state
fn cli_loop(state: std::sync::Arc<Mutex<State>>) {
    loop {
        let mut input = String::new();
        std::io::stdin().read_line(&mut input).unwrap();
        let input = input.trim();
        match input {
            "wasp" => {
                state.lock().unwrap().coords.set_new_coordinates(WASP_SHACK);
                info!("Setting next coordinates to WASP_SHACK");
            }
            "garage" => {
                state.lock().unwrap().coords.set_new_coordinates(GARAGE);
                info!("Setting next coordinates to GARAGE");
            }
            "front" => {
                state.lock().unwrap().coords.set_new_coordinates(FRONT_DOOR);
                info!("Setting next coordinates to FRONT_DOOR");
            }
            "spot1" => {
                state.lock().unwrap().coords.set_new_coordinates(SPOT_1);
                info!("Setting next coordinates to SPOT_1");
            }
            "spot2" => {
                state.lock().unwrap().coords.set_new_coordinates(SPOT_2);
                info!("Setting next coordinates to SPOT_2");
            }
            "road_left" => {
                state
                    .lock()
                    .unwrap()
                    .coords
                    .set_new_coordinates(ROAD_FAR_LEFT);
                info!("Setting next coordinates to ROAD_FAR_LEFT");
            }
            "road_right" => {
                state
                    .lock()
                    .unwrap()
                    .coords
                    .set_new_coordinates(ROAD_FAR_RIGHT);
                info!("Setting next coordinates to ROAD_FAR_RIGHT");
            }
            "help" => {
                println!(
                    "wasp, garage, front, spot1, spot2, road_left, road_right, exit, lat <value>"
                );
            }
            "exit" => {
                break;
            }
            other => {
                // alt x
                //  lon y
                // lat z commands
                if other.starts_with("alt") {
                    let lat = other[3..].trim().parse::<f64>();
                    match lat {
                        Ok(lat) => {
                            let mut coords = state.lock().unwrap().coords.get_coordinates().clone();
                            coords.altitude = lat;
                            state.lock().unwrap().coords.set_new_coordinates(coords);
                            info!("Setting next latitude to {}", lat);
                        }
                        Err(e) => {
                            error!("Failed to parse latitude: {:?}", e);
                        }
                    }
                } else if other.starts_with("lon") {
                    let lon = other[3..].trim().parse::<f64>();
                    match lon {
                        Ok(lon) => {
                            let mut coords = state.lock().unwrap().coords.get_coordinates().clone();
                            coords.longitude = lon;
                            state.lock().unwrap().coords.set_new_coordinates(coords);
                            info!("Setting next longitude to {}", lon);
                        }
                        Err(e) => {
                            error!("Failed to parse longitude: {:?}", e);
                        }
                    }
                } else if other.starts_with("lat") {
                    let lat = other[3..].trim().parse::<f64>();
                    match lat {
                        Ok(lat) => {
                            let mut coords = state.lock().unwrap().coords.get_coordinates().clone();
                            coords.latitude = lat;
                            state.lock().unwrap().coords.set_new_coordinates(coords);
                            info!("Setting next latitude to {}", lat);
                        }
                        Err(e) => {
                            error!("Failed to parse latitude: {:?}", e);
                        }
                    }
                } else {
                    println!("Invalid command");
                }
            }
        }
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::TRACE)
        .init();

    let args = Args::parse();

    let listener_str = format!("{}:{}", args.address, args.port);
    info!("Attempting to bind to {}", listener_str);

    let listener = match TcpListener::bind(listener_str) {
        Ok(listener) => {
            info!("Server created successfully");
            listener
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error.into());
        }
    };

    info!("Listening for connections on {}", listener.local_addr()?);

    let state = std::sync::Arc::new(Mutex::new(State {
        coords: DynamicCoordinates::new(WASP_SHACK),
        mode: args.mode,
    }));

    // Create a thread to handle CLI input
    let state_clone = state.clone();
    std::thread::spawn(move || {
        cli_loop(state_clone);
    });

    // Accept connections and create threads
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                let peer_addr = match stream.peer_addr() {
                    Ok(addr) => addr,
                    Err(e) => {
                        error!("Failed to get peer address, not accepting: {:?}", e);
                        continue;
                    }
                };
                info!("New connection: {:?}", peer_addr);
                let mut stream = stream;
                let state = state.clone();
                std::thread::spawn(move || {
                    handle_connection(&mut stream, args.interval, state.clone());
                });
            }
            Err(e) => {
                error!("Failed to accept connection: {:?}", e);
            }
        }
    }
    Ok(())
}
