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
	import HorizontalBarchart from '../../../../components/HorizontalBarchart.svelte';

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

	let summaryData: AudioFeature[];

	function fetchGenreDistribution() {
		fetch(`/genres/genre/genreDist?genreId=${id}`)
			.then((res) => res.json())
			.then((data) => {
				isLoading = true;
				let distribution = data;
				majorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistributionGenre = distribution.filter((t: AudioFeature) => t.mode == 0);
				
				maxMajor = Math.max(...majorKeyDistributionGenre.map((b) => b.value));
				maxMinor = Math.max(...minorKeyDistributionGenre.map((b) => b.value));

				const yScaleMajor = d3.scaleLinear().domain([0, maxMajor]).range([0, 200]);
				yTicksMajor = yScaleMajor.ticks(4);
				
				const yScaleMinor = d3.scaleLinear().domain([0, maxMinor]).range([0, 200]);
				yTicksMinor = yScaleMinor.ticks(4);
			});

	}

	function fetchTracks() {
		fetch(`/genres/genre?genreId=${id}`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;

				let averageDanceability = d3.mean(tracks.map(t => t.danceability));
				let averageEnergy = d3.mean(tracks.map(t => t.energy));
				let averageValence = d3.mean(tracks.map(t => t.valence));
				let averageInstrumentalness = d3.mean(tracks.map(t => t.instrumentalness));
				let averageAcousticness = d3.mean(tracks.map(t => t.acousticness));
				let averagePopularity = d3.mean(tracks.map(t => (t.popularity / 100)));
				
				summaryData = [
					{
						name: "Danceability",
						value: averageDanceability ?? 0
					},
					{
						name: "Energy",
						value: averageEnergy ?? 0
					},
					{
						name: "Valence",
						value: averageValence ?? 0
					},
					{
						name: "Instrumentalness",
						value: averageInstrumentalness ?? 0
					},
					{
						name: "Acousticness",
						value: averageAcousticness ?? 0
					},
					{
						name: "Popularity",
						value: averagePopularity ?? 0
					},
				]

				isLoading = false;
			});
	}

	onMount(() => {
		fetchGenreDistribution();
		fetchTracks();
	});
</script>

<div class="px-4">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/tracks">Tracks</a></li> 
			<li>{id}</li> 
		</ul>
	</div>
	<h1 class="is-size-1 mb-5 text-3xl text-center">{id}</h1>

	{#if isLoading}
		<div class="h-screen flex items-center justify-center">
			<Wave size="60" color="#9980fa" unit="px" duration="1s" />
		</div>
	{:else}

		<div class="grid grid-cols-2">
			<div class="col-span-2 lg:col-span-1">
				{#if (summaryData)}
					<div class="text-center"> Genre Summary </div>
					<HorizontalBarchart data={summaryData} />
				{/if}
			</div>
			<div class="col-span-2 lg:col-span-1">
				<h1 class="is-size-1 mb-5 text-center">Key Distribution for Major and Minor tracks</h1>
				<h1 class="text-center"> Major </h1>
				<div class="majorHist">
					{#if majorKeyDistributionGenre && majorKeyDistributionGenre.length > 0 }
						<DualBarchart data={majorKeyDistributionGenre}  yTicks={yTicksMajor} />
					{/if}
				</div>

				<h1 class="text-center"> Minor </h1>
				<div class="minorHist">
					{#if minorKeyDistributionGenre && minorKeyDistributionGenre.length > 0 }
						<DualBarchart data={minorKeyDistributionGenre}  yTicks={yTicksMinor} />
					{/if}
				</div>
			</div>
		</div>
	{/if}


	{#if tracks != undefined}
		<div class="text-center text-xl pt-24">
			Distributions for Spotify Attributes
		</div>
		<div class="grid grid-cols-3">
			<div class="py-4 col-span-3 lg:col-span-1">
				<div class="p-4 pt-10 flex justify-center">
					<Violin data={tracks.map(t => Math.floor(t.energy * 100))} />
				</div>

				<div class="p-4 py-10 flex justify-center">
					<h2> Energy Distribution </h2>
				</div>
			</div>
			
			<div class="py-4 col-span-3 lg:col-span-1">
				<div class="p-4 pt-10 flex justify-center col-span-1">
					<Violin data={tracks.map(t => Math.floor(t.danceability * 100))} />
				</div>

				<div class="p-4 py-10 flex justify-center">
					<h2> Danceability Distribution </h2>
				</div>
			</div>

			<div class="py-4 col-span-3 lg:col-span-1">
				<div class="p-4 pt-10 flex justify-center">
					<Violin data={tracks.map(t => Math.floor(t.instrumentalness * 100))} />
				</div>

				<div class="p-4 py-10 flex justify-center">
					<h2> Instrumentalness Distribution </h2>
				</div>
			</div>

			<div class="py-4 col-span-3 lg:col-span-1">
				<div class="p-4 pt-10 flex justify-center">
					<Violin data={tracks.map(t => Math.floor(t.acousticness * 100))} />
				</div>

				<div class="p-4 py-10 flex justify-center">
					<h2> Acousticness Distribution </h2>
				</div>
			</div>

			<div class="py-4 col-span-3 lg:col-span-1">
				<div class="p-4 pt-10 flex justify-center">
					<Violin data={tracks.map(t => Math.floor(t.valence * 100))} />
				</div>

				<div class="p-4 py-10 flex justify-center">
					<h2> Valence Distribution </h2>
				</div>
			</div>
		</div>
	{/if}
</div>