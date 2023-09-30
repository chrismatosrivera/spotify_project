import { getTrackSample } from '../../lib/db/index';
import type { Artist } from '../../lib/db/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET = (({ url }) => {
    let tracks: Tracks[] = [];

    tracks = getTrackSample();

    return json(tracks);
}) satisfies RequestHandler;