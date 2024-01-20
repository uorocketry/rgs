use hello_world::greeter_client::GreeterClient;
use hello_world::HelloRequest;

use health::health_client::HealthClient;
use health::HealthCheckRequest;

pub mod hello_world {
    tonic::include_proto!("helloworld");
}

pub mod health {
    tonic::include_proto!("health");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut client = GreeterClient::connect("http://[::1]:50051").await?;

    let request = tonic::Request::new(HelloRequest {
        name: "AAAAA".into(),
    });

    let response = client.say_hello(request).await?;

    println!("RESPONSE={:?}", response);
    println!("");
    println!("");

    let request = tonic::Request::new(HealthCheckRequest {
        service: "test".into(),
    });

    let mut client = HealthClient::connect("http://[::1]:50051").await?;

    let response = client.check(request).await?;

    println!("RESPONSE={:?}", response);

    Ok(())
}
