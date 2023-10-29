<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, Track } from '../../../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav } from 'svelte-paginate'
	import { page } from '$app/stores';
	import ScatterPlot from '../../../../components/ScatterPlot.svelte';
	import Histogram from '../../../../components/Histogram.svelte';

	let tracks: Track[];

  const artistId = $page.params.artist;

  const energyAccessor = d => d.energy;
  const danceabilityAccessor = d => d.danceability;
  const popularityAccessor = d => d.popularity;
  const keyAccessor = d => d.key;
  let majorTracks: Track[];
  let minorTracks: Track[];

  let chosenTrack: string;

	function fetchTracks() {
		fetch(`/artists/artist?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
				majorTracks = tracks.filter(t => t.mode == 1);
				minorTracks = tracks.filter(t => t.mode == 0);
				console.log(majorTracks);
				console.log(minorTracks)
			})
	}

	onMount(async () => {
		fetchTracks();
	});
</script>

<div class="px-4">
	<h1 class="is-size-1 mb-5">Tracks</h1>

<ScatterPlot
	data={tracks}
	xAccessor={energyAccessor}
	yAccessor={danceabilityAccessor}
	rAccessor={popularityAccessor}
	xLabel="Energy"
	yLabel="Danceability"
/>


<h1> Major </h1>
<Histogram
	data={majorTracks}
	xAccessor={keyAccessor}
	label="Key"
/>

<h1> Minor </h1>
<Histogram
	data={minorTracks}
	xAccessor={keyAccessor}
	label="Key"
/>

{#if tracks != undefined}
	{#each tracks as track}
		<p on:click={() => {chosenTrack = track.name}}> {track.name} {track.popularity} </p>
    {#if (chosenTrack == track.name)}
    <audio controls="controls">
      <source src={track.preview_url} type="audio/mpeg"/>
    </audio>
    {/if}
	{/each}
	{/if}
</div>