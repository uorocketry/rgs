import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const latestAltitudeDocument = graphql(`
	subscription LatestAltitude {
		rocket_sensor_air(order_by: {rocket_sensor_message: {}, time_stamp: desc}, limit: 1) {
			altitude
			time_stamp
		}
	}
`);

export const LatestAltitude = subscriptionStore({
	client: gqlClient,
	query: latestAltitudeDocument
});
