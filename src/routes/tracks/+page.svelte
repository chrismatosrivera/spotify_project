<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { AudioFeature, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlotV2 from '../../components/ScatterPlotV2.svelte';
	import * as d3 from "d3";
	import Barchart from '../../components/Barchart.svelte';
	import Histogram from '../../components/Histogram.svelte';
	import { Wave } from 'svelte-loading-spinners';
	import { fly, scale } from 'svelte/transition';

	let trackAverages: Track[];
	let allTrackAverages: Track[];
	let allTracks: Track[];
	let filterTracks: Track[];

	let audioPlayer: HTMLAudioElement;

	let isLoading: boolean = false; 
	
	const energyAccessor = (d: { energy: any; }) => d.energy;
	const danceabilityAccessor = (d: { danceability: any; }) => d.danceability;
	const valenceAccessor = (d: { valence: any; }) => d.valence;

	let chosenTempo: number = 100;
	let tempoName: string = "Tempo"

	function fetchtrackAveragesample() {
		isLoading = true;
		fetch(`/tracks/trackAverage`)
			.then((res) => res.json())
			.then((data) => {
				allTrackAverages = data;
				trackAverages = allTrackAverages;
				
                attributes = [
					{name: 'energy', value: trackAverages[0].energy},
					{name: 'danceability', value: trackAverages[0].danceability},
					{name: 'valence', value: trackAverages[0].valence},
				];
				isLoading = false;
				
				
			})

		fetch(`/tracks`)
			.then((res) => res.json())
			.then((data) => {
				allTracks = data;	
				filterTracks = allTracks.filter(t => Math.floor(t.tempo) > Math.floor(chosenTempo) && Math.floor(t.tempo) < Math.floor(chosenTempo + 20));

				danceDance = allTracks.map(t => {
					return { x: t.danceability * 100, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})

				danceEnergy = allTracks.map(t => {
					return { x: t.energy * 100, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})
				
				danceLoud = allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})

				energyDance = allTracks.map(t => {
					return { x: t.danceability * 100, y: t.energy * 100, z: t.preview_url, name: t.name}
				})
				
				energyEnergy = allTracks.map(t => {
					return { x: t.energy * 100, y: t.energy * 100, z: t.preview_url, name: t.name}
				})

				energyLoud = allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: t.energy * 100, z: t.preview_url, name: t.name}
				})

				loudDance = allTracks.map(t => {
					return { x: t.danceability * 100, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				});

				loudEnergy = allTracks.map(t => {
					return { x: t.energy * 100, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				});

				loudLoud = allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				})
			})
	}

	function selectScatterPlot(data: {x: number; y: number; z: string; name: string}[]) {
		selectedScatterPlotData = data;
	}

	function clearScatterPlotSelection() {
		selectedScatterPlotData = null;
	}

	function onTempoChange() {
		trackAverages = allTrackAverages.filter(t => Math.floor(t.tempo) > Math.floor(chosenTempo) && Math.floor(t.tempo) < Math.floor(chosenTempo + 20))
		attributes = [
			{name: 'energy', value: trackAverages[0].energy},
			{name: 'danceability', value: trackAverages[0].danceability},
			{name: 'valence', value: trackAverages[0].valence},
		];
		
		filterTracks = allTracks.filter(t => Math.floor(t.tempo) > Math.floor(chosenTempo) && Math.floor(t.tempo) < Math.floor(chosenTempo + 20));
		
		if (chosenTempo > 199){
		 tempoName = "Prestissimo (200+bpm)";
		} else if (chosenTempo > 179){
		 tempoName = "Presto (180-200bpm)";
		} else if (chosenTempo > 159){
		 tempoName = "Vivace (160 - 180bpm)";
		} else if (chosenTempo > 139) {
		 tempoName = "Allegro - upper (140-160bpm)";
		} else if (chosenTempo > 119) {
		 tempoName = "Allegro (120 - 140bpm)";
		} else if (chosenTempo > 99) {
		 tempoName = "Allegretto (100-120bpm)";
		} else if (chosenTempo > 79) {
		 tempoName = "Andantino (80 - 100bpm)";
		} else if (chosenTempo > 59) {
		 tempoName = "Adagio (60 - 80bpm)";
		} else {
		 tempoName = "Largo (40 - 60bpm)";
		}
	}

	onMount(async () => {
		fetchtrackAveragesample();
	});


	let attributes: AudioFeature[];

	const yTicks = [0, 25, 50, 75, 100];

	let selectedScatterPlotData: {x: number; y: number; z: string; name: string}[] | null = null;

	let danceDance: {x: number; y: number; z: string; name: string}[];
	let danceEnergy: {x: number; y: number; z: string; name: string}[];
	let danceLoud: {x: number; y: number; z: string; name: string}[];
	let energyEnergy: {x: number; y: number; z: string; name: string}[];
	let energyDance: {x: number; y: number; z: string; name: string}[];
	let energyLoud: {x: number; y: number; z: string; name: string}[];
	let loudDance: {x: number; y: number; z: string; name: string}[];
	let loudEnergy: {x: number; y: number; z: string; name: string}[];
	let loudLoud: {x: number; y: number; z: string; name: string}[];

