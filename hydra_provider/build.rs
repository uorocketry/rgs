fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("proto/hydra_provider.proto").unwrap();
    // No need to compile health as its provided by tonic
    Ok(())
}
