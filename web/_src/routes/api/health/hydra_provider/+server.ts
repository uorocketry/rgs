import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { ChannelCredentials } from '@grpc/grpc-js';
import { HealthClient } from '$lib/proto/hydra_provider/proto/health.client.js';

export async function GET() {
	try {
		const transport = new GrpcTransport({
			host: '[::1]:3001',
			channelCredentials: ChannelCredentials.createInsecure()
		});

		const client = new HealthClient(transport);

		const healthCheck = await client.check({ service: '' });
		switch (healthCheck.response.status) {
			case 0:
				return new Response('UNKNOWN', { status: 404 });
			case 1:
				return new Response('SERVING', { status: 200 });
			case 2:
				return new Response('NOT_SERVING', { status: 503 });
			case 3:
				return new Response('SERVICE_UNKNOWN', { status: 404 });
			default:
				return new Response('UNKNOWN', { status: 404 });
		}
	} catch (e) {
		return new Response((e as RpcError).code, { status: 404 });
	}
}
