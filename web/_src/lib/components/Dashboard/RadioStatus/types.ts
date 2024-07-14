import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

export const RadioStatusDocument = graphql(`
	subscription RadioStatus {
		rocket_radio_status(limit: 1, order_by: { created_at: desc }) {
			fixed
			noise
			remnoise
			remrssi
			rssi
			rxerrors
			txbuf
			created_at
		}
	}
`);

export const RadioStatus = subscriptionStore({
	client: gqlClient,
	query: RadioStatusDocument
});
