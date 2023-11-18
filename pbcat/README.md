# pbcat 📡

## Overview 🌟

`pbcat` is a versatile application designed for listening to server-sent events (SSE) from PocketBase and displaying them on the standard output. Think of it as a flexible tool akin to "cat" or "socat" tailored for web-server-database interaction. Use `pbcat` to effortlessly monitor and record events from your PocketBase database in real-time.

## Prerequisites 🛠️

Before tuning in with `pbcat`, make sure you have the following:

- PocketBase up and running (see `pb` README).

## Usage 🚀

To start listening to your PocketBase records, use the following command:

```bash
./pbcat/main --record <recordName>
```

Replace `<recordName>` with the name of the record you want to monitor (eg `Air`)
