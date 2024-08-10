use std::io::{self, Read};
use std::net::TcpStream;

fn main() -> io::Result<()> {
    // Connect to a TCP server or an existing stream.
    let mut stream = TcpStream::connect("127.0.0.1:8080")?;

    let mut reader = messages::mavlink::peek_reader::PeekReader::new(stream);

    println!("Connected to 127.0.0.1:8080...");

    // loop {
    //     // Read the data from the stream.
    //     match messages::mavlink::read_v2_msg(&mut reader) {
    //         Ok((header, obj)) => {
    //             // Output the data to the console.
    //             println!("Received: {}", header.component_id);
    //         }
    //         Err(e) => {
    //             println!("Failed to read from the stream: {}", e);
    //             break;
    //         }
    //     }
    // }

    Ok(())
}
