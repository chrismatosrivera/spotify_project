<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav } from 'svelte-paginate';
	export let data: Artist;

	let timer: NodeJS.Timeout;
	let searchTerm = '';
	let chosenArtist = '';
	let errorMessage = '';

	let artists: Artist[];

	let items: Artist[] = [];

	let currentPage = 1
  	let pageSize = 25
 	$: paginatedItems = paginate({ items, pageSize, currentPage })

	function fetchArtists() {
		
		if (searchTerm.length < 1) {
			errorMessage = 'Please enter more than 0 characters';
			return;
		}

		fetch(`/artists?searchTerm=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				artists = data;
				items = artists;
			})

		errorMessage = '';
	}

	onMount(async () => {
		//fetchArtists();
	});
</script>

<div class="px-4">
	<p> {errorMessage} </p>
	<input type="text" placeholder="Type an artist name..." class="input input-bordered w-full" bind:value="{searchTerm}">
	
	<button class="btn" on:click={fetchArtists}> Show Artists </button>

	{#each paginatedItems as item}
		<a class="text-xl" href="/artists/artist/{item.id}">
			<p>
				{item.name}
			</p>
		</a>
	{/each}

	<div>
		{#if (paginatedItems != undefined && paginatedItems.length > 0)}
            <LightPaginationNav
                totalItems="{items.length}"
                pageSize="{pageSize}"
                currentPage="{currentPage}"
                limit="{1}"
                showStepOptions="{true}"
                on:setPage="{(e) => currentPage = e.detail.page}"
            />
		{/if}
	</div>
</div>