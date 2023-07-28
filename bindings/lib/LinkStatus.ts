// pub struct LinkStatus {
//     pub rssi: Option<u8>,
//     pub remrssi: Option<u8>,
//     pub txbuf: Option<u8>,
//     pub noise: Option<u8>,
//     pub remnoise: Option<u8>,
//     pub rxerrors: Option<u16>,
//     pub fixed: Option<u16>,
//     pub recent_error_rate: f32,
//     pub missed_messages: u32,
//     pub connected: bool,
//     pub timestamp: u64,
// }

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
