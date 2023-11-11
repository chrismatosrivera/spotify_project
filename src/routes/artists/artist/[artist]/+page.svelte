<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, AudioFeature, Track } from '../../../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav } from 'svelte-paginate'
	import { page } from '$app/stores';
	import ScatterPlot from '../../../../components/ScatterPlot.svelte';
	import { Wave } from 'svelte-loading-spinners';
	import Barchart from '../../../../components/Barchart.svelte';

	let tracks: Track[];

  const artistId = $page.params.artist;

  let majorTracks: Track[];
  let minorTracks: Track[];
  let isLoading: boolean = false; 

  let majorKeyDistribution: AudioFeature[];
  let minorKeyDistribution: AudioFeature[];
  const yTicks = [0, 10, 25];

  let chosenTrack: string;

	function fetchTracks() {
		isLoading = true;
		fetch(`/artists/artist?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
				majorTracks = tracks.filter(t => t.mode == 1);
				minorTracks = tracks.filter(t => t.mode == 0);
				isLoading = false;
			})

		fetch(`/artists/keyDistribution?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				majorKeyDistribution = data.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistribution = data.filter((t: AudioFeature) => t.mode == 0);
			})
			
	}

	onMount(async () => {
		fetchTracks();
	});
</script>

<div class="px-4">
	<h1 class="is-size-1 mb-5">Tracks</h1>

{#if isLoading}
	<div class="h-screen flex items-center justify-center">
		<Wave size="60" color="#9980fa" unit="px" duration="1s" />
	</div>
{:else}

	<h1> Major </h1>
	<div class="majorHist">
		{#if majorKeyDistribution && majorKeyDistribution.length > 0}
			<Barchart data={majorKeyDistribution} yTicks={yTicks} />
		{/if}
	</div>

	<h1> Minor </h1>
	<div class="minorHist">
		{#if minorKeyDistribution && minorKeyDistribution.length > 0}
			<Barchart data={minorKeyDistribution} yTicks={yTicks} />
		{/if}
	</div>
{/if}


{#if tracks != undefined}
	{#each tracks as track}
		<p on:click={() => {chosenTrack = track.name}}> {track.name} {track.popularity} </p>
    {#if (chosenTrack == track.name)}
    <audio>
      <source src={track.preview_url} type="audio/mpeg"/>
    </audio>
    {/if}
	{/each}
	{/if}
</div>