<script lang="ts">
  import { onSocket, socket, uuid } from "$lib/common/socket";

  type Message = {
    timestamp: number;
    message: string;
    sender: string;
  };

  let messages: Message[] = [];

  onSocket("chat", (message: Message) => {
    messages = [...messages, message];
  });

  let textInput: HTMLInputElement;
  function submitMessage(event: Event) {
    console.log("submitting message");
    console.log(event);
    const input = event.target as HTMLInputElement;
    const message = textInput.value;
    socket?.emit("chat", {
      timestamp: Date.now(),
      message,
      sender: socket.id,
    });
    input.value = "";
  }

  let loggedUsers: string[] = [];
  onSocket("loggedUsers", (users: string[]) => {
    loggedUsers = users;
  });
</script>

<div class="h-full grid grid-cols-2">
  <div class="flex  flex-col p-4 gap-2">
    <p>TODO: Check-In with your peers and connection status</p>
    <div class="flex-1 card bg-base-200 rounded-xl overflow-auto">
      {#each messages as message}
        <!-- If message is not socket.id is not ours -->
        <div class="chat {message.sender === uuid ? 'chat-end' : 'chat-start'}">
          <div class="chat-header">
            {message.sender}
            <time class="text-xs opacity-50"
              >{new Date(message.timestamp).toLocaleString()}</time
            >
          </div>
          <div class="chat-bubble">{message.message}</div>
        </div>
      {/each}
    </div>

    <!-- Text input -->

    <form on:submit|preventDefault="{submitMessage}">
      <input
        name="message"
        bind:this="{textInput}"
        type="text"
        placeholder="Type your message here..."
        class="input input-accent w-full"
      />
    </form>
  </div>
  <!-- Right side connections -->
  <div class="flex flex-col gap-4 p-4">
    <h1 class="text-4xl font-bold">List of connections</h1>
    {#each loggedUsers as user}
      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">User: {user}</h2>
        </div>
      </div>
    {/each}
  </div>
</div>
