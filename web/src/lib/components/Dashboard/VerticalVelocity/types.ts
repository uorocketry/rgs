import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const latestAltitudeDocument = graphql(`
	subscription LatestAltitude {
		rocket_sensor_air(limit: 1, order_by: { rocket_sensor_message: { rocket_message: { created_at: desc } } }
		) {
			altitude
		}
	}
`);

export const LatestAltitude = subscriptionStore({
	client: gqlClient,
	query: latestAltitudeDocument
});
