import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import exp from 'constants';
import { graphql } from 'gql.tada';

/*const LatestAltidudeDocument = graphql(`
	subscription LatestAltitudeMeasurements {
  rocket_sensor_air(limit: 1, order_by: {time_stamp: desc}) {
    altitude
  }
}
`);*/

const LatestCoordinatesDocument = graphql(`
subscription LatestCoordinates {
  rocket_sensor_gps_pos_1(limit: 1, order_by: {time_stamp: desc}) {
    altitude
    latitude
    longitude
  }
}
`);

//graph QL queries must select one top level field



/*export const LatestAltitudeMeasurements = subscriptionStore({
	client: gqlClient,
	query: LatestAltidudeDocument
});*/

export const LatestCoordinates = subscriptionStore({
  client: gqlClient,
  query: LatestCoordinatesDocument
});