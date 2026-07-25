<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SearchSheet from './SearchSheet.svelte';

	let open = $state(false);
	let query = $state('');

	const results = $derived(
		['Barcelona', 'Berlin', 'Boston', 'Buenos Aires', 'Brussels'].filter((c) =>
			c.toLowerCase().includes(query.toLowerCase())
		)
	);
</script>

<Button onclick={() => (open = true)}>Open search</Button>

<SearchSheet bind:open bind:query>
	{#if query}
		<ul class="space-y-1">
			{#each results as city}
				<li>
					<button
						type="button"
						class="w-full rounded-lg px-3 py-2.5 text-left text-sm text-primary hover:bg-surface-overlay"
						onclick={() => (open = false)}
					>
						{city}
					</button>
				</li>
			{:else}
				<li class="px-3 py-6 text-center text-sm text-muted">No results</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-muted">Recent searches appear here.</p>
	{/if}
</SearchSheet>
