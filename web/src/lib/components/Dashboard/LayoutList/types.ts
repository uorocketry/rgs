// import { gqlClient } from '$lib/stores';
// import { subscriptionStore } from '@urql/svelte';
// import { graphql } from 'gql.tada';

// export const LayoutListDocument = graphql(`
// 	subscription LayoutList {
// 		web_layout {
// 			id
// 			layout
// 			name
// 		}
// 	}
// `);

// export const DeleteLayoutDocument = graphql(`
// 	mutation DeleteLayout($id: Int) {
// 		delete_web_layout(where: { id: { _eq: $id } }) {
// 			affected_rows
// 		}
// 	}
// `);

// export const LayoutList = subscriptionStore({
// 	client: gqlClient,
// 	query: LayoutListDocument
// });
