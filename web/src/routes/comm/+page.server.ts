import type { Actions } from './$types';
import { SerialDataFeedClient } from '$lib/proto/hydra_provider/proto/data_feed.client';
import { RandomDataFeedClient } from '$lib/proto/hydra_provider/proto/data_feed.client';
import { toPlainObject } from '$lib/common/utils';

// Load
const transport = new GrpcTransport({
	host: '[::1]:3001',
	channelCredentials: ChannelCredentials.createInsecure()
});

const serialClient = new SerialDataFeedClient(transport);
const randomClient = new RandomDataFeedClient(transport);

export const load = async () => {
	const devices = await serialClient.listAvailablePorts({});
	const serialStatus = await serialClient.getStatus({});
	const randomStatus = await randomClient.getStatus({});
	return {
		devices: devices.response.ports,
		serialStatus: toPlainObject(serialStatus.response),
		randomIsRunning: randomStatus.response.isRunning
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
