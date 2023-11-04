<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { AudioFeature, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlot from '../../components/ScatterPlot.svelte';
	import * as d3 from "d3";
	import Barchart from '../../components/Barchart.svelte';

	let tracks: Track[];
	let allTracks: Track[];

	let chosenTempo: number = 100;

	function fetchTrackSample() {
		fetch(`/tracks`)
			.then((res) => res.json())
			.then((data) => {
				allTracks = data;
				tracks = allTracks;
				
                attributes = [
					{name: 'energy', value: tracks[0].energy},
					{name: 'danceability', value: tracks[0].danceability},
					{name: 'instrumentalness', value: tracks[0].instrumentalness},
					{name: 'valence', value: tracks[0].valence},
					{name: 'liveness', value: tracks[0].loudness},
					{name: 'speechiness', value: tracks[0].speechiness},
				];
				
			})
	}

	function onTempoChange() {
		tracks = allTracks.filter(t => Math.floor(t.tempo) == Math.floor(chosenTempo));
		attributes = [
			{name: 'energy', value: tracks[0].energy},
			{name: 'danceability', value: tracks[0].danceability},
			{name: 'instrumentalness', value: tracks[0].instrumentalness},
			{name: 'valence', value: tracks[0].valence},
			{name: 'liveness', value: tracks[0].liveness},
			{name: 'speechiness', value: tracks[0].speechiness},
		];
	}

	onMount(async () => {
		fetchTrackSample();
	});


	let attributes: AudioFeature[];

/* 	function redraw(): void {
		// empty vis div
		d3.select(vis).html(null); 

		// determine width & height of parent element and subtract the margin
		width = d3.select(vis).node().getBoundingClientRect().width - margin.left - margin.right;
		height = d3.select(vis).node().getBoundingClientRect().height - margin.top - margin.bottom;

		// init scales according to new width & height
		xScale.range([0, width]);
		yScale.range([height, 0]);

		// create svg and create a group inside that is moved by means of margin
		const svg = d3.select(vis)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${[margin.left, margin.top]})`)

		// draw x and y axes
		svg.append("g")
			.attr("transform", `translate(${[0, height]})`)
			.call(d3.axisBottom(xScale));
		svg.append("g")
    		.call(d3.axisLeft(yScale));

		// draw data points
		svg.append('g').selectAll('circle')
			.data(tracks)
			.enter()
			.append('circle')
			.attr('danceability', function (d: { danceability: any; }) { 
				return xScale(d.danceability); 
			})
			.attr('loudness', function (d: { loudness: any; }) { 
				return yScale(d.loudness); 
			})
			.attr('r', (d: Track) => d.popularity)
			.style('fill', '#ff3e00')
			.style('fill-opacity', '0.5')
			.style('stroke', '#ff3e00');
	} */

	const xTicks = ['energy', 'danceability', 'instrumentalness', 'valence', 'liveness', 'speechiness'];
	const yTicks = [0, 25, 50, 75, 100];

</script>


<!-- <ScatterPlot
	data={tracks}
	xAccessor={energyAccessor}
	yAccessor={loudnessAccessor}
	xLabel="Energy"
	yLabel="Loudness"
/> -->

{#if (attributes && attributes.length > 0)}
	<Barchart data={attributes} yTicks={yTicks} />
{/if}



<div class="m-5">
	<input type="range" min="60" max="180" class="range" bind:value={chosenTempo} on:change={onTempoChange} /> 
	<p>{chosenTempo}</p>
</div>