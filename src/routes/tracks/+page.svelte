<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { AudioFeature, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlot from '../../components/ScatterPlot.svelte';
	import * as d3 from "d3";
	import Barchart from '../../components/Barchart.svelte';
	import { Wave } from 'svelte-loading-spinners';

	let tracks: Track[];
	let allTracks: Track[];
	let isLoading: boolean = false; 

	let chosenTempo: number = 100;
	let tempoName: string = "Tempo"

	function fetchTrackSample() {
		isLoading = true;
		fetch(`/tracks`)
			.then((res) => res.json())
			.then((data) => {
				allTracks = data;
				tracks = allTracks;
				
                attributes = [
					{name: 'energy', value: tracks[0].energy},
					{name: 'danceability', value: tracks[0].danceability},
					{name: 'valence', value: tracks[0].valence},
				];
				isLoading = false;
			})
	}

	function onTempoChange() {
		tracks = allTracks.filter(t => Math.floor(t.tempo) > Math.floor(chosenTempo) && Math.floor(t.tempo) < Math.floor(chosenTempo + 20))
		attributes = [
			{name: 'energy', value: tracks[0].energy},
			{name: 'danceability', value: tracks[0].danceability},
			{name: 'valence', value: tracks[0].valence},
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
		fetchTrackSample();
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
	<div class="m-5">
	<input type="range" min="40" max="200" class="range" step="20" bind:value={chosenTempo} on:change={onTempoChange} /> 
	{tempoName}
	</div>
{/if}


{#if (attributes && attributes.length > 0)}
	<Barchart data={attributes} yTicks={yTicks} />
{/if}



