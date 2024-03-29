use chrono::Local;
use tonic::{Request, Status};

// Interceptor to log every request received by the server
pub fn log_request(request: Request<()>) -> Result<Request<()>, Status> {
    let timestmap = Local::now().format("[%Y-%m-%d][%H:%M:%S]");

    // SHOULD DO: better logging as Request gRPC method is not shown here
    // https://github.com/hyperium/tonic/issues/300
    // https://github.com/hyperium/tonic/issues/430

    println!("{} Request Received: {:?}", timestmap, request);
    Ok(request)
}
