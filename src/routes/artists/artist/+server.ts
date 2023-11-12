import { getArtistData, getArtistList, getKeyDistributionForArtist, getTrackForArtist } from '../../../lib/db/index';
import type { Track, Artist, AudioFeature } from '../../../lib/db/types';
import { json } from '@sveltejs/kit';

export const GET = (({ url }: any) => {
    const artistId = url.searchParams.get('artistId')?.toString();

    let artist: Artist;
    artist = getArtistData(artistId ?? "")[0];

    let tracks: Track[] = [];
    tracks = getTrackForArtist(artistId ?? "");

    let keyDistribution: AudioFeature[];
    keyDistribution = getKeyDistributionForArtist(artistId);

    artist.tracks = tracks;
    artist.keyDistribution = keyDistribution;

    return json(artist);
}) 