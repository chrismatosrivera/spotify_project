export type Track = {
    name: string;
    duration: number;
    explicit: boolean;
    preview_url: string;
    popularity: number;
    artist_name: string;
    artist_followers: number;
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    valence: number;
    tempo: number;
    speechiness: number;
    time_signature: number;
};

export type Artist = {
    id: string;
    name: string;
    popularity: number;
}