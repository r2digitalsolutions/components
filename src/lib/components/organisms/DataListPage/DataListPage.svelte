<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Pagination from '$lib/components/molecules/Pagination/Pagination.svelte';
	import LoadingOverlay from '$lib/components/molecules/LoadingOverlay/LoadingOverlay.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	interface DataListPageProps {
		title: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		query?: string;
		filters?: FilterChip[];
		page?: number;
		totalPages?: number;
		empty?: boolean;
		loading?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		searchable?: boolean;
		class?: string;
		actions?: Snippet;
		toolbar?: Snippet;
		children?: Snippet;
		emptyAction?: Snippet;
		onquerychange?: (query: string) => void;
		onpagechange?: (page: number) => void;
	}

	let {
		title,
		description,
		breadcrumbs = [],
		query = $bindable(''),
		filters = $bindable<FilterChip[]>([]),
		page = $bindable(1),
		totalPages = 1,
		empty = false,
		loading = false,
		emptyTitle = 'No results',
		emptyDescription = 'Try adjusting your filters or create a new item.',
		searchable = true,
		class: className = '',
		actions,
		toolbar,
		children,
		emptyAction,
		onquerychange,
		onpagechange
	}: DataListPageProps = $props();
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{/if}
		{/snippet}
	</PageHeader>

	<FilterBar bind:query bind:filters {searchable} {onquerychange}>
		{#snippet actions()}
			{#if toolbar}
				{@render toolbar()}
			{/if}
		{/snippet}
	</FilterBar>

	<LoadingOverlay active={loading} class="min-h-[12rem]">
		{#if empty && !loading}
			<EmptyState title={emptyTitle} description={emptyDescription}>
				{#snippet action()}
					{#if emptyAction}
						{@render emptyAction()}
					{/if}
				{/snippet}
			</EmptyState>
		{:else if children}
			{@render children()}
		{/if}
	</LoadingOverlay>

	{#if !empty && totalPages > 1}
		<Stack direction="horizontal" justify="end">
			<Pagination bind:page {totalPages} onchange={onpagechange} />
		</Stack>
	{/if}
</div>
