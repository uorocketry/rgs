import { gqlClient } from '$lib/stores';
import { subscriptionStore } from '@urql/svelte';
import { graphql } from 'gql.tada';

const AltitudeDocument = graphql(`
     subscription AltitudeDocument {
  rocket_sensor_air(limit: 100, order_by: {time_stamp: asc}) {
    altitude
    time_stamp
  }
}
 
`);