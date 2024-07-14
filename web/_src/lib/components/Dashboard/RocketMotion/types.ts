import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const AccelerometersDocument = graphql(`
	subscription Accelerometers {
		rocket_sensor_imu_1(order_by: { time_stamp: desc }) {
			accelorometer_x
			accelorometer_y
			accelorometer_z
		}
	}
`);

export const Accelerometers = subscriptionStore({
	client: gqlClient,
	query: AccelerometersDocument
});

const DeltaVDocument = graphql(`
	subscription DeltaV {
		rocket_sensor_imu_2(
			order_by: { rocket_sensor_message: { rocket_message: { created_at: desc } } }
			limit: 1
		) {
			delta_velocity_x
			delta_velocity_y
			delta_velocity_z
		}
	}
`);

export const DeltaV = subscriptionStore({
	client: gqlClient,
	query: DeltaVDocument
});

const MaxDeltaVDocument = graphql(`
	subscription MaxDeltaV {
		rocket_sensor_imu_2_aggregate(where: { rocket_sensor_message: {} }) {
			aggregate {
				max {
					delta_velocity_x
					delta_velocity_y
					delta_velocity_z
				}
			}
		}
	}
`);

export const MaxDeltaV = subscriptionStore({
	client: gqlClient,
	query: MaxDeltaVDocument
});
