import { onDestroy } from "svelte";
import { get, writable, type Unsubscriber, type Writable } from "svelte/store";

export let theme: Writable<string> = writable();

export function isDarkTheme(): boolean {
  return get(theme) === "dark";
}

export function onThemeChange(callback: () => void) {
  let unsubscribe = theme.subscribe(callback);
  onDestroy(() => {
    unsubscribe();
  });
  return unsubscribe;
}

export function onInterval(callback: () => void, milliseconds: number) {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
  let unsubscriber: Unsubscriber = () => {
    clearInterval(interval);
  };
  return unsubscriber;
}
