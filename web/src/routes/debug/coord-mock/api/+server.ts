import { getDbClient } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function nowEpoch(): number {
    return Math.floor(Date.now() / 1000);
}

function clampAltitudeMeters(v: unknown): number {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5000, Math.round(n)));
}

function normalizeLatLon(v: unknown, min: number, max: number): number {
    const n = Number(v);
    if (!Number.isFinite(n)) throw error(400, 'Invalid coordinate');
    if (n < min || n > max) throw error(400, 'Coordinate out of range');
    return n;
}

export const POST: RequestHandler = async ({ request }) => {
    const db = getDbClient();
    const body = await request.json().catch(() => null);
    if (!body) throw error(400, 'Invalid JSON');

    const latitude = normalizeLatLon(body.lat, -90, 90);
    const longitude = normalizeLatLon(body.lon, -180, 180);
    const altitude_m = clampAltitudeMeters(body.alt);

    const ts = nowEpoch();

    const transaction = await db.transaction("write");
    try {
        // Insert SbgGpsPos
        const gpsRes = await transaction.execute({
            sql: `INSERT INTO SbgGpsPos (latitude, longitude, time_of_week, undulation, altitude, time_stamp, status, latitude_accuracy, longitude_accuracy, altitude_accuracy, num_sv_used, base_station_id, differential_age)
			VALUES (?, ?, 0, 0.0, ?, ?, 'OK', 0.0, 0.0, 0.0, 0, 0, 0)`,
            args: [latitude, longitude, altitude_m, ts]
        });

        // Insert SbgEkfNav
        const ekfRes = await transaction.execute({
            sql: `INSERT INTO SbgEkfNav (status, velocity_north, velocity_east, velocity_down, velocity_std_dev_north, velocity_std_dev_east, velocity_std_dev_down, position_latitude, position_longitude, position_altitude, position_std_dev_latitude, position_std_dev_longitude, position_std_dev_altitude, time_stamp, undulation)
			VALUES ('OK', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, ?, ?, ?, 0.0, 0.0, 0.0, ?, 0.0)`,
            args: [latitude, longitude, altitude_m, ts]
        });

        // Insert SbgAir
        const airRes = await transaction.execute({
            sql: `INSERT INTO SbgAir (time_stamp, status, pressure_abs, altitude, pressure_diff, true_airspeed, air_temperature)
			VALUES (?, 'OK', NULL, ?, NULL, NULL, NULL)`,
            args: [ts, altitude_m]
        });

        // Insert Barometer
        const baroRes = await transaction.execute({
            sql: `INSERT INTO Barometer (timestamp_us, pressure_pa, temperature_c, altitude_m)
			VALUES (?, NULL, NULL, ?)`,
            args: [ts * 1_000_000, altitude_m]
        });

        // Commit the transaction
        await transaction.commit();

        return json({
            success: true,
            inserted: {
                gps: gpsRes.rowsAffected,
                ekf: ekfRes.rowsAffected,
                air: airRes.rowsAffected,
                baro: baroRes.rowsAffected
            },
            lat: latitude,
            lon: longitude,
            alt: altitude_m
        });
    } catch (e: any) {
        // Rollback on error
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        console.error('Coord-mock insert failed', e);
        throw error(500, e?.message ?? 'Insert failed');
    } finally {
        // Always close the transaction
        transaction.close();
    }
};
