import { gqlClient } from '$lib/server/index';
import { InsertQuaternionDocument } from '$lib/server/quat_document';

export async function POST({ request }) {
	const { x, y, z, w } = await request.json();

	const result = await gqlClient.mutation(InsertQuaternionDocument, {
		x,
		y,
		z,
		w
	});

	if (result.error) {
		console.error(result.error);
	} else {
		console.log(result.data?.insert_rocket_message?.affected_rows);
	}

	return new Response();
}
