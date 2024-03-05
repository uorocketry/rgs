import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { Actions } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { ConnectionManagerClient } from '$lib/proto/hydra_provider/proto/hydra_provider.client';
import type { RpcError } from '@protobuf-ts/runtime-rpc';
import { ConnectionType } from '$lib/proto/hydra_provider/proto/hydra_provider';

// Load
const transport = new GrpcTransport({
	host: '[::1]:3001',
	channelCredentials: ChannelCredentials.createInsecure()
});

const client = new ConnectionManagerClient(transport);

export const load = async () => {
	const devices = await client.getSerialPorts({});
	console.log(devices.response);
	return {
		devices: devices.response.ports
	};
};

export const actions = {
	select_device: async (req) => {
		// device: string
		const form = await req.request.formData();
		const device = form.get('device');

		if (device === null) {
			return {
				error: 'No device selected'
			};
		} else {
			try {
				const response = await client.setPreferredSerialPort({
					portName: device.toString()
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

	select_mode: async (req) => {
		// device: string
		const form = await req.request.formData();
		const mode = form.get('mode');
		let modeEnum: ConnectionType;

		if (mode === null) {
			return {
				error: 'No mode selected'
			};
		}

		switch (mode) {
			case 'random':
				modeEnum = ConnectionType.RANDOM;
				break;
			case 'serial':
				modeEnum = ConnectionType.SERIAL;
				break;
			default:
				return {
					error: 'Invalid mode: ' + mode
				};
		}

		try {
			const response = await client.setConnectionType({
				connectionType: modeEnum
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
} satisfies Actions;
