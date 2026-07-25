<script lang="ts">
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { Snippet } from 'svelte';

	export interface SearchResultItem {
		id: string;
		title: string;
		description?: string;
		meta?: string;
		href?: string;
	}

	interface SearchResultsProps {
		query?: string;
		results?: SearchResultItem[];
		filters?: ChipBarItem[];
		filter?: string;
		total?: number;
		loading?: boolean;
		class?: string;
		children?: Snippet;
		onsearch?: (q: string) => void;
		onfilter?: (id: string) => void;
		onselect?: (id: string) => void;
	}

	let {
		query = $bindable(''),
		results = [],
		filters = [],
		filter = $bindable(''),
		total,
		loading = false,
		class: className = '',
		children,
		onsearch,
		onfilter,
		onselect
	}: SearchResultsProps = $props();

	const count = $derived(total ?? results.length);
</script>

<div class={['w-full space-y-4', className]}>
	<SearchBar bind:value={query} onsubmit={(q) => onsearch?.(q)} />
	{#if filters.length}
		<ChipBar bind:value={filter} items={filters} onchange={(id) => onfilter?.(id)} />
	{/if}

	<p class="text-xs text-muted">
		{#if loading}
			Searching…
		{:else}
			{count} result{count === 1 ? '' : 's'}
			{#if query}
				for “{query}”
			{/if}
		{/if}
	</p>

	{#if children}
		{@render children()}
	{:else if !loading && results.length === 0}
		<EmptyState title="No results" description="Try a different keyword or clear filters." />
	{:else}
		<ul class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-elevated">
			{#each results as item (item.id)}
				<li>
					<button
						type="button"
						class="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-surface-overlay"
						onclick={() => onselect?.(item.id)}
					>
						<span class="text-sm font-medium text-primary">{item.title}</span>
						{#if item.description}
							<span class="line-clamp-2 text-xs text-secondary">{item.description}</span>
						{/if}
						{#if item.meta}
							<span class="text-[11px] text-muted">{item.meta}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
