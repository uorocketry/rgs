import { derived, type Writable } from 'svelte/store';
import { Collections, type RocketAirResponse, type RocketImu1Response, type RocketImu2Response, type RocketNav1Response, type RocketNav2Response, type RocketQuatResponse } from '../common/pocketbase-types';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const linkStatus = latestCollectionWritable(Collections.RocketLink) 

export const air = latestCollectionWritable(Collections.RocketAir) as Writable<RocketAirResponse<number[]> | undefined>

const ekf1 = latestCollectionWritable(Collections.RocketNav1) as Writable<RocketNav1Response<number[], number[], unknown> | undefined>

const ekf2 = latestCollectionWritable(Collections.RocketNav2) as Writable<RocketNav2Response<number[], number[], unknown> | undefined>

const ekfQuaternion = latestCollectionWritable(Collections.RocketQuat) as Writable<RocketQuatResponse<number[], number[], unknown> | undefined>

export const ekf = derived([ekf1, ekf2, ekfQuaternion], ([$ekf1, $ekf2, $ekfQuaternion]) => {
	return {
		...($ekf1 ?? {}),
		...($ekf2 ?? {}),
		...($ekfQuaternion ?? {})
	};
});

export const state = latestCollectionWritable(Collections.RocketState);

const imu1 = latestCollectionWritable(Collections.RocketImu1) as Writable<RocketImu1Response<number[], number[], unknown> | undefined>
const imu2 = latestCollectionWritable(Collections.RocketImu2) as Writable<RocketImu2Response<number[], number[], unknown> | undefined>

export const imu = derived([imu1, imu2], ([$imu1, $imu2]) => {
	return {
		...($imu1 ?? {}),
		...($imu2 ?? {})
	};
});
