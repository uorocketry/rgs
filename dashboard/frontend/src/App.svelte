<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let gamepad: Gamepad | null = null;
  let logs: { message: string, timestamp: string }[] = [];
  let error: string | null = null;
  let animationFrameId: number;

  const MAX_LOGS = 20;

  function addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    logs = [{ message, timestamp }, ...logs].slice(0, MAX_LOGS);
  }

  function handleConnect(event: GamepadEvent) {
    addLog(`Gamepad connected at index ${event.gamepad.index}: ${event.gamepad.id}.`);
    if (!gamepad) {
      gamepad = event.gamepad;
      update();
    }
  }

  function handleDisconnect(event: GamepadEvent) {
    addLog(`Gamepad disconnected from index ${event.gamepad.index}: ${event.gamepad.id}.`);
    if (gamepad && gamepad.index === event.gamepad.index) {
      gamepad = null;
      cancelAnimationFrame(animationFrameId);
      // Check for other gamepads
      const gamepads = navigator.getGamepads().filter(g => g);
      if (gamepads.length > 0) {
        const firstGamepad = gamepads[0];
        if (firstGamepad) {
            gamepad = firstGamepad;
            addLog(`Switched to gamepad at index ${gamepad.index}: ${gamepad.id}.`);
            update();
        }
      }
    }
  }

  function update() {
    if (!gamepad) return;

    const gamepads = navigator.getGamepads();
    const latestGamepadState = gamepads[gamepad.index];

    if (latestGamepadState) {
      gamepad = latestGamepadState; // This triggers reactivity
    } else {
        // This case can happen if the gamepad was disconnected uncleanly
        addLog(`Gamepad at index ${gamepad.index} lost.`);
        cancelAnimationFrame(animationFrameId);
        
        // Check for other gamepads
        const otherGamepads = navigator.getGamepads().filter(g => g && g.index !== gamepad?.index);
        if (otherGamepads.length > 0 && otherGamepads[0]) {
            gamepad = otherGamepads[0];
            addLog(`Switched to gamepad at index ${gamepad.index}: ${gamepad.id}.`);
            update();
        } else {
            gamepad = null;
        }
        return;
    }
    
    animationFrameId = requestAnimationFrame(update);
  }

  onMount(() => {
    if (!('getGamepads' in navigator)) {
      error = "Gamepad API not supported in this browser.";
      addLog(error);
      return;
    }

    addLog("Waiting for gamepad connection...");

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    
    // Check if a gamepad is already connected
    const gamepads = navigator.getGamepads().filter(g => g);
    if (gamepads.length > 0) {
      const firstGamepad = gamepads[0];
      if (firstGamepad) {
        // The event might not be a real GamepadEvent, so we create a simple object
        handleConnect({ gamepad: firstGamepad } as GamepadEvent);
      }
    }
  });

  onDestroy(() => {
    window.removeEventListener('gamepadconnected', handleConnect);
    window.removeEventListener('gamepaddisconnected', handleDisconnect);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
</script>

<main>
  <h1>Controller Status v69</h1>

  <!-- Hard reload button -->
  <button on:click={() => location.reload()}>Hard Reload</button>

  <!-- Toggle fullscreen button -->
  <button on:click={() => toggleFullscreen()}>Toggle Fullscreen</button>

  {#if error}
    <div class="error">{error}</div>
  {:else if gamepad}
    <div class="controller-info">
      <h2>{gamepad.id}</h2>
      <p>Index: {gamepad.index} | Connected: {gamepad.connected}</p>
    </div>
    <div class="display">
      <div class="buttons">
        <h3>Buttons</h3>
        <ul>
          {#each gamepad.buttons as button, i}
            <li>
              Button {i}: 
              <span class:pressed={button.pressed}>{button.pressed ? 'Pressed' : 'Released'}</span>
              ({button.value.toFixed(2)})
            </li>
          {/each}
        </ul>
      </div>
      <div class="axes">
        <h3>Axes</h3>
        <ul>
          {#each gamepad.axes as axis, i}
            <li>
              Axis {i}:
              <progress value={axis + 1} max="2"></progress>
              <span>{axis.toFixed(4)}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {:else}
    <p>Waiting for a controller to be connected...</p>
  {/if}

  <div class="log-container">
    <h3>Logs</h3>
    <div class="logs">
      {#each logs as log}
        <p><code>[{log.timestamp}] {log.message}</code></p>
      {/each}
    </div>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    --background-color: #1e1e1e;
    --text-color: #d4d4d4;
    --primary-color: #007acc;
    --error-color: #f44747;
    --pressed-color: #4CAF50;
  }

  main {
    padding: 1rem;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  h1, h2, h3 {
    color: var(--primary-color);
  }

  .error {
    color: var(--error-color);
    border: 1px solid var(--error-color);
    padding: 1rem;
    border-radius: 4px;
  }

  .display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  .buttons li .pressed {
    color: var(--pressed-color);
    font-weight: bold;
  }
  
  .axes li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .axes progress {
    width: 150px;
  }

  .log-container {
    margin-top: 2rem;
    border-top: 1px solid var(--primary-color);
    padding-top: 1rem;
  }

  .logs {
    background-color: #252526;
    border: 1px solid #333;
    padding: 1rem;
    height: 200px;
    overflow-y: auto;
    border-radius: 4px;
    font-family: "Courier New", Courier, monospace;
  }

  .logs p {
    margin: 0;
    padding: 2px 0;
  }
</style>
