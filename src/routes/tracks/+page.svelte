<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlot from '../../components/ScatterPlot.svelte';
	import * as d3 from "d3";

	let tracks: Track[];
	let vis: HTMLDivElement;

	const energyAccessor = d => d.energy;
	const danceabilityAccessor = d => d.danceability;
	const loudnessAccessor = d => d.loudness;

	let chosenTrack: string;
	let xScale = d3.scaleLinear().domain([0, 10]);
	let yScale = d3.scaleLinear().domain([0, 10]);
	let width: number;
	let height: number;
	const margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 30
	};

	function fetchTrackSample() {
		fetch(`/tracks`)
			.then((res) => res.json())
			.then((data) => {
				tracks = data;
                console.log(tracks);
			})
	}

	onMount(async () => {
		fetchTrackSample();
	});

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
</script>

<div id="scatter" bind:this={vis}></div>

<ScatterPlot
	data={tracks}
	xAccessor={energyAccessor}
	yAccessor={loudnessAccessor}
	xLabel="Energy"
	yLabel="Loudness"
/>