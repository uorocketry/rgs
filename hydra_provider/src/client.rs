use hello_world::greeter_client::GreeterClient;
use hello_world::HelloRequest;

use tonic_health::pb::health_client::HealthClient;
use tonic_health::pb::HealthCheckRequest;

pub mod hello_world {
    tonic::include_proto!("helloworld");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Set up transport
    let transport = tonic::transport::Channel::from_static("http://[::1]:50051")
        .connect()
        .await?;

    //##########################################################################

    // Connect to the services
    let mut greeter_client = GreeterClient::new(transport.clone());
    let mut health_client = HealthClient::new(transport.clone());

    //##########################################################################

    // Greeter service
    let request = HelloRequest {
        name: "world".into(),
    };

    let response = greeter_client.say_hello(request).await?;

    println!("RESPONSE={:?}", response); // Should be "Hello world!"

    //##########################################################################

    // Check for Greeter service health
    let request = HealthCheckRequest {
        service: "helloworld.Greeter".into(),
    };
    let response = health_client.check(request).await;

    println!("RESPONSE={:?}", response); // Should be "Serving"

    Ok(())
}
