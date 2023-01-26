import { io, Socket } from "socket.io-client";
import { writable, type Unsubscriber } from "svelte/store";
import { browser } from "$app/environment";

export class ClientSocket {
  public static _socket: Socket = io();
  public static connected = writable(false);
  // On callbacks is a map of event names to array of callback functions
  public static onCallbacks: Map<string, ((...args: any[]) => void)[]> =
    new Map();

  private constructor() {}

  public static on(
    event: string,
    callback: (...args: any[]) => void
  ): Unsubscriber {
    if (!ClientSocket.onCallbacks.has(event)) {
      ClientSocket.onCallbacks.set(event, []);
    }
    ClientSocket.onCallbacks.get(event)?.push(callback);
    this.socket.on(event, callback);
    return () => {
      // Remove callback from ClientSocket.onCallbacks
      let callbacks = ClientSocket.onCallbacks.get(event);
      if (callbacks) {
        callbacks = callbacks.filter((cb) => cb !== callback);
        ClientSocket.onCallbacks.set(event, callbacks);
      }
      this.socket.off(event, callback);
    };
  }

  public static get socket(): Socket {
    return ClientSocket._socket;
  }
}

// Hook connect and disconnect events
// Hook on connect and disconnect events
ClientSocket.socket.on("connect", () => {
  console.log("Connected to server");
  ClientSocket.connected.set(true);
});

ClientSocket.socket.on("disconnect", () => {
  console.log("Disconnected from server");
  ClientSocket.connected.set(false);
});

if (browser) {
  console.log("Hello from client");
} else {
  console.log("Hello from server");
}
