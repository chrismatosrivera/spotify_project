<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Artist, Track } from '../../lib/db/types';
	import { onMount } from 'svelte';
	import { paginate, LightPaginationNav, DarkPaginationNav } from 'svelte-paginate';
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
		
		if (searchTerm.length < 0) {
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

	<div class="flex">
		<input type="text" placeholder="Type an artist name..." class="input input-bordered w-full" bind:value="{searchTerm}">
	
		<button class="btn btn-primary mx-2" on:click={fetchArtists}> Show Artists </button>
	</div>

	{#each paginatedItems as item}
		<a class="text-xl" href="/artists/artist/{item.id}">
			<div class="p-3">
				{item.name}
			</div>
		</a>
	{/each}

	<div>
		{#if (paginatedItems != undefined && paginatedItems.length > 0)}
            <DarkPaginationNav
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

<style>
	.pagination-nav {
		background: transparent !important;
	}

	.option .number .active {
		color: hsl(var(--pc) / var(--tw-text-opacity));
	}
</style>