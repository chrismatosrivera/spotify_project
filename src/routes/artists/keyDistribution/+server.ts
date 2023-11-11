import { getArtistList, getTrackForArtist, getKeyDistributionForArtist } from '../../../lib/db/index';
import type { AudioFeature, Track } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';


export const GET = (({ url }: any) => {
    const artistId = url.searchParams.get('artistId')?.toString();
    let keys: AudioFeature[] = [];

    keys = getKeyDistributionForArtist(artistId);

    return json(keys);
})