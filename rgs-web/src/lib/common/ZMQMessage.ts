export type ZMQMessage = {
    serverTimestamp: number;
    timestamp: number;
    sender: string;
    data: any;
}