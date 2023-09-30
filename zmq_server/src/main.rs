extern crate clap;
extern crate log;

use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short)]
    zeromq_port: u32,
}

fn main() {
    let args = Args::parse();
    let ctx = zmq::Context::new();
    let port = args.zeromq_port;
    println!("Starting ZeroMQ server on the port {}", args.zeromq_port);
    let socket = ctx.socket(zmq::SUB).unwrap();

    assert!(socket.bind(&format!("tcp://*:{}", port)).is_ok());
    println!("Bound to port {}", port);
    socket.set_subscribe(b"").unwrap();

    loop {
        let msg = socket.recv_string(0).unwrap().unwrap();
        println!(">{}", msg);
    }
}
