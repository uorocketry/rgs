import type { Message } from "$lib/../../../hydra_provider/bindings/Message";
import type { ProcessedMessage } from "$lib/../../../hydra_provider/bindings/ProcessedMessage";
import type { Sender } from "$lib/../../../hydra_provider/bindings/Sender";
import type { LinkStatus } from "./Bindings";

export type { Data } from "$lib/../../../hydra_provider/bindings/Data";
export type { LinkStatus } from "$lib/../../../hydra_provider/bindings/LinkStatus";
export type { Message } from "$lib/../../../hydra_provider/bindings/Message";
export type { ProcessedMessage } from "$lib/../../../hydra_provider/bindings/ProcessedMessage";
export type { Sbg } from "$lib/../../../hydra_provider/bindings/Sbg";
export type { Sender } from "$lib/../../../hydra_provider/bindings/Sender";
export type { Sensor } from "$lib/../../../hydra_provider/bindings/Sensor";
export type { State } from "$lib/../../../hydra_provider/bindings/State";
export type { Status } from "$lib/../../../hydra_provider/bindings/Status";

export interface ChatMessage {
  timestamp: number;
  message: string;
  sender: string;
}
export interface ServerToClientEvents {
  RocketMessage: (message: Message) => void;
  LinkStatus: (status: LinkStatus) => void;
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
