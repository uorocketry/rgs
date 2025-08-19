// import { gqlClient } from '$lib/stores';
// import { subscriptionStore } from '@urql/svelte';
// import { graphql } from 'gql.tada';

// const AltitudeDocument = graphql(`
// 	subscription Altitude {
// 		altitude(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			altitude
// 		}
// 	}
// `);

// export const Altitude = subscriptionStore({
// 	// client: gqlClient,
// 	query: AltitudeDocument
// });

// const TemperatureDocument = graphql(`
// 	subscription Temperature {
// 		temperature(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			temperature
// 		}
// 	}
// `);

// export const Temperature = subscriptionStore({
// 	// client: gqlClient,
// 	query: TemperatureDocument
// });

// const PressureDocument = graphql(`
// 	subscription Pressure {
// 		pressure(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			pressure
// 		}
// 	}
// `);

// export const Pressure = subscriptionStore({
// 	// client: gqlClient,
// 	query: PressureDocument
// });

// const AirDocument = graphql(`
// 	subscription Air {
// 		rocket_sensor_barometer(order_by: { time_stamp: desc }, limit: 1) {
// 			pressure
// 			temperature
// 			altitude
// 		}
// 	}
// `);

// export const Air = subscriptionStore({
// 	// client: gqlClient,
// 	query: AirDocument
// });

// const GPSDocument = graphql(`
// 	subscription GPS {
// 		rocket_sensor_gps(
// 			order_by: { time_stamp: desc }
// 			limit: 1
// 			where: { gps_latitude: { _is_null: false } }
// 		) {
// 			gps_fix
// 			gps_latitude
// 			gps_longitude
// 			gps_speed
// 			gps_satellite_count
// 		}
// 	}
// `);

// export const GPS = subscriptionStore({
// 	// client: gqlClient,
// 	query: GPSDocument
// });

// const ImuTempDocument = graphql(`
// 	subscription ImuTemp {
// 		rocket_sensor_imu_1(limit: 1, order_by: { time_stamp: desc }) {
// 			temperature
// 		}
// 	}
// `);

// export const ImuTemp = subscriptionStore({
// 	// client: gqlClient,
// 	query: ImuTempDocument
// });
