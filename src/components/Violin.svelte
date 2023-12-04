<script lang="ts">
    import * as d3 from "d3";
    import type { Artist, AudioFeature, Track } from '../lib/db/types';
	import { onMount } from "svelte";



    export let data: number[];

    export let width: number = 500;
    export let height: number = 400;
    export let binNumber: number = 10;

    let areaPath: any;
	const min = 0;
    const max = 100;

    const yScale = d3.scaleLinear().domain([min, max]).range([500, 0]);

onMount(() => {
    const binBuilder = d3
        .bin()
        .domain([min, max])
        .thresholds(yScale.ticks(binNumber))
        .value((d) => d);

    const bins = binBuilder(data);

    const biggestBin = Math.max(...bins.map((b) => b.length));

    const wScale = d3
        .scaleLinear()
        .domain([-biggestBin, biggestBin])
        .range([0, 400]);

    const areaBuilder = d3
        .area<d3.Bin<number, number>>()
        .x0((d) => wScale(-d.length))
        .x1((d) => wScale(d.length))
        .y((d) => yScale(d.x0 || 0))
        .curve(d3.curveBumpY);

    areaPath = areaBuilder(bins);
})

</script>

<svg width={width} height={height}>
    <path
        d={areaPath || undefined}
        opacity={1}
        stroke="#9a6fb0"
        fill="#9a6fb0"
        fill-opacity={0.1}
        stroke-width={2}
		transform="translate(75,0)"
        />
		
	
	<g class="axis y-axis">
	{#each yScale.ticks() as tick}
		<g class="tick tick-{tick}" transform="translate(0, {height - tick*4})">
			<line x2="100%" />
			<text y="12"> {tick} </text>
		</g>
	{/each}
	</g>
	
</svg>

<style>

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

	
</style>

