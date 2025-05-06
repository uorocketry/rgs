// import { gqlClient } from '$lib/stores';
// import { subscriptionStore } from '@urql/svelte';
// import { graphql } from 'gql.tada';

// const VerticalVelocityDocument = graphql(`
// 	subscription VerticalVelocity {
// 		vertical_velocity(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			velocity
// 		}
// 	}
// `);

// export const VerticalVelocity = subscriptionStore({
// 	// client: gqlClient,
// 	query: VerticalVelocityDocument
// });

// const latestAltitudeDocument = graphql(`
// 	subscription LatestAltitude {
// 		rocket_sensor_air(limit: 1, order_by: { time_stamp: desc }) {
// 			altitude
// 			time_stamp
// 		}
// 	}
// `);

// export const LatestAltitude = subscriptionStore({
// 	// client: gqlClient,
// 	query: latestAltitudeDocument
// });
