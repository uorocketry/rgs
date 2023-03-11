import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import { Euler, Quaternion } from "three";

export const rotation = writable(new Quaternion());

if (browser) {
  // Instead of doing this here, we should probably have a separate file to handle SBG events
  setInterval(() => {
    rotation.set(
      get(rotation).setFromEuler(
        new Euler(Math.random() * 7, Math.random() * 7, Math.random() * 7)
      )
    );
  }, 1000);
}
