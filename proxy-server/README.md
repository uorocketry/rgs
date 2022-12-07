# Server Socket.IO API

- `ping`
  - Parameters:
    - `callback()` 
  - Description:
    - Triggers callback on client side immediately. (Used to test connection)

- `put`
  - Parameters:
    - `dataset` - Dataset to store value in
    - `key` - Key
    - `value` - Value 
  - Description:
    - Sends value to room

- `sub`
  - Parameters:
    - `key` - Room to join
  - Description:
    - Joins room with set subscribing options, calling sub twice will overwrite the options

- `put`
  - Parameters:
    - `key` - Room to send message to
    - `value` - value to send
  - Description:
    - Sends value to room
  