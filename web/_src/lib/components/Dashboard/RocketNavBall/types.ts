import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const RocketQuatDocument = graphql(`
	subscription RocketQuat {
		rocket_message(
			where: { rocket_sensor_message: { rocket_sensor_quat: {} } }
			order_by: { created_at: desc }
		) {
			rocket_sensor_message {
				rocket_sensor_quat {
					quat_x
					quat_y
					quat_z
					quat_w
				}
			}
		}
	}
`);

const RocketCourseDocument = graphql(`
	subscription Course {
		rocket_sensor_gps_vel(limit: 1, order_by: { time_stamp: desc }) {
			course
		}
	}
`);

export const RocketCourse = subscriptionStore({
	client: gqlClient,
	query: RocketCourseDocument
});

export const RocketQuat = subscriptionStore({
	client: gqlClient,
	query: RocketQuatDocument
});
