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

  const id = $page.params.id;

  let isLoading: boolean = false; 
  
  let majorKeyDistributionGenre: AudioFeature[];
  let minorKeyDistributionGenre: AudioFeature[];
  const yTicks = [0, 25, 50];

	function fetchGenreDistribution() {
        isLoading = true;
		fetch(`/genres/genre/genreDist?genreId=${id}`)
			.then((res) => res.json())
			.then((data) => {
				let distribution = data;
				majorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 0);
				isLoading = false;
			});
	}

	onMount(() => {
		fetchGenreDistribution();
	});
</script>

<div class="px-4">
	<h1 class="is-size-1 mb-5 text-3xl">{id}</h1>

{#if isLoading}
	<div class="h-screen flex items-center justify-center">
		<Wave size="60" color="#9980fa" unit="px" duration="1s" />
	</div>
{:else}

	<h1> Major </h1>
	<div class="majorHist">
		{#if majorKeyDistributionGenre && majorKeyDistributionGenre.length > 0 }
			<DualBarchart data={majorKeyDistributionGenre}  yTicks={yTicks} />
		{/if}
	</div>

	<h1> Minor </h1>
	<div class="minorHist">
		{#if minorKeyDistributionGenre && minorKeyDistributionGenre.length > 0 }
			<DualBarchart data={minorKeyDistributionGenre}  yTicks={yTicks} />
		{/if}
	</div>
{/if}


{#if tracks != undefined}
	<Violin data={tracks.map(t => t.energy * 100)} />
{/if}
</div>