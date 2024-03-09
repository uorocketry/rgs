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
