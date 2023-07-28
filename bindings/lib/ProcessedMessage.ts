import { LinkStatus } from "./LinkStatus";
import { Message } from "./Message";

export type ProcessedMessage = { RocketMessage: Message } | { LinkStatus: LinkStatus };