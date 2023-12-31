<script lang="ts">
	import type { AudioFeature } from "$lib/db/types";
    import * as d3 from "d3";
	import type { Attribute } from "svelte/types/compiler/interfaces";

    export let data: AudioFeature[];
	export let data2: AudioFeature[] | null = null;

    let width: number;
	let height: number;

    function formatMobile(tick: any) {
		return "'" + tick.toString().slice(-2);
	}

    $: xTicks = data.map(d => d.name);
    export let yTicks: number[];
	
	let keys: string[] = ["C","C#","D","E♭","E","F","F#","G","G#","A","B♭","B"];

    const padding = { top: 20, right: 15, bottom: 20, left: 25 };
    
    $: xScale = d3.scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = d3.scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);
        
    $: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%" />
					<text y="-4">{tick} {tick === 20 ? ' per 1,000 population' : ''}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each data as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x={barWidth / 2} y="-4">{keys[parseInt(point.name)]}</text>
				</g>
			{/each}
		</g>

		<g class="bars">
			{#each data as point, i}
				<rect
					x={xScale(i)+xTicks.length-2}
					y={yScale(point.value)}
					width={barWidth / xTicks.length * 3}
					height={yScale(0) - yScale(point.value)}
				/>
			{/each}
		</g>
		
		{#if data2 != null}
			<g class="bars2">
				{#each data2 as point, i}
					<rect
						x={xScale(i) + 260/xTicks.length}
						y={yScale(point.value)}
						width={barWidth / xTicks.length * 3}
						height={yScale(0) - yScale(point.value)}
					/>
				{/each}
			</g>
		{/if}
	</svg>
</div>

<style>
	h2 {
		text-align: center;
	}

	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #9980fa;
		stroke: none;
		transition: all 0.3s ease-out;
		opacity: 0.65;
	}
	
	.bars2 rect {
		fill: #FF8D5F;
		stroke: none;
		transition: all 0.3s ease-out;
		opacity: 0.65;
	}
</style>