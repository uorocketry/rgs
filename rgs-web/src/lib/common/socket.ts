import { browser } from "$app/environment";
import { onDestroy } from "svelte";
import io from "socket.io-client";

export let socket: undefined | any = undefined;

const initSocket = () => {
  // TODO: Read https://stackoverflow.com/questions/69350342/svelte-sveltekit-and-socket-io-client-not-working-in-dev-works-in-preview
  // let sock = io();
  // socket = sock;
  // sock.on("connect", () => {
  //   console.log("Connected to server");
  // });
  // sock.on("disconnect", () => {
  //   console.log("Disconnected from server");
  // });
};

export function onSocket(event: string, callback: (...data: any) => void) {
  socket?.on(event, callback);

  onDestroy(() => {
    socket?.off(event, callback);
  });
}

if (browser) {
  initSocket();
}
