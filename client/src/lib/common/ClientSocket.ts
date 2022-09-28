import { io, Socket } from 'socket.io-client';
import { get, writable, type Unsubscriber, type Writable } from 'svelte/store'
import { browser } from "$app/environment";

export class ClientSocket {
    public static readonly DEFAULT_ENDPOINT = "localhost:3000";
    private static endpoint: string;
    public static _socket: Writable<Socket> = writable(io(ClientSocket.DEFAULT_ENDPOINT));
    public static connected = writable(false);
    // On callbacks is a map of event names to array of callback functions
    public static onCallbacks: Map<string, ((...args: any[]) => void)[]> = new Map();
    public static data: Map<string, Map<number, any>> = new Map();


    public static on(event: string, callback: (...args: any[]) => void): Unsubscriber {
        if (!ClientSocket.onCallbacks.has(event)) {
            ClientSocket.onCallbacks.set(event, []);
        }
        ClientSocket.onCallbacks.get(event)?.push(callback);
        this.socket.on(event, callback);
        return () => {
            // Remove callback from ClientSocket.onCallbacks
            let callbacks = ClientSocket.onCallbacks.get(event);
            if (callbacks) {
                callbacks = callbacks.filter(cb => cb !== callback);
                ClientSocket.onCallbacks.set(event, callbacks);
            }
            this.socket.off(event, callback);
        }
    }

    public static get socket(): Socket {
        return get(ClientSocket._socket);
    }

    public static getEndpoint() {
        return ClientSocket.endpoint;
    }

    public static setEndpoint(endpoint: string) {
        console.log("Setting endpoint to " + endpoint);
        // Close existing socket if it exists
        if (this.socket) {
            this.socket.disconnect();
        }

        this.endpoint = endpoint;
        console.log("Creating new socket");
        this._socket.set(io(endpoint));
        this.wire();
    }


    private static wire() {
        this.socket.on('connect', () => {
            console.log("Connected to server");
            this.connected.set(true);
        });
        this.socket.on('disconnect', () => {
            console.log("Disconnected from server");
            this.connected.set(false);
        });

        this.socket.on('put', (key, timestamp, value) => {
            if (!ClientSocket.data.has(key)) {
                ClientSocket.data.set(key, new Map());
            }
            ClientSocket.data.get(key)?.set(timestamp, value);
        });


        this.socket.on('meta', (data) => {
            let meta = new Map<number, any>();
            let i = 0;
            for (let value of data) {
                meta.set(i++, value);
            }
            this.data.set("meta", meta);
            console.log("Received meta");
            // this.data = this.data;// Trigger update
        });

        // add all onCallbacks to the socket
        for (let [event, callbacks] of ClientSocket.onCallbacks) {
            for (let callback of callbacks) {
                console.log("Restoring callback for " + event);
                this.socket.on(event, callback);
            }
        }

    }
}

if (browser) {
    // Static initialisation
    ClientSocket.setEndpoint(localStorage.getItem('endpoint') ?? ClientSocket.DEFAULT_ENDPOINT);
}