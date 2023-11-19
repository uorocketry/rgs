import { derived } from 'svelte/store';
import { Collections } from '../common/pocketbase-types';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const linkStatus = latestCollectionWritable(Collections.LinkStatus);

export const air = latestCollectionWritable(Collections.Air);

const ekf1 = latestCollectionWritable(Collections.EkfNav1);

const ekf2 = latestCollectionWritable(Collections.EkfNav2);

const ekfQuaternion = latestCollectionWritable(Collections.EkfQuat);

export const ekf = derived([ekf1, ekf2, ekfQuaternion], ([$ekf1, $ekf2, $ekfQuaternion]) => {
	return {
		...($ekf1 ?? {}),
		...($ekf2 ?? {}),
		...($ekfQuaternion ?? {})
	};
});

export const state = latestCollectionWritable(Collections.State);

const imu1 = latestCollectionWritable(Collections.Imu1);

const imu2 = latestCollectionWritable(Collections.Imu2);

export const imu = derived([imu1, imu2], ([$imu1, $imu2]) => {
	return {
		...($imu1 ?? {}),
		...($imu2 ?? {})
	};
});
