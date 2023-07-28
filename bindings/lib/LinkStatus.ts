export type LinkStatus = {
    rssi: number;
    remrssi: number;
    txbuf: number;
    noise: number;
    remnoise: number;
    rxerrors: number;
    fixed: number;
    recent_error_rate: number;
    missed_messages: number;
    connected: boolean;
    timestamp: number;
};
