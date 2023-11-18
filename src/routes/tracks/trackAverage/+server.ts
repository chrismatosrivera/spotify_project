import { getTrackAverageSample } from '../../../lib/db/index';
import type { Track } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';

export const GET = (({ url }: any) => {
    let tracks: Track[] = [];

    tracks = getTrackAverageSample();

    return json(tracks);
}) 