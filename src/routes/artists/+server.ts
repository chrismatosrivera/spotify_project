import { getArtistList } from '../../lib/db/index';
import type { Artist } from '../../lib/db/types';
import { json } from '@sveltejs/kit';

export const GET = (({ url }: any) => {
    const searchTerm = url.searchParams.get('searchTerm')?.toString();
    let artists: Artist[] = [];

    artists = getArtistList(searchTerm ?? "");

    return json(artists);
}) 