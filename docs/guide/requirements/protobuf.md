# Protobuf

In order to be able to communicate between different services, we use gRPC and Protobuf.

It can be installed by running the following:

::: code-group

```sh [Ubuntu]
sudo apt update && sudo apt install -y protobuf-compiler
```

```sh [Mac]
brew install protobuf
```

:::

Verify the installation is at least of version 3 by running:

```sh
$ protoc --version
libprotoc 3.XX.X
```
