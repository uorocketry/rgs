import { LinkStatus } from "./LinkStatus";
import type { Message } from "./Message";

export type ProcessedMessage = { RocketMessage: Message } | { LinkStatus: LinkStatus };