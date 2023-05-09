

export interface ProxyMessage {
  timestamp: number;
  sender: Sender;
  data: Data;
}

/*
 * Upgraded version of ProxyMessage that includes the server timestamp
 */
export type ZMQMessage = {
  serverTimestamp: number;
  RocketData: ProxyMessage;
}

export enum Sender {
  GroundStation = "GroundStation",
  MainBoard = "MainBoard",
}

export interface State {
  status: Status;
  has_error: boolean;
  voltage: number;
}

export interface Status {
  Uninitialized: "Uninitialized";
  Initializing: "Initializing";
  Running: "Running";
}

export interface Sensor {
  component_id: number;
  data: SensorData;
}


export interface Sbg {
  accel_x: number;
  accel_y: number;
  accel_z: number;
  velocity_n: number;
  velocity_e: number;
  velocity_d: number;
  pressure: number;
  height: number;
  roll: number;
  yaw: number;
  pitch: number;
  latitude: number;
  longitude: number;
  quant_w: number;
  quant_x: number;
  quant_y: number;
  quant_z: number;
}

export type SensorData = {
  Sbg?: Sbg;
};

export type Data = {
  state?: State;
  sensor?: Sensor;
};

export interface ChatMessage {
  timestamp: number;
  message: string;
  sender: string;
}
export interface ServerToClientEvents {
  RocketData: (data: ZMQMessage) => void;
  connect: () => void;
  disconnect: () => void;
  message: (data: any) => void;
  chat: (data: ChatMessage) => void;
  loggedUsers: (data: string[]) => void; // List of logged users
}

export interface ClientToServerEvents {
  chat: (data: ChatMessage) => void;
  login: (uuid: string, secret: string) => void;
  ping: (cb: (n: number) => void) => void;
}
