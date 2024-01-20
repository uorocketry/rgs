use hello_world::greeter_client::GreeterClient;
use hello_world::HelloRequest;

use tonic_health::pb::health_client::HealthClient;
use tonic_health::pb::HealthCheckRequest;

pub mod hello_world {
    tonic::include_proto!("helloworld");
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

    println!("RESPONSE={:?}", response);

    let mut healthClient = HealthClient::from(client);

    loop {
        let request = tonic::Request::new(HealthCheckRequest {
            service: "helloworld.Greeter".into(),
        });
        let response = healthClient.check(request).await;

        match response {
            Ok(response) => {
                println!("RESPONSE={:?}", response);
            }
            Err(e) => {
                println!("ERROR={:?}", e);
            }
        }

        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    }
}
