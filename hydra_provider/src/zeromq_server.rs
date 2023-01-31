use anyhow::Result;
use messages::Message;
use zmq::Socket;

pub struct ZeroMQServer {
    socket: Socket,
}

impl ZeroMQServer {
    pub fn new() -> Self {
        let ctx = zmq::Context::new();

        let socket = ctx.socket(zmq::SUB).unwrap();

        socket.connect("tcp://127.0.0.1:2227").unwrap();

        ZeroMQServer { socket }
    }

    pub fn send(&self, msg: &Message) -> Result<()> {
        self.socket.send(&serde_json::to_string(msg)?, 0)?;

        Ok(())
    }
}
