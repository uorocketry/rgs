fn main() {
    // Define .proto files that need to get compiled here
    // No need to compile health.proto as its provided by tonic
    let protos = [
        "proto/data_feed_service.proto",
        "proto/command_service.proto",
    ];

    tonic_build::configure()
        .build_server(true)
        .compile(&protos, &["."])
        .unwrap_or_else(|error| panic!("Failed to compile {:?}", error));
}
