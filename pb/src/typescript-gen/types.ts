export const COLLECTIONS = [
  "Air",
  "EkfNav1",
  "EkfNav2",
  "EkfQuat",
  "GpsVel",
  "Imu1",
  "Imu2",
  "rocket_link",
  "Log",
  "State",
  "layouts",
  "raw",
  "CalculatedMetrics",
  "FlightDirector",
  "GpsPos1",
  "GpsPos2",
  "rocket_message",
  "rocket_state",
  "rocket_log",
  "rocket_command",
  "rocket_sensor",
  "rocket_time",
] as const;

export type Collections = (typeof COLLECTIONS)[number];

export type Air = {
  timestamp: number;
  status: number;
  pressure_abs: number;
  altitude: number;
  pressure_diff: number;
  true_airspeed: number;
  air_temperature: number;
};

export type EkfNav1 = {
  time_stamp: number;
  velocity_0: number;
  velocity_1: number;
  velocity_2: number;
  velocity_std_dev_0: number;
  velocity_std_dev_1: number;
  velocity_std_dev_2: number;
};

export type EkfNav2 = {
  position_0: number;
  position_1: number;
  position_2: number;
  position_std_dev_0: number;
  position_std_dev_1: number;
  position_std_dev_2: number;
  status: number;
};

export type EkfQuat = {
  time_stamp: number;
  quaternion_0: number;
  quaternion_1: number;
  quaternion_2: number;
  quaternion_3: number;
  euler_std_dev_0: number;
  euler_std_dev_1: number;
  euler_std_dev_2: number;
  status: number;
};

export type GpsVel = {
  time_stamp: number;
  status: number;
  velocity_0: number;
  velocity_1: number;
  velocity_2: number;
  velocity_acc_0: number;
  velocity_acc_1: number;
  velocity_acc_2: number;
  course: number;
  course_acc: number;
};

export type Imu1 = {
  time_stamp: number;
  status: number;
  accelerometers_0: number;
  accelerometers_1: number;
  accelerometers_2: number;
  gyroscopes_0: number;
  gyroscopes_1: number;
  gyroscopes_2: number;
};

export type Imu2 = {
  delta_velocity_0: number;
  delta_velocity_1: number;
  delta_velocity_2: number;
  delta_angle_0: number;
  delta_angle_1: number;
  delta_angle_2: number;
  temperature: number;
};

export type rocket_link = {
  rssi: number;
  remrssi: number;
  txbuf: number;
  noise: number;
  remnoise: number;
  rxerrors: number;
  fixed: number;
  recent_error_rate: number;
  missed_messages: number;
  connected: number;
  timestamp: number;
};

export type Log = {
  level: string;
  event: Map<string, unknown>;
};

export type State = {
  status:
    | "Initializing"
    | "WaitForTakeoff"
    | "Ascent"
    | "Descent"
    | "TerminalDescent"
    | "Abort"
    | "WaitForRecovery";
};

export type layouts = {
  name: string;
  data: Map<string, unknown>;
};

export type raw = {
  timestamp: number;
  data: Map<string, unknown>;
};

export type CalculatedMetrics = {
  max_altitude: number;
  max_true_air_speed: number;
  g_force: number;
  max_g_force: number;
  max_velocity_1: number;
  max_velocity_2: number;
  max_velocity_3: number;
  ground_altitude: number;
  distance_from_target: number;
  total_traveled_distance: number;
};

export type FlightDirector = {
  latitude: number;
  longitude: number;
  targetAltitude: number;
  relativeAltitude: number;
};

export type GpsPos1 = {
  timestamp: number;
  status: number;
  timeOfWeek: number;
  latitude: number;
  longitude: number;
  undulation: number;
  altitude: number;
};

export type GpsPos2 = {
  latitudeAccuracy: number;
  longitudeAccuracy: number;
  altitudeAccuracy: number;
  numSvUsed: number;
  baseStationId: number;
  differentialAge: number;
};

export type rocket_message = {
  timestamp: number;
  discriminator:
    | "rocket_state"
    | "rocket_sensor"
    | "rocket_log"
    | "rocket_command";
  sender:
    | "GroundStation"
    | "SensorBoard"
    | "RecoveryBoard"
    | "CommunicationBoard"
    | "PowerBoard"
    | "CameraBoard";
};

export type rocket_state = {
  parent: string;
  state:
    | "Initializing"
    | "WaitForTakeoff"
    | "Ascent"
    | "Descent"
    | "TerminalDescent"
    | "WaitForRecovery"
    | "Abort";
};

export type rocket_log = {
  level: string;
  event: Map<string, unknown>;
  parent: string;
};

export type rocket_command = {
  data: Map<string, unknown>;
  parent: string;
};

export type rocket_sensor = {
  component_id: number;
  parent: string;
  discriminator:
    | "rocket_time"
    | "rocket_air"
    | "rocket_quat"
    | "rocket_nav1"
    | "rocket_nav2"
    | "rocket_imu1"
    | "rocket_imu2"
    | "rocket_vel"
    | "rocket_pos1"
    | "rocket_pos2"
    | "rocket_current"
    | "rocket_voltage"
    | "rocket_regulator"
    | "rocket_temperature";
};

export type rocket_time = {
  time_stamp: number;
  status: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  nano_second: number;
  gps_time_of_week: number;
  parent: string;
};

export type BaseResponse = {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  updated: string;
};

export type AirBaseResponse = BaseResponse & Air;
export type EkfNav1BaseResponse = BaseResponse & EkfNav1;
export type EkfNav2BaseResponse = BaseResponse & EkfNav2;
export type EkfQuatBaseResponse = BaseResponse & EkfQuat;
export type GpsVelBaseResponse = BaseResponse & GpsVel;
export type Imu1BaseResponse = BaseResponse & Imu1;
export type Imu2BaseResponse = BaseResponse & Imu2;
export type rocket_linkBaseResponse = BaseResponse & rocket_link;
export type LogBaseResponse = BaseResponse & Log;
export type StateBaseResponse = BaseResponse & State;
export type layoutsBaseResponse = BaseResponse & layouts;
export type rawBaseResponse = BaseResponse & raw;
export type CalculatedMetricsBaseResponse = BaseResponse & CalculatedMetrics;
export type FlightDirectorBaseResponse = BaseResponse & FlightDirector;
export type GpsPos1BaseResponse = BaseResponse & GpsPos1;
export type GpsPos2BaseResponse = BaseResponse & GpsPos2;
export type rocket_messageBaseResponse = BaseResponse & rocket_message;
export type rocket_stateBaseResponse = BaseResponse & rocket_state;
export type rocket_logBaseResponse = BaseResponse & rocket_log;
export type rocket_commandBaseResponse = BaseResponse & rocket_command;
export type rocket_sensorBaseResponse = BaseResponse & rocket_sensor;
export type rocket_timeBaseResponse = BaseResponse & rocket_time;
