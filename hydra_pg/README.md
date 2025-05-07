# Hydra PG

A Hydra message decoder and database storage component that processes messages from Hydra Gateway and persists them in a LibSQL database. 

## Features

- Decodes messages from Hydra Gateway
- Stores decoded data in a LibSQL database
- Batch processes them for improved performance
- Automatic heartbeat monitoring

## Prerequisites

- LibSQL server up and running
- Network access to Hydra Gateway

## Usage

```bash
./hydra_pg [options]
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--libsql-url` | LibSQL server URL | http://localhost:8080 |
| `--address` | Hydra Gateway host | 127.0.0.1 |
| `--port` | Hydra Gateway port | 5656 |

## Implementation

- Batch processing: 100 messages or 500ms timeout
- Heartbeat: Every 30 seconds
- Handles POSTCARD_MESSAGE and RADIO_STATUS types
- Tracks packet loss and sequence numbers

## Troubleshooting

1. **Database Issues**
   - Verify LibSQL server is running
   - Check server URL configuration

2. **Connection Issues**
   - Verify Hydra Gateway is accessible
   - Check network connectivity
