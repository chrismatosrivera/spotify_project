import { getTrackForGenre } from '../../../lib/db/index';
import type { Track, Artist, AudioFeature } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';

export const GET = (({ url }: any) => {
    const genreId = url.searchParams.get('genreId')?.toString();

    let tracks: Track[] = [];
    tracks = getTrackForGenre(genreId);

    return json(tracks);
}) 