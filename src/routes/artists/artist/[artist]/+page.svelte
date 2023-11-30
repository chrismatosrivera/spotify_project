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
	import * as d3 from "d3";
	import Steam from '../../../../components/Steam.svelte';

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
	let maxMajor =  0;
	let maxMinor = 0;

	let yTicksMajor: number[];
	let yTicksMinor: number[];

	function fetchTracks() {
		isLoading = true;
		fetch(`/artists/artist?artistId=${artistId}`)
			.then((res) => res.json())
			.then((data) => {
				artist = data;
				tracks = artist.tracks;
				majorKeyDistribution = artist.keyDistribution.filter((t: AudioFeature) => t.mode == 1);
				minorKeyDistribution = artist.keyDistribution.filter((t: AudioFeature) => t.mode == 0);

				maxMajor = Math.max(...majorKeyDistribution.map((b) => b.value));
				maxMinor = Math.max(...minorKeyDistribution.map((b) => b.value));

				const yScaleMajor = d3.scaleLinear().domain([0, maxMajor]).range([0, 200]);
				yTicksMajor = yScaleMajor.ticks(4);
				
				const yScaleMinor = d3.scaleLinear().domain([0, maxMinor]).range([0, 200]);
				yTicksMinor = yScaleMinor.ticks(4);

				fetchGenreDistribution();
			});

		
	}

	function fetchGenreDistribution() {
		//fetch(`/genres/genreDist?genreId=${artist.genre_id}`)
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

	{#if artist}
		<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/tracks">Tracks</a></li> 
			<li><a href="/genres/genre/{artist.genre_id}">{artist.genre_id}</a></li> 
			<li>{artist.name}</li>
		</ul>
		</div>
	{/if}

	{#if isLoading}
		<div class="h-screen flex items-center justify-center">
			<Wave size="60" color="#9980fa" unit="px" duration="1s" />
		</div>
	{:else}

		{#if artist}
			<h1 class="is-size-1 mb-5 text-3xl text-center">{artist.name}</h1>
		{/if}

		<h1 class="is-size-1 mb-5 text-center">Key Distribution for Major and Minor tracks</h1>
		<h1 class="text-center"> Major </h1>
		<div class="majorHist">
			{#if majorKeyDistribution && majorKeyDistribution.length > 0 }
				<DualBarchart data={majorKeyDistribution}  yTicks={yTicksMajor} />
			{/if}
		</div>

		<h1 class="text-center"> Minor </h1>
		<div class="minorHist">
			{#if minorKeyDistribution && minorKeyDistribution.length > 0 }
				<DualBarchart data={minorKeyDistribution}  yTicks={yTicksMinor} />
			{/if}
		</div>
	{/if}

	{#if tracks != undefined}
		<div class="py-4">
			<div class="p-4 pt-10 flex justify-center">
				<Violin data={tracks.map(t => Math.floor(t.energy * 100))} />
			</div>

			<div class="p-4 py-10 flex justify-center">
				<h2> Energy Distribution </h2>
			</div>
		</div>
		
		<div class="py-4">
			<div class="p-4 pt-10 flex justify-center">
				<Violin data={tracks.map(t => Math.floor(t.danceability * 100))} />
			</div>

			<div class="p-4 py-10 flex justify-center">
				<h2> Danceability Distribution </h2>
			</div>
		</div>
	{/if}
</div>