</script>

<style>
    .loadingAnim {
        width: 50%;
		text-align: center;
    }
	
</style>


<!-- i want to make it centered and take up about half the size of the page? i couldnt figure it out lol -->
{#if isLoading}
	<div class="h-screen flex items-center justify-center">
		<Wave size="60" color="#9980fa" unit="px" duration="1s" />
	</div>
{:else}
	<div class="mx-48">
		<div class="text-lg text-center py-3"> Average Energy, Danceability and Valence per chosen tempo</div>
		<input type="range" min="40" max="200" class="range" step="20" bind:value={chosenTempo} on:change={onTempoChange} /> 
		{tempoName}
	</div>
{/if}


{#if (attributes && attributes.length > 0)}
	<Barchart data={attributes} yTicks={yTicks} />
{/if}


{#if (allTracks && allTracks.length > 0)}
	<div class="text-lg text-center py-3 pt-10"> Energy, Danceability and Valence Distributions </div>
		<div class="grid grid-cols-6 h-48 place-items-center">
			<div class="col-span-2">
				<Histogram
				data={filterTracks}
				xAccessor={energyAccessor}
				label="Energy"
				/>
			</div>
			
			<div class="col-span-2">
				<Histogram
				data={filterTracks}
				xAccessor={danceabilityAccessor}
				label="Danceability"
				/>
			</div>
		
			<div class="col-span-2">
				<Histogram
				data={filterTracks}
				xAccessor={valenceAccessor}
				label="Valence"
				/>
			</div>
		</div>

	<div class="text-lg text-center py-3 pt-80"> Relationship Matrix of Spotify Attributes <div class="tooltip" data-tip="You may click on a scatterplot to expand it">i</div> </div>
	{#if (!selectedScatterPlotData)}
	<div class="flex justify-center" transition:fly={{ duration: 500 }}>
		<div class="py-5 w-1/2">
			<div class="grid grid-cols-7">
				<div class="col-span-1">
					
				</div>
				<div class="col-span-2 text-center">
					danceability
				</div>
				<div class="col-span-2 text-center">
					energy
				</div>
				<div class="col-span-2 text-center">
					loudness
				</div>
			</div>
			<div class="grid grid-cols-7 h-48">
				<div class="col-span-1 text-center pt-[50%]">
					danceability
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(danceDance)}>
					<ScatterPlotV2 points={danceDance} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(danceEnergy)}>
					<ScatterPlotV2  points={danceEnergy} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(danceLoud)}>
					<ScatterPlotV2 points={danceLoud} />
				</div>
			</div>

			<div class="grid grid-cols-7 h-48">
				<div class="col-span-1 text-center pt-[50%]">
					energy
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(energyDance)}>
					<ScatterPlotV2 points={energyDance} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(energyEnergy)}>
					<ScatterPlotV2 points={energyEnergy} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(energyLoud)}>
					<ScatterPlotV2 points={energyLoud} />
				</div>
			</div>

			<div class="grid grid-cols-7 h-48">
				<div class="col-span-1 text-center pt-[50%]">
					loudness
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(loudDance)}>
					<ScatterPlotV2 points={loudDance} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(loudEnergy)}>
					<ScatterPlotV2 points={loudEnergy} />
				</div>
				<div class="col-span-2 cursor-pointer" on:click={() => selectScatterPlot(loudLoud)}>
					<ScatterPlotV2 points={loudLoud} />
				</div>
			</div>
		</div>
	</div>

	{:else}
		{#if (selectedScatterPlotData)}
			<div class="px-96 h-96" transition:fly={{ duration: 500 }}>
				<button class="link" on:click={() => { selectedScatterPlotData = null }}>
					Back
				</button>
				<ScatterPlotV2 points={selectedScatterPlotData} includeAudioPlayer={true} width={500} height={1000} />
			</div>
		{/if}
	{/if}
{/if}





