<script lang="ts">
	import { error } from '@sveltejs/kit';
	import * as d3 from "d3";
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
	let yTicksMajor: number[];
	let yTicksMinor: number[];
	let maxMajor =  0;
	let maxMinor = 0;

	function fetchGenreDistribution() {
        isLoading = true;
		fetch(`/genres/genre/genreDist?genreId=${id}`)
			.then((res) => res.json())
			.then((data) => {
				let distribution = data;
				majorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 0);
				isLoading = false;
				
				maxMajor = Math.max(...majorKeyDistributionGenre.map((b) => b.value));
				maxMinor = Math.max(...minorKeyDistributionGenre.map((b) => b.value));

				const yScaleMajor = d3.scaleLinear().domain([0, maxMajor]).range([0, 200]);
				yTicksMajor = yScaleMajor.ticks(4);
				
				const yScaleMinor = d3.scaleLinear().domain([0, maxMinor]).range([0, 200]);
				yTicksMinor = yScaleMinor.ticks(4);
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
				<DualBarchart data={majorKeyDistributionGenre}  yTicks={yTicksMajor} />
			{/if}
		</div>

		<h1> Minor </h1>
		<div class="minorHist">
			{#if minorKeyDistributionGenre && minorKeyDistributionGenre.length > 0 }
				<DualBarchart data={minorKeyDistributionGenre}  yTicks={yTicksMinor} />
			{/if}
		</div>

	{/if}


	<div class="p-4 flex justify-center">
		{#if tracks != undefined}
			<Violin data={tracks.map(t => t.energy * 100)} />
		{/if}
	</div>
</div>