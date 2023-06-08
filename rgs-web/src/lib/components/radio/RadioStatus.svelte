<script lang="ts">
    import type { LinkStatus } from "../../../../../hydra_provider/bindings/LinkStatus";
    import { onSocket, socket } from "$lib/common/socket";

    let radio_msg: LinkStatus[] = [];

    onSocket("LinkStatus", (msg: LinkStatus) => {
        radio_msg = [...radio_msg, msg];
    })
</script>

<div class="card shadow-xl w-full h-full place-items-stretch">
    <div class=" text-3xl font-bold text-center">
        <h2>Radio Info</h2>
    </div>
    
    <div class="card-body">
        <div class="gap-0 !p-2">
            <div class="flex place-items-left">
                <p class="w-1/2 text-left text-2xl mr-8">rssi:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.rssi}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">remrssi:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.remrssi}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">txbuf:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.txbuf}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">noise:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.noise}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">remnoise:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.remnoise}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">rxerrors:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.rxerrors}</p>
            </div>
            <div class="flex">
                <p class="w-1/2 text-left text-2xl mr-8">fixed:</p>
                <p class="w-1/2 text-xl text-right">{radio_msg[radio_msg.length -1]?.fixed}</p>
            </div>
        </div>
    </div>
</div>