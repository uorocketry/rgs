// export INFLUXDB_TOKEN=j05jnLjTrYp_PgmYGD7h5qxkNtay5zuC3hFKaEU3eO3OalGMFtQeazBfXXaQOboIB8XKvVM4LXHQpHRVkSoqnA==
console.log("Hello via Bun!");

// Run influxd
const influxd = Bun.spawn(["influxd"]);

if (influxd.stdout) {
  // influx.stdout is of type ReadableStream<Uint8Array>
  const writableStream = new WritableStream({
    write(chunk) {
      process.stdout.write(chunk);
    },
  });
  influxd.stdout.pipeTo(writableStream);
}

setTimeout(() => {
  // INFLUXD_HTTP_BIND_ADDRESS
  const bindAddress = Bun.env["INFLUX_HOST"] ?? "localhost";
  const init = Bun.spawnSync([
    "./influx",
    "setup",
    "--username",
    "rgs",
    "--password",
    "password",
    "--org",
    "rgs",
    "--bucket",
    "rgs",
    "--token",
    "rgs",
    "--retention",
    "0",
    "--host",
    bindAddress,
    "--force",
  ]);

  console.log(`
Influx Setup Output:
STDOUT:${init.stdout.toString()}
STDERR:${init.stderr.toString()}
`);
}, 1000);
