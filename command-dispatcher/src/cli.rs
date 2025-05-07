use clap::Parser;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct Args {
    #[arg(long, default_value = "http://localhost:8080")]
    pub libsql_url: String,

    #[arg(long, default_value = "")]
    pub libsql_auth_token: String,

    #[arg(long, default_value = "127.0.0.1")]
    pub gateway_address: String,

    #[arg(long, default_value_t = 5656)]
    pub gateway_port: u16,

    #[arg(long, default_value_t = 5)]
    pub poll_interval_secs: u64,
}
