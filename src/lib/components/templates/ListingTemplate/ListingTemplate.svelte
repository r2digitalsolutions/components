<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import Pagination from '$lib/components/molecules/Pagination/Pagination.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	interface ListingTemplateProps {
		title?: string;
		description?: string;
		query?: string;
		filters?: ChipBarItem[];
		filter?: string;
		page?: number;
		pageCount?: number;
		empty?: boolean;
		class?: string;
		actions?: Snippet;
		sidebar?: Snippet;
		children?: Snippet;
		onsearch?: (q: string) => void;
	}

	let {
		title = 'Browse',
		description = 'Explore items with search and filters.',
		query = $bindable(''),
		filters = [],
		filter = $bindable(''),
		page = $bindable(1),
		pageCount = 5,
		empty = false,
		class: className = '',
		actions,
		sidebar,
		children,
		onsearch
	}: ListingTemplateProps = $props();
</script>

<Container size="6xl" class={`space-y-6 py-6 ${className}`}>
	<PageHeader {title} {description} {actions} />
	<SearchBar bind:value={query} onsubmit={(q) => onsearch?.(q)} />
	{#if filters.length}
		<ChipBar bind:value={filter} items={filters} />
	{/if}

	<div class={['grid gap-6', sidebar && 'lg:grid-cols-[240px_1fr]']}>
		{#if sidebar}
			<aside class="space-y-3">
				{@render sidebar()}
			</aside>
		{/if}
		<div class="min-w-0 space-y-4">
			{#if empty}
				<EmptyState title="No items found" description="Try adjusting your search or filters." />
			{:else}
				{@render children?.()}
			{/if}
			{#if pageCount > 1 && !empty}
				<div class="flex justify-center pt-2">
					<Pagination bind:page totalPages={pageCount} />
				</div>
			{/if}
		</div>
	</div>
</Container>
