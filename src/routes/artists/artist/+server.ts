import { getArtistList, getTrackForArtist } from '../../../lib/db/index';
import type { Track } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../$types';

let keys: any = {
    1: "C",
    2: "D",
    3: "E",
    4: "F",
    5: "G",
    6: "A",
    7: "B"
}

export const GET = (({ url }) => {
    const artistId = url.searchParams.get('artistId')?.toString();
    let tracks: Track[] = [];

    tracks = getTrackForArtist(artistId ?? "");

    tracks.map(t => t.key_string = keys[t.key]);

    return json(tracks);
}) satisfies RequestHandler;