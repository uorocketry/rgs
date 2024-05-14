pub mod random;
pub mod serial;

pub mod proto {
    tonic::include_proto!("data_feed_service");
}
