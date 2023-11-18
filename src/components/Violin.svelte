<script lang="ts">
    import * as d3 from "d3";
    import type { Artist, AudioFeature, Track } from '../lib/db/types';
	import { onMount } from "svelte";



    export let data: number[];

    export let width: number = 600;
    export let height: number = 400;
    export let binNumber: number = 20;

    let areaPath: any;

onMount(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);

    const yScale = d3.scaleLinear().domain([min, max]).range([500, 0]);
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
        />
</svg>