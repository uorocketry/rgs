import { getDbClient } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const db = getDbClient();
    const result = await db.execute({
        sql: `SELECT timestamp, rssi, packets_lost FROM RadioMetrics ORDER BY timestamp DESC LIMIT 20`,
        args: []
    });
    return json(result.rows);
};
