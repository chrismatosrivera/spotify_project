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

export function getGenreList(searchQuery: string): { id: string }[] {
  searchQuery = searchQuery + '%';

  const sql = `
    select *
    from genres
    where id like $searchQuery
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ searchQuery });
  return rows as { id: string }[];
}

export function getTrackForGenre(genre_id: string): Track[] {
  const sql = `
    select popularity,
          acousticness,
          danceability,
          energy,
          instrumentalness,
          key,
          liveness,
          loudness,
          mode,
          valence,
          tempo,
          speechiness,
          time_signature
    from trackgenres
    where genre_id = $genre_id;
  `

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ genre_id });
  return rows as Track[];
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

export function getArtistData(artistId: string) {
  const sql = `
  select id,
      name,
      genre_id
  from artists
  inner join r_artist_genre on id = artist_id
  where id = $artistId
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ artistId });
  return rows as Artist[];
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
    where a.id = $artistId
    group by [key], mode;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ artistId });
  return rows as AudioFeature[];
}

export function getAverageKeyDistributionForGenre(genreId: string) {
  const sql = `
    WITH TrackCounts AS (
    select t.key AS name,
        COUNT(t.id) AS track_count,
        t.mode AS mode
    from trackgenres AS t
    where t.genre_id = $genreId
    group by t.key, t.mode
    )

    select name,
        AVG(track_count) AS value,
        mode
    from TrackCounts
    group by name, mode;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all({ genreId });
  return rows as AudioFeature[];
}

export function getTrackAverageSample(): Track[] {
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
    where t.id in (select id from tracks where popularity > 10 ORDER BY RANDOM() LIMIT 1000) and a.popularity > 10
    group by af.tempo;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows as Track[];
}

export function getTrackSample(): Track[] {
  const sql = `
    select
          t.name,
          t.popularity,
          t.preview_url as preview_url,
          af.loudness as loudness,
          af.acousticness as acousticness,
          af.danceability as danceability,
          af.energy as energy,
          af.instrumentalness as instrumentalness,
          af.liveness as liveness,
          af.valence as valence,
          af.loudness as loudness,
          af.speechiness as speechiness,
          af.tempo
    from tracks as t
    inner join r_track_artist as ta on t.id = ta.track_id
    inner join artists as a on a.id = ta.artist_id
    inner join audio_features as af on t.audio_feature_id = af.id
    where t.id and a.popularity > 10 and preview_url != '' LIMIT 100;
  `;

  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return rows as Track[];
}