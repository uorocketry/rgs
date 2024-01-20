use hello_world::greeter_server::Greeter;
use hello_world::greeter_server::GreeterServer;
use hello_world::{HelloReply, HelloRequest};
use tonic::{Request, Response, Status};

pub mod hello_world {
    tonic::include_proto!("helloworld");
}

#[derive(Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request from {:?}", request.remote_addr());

        let reply = hello_world::HelloReply {
            message: format!("Hello {}!", request.into_inner().name),
        };
        Ok(Response::new(reply))
    }
}

// Export alias GreeterService as GreeterServer<MyGreeter>
pub type GreeterService = GreeterServer<MyGreeter>;

impl GreeterService {
    pub fn instantiate() -> GreeterServer<MyGreeter> {
        return GreeterServer::new(MyGreeter::default());
    }
}
