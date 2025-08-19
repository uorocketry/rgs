# Architecture

Here is a general overview of the architecture of the RGS project.

![RGS Architecture](/static/rgs.drawio.png)

It's main goals are to:
- Decentralize the data storage and visualization to allow for multiple ground stations to be used simultaneously
- Provide a decent and decoupled I/O interface for the rocket
- Provide a real-time data visualization interface for the rocket
- Reliably save and store data for later analysis

These goals are achieved by combining programs that:
- Do one thing and do it well
- Communicate with each other through well-defined interfaces
- Reliably handle fatal errors and edge cases