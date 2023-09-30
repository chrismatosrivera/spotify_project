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
  const keyAccessor = d => d.key;

  let chosenTrack: string;

	function fetchTracks() {
		fetch(`/artists/artist?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
				console.log(tracks)
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
	xLabel="Energy"
	yLabel="Danceability"
/>

<Histogram
				data={tracks}
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