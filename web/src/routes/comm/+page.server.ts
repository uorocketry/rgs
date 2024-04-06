import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { Actions } from './$types';
import { SerialDataFeedClient } from '$lib/proto/hydra_provider/proto/data_feed.client';
import { RandomDataFeedClient } from '$lib/proto/hydra_provider/proto/data_feed.client';
import type { RpcError } from '@protobuf-ts/runtime-rpc';
import { ChannelCredentials } from '@grpc/grpc-js';

// Load
const transport = new GrpcTransport({
	host: '[::1]:3001',
	channelCredentials: ChannelCredentials.createInsecure()
});

const serialClient = new SerialDataFeedClient(transport);
const randomClient = new RandomDataFeedClient(transport);

function classToPOJO<T extends object>(instance: T): { [K in keyof T]: T[K] } {
	const pojo = {} as { [K in keyof T]: T[K] };
	for (const key of Object.keys(instance)) {
		if (typeof instance[key as keyof T] !== 'function') {
			pojo[key as keyof T] = instance[key as keyof T];
		}
	}
	return pojo;
}

export const load = async () => {
	const devices = await serialClient.listAvailablePorts({});
	const serialStatus = await serialClient.getStatus({});
	const randomIsRunning = await randomClient.isRunning({});
	return {
		devices: devices.response.ports,
		serialStatus: classToPOJO(serialStatus.response),
		randomIsRunning: randomIsRunning.response.isRunning
	};
};

export const actions = {
	serial_configure: async (req) => {
		// device: string
		const form = await req.request.formData();
		const device = form.get('device');

		if (device === null) {
			return {
				error: 'No device selected'
			};
		} else {
			try {
				const response = await serialClient.configure({
					baudRate: 9600,
					port: device.toString()
				});
				return {
					response: JSON.parse(JSON.stringify(response.response))
				};
			} catch (error) {
				const err = error as RpcError;
				return {
					error: err.message
				};
			}
		}
	},

	serial_start: async () => {
		await serialClient.start({});
	},

	serial_stop: async () => {
		await serialClient.stop({});
	},
	random_start: async () => {
		await randomClient.start({});
	},
	random_stop: async () => {
		await randomClient.stop({});
	}
} satisfies Actions;
