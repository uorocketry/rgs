import { browser } from '$app/environment';
import { onDestroy } from 'svelte';
import io from 'socket.io-client';
import type { Socket } from 'socket.io';
import { writable, type Unsubscriber } from 'svelte/store';
import type { ReservedOrUserEventNames, ReservedOrUserListener } from 'socket.io/dist/typed-events';
import type { ClientToServerEvents, ServerToClientEvents } from './Message';
import type { SocketReservedEventsMap } from 'socket.io/dist/socket';

/**
 * The client's socket connection to the server. Value is null on the server.
 * Prefer using onSocket() instead of socket.on() directly.
 */
export let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export let uuid = '';
export let secret = '';

const initSocket = () => {
	console.log('Initializing socket');

	// Check if we have a uuid in local storage
	uuid = localStorage.getItem('uuid') || '';
	secret = localStorage.getItem('secret') || '';
	if (!uuid || !secret) {
		// If not, generate one
		uuid = self.crypto.randomUUID();
		secret = self.crypto.randomUUID();
		localStorage.setItem('uuid', uuid);
		localStorage.setItem('secret', secret);
	}

	socket = io() as unknown as Socket;
	socket.on('connect', () => {
		console.log('Connected to server');
	});
	socket.on('disconnect', () => {
		console.error('Lost connection to server');
	});

	socket.on('message', (data: string) => {
		console.log('Received message from server: ', data);
	});

	// Emit a login message to the server with our uuid
	socket.emit('login', uuid, secret);
};

// TODO: improve typings

/**
 * Subscribes to a socket event and unsubscribes when the component is destroyed.
 * Prefer using this over socket.on() directly.
 * @param event The event name.
 * @param data The data to send.
 */
export function onSocket<
	Ev extends ReservedOrUserEventNames<SocketReservedEventsMap, ServerToClientEvents>,
	Cb extends ReservedOrUserListener<SocketReservedEventsMap, ServerToClientEvents, Ev>
>(event: Ev, callback: Cb) {
	socket?.on(event, callback);

	onDestroy(() => {
		socket?.off(event, callback);
	});
	const unsubscriber: Unsubscriber = () => {
		socket?.off(event, callback);
	};
	return unsubscriber;
}

if (browser) {
	initSocket();
}

// Socket status
export const socketConnected = writable(false, (set) => {
	const connect = () => {
		set(true);
	};

	const disconnect = () => {
		set(false);
	};

	if (socket) {
		set(socket.connected);
		socket.on('connect', connect);
		socket.on('disconnect', disconnect);
	}

	return () => {
		socket?.removeListener('connect', connect);
		socket?.removeListener('disconnect', disconnect);
	};
});
