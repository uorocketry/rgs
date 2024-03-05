import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

export const RocketQuatDocument = graphql(`
	subscription RocketQuat {
		rocket_sensor_quat(limit: 1, order_by: { time_stamp: desc }) {
			data_quaternion {
				w
				x
				y
				z
			}
			time_stamp
		}
	}
`);

export const RocketQuat = subscriptionStore({
	client: gqlClient,
	query: RocketQuatDocument
});
