import Database from 'better-sqlite3';
import type { Track, Artist } from './types';

const db = new Database('./data/spotify.sqlite', { verbose: console.log });

export function getArtistList(searchQuery : string): Artist[] {

    searchQuery = searchQuery + '%';

    const sql = `
      select name, 
        id,
        popularity 
      from artists
      where name like $searchQuery order by name;
    `;
    const stmnt = db.prepare(sql);
    const rows = stmnt.all({ searchQuery });
    return rows as Artist[];
}

export function getTrackForArtist(artistId: string): Track[] {
  const sql = `
    select t.name,
          t.duration,
          t.explicit,
          t.preview_url,
          t.popularity,
          a.name as artist_name,
          a.followers as artist_followers,
          af.acousticness,
          af.danceability,
          af.energy,
          af.instrumentalness,
          af.key,
          af.liveness,
          af.loudness,
          af.mode,
          af.valence,
          af.tempo,
          af.speechiness,
          af.time_signature
    from tracks as t
    inner join r_track_artist as ta on t.id = ta.track_id
    inner join artists as a on a.id = ta.artist_id
    inner join audio_features as af on t.audio_feature_id = af.id
    where a.id = $artistId;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ artistId });
  return rows as Track[];
}

export function getTrackSample(): Track[] {
  const sql = `
    select t.name,
          t.duration,
          t.explicit,
          t.preview_url,
          t.popularity,
          a.name as artist_name,
          a.followers as artist_followers,
          af.acousticness,
          af.danceability,
          af.energy,
          af.instrumentalness,
          af.key,
          af.liveness,
          af.loudness,
          af.mode,
          af.valence,
          af.tempo,
          af.speechiness,
          af.time_signature
    from tracks as t
    inner join r_track_artist as ta on t.id = ta.track_id
    inner join artists as a on a.id = ta.artist_id
    inner join audio_features as af on t.audio_feature_id = af.id
    where t.id in (select id from tracks ORDER BY RANDOM() LIMIT 10000);
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows as Track[];
}