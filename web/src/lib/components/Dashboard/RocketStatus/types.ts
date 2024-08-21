import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const AirDocument = graphql(`
	subscription AirSub {
		rocket_sensor_air(order_by: { time_stamp: desc }, limit: 1) {
			altitude
			pressure_abs
			air_temperature
		}
	}
`);

const GPSDocument = graphql(`
	subscription GPSSub {
		rocket_sensor_gps_pos_1(order_by: { time_stamp: desc }, limit: 1) {
			altitude
			latitude
			longitude
		}
	}
`);

const ImuTempDocument = graphql(`
	subscription ImuTemp {
		rocket_sensor_imu_2(limit: 1, order_by: { temperature: asc }) {
			temperature
		}
	}
`);

export const Air = subscriptionStore({
	client: gqlClient,
	query: AirDocument
});

export const GPS = subscriptionStore({
	client: gqlClient,
	query: GPSDocument
});

export const ImuTemp = subscriptionStore({
	client: gqlClient,
	query: ImuTempDocument
});
