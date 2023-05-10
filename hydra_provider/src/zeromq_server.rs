use crate::processing::ProcessedMessage;
use anyhow::Result;

use zmq::Socket;

pub struct ZeroMQServer {
    socket: Socket,
}

impl ZeroMQServer {
    pub fn new(port: u32) -> Self {
        let ctx = zmq::Context::new();

        let socket = ctx.socket(zmq::PUB).unwrap();

        socket.bind(&format!("tcp://*:{port}")).unwrap();

        ZeroMQServer { socket }
    }

    pub fn send(&self, msg: &ProcessedMessage) -> Result<()> {
        self.socket.send(&serde_json::to_string(msg)?, 0)?;

        Ok(())
    }
}
