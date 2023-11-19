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

	let items: { id: string }[] = [];

	let currentPage = 1
  	let pageSize = 25
 	$: paginatedItems = paginate({ items, pageSize, currentPage })

	function fetchGenres() {
		
		if (searchTerm.length < 0) {
			errorMessage = 'Please enter more than 0 characters';
			return;
		}

		fetch(`/genres?searchTerm=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				items = data;
			})

		errorMessage = '';
	}

	onMount(async () => {
		fetchGenres();
	});
</script>

<div class="px-4">
	<p> {errorMessage} </p>

	<div class="flex">
		<input type="text" placeholder="Type an artist name..." class="input input-bordered w-full" bind:value="{searchTerm}">
	
		<button class="btn btn-primary mx-2" on:click={fetchGenres}> Show Artists </button>
	</div>

	{#each paginatedItems as item}
		<a class="text-xl" href="/genres/genre/{item.id}">
			<div class="p-3">
				{item.id}
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