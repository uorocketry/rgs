use crate::hydra_provider_proto::hydra_provider_proto::*;
use tonic::{Request, Response, Status};

use self::greeter_server::Greeter;

#[derive(Default)]
pub struct GreeterImpl {}

#[tonic::async_trait]
impl Greeter for GreeterImpl {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request from {:?}", request.remote_addr());

        let reply = HelloReply {
            message: format!("Hello {}!", request.into_inner().name),
        };
        Ok(Response::new(reply))
    }
}
