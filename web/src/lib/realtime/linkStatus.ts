import { unflattenObjectWithArray } from '$lib/common/utils';
import type { Air, EkfNav1, EkfNav2, EkfQuat, Imu1, Imu2, LinkStatus } from '@rgs/bindings';
import { derived } from 'svelte/store';
import { latestCollectionWritable } from './lastestCollectionWritable';

export const linkStatus = latestCollectionWritable<LinkStatus | undefined>(
	'LinkStatus',
	undefined,
	(row) => {
		return row as unknown as LinkStatus;
	}
);

export const air = latestCollectionWritable<Air | undefined>('Air', undefined, (row) => {
	return row as unknown as Air;
});

const ekf1 = latestCollectionWritable<EkfNav1 | undefined>('EkfNav1', undefined, (row) => {
	return unflattenObjectWithArray(row) as unknown as EkfNav1;
});

const ekf2 = latestCollectionWritable<EkfNav2 | undefined>('EkfNav2', undefined, (row) => {
	return unflattenObjectWithArray(row) as unknown as EkfNav2;
});

const ekfQuaternion = latestCollectionWritable<EkfQuat | undefined>('EkfQuat', undefined, (row) => {
	return unflattenObjectWithArray(row) as unknown as EkfQuat;
});

export const ekf = derived([ekf1, ekf2, ekfQuaternion], ([$ekf1, $ekf2, $ekfQuaternion]) => {
	return {
		...($ekf1 ?? {}),
		...($ekf2 ?? {}),
		...($ekfQuaternion ?? {})
	};
});

export const state = latestCollectionWritable<{ status: string } | undefined>(
	'State',
	undefined,
	(row) => {
		return row as unknown as { status: string };
	}
);

const imu1 = latestCollectionWritable<Imu1 | undefined>('Imu1', undefined, (row) => {
	return unflattenObjectWithArray(row) as unknown as Imu1;
});

const imu2 = latestCollectionWritable<Imu2 | undefined>('Imu2', undefined, (row) => {
	return unflattenObjectWithArray(row) as unknown as Imu2;
});

export const imu = derived([imu1, imu2], ([$imu1, $imu2]) => {
	return {
		...($imu1 ?? {}),
		...($imu2 ?? {})
	};
});
