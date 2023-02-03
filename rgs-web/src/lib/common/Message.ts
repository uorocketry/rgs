export interface Message {
  timestamp: number;
  sender: Sender;
  data: Data;
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
  accel: number;
  speed: number;
  pressure: number;
  height: number;
}

export type SensorData = {
  Sbg?: Sbg;
};

export type Data = {
  state?: State;
  sensor?: Sensor;
};
export interface ServerToClientEvents {
  RocketData: (data: Message) => void;
  connect: () => void;
  disconnect: () => void;
  message: (data: any) => void;
}

export interface ClientToServerEvents {
  // None yet
}
