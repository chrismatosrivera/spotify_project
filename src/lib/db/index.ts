import Database from 'better-sqlite3';
import type { Track, Artist, AudioFeature } from './types';

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

export function getKeyDistributionForArtist(artistId: string) {
  const sql = `
    select af.key as name,
      count(key) as value,
      mode as mode,
      count(mode) as modecount
    from tracks as t
    inner join r_track_artist as ta on t.id = ta.track_id
    inner join artists as a on a.id = ta.artist_id
    inner join audio_features as af on t.audio_feature_id = af.id
    where a.id = '2JFljHPanIjYy2QqfNYvC0'
    group by [key], mode;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ artistId });
  return rows as AudioFeature[];
}

export function getTrackSample(): Track[] {
  const sql = `
    select
          avg(af.acousticness) * 100 as acousticness,
          avg(af.danceability) * 100 as danceability,
          avg(af.energy) * 100 as energy,
          avg(af.instrumentalness) * 100 as instrumentalness,
          avg(af.liveness) * 100 as liveness,
          avg(af.valence) * 100 as valence,
          avg(af.loudness) * 100 as loudness,
          avg(af.speechiness) * 100 as speechiness,
          af.tempo
    from tracks as t
    inner join r_track_artist as ta on t.id = ta.track_id
    inner join artists as a on a.id = ta.artist_id
    inner join audio_features as af on t.audio_feature_id = af.id
    inner join r_albums_tracks as at on at.track_id = t.id
    inner join albums as al on al.id = at.album_id
    where t.id in (select id from tracks where popularity > 10 ORDER BY RANDOM() LIMIT 1000) and a.popularity > 10
    group by af.tempo;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows as Track[];
}