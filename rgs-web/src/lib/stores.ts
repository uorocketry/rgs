import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import type { Message, Sbg, Sensor, State } from './common/bindings';
import { socket } from './common/socket';
import PocketBase from 'pocketbase';

export const state: Writable<State> = writable({
	status: 'Uninitialized',
	has_error: false,
	voltage: 0
});

export const pb = new PocketBase('http://127.0.0.1:8090');
pb.admins.authWithPassword('admin@db.com', 'adminadmin');

const initSensor: Sensor = {
	component_id: -1,
	data: {
		Sbg: {}
	}
} as Sensor;
export const sensorProxy = new Proxy(initSensor.data.Sbg, {
	get: function (obj: Sbg, prop: string) {
		return 0;
	}
});
initSensor.data.Sbg = sensorProxy;

export const sensor: Writable<Sensor> = writable(initSensor);

if (browser) {
	socket?.on('RocketMessage', (msg: Message) => {
		if ('state' in msg.data) {
			state.set(msg.data.state);
		} else {
			sensor.set(msg.data.sensor);
		}
	});
}
