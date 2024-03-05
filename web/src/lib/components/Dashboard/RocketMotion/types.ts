import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const AccelerometersDocument = graphql(`
	subscription Accelerometers {
		rocket_sensor_imu_1(order_by: { time_stamp: desc }) {
			data_vec3ByAccelerometers {
				x
				y
				z
			}
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
			dataVec3ByDeltaVelocity {
				x
				y
				z
			}
		}
	}
`);

export const DeltaV = subscriptionStore({
	client: gqlClient,
	query: DeltaVDocument
});

const MaxDeltaVDocument = graphql(`
	subscription MaxDeltaV {
		data_vec3_aggregate(where: { rocketSensorImu2sByDeltaVelocity: {} }) {
			aggregate {
				max {
					x
					y
					z
				}
			}
		}
	}
`);

export const MaxDeltaV = subscriptionStore({
	client: gqlClient,
	query: MaxDeltaVDocument
});
