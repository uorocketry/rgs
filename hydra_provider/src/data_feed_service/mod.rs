pub mod random;
pub mod serial;
pub mod message;

pub mod proto {
	tonic::include_proto!("data_feed");
}
