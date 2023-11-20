import { derived, type Writable } from 'svelte/store';
import {
	Collections,
	type RocketAirResponse,
	type RocketImu1Response,
	type RocketImu2Response,
	type RocketNav1Response,
	type RocketNav2Response,
	type RocketQuatResponse
} from '../common/pocketbase-types';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const linkStatus = latestCollectionWritable(Collections.RocketLink);

export const air = latestCollectionWritable(Collections.RocketAir) as Writable<
	RocketAirResponse<number[]> | undefined
>;

const nav1 = latestCollectionWritable(Collections.RocketNav1) as Writable<
	RocketNav1Response<number[], number[], unknown> | undefined
>;

const nav2 = latestCollectionWritable(Collections.RocketNav2) as Writable<
	RocketNav2Response<number[], number[], unknown> | undefined
>;

export const quat = latestCollectionWritable(Collections.RocketQuat) as Writable<
	RocketQuatResponse<number[], number[], unknown> | undefined
>;

export const nav = derived([nav1, nav2], ([$nav1, $nav2]) => {
	return {
		...($nav1 ?? {}),
		...($nav2 ?? {})
	};
});

export const state = latestCollectionWritable(Collections.RocketState);

const imu1 = latestCollectionWritable(Collections.RocketImu1) as Writable<
	RocketImu1Response<number[], number[], unknown> | undefined
>;
const imu2 = latestCollectionWritable(Collections.RocketImu2) as Writable<
	RocketImu2Response<number[], number[], unknown> | undefined
>;

export const imu = derived([imu1, imu2], ([$imu1, $imu2]) => {
	return {
		...($imu1 ?? {}),
		...($imu2 ?? {})
	};
});
