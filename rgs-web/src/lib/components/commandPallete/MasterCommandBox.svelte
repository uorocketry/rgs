<script lang="ts">
  import { browser } from "$app/environment";
  // import { commandActions, type CommandAction } from "$lib/common/actions";
  import { getStringScores } from "$lib/common/stringCmp";
  import { onDestroy, onMount, tick } from "svelte";
  import CommandBox from "./CommandBox.svelte";
  import {
    commandActions,
    commandReqAdaptor,
    type CommandRequest,
  } from "$lib/common/actions";
  import { get } from "svelte/store";

  let visible = true;
  let inputElement: HTMLInputElement;
  let inputValue = "";
  let list: string[] = [];
  let placeholder = "Search";
  let prompt = "";

  let cmdAdaptor: CommandRequest = {
    string: async (reqPrompt, reqPlaceholder) => {
      visible = true;
      inputValue = "";
      list = [];
      placeholder = reqPlaceholder;
      prompt = reqPrompt;
      await tick();
      inputElement.focus();

      return new Promise((resolve) => {
        cmdBox?.onEnter((err) => {
          if (err) {
            resolve(undefined);
            console.log("Resolving to undefined");
            return;
          }
          resolve(inputValue);
          console.log("Resolving to", inputValue);
          visible = false;
        });
      });
    },
    select: async (reqPrompt, options) => {
      visible = true;
      inputValue = "";
      list = options;
      prompt = reqPrompt;
      await tick();
      inputElement.focus();

      return new Promise((resolve) => {
        cmdBox?.onClick((item, err) => {
          if (err) {
            resolve(undefined);
            return;
          }
          resolve(item);
          visible = false;
        });
      });
    },
  };
  commandReqAdaptor.set(cmdAdaptor);

  async function chooseAction() {
    let actionNames = get(commandActions).map((a) => a.name);
    let choice: number | undefined = await cmdAdaptor.select("", actionNames); // Number
    if (choice === undefined) {
      return;
    }
    let action = get(commandActions)[choice];
    console.log("Action chosen:", action);
    action.do();
  }

  async function listenToToggle(e: KeyboardEvent) {
    // Ctrl + P to toggle
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault();
      if (!visible) inputValue = "";
      visible = !visible;
      await tick();
      if (visible) {
        inputElement.focus();
        chooseAction();
      }
    }
    // esc to close
    if (e.key === "Escape") {
      visible = false;
    }
  }

  onMount(() => {
    window.addEventListener("keydown", listenToToggle);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", listenToToggle);
  });

  let cmdBox: CommandBox;
</script>

{#if visible}
  <CommandBox
    bind:this={cmdBox}
    {placeholder}
    {prompt}
    {list}
    bind:inputElement
    bind:inputValue
  />
{/if}
