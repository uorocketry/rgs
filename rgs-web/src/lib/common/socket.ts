import { browser } from "$app/environment";
import { onDestroy } from "svelte";
import io from "socket.io-client";
import type { Socket } from "socket.io";
import type { Unsubscriber } from "svelte/store";
import type {
  ClientToServerEvents,
  Data,
  Message,
  ServerToClientEvents,
} from "./Message";
import type {
  ReservedOrUserEventNames,
  ReservedOrUserListener,
} from "socket.io/dist/typed-events";
import type { SocketReservedEventsMap } from "socket.io/dist/socket";

/**
 * The client's socket connection to the server. Value is null on the server.
 * Prefer using onSocket() instead of socket.on() directly.
 */
export let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
  null;

const initSocket = () => {
  console.log("Initializing socket");
  socket = io() as unknown as Socket;
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  socket.on("disconnect", () => {
    console.error("Lost connection to server");
  });

  socket.on("message", (data: string) => {
    console.log("Received message from server: ", data);
  });
};

/**
 * Subscribes to a socket event and unsubscribes when the component is destroyed.
 * Prefer using this over socket.on() directly.
 * @param event The event name.
 * @param data The data to send.
 */
export function onSocket<
  Ev extends ReservedOrUserEventNames<
    ClientToServerEvents,
    ServerToClientEvents
  >
>(event: Ev, callback: ReservedOrUserListener<ServerToClientEvents, any, any>) {
  socket?.on(event, callback);

  onDestroy(() => {
    socket?.off(event, callback);
  });
  let unsubscriber: Unsubscriber = () => {
    socket?.off(event, callback);
  };
  return unsubscriber;
}

if (browser) {
  initSocket();
}

// StrictEventEmitter<ListenEvents extends EventsMap, EmitEvents extends EventsMap, ReservedEvents extends EventsMap = {}>
// on<Ev extends ReservedOrUserEventNames<ReservedEvents, ListenEvents>>(ev: Ev, listener: ReservedOrUserListener<ReservedEvents, ListenEvents, Ev>): this;
