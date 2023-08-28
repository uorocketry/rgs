import type { Air, EkfNav1, EkfNav2, EkfQuat, LinkStatus } from '@rgs/bindings';
import { latestCollectionWritable } from './lastestCollectionWritable';
import { derived, writable } from 'svelte/store';
import { unflattenObjectWithArray } from '$lib/common/utils';

export const linkStatus = latestCollectionWritable<LinkStatus | undefined>(
    "LinkStatus", undefined, (row) => {
        return row as unknown as LinkStatus;
    }
);

export const air = latestCollectionWritable<Air>(
    "Air",
    undefined,
    (row) => {
        return row as unknown as Air;
    }
);



const ekf1 = latestCollectionWritable<EkfNav1 | undefined>(
    "EkfNav1",
    undefined,
    (row) => {
        return unflattenObjectWithArray(row) as unknown as EkfNav1;
    }
)

const ekf2 = latestCollectionWritable<EkfNav2 | undefined>(
    "EkfNav2",
    undefined,
    (row) => {
        return unflattenObjectWithArray(row) as unknown as EkfNav2;
    }
)

const ekfQuaternion = latestCollectionWritable<EkfQuat | undefined>(
    "EkfQuaternion",
    undefined,
    (row) => {
        return unflattenObjectWithArray(row) as unknown as EkfQuat;
    }
)

export const ekf = derived([ekf1, ekf2, ekfQuaternion], ([$ekf1, $ekf2, $ekfQuaternion]) => {
    return {
        ...($ekf1 ?? {}),
        ...($ekf2 ?? {}),
        ...($ekfQuaternion ?? {})
    }
});

export const state = latestCollectionWritable<{ status: string }>(
    "State",
    undefined,
    (row) => {
        return row as unknown as { status: string };
    }
);
