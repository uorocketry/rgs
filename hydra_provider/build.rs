fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("proto/helloworld/helloworld.proto").unwrap();
    tonic_build::compile_protos("proto/health/health.proto").unwrap();
    Ok(())
}
