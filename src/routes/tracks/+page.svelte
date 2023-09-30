<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ScatterPlot from '../../components/ScatterPlot.svelte';

	let tracks: Track[];

  const energyAccessor = d => d.energy;
  const danceabilityAccessor = d => d.danceability;

  let chosenTrack: string;

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
</script>

<ScatterPlot
	data={tracks}
	xAccessor={energyAccessor}
	yAccessor={danceabilityAccessor}
	xLabel="Energy"
	yLabel="Danceability"
/>