<script lang="ts">
  import { scaleBand, scaleLinear } from "d3-scale";
  import type { AudioFeature } from "$lib/db/types";

  export let data: AudioFeature[];

  const width = 800;
  const height = 500;

  const margin = { top: 20, right: 20, bottom: 20, left: 180 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  $: xDomain = data.map((d) => d.name);
  $: yDomain = data.map((d) => +d.value);

  $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
  $: xScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerWidth]);
</script>

<svg {width} {height}>
  <g transform={`translate(${margin.left},${margin.top})`}>
    {#each xScale.ticks() as tickValue}
      <g transform={`translate(${xScale(tickValue)},0)`}>
        <line y2={innerHeight}  />
        <text text-anchor="middle" dy=".71em" y={innerHeight + 3}>
          {tickValue}
        </text>
      </g>
    {/each}
    {#each data as d}
      <text
        text-anchor="end"
        x="-3"
        dy="3em"
        y={yScale(d.name) ?? 0 + yScale.bandwidth() / 2}
      >
        {d.name}
      </text>
      <rect
        x="0"
        y={yScale(d.name)}
        width={xScale(d.value)}
        height={yScale.bandwidth()}
      />
    {/each}
  </g>
</svg>

<style>
    rect {
		fill: #9980fa;
		stroke: none;
		transition: all 0.3s ease-out;
    opacity: 0.85;
	}

    text {
            fill: black;
        }
        @media (prefers-color-scheme: dark) {
            text{ fill: #a6adba; }
        }

    line {
            stroke: black;
        }
        @media (prefers-color-scheme: dark) {
            line{ stroke: #a6adba; }
        }
</style>