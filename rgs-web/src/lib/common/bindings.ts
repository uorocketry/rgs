import { Air } from "rgs-bindings";

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
	message: (data: unknown) => void;
	chat: (data: ChatMessage) => void;
	loggedUsers: (data: string[]) => void; // List of logged users
}

export interface ClientToServerEvents {
	chat: (data: ChatMessage) => void;
	login: (uuid: string, secret: string) => void;
	ping: (cb: (n: number) => void) => void;
}
