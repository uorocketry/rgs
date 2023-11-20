import { DB_REST_PORT } from '$env/static/private';
import PocketBase from 'pocketbase';

export async function GET() {
	const pb = new PocketBase(`http://localhost:${DB_REST_PORT}`);
	await pb.admins.authWithPassword('admin@admin.com', 'admin');

	const res = (
		await pb.collections.getFullList({
			$autoCancel: false
		})
	).filter((item) => {
		return item.name[0] === item.name[0].toUpperCase();
	});
	return new Response(JSON.stringify(res));
}
