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

export interface ChatMessage {
  timestamp: number;
  message: string;
  sender: string;
}
export interface ServerToClientEvents {
  RocketData: (data: Message) => void;
  connect: () => void;
  disconnect: () => void;
  message: (data: any) => void;
  chat: (data: ChatMessage) => void;
  loggedUsers: (data: string[]) => void; // List of logged users
}

export interface ClientToServerEvents {
  chat: (data: ChatMessage) => void;
  login: (uuid: string, secret: string) => void;
}
