<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, AudioFeature, Track } from '../../../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav } from 'svelte-paginate'
	import { page } from '$app/stores';
	import ScatterPlot from '../../../../components/ScatterPlot.svelte';
	import { Wave } from 'svelte-loading-spinners';
	import DualBarchart from '../../../../components/DualBarchart.svelte';
	import Violin from '../../../../components/Violin.svelte';

	let artist: Artist;
	let tracks: Track[];

  const artistId = $page.params.artist;

  let isLoading: boolean = false; 

  let majorKeyDistribution: AudioFeature[];
  let minorKeyDistribution: AudioFeature[];
  
  let majorKeyDistributionGenre: AudioFeature[];
  let minorKeyDistributionGenre: AudioFeature[];
  const yTicks = [0, 25, 50];

  let chosenTrack: string;

	function fetchTracks() {
		isLoading = true;
		fetch(`/artists/artist?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				artist = data;
				tracks = artist.tracks;
				majorKeyDistribution = artist.keyDistribution.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistribution = artist.keyDistribution.filter((t: AudioFeature) => t.mode == 0);
				fetchGenreDistribution();
			});

		
	}

	function fetchGenreDistribution() {
		//fetch(`/genres/genre?genreId=${artist.genre_id}`)
			//.then((res) => res.json())
			//.then((data) => {
				//let distribution = data;
				//majorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 1);
				//minorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 0);
				isLoading = false;
			//});
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
		{#if majorKeyDistribution && majorKeyDistribution.length > 0 }
			<DualBarchart data={majorKeyDistribution}  yTicks={yTicks} />
		{/if}
	</div>

	<h1> Minor </h1>
	<div class="minorHist">
		{#if minorKeyDistribution && minorKeyDistribution.length > 0 }
			<DualBarchart data={minorKeyDistribution}  yTicks={yTicks} />
		{/if}
	</div>
{/if}


{#if tracks != undefined}
	<Violin data={tracks.map(t => t.energy * 100)} />
{/if}
</div>