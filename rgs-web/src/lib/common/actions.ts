import { get, writable, type Writable } from "svelte/store";
import { virtualLayout } from "./layoutStore";
import { pb } from "$lib/stores";

export interface CommandAction {
  name: string;
  do: () => void;
}

export interface CommandRequest {
  string: (prompt: string, placeholder: string) => Promise<string | undefined>;
  select: (prompt: string, options: string[]) => Promise<number | undefined>;
}

const defaultAdapterResponse = async () => {
  console.log("No command request adaptor set");
  return undefined;
};
export let commandReqAdaptor: Writable<CommandRequest> = writable({
  string: defaultAdapterResponse,
  select: defaultAdapterResponse,
});

export let commandActions: Writable<CommandAction[]> = writable([
  {
    name: "Developer: Alert Test",
    do: async () => {
      let cmd = get(commandReqAdaptor);
      if (!cmd) return;

      let alertMsg = await cmd.string("Alert Message?", "Hello World");
      console.log("Alert Test: " + alertMsg);
      alert(alertMsg);
    },
  },
  {
    name: "Layout: Save Layout",
    do: async () => {
      let cmd = get(commandReqAdaptor);
      if (!cmd) return;

      let layoutName = await cmd.string("Layout name?", "Recovery Layout");
      if (!layoutName) return;
      console.log("Saving layout: " + layoutName);
      let vLayout = get(virtualLayout);
      if (!vLayout) return;
      let saved = vLayout.saveLayout();
      pb.collection("layouts").create({
        name: layoutName,
        data: JSON.stringify(saved),
      });
    },
  },
  {
    name: "Developer: Bar",
    do: () => {
      console.log("Alert Test");
    },
  },
]);
