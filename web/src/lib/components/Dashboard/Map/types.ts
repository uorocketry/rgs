import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const LatestAltidudeDocument = graphql(`
	subscription LatestAltitudeMeasurements {
  rocket_sensor_air(limit: 1, order_by: {time_stamp: desc}) {
    altitude
  }
}

`);

export const LatestAltitudeMeasurements = subscriptionStore({
	client: gqlClient,
	query: LatestAltidudeDocument
});

//assumption: gps position 1 is latitude
//assumption: gps position 2 is longitude