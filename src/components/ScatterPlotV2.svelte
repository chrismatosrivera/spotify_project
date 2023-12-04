<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';

	export let points: { x: number, y: number, z: string, name: string }[];
	export let includeAudioPlayer: boolean = false;

	let audioPlayer: HTMLAudioElement;

	let selectedPoint: { x: number, y: number, z: string, name: string };

	let svg: SVGElement;
	export let width = 500;
	export let height = 500;

	const padding = { top: 20, right: 40, bottom: 40, left: 25 };

	$: xScale = scaleLinear()
		.domain([0, 100])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, 100])
		.range([height - padding.bottom, padding.top]);

	$: xTicks = [0, 25, 50, 75, 100];

	$: yTicks = [0, 25, 50, 75, 100];

	onMount(resize);

	function resize() {
		({ width, height } = svg.getBoundingClientRect());
	}

	function selectPoint(point: { x: number, y: number, z: string, name: string }) {
		console.log(point.name)
		selectedPoint = point;

		console.log(point.z)

		if (audioPlayer) {
			audioPlayer.src = point.z;
		}

		if (audioPlayer?.src) {
			audioPlayer?.play();
		}
	}
</script>

<svelte:window on:resize={resize} />

	<svg bind:this={svg}>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x1={padding.left} x2={xScale(100)} />
					<text x={padding.left - 8} y="+4">{tick}</text>
				</g>
			{/each}
		</g>

		<text
		class="Axis__label"
		style="transform: translate({(
			[-56, height / 2]
		).map(d => d + "px").join(", ")}) {
			"rotate(-90deg)"
		}">
		Test
		</text>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g class="tick" transform="translate({xScale(tick)},0)">
					<line y1={yScale(0)} y2={yScale(100)} />
					<text y={height - padding.bottom + 16}>{tick}</text>
				</g>
			{/each}
		</g>

		<!-- data -->
		{#each points as point}
			<circle fill={selectedPoint == point ? "#e4dcfa" : "#9980fa"} cx={xScale(point.x)} cy={yScale(point.y)} on:click={() => selectPoint(point)} r="5" />
			{#if selectedPoint == point}
				<text x={xScale(point.x) + 10} y={yScale(point.y)}> {point.name} </text>
			{/if}
		{/each}
	</svg>

	{#if (includeAudioPlayer)}
		<div class="">
			<audio class="m-auto" controls={true} bind:this={audioPlayer} >
				<source />
			</audio>
		</div>
	{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
		float: left;
	}

	circle {

		fill-opacity: 0.6;
		stroke: rgba(0, 0, 0, 0.5);
	}

	.tick line {
		stroke: #ddd;
		stroke-dasharray: 2;
	}

	text {
		font-size: 12px;
		fill: #999;
	}

	.x-axis text {
		text-anchor: middle;
	}

	.y-axis text {
		text-anchor: end;
	}
</style>
