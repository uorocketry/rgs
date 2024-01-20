use std::{any::Any, time::Duration};

use greeter::GreeterService;
use tonic::transport::Server;

mod greeter;

use tonic_health::server::HealthReporter;

/// This function (somewhat improbably) flips the status of a service every second, in order
/// that the effect of `tonic_health::HealthReporter::watch` can be easily observed.
async fn twiddle_service_status(mut reporter: HealthReporter) {
    let mut iter = 0u64;
    loop {
        iter += 1;
        tokio::time::sleep(Duration::from_secs(1)).await;

        if iter % 2 == 0 {
            reporter.set_serving::<GreeterService>().await;
        } else {
            reporter.set_not_serving::<GreeterService>().await;
        };
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (mut health_reporter, health_service) = tonic_health::server::health_reporter();
    health_reporter.set_serving::<GreeterService>().await;
    // tokio::spawn(twiddle_service_status(health_reporter));

    let addr = "[::1]:50051".parse().unwrap();
    let greeter = GreeterService::instantiate();

    println!("HealthServer + GreeterServer listening on {}", addr);

    Server::builder()
        .add_service(health_service)
        .add_service(greeter)
        .serve(addr)
        .await?;

    Ok(())
}
