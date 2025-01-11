// import { gqlClient } from '$lib/stores';
// import { subscriptionStore } from '@urql/svelte';
// import { graphql } from 'gql.tada';

// const LatestCoordinatesDocument = graphql(`
// 	subscription LatestCoordinates {
// 		rocket_sensor_nav_pos_llh(limit: 1, order_by: { rocket_sensor_message: { rocket_message: { created_at: desc } } }
// 		) {
// 			latitude
// 			longitude
// 		}
// 	}
// `);

// const LatestCoordinatesSBGDocument = graphql(`
// 	subscription LatestCoordinates {
// 		rocket_sensor_gps_pos_1(limit: 1, order_by: { rocket_sensor_message: { rocket_message: { created_at: desc } } }
// 		) {
// 			latitude
// 			longitude
// 		}
// 	}
// `);

// const latestAltitudeDocument = graphql(`
// 	subscription LatestAltitude {
// 		rocket_sensor_air(limit: 1, order_by: { rocket_sensor_message: { rocket_message: { created_at: desc } } }
// 		) {
// 			altitude
// 		}
// 	}
// `);

// export const LatestCoordinates = subscriptionStore({
// 	client: gqlClient,
// 	query: LatestCoordinatesDocument
// });

// export const LatestCoordinatesSBG = subscriptionStore({
// 	client: gqlClient,
// 	query: LatestCoordinatesSBGDocument
// });

// export const LatestAltitude = subscriptionStore({
// 	client: gqlClient,
// 	query: latestAltitudeDocument
// });
