<script>
  // @ts-ignore
  import * as d3 from "d3";

  import Chart from "./Chart.svelte";
  import Circles from "./Circles.svelte";
  import Axis from "./Axis.svelte";

  /**
	 * @type {never[]}
	 */
   export let data = [];
  export let xAccessor = (/** @type {{ x: any; }} */ d) => d.x;
  export let yAccessor = (/** @type {{ y: any; }} */ d) => d.y;
  export let rAccessor = (/** @type {{ r: any; }} */ d) => d.r;
  /**
	 * @type {any}
	 */
   export let xLabel;
  /**
	 * @type {any}
	 */
   export let yLabel;

  let width = 100;
  let height = 100;

  const margins = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 77,
    marginLeft: 75
  };
  $: dms = {
    width,
    height,
    ...margins,
    boundedHeight: Math.max(
      height - margins.marginTop - margins.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      width - margins.marginLeft - margins.marginRight,
      0
    )
  };

  $: xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dms.boundedWidth])
    .nice();

  $: yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dms.boundedHeight, 0])
    .nice();

  $: rScale = d3.scaleLinear()

  $: xAccessorScaled = (/** @type {{ x: any; }} */ d) => xScale(xAccessor(d));
  $: yAccessorScaled = (/** @type {{ y: any; }} */ d) => yScale(yAccessor(d));
  $: rAccessorScaled = (/** @type {{ r: any; }} */ d) => rScale(rAccessor(d));
  $: keyAccessor = (d, i) => i
</script>

<div class="ScatterPlot placeholder" bind:clientWidth={width} bind:clientHeight={height}>
  <Chart dimensions={dms}>
    <Axis
      dimension="x"
      scale={xScale}
      label={xLabel}
    />
    <Axis
      dimension="y"
      scale={yScale}
      label={yLabel}
    />
    <Circles
      data={data}
      keyAccessor={keyAccessor}
      xAccessor={xAccessorScaled}
      yAccessor={yAccessorScaled}
      rAccessor={rAccessorScaled}
    />
  </Chart>
</div>

<style>
  .ScatterPlot {
    height: 500px;
    width: 500px;
    margin-right: 2em;
  }
</style>
