<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, Track } from '../../../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav } from 'svelte-paginate'
	import { page } from '$app/stores';
	import ScatterPlot from '../../../../components/ScatterPlot.svelte';
	import Histogram from '../../../../components/Histogram.svelte';
	import { Wave } from 'svelte-loading-spinners';

	let tracks: Track[];

  const artistId = $page.params.artist;

  const energyAccessor = d => d.energy;
  const danceabilityAccessor = d => d.danceability;
  const popularityAccessor = d => d.popularity;
  const keyAccessor = d => d.key;
  let majorTracks: Track[];
  let minorTracks: Track[];
  let isLoading: boolean = false; 

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
			
	}

	onMount(async () => {
		fetchTracks();
	});
	
	
	function showTip(){
	
	
	
	}
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
		<Histogram
			data={majorTracks}
			xAccessor={keyAccessor}
			label="Key"
		/>
	</div>

	<h1> Minor </h1>
	<div class="minorHist">
		<Histogram
			data={minorTracks}
			xAccessor={keyAccessor}
			label="Key"
		/>
	</div>
{/if}


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