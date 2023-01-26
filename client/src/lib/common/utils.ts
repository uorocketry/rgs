import { onDestroy } from "svelte";
import { get, writable, type Writable } from "svelte/store";
import { ClientSocket } from "./ClientSocket";

export let theme: Writable<string> = writable();

export function isDarkTheme(): boolean {
  return get(theme) === "dark";
}

export function onThemeChange(callback: () => void) {
  let unsubscribe = theme.subscribe(callback);
  onDestroy(() => {
    unsubscribe();
  });
}

export function onInterval(callback: () => void, milliseconds: number) {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
}

export function onSocket(event: string, callback: (...data: any) => void) {
  let unsubscribe = ClientSocket.on(event, callback);

  onDestroy(() => {
    unsubscribe();
  });
}
