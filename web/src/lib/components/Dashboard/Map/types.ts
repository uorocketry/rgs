import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const LatestCoordinatesDocument = graphql(`
	subscription LatestCoordinates {
		rocket_sensor_gps_pos_1(limit: 1, order_by: { time_stamp: desc }) {
			altitude
			latitude
			longitude
		}
	}
`);

export const LatestCoordinates = subscriptionStore({
	client: gqlClient,
	query: LatestCoordinatesDocument
});
