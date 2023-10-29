<script>
// @ts-nocheck

  export let data = [];
  export let keyAccessor = () => {};
  export let xAccessor = () => {};
  export let yAccessor = () => {};
  export let rAccessor = () => {};
  export let radius = 5;
  let pickedPreview;
</script>

{#each data as d, i (keyAccessor(d) || i)}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <circle
    cx={xAccessor(d, i)}
    cy={yAccessor(d, i)}
    r={radius} 
    on:click={() => { pickedPreview = d.preview_url; }}/>
{/each}

{#if (pickedPreview)}
        <audio controls="controls">
            <source src={pickedPreview} type="audio/mpeg"/>
        </audio>
    {/if}

<style>
  circle {
    fill: #9980fa;
    transition: all 0.3s ease-out;
    stroke: black;
  }
</style>
