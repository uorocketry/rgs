// import { gqlClient } from '$lib/stores';
// import { subscriptionStore } from '@urql/svelte';
// import { graphql } from 'gql.tada';

// const AccelerationDocument = graphql(`
// 	subscription Acceleration {
// 		acceleration(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const Acceleration = subscriptionStore({
// 	// client: gqlClient,
// 	query: AccelerationDocument
// });

// const GyroscopeDocument = graphql(`
// 	subscription Gyroscope {
// 		gyroscope(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const Gyroscope = subscriptionStore({
// 	// client: gqlClient,
// 	query: GyroscopeDocument
// });

// const MagnetometerDocument = graphql(`
// 	subscription Magnetometer {
// 		magnetometer(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const Magnetometer = subscriptionStore({
// 	// client: gqlClient,
// 	query: MagnetometerDocument
// });

// const AccelerometersDocument = graphql(`
// 	subscription Accelerometers {
// 		accelerometers(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const Accelerometers = subscriptionStore({
// 	// client: gqlClient,
// 	query: AccelerometersDocument
// });

// const DeltaVDocument = graphql(`
// 	subscription DeltaV {
// 		deltav(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const DeltaV = subscriptionStore({
// 	// client: gqlClient,
// 	query: DeltaVDocument
// });

// const MaxDeltaVDocument = graphql(`
// 	subscription MaxDeltaV {
// 		maxdeltav(limit: 1, order_by: { timestamp: desc }) {
// 			timestamp
// 			x
// 			y
// 			z
// 		}
// 	}
// `);

// export const MaxDeltaV = subscriptionStore({
// 	// client: gqlClient,
// 	query: MaxDeltaVDocument
// });
