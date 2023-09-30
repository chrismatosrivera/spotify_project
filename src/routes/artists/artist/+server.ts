import { getArtistList, getTrackForArtist } from '../../../lib/db/index';
import type { Track } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';

export const GET = (({ url }) => {
    const artistId = url.searchParams.get('artistId')?.toString();
    let tracks: Track[] = [];

    tracks = getTrackForArtist(artistId ?? "");

    return json(tracks);
}) satisfies RequestHandler;