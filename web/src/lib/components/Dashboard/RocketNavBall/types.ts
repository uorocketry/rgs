import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const RocketQuatDocument = graphql(`
	subscription RocketQuat {
		rocket_message(
			where: { rocket_sensor_message: { rocket_sensor_quat: { data_quaternion: {} } } }
			limit: 1
			order_by: { created_at: desc }
		) {
			rocket_sensor_message {
				rocket_sensor_quat {
					data_quaternion {
						w
						x
						y
						z
					}
				}
			}
		}
	}
`);

export const RocketQuat = subscriptionStore({
	client: gqlClient,
	query: RocketQuatDocument
});
