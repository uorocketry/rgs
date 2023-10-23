import { derived } from 'svelte/store';
import { Collections } from '../common/pocketbase-types';
import { latestCollectionWritable } from './lastestCollectionWritable';

const rocketPos1 = latestCollectionWritable(Collections.RocketPos1);
const rocketPos2 = latestCollectionWritable(Collections.RocketPos2);

export const rocketPos = derived([rocketPos1, rocketPos2], ([$rocketPos1, $rocketPos2]) => {
	return {
		...($rocketPos1 ?? {}),
		...($rocketPos2 ?? {})
	};
});


export const rocketVel = latestCollectionWritable(Collections.RocketVel);
