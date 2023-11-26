<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { AudioFeature, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlotV2 from '../../components/ScatterPlotV2.svelte';
	import * as d3 from "d3";
	import Barchart from '../../components/Barchart.svelte';
	import { Wave } from 'svelte-loading-spinners';

	let trackAverages: Track[];
	let allTrackAverages: Track[];
	let allTracks: Track[];

	let audioPlayer: HTMLAudioElement;

	let isLoading: boolean = false; 

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
			})
	}

	function onTempoChange() {
		trackAverages = allTrackAverages.filter(t => Math.floor(t.tempo) > Math.floor(chosenTempo) && Math.floor(t.tempo) < Math.floor(chosenTempo + 20))
		attributes = [
			{name: 'energy', value: trackAverages[0].energy},
			{name: 'danceability', value: trackAverages[0].danceability},
			{name: 'valence', value: trackAverages[0].valence},
		];
		
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
		<input type="range" min="40" max="200" class="range" step="20" bind:value={chosenTempo} on:change={onTempoChange} /> 
		{tempoName}
	</div>
{/if}


{#if (attributes && attributes.length > 0)}
	<Barchart data={attributes} yTicks={yTicks} />
{/if}

{#if (allTracks && allTracks.length > 0)}
	<div class="flex justify-center pt-10">
		<audio controls={true} bind:this={audioPlayer} >
			<source />
		</audio>
	</div>
	<div class="py-5">
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
		<div class="grid grid-cols-7 h-96">
			<div class="col-span-1 text-center pt-[50%]">
				danceability
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: t.danceability * 100, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer}  points={allTracks.map(t => {
					return { x: t.energy * 100, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer}  points={allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: t.danceability * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
		</div>

		<div class="grid grid-cols-7 h-96">
			<div class="col-span-1 text-center pt-[50%]">
				energy
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: t.danceability * 100, y: t.energy * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: t.energy * 100, y: t.energy * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: t.energy * 100, z: t.preview_url, name: t.name}
				})} />
			</div>
		</div>

		<div class="grid grid-cols-7 h-96">
			<div class="col-span-1 text-center pt-[50%]">
				loudness
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: t.danceability * 100, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: t.energy * 100, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				})} />
			</div>
			<div class="col-span-2">
				<ScatterPlotV2 audioPlayer={audioPlayer} points={allTracks.map(t => {
					return { x: 100 - t.loudness * -1, y: 100 - t.loudness * -1, z: t.preview_url, name: t.name}
				})} />
			</div>
		</div>
	</div>
{/if}





