import { PUBLIC_GRAPHQL_ENDPOINT } from '$env/static/public';
import { cacheExchange, Client, fetchExchange, subscriptionExchange } from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
// use node
import Websocket from 'ws';

const graphQLWSEndpoint = PUBLIC_GRAPHQL_ENDPOINT.replace('http', 'ws');
const wsClient = createWSClient({
	url: graphQLWSEndpoint,
	webSocketImpl: Websocket
});

export const gqlClient = new Client({
	url: PUBLIC_GRAPHQL_ENDPOINT,
	exchanges: [
		cacheExchange,
		fetchExchange,
		subscriptionExchange({
			forwardSubscription(request) {
				const input = { ...request, query: request.query || '' };
				return {
					subscribe(sink) {
						const unsubscribe = wsClient.subscribe(input, sink);
						return { unsubscribe };
					}
				};
			}
		})
	]
});
