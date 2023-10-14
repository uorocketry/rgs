extern crate clap;
extern crate log;

use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short)]
    pub_port: u32,
    #[arg(short)]
    sub_port: u32,
}

fn main() {
    println!("Starting ZMQ proxy service");

    let args = Args::parse();
    let ctx = zmq::Context::new();
    let xpub = ctx.socket(zmq::XPUB).unwrap();
    let xsub = ctx.socket(zmq::XSUB).unwrap();

    let pub_port = args.pub_port;
    let sub_port = args.sub_port;

    println!("Binding XPUB to port {}", pub_port);
    assert!(xpub.bind(&format!("tcp://*:{}", pub_port)).is_ok());
    println!("Binding XSUB to port {}", sub_port);
    assert!(xsub.bind(&format!("tcp://*:{}", sub_port)).is_ok());
    println!("Starting proxy");
    zmq::proxy(&xpub, &xsub).unwrap();
}
