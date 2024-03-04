use hydra_provider_proto::greeter_server::Greeter;
use hydra_provider_proto::{HelloReply, HelloRequest};
use tonic::{Request, Response, Status};

pub mod hydra_provider_proto {
    tonic::include_proto!("hydra_provider");
}

#[derive(Default)]
pub struct GreeterImpl {}

#[tonic::async_trait]
impl Greeter for GreeterImpl {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request from {:?}", request.remote_addr());

        let reply = hydra_provider_proto::HelloReply {
            message: format!("Hello {}!", request.into_inner().name),
        };
        Ok(Response::new(reply))
    }
}
