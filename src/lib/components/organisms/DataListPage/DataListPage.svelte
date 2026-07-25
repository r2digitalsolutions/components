<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Pagination from '$lib/components/molecules/Pagination/Pagination.svelte';
	import LoadingOverlay from '$lib/components/molecules/LoadingOverlay/LoadingOverlay.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';

	interface DataListPageProps {
		title: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		query?: string;
		filters?: FilterChip[];
		page?: number;
		totalPages?: number;
		/** Total matching rows (for “Showing 1–10 of 128”) */
		totalItems?: number;
		pageSize?: number;
		stats?: StatStripItem[];
		empty?: boolean;
		loading?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		searchable?: boolean;
		searchPlaceholder?: string;
		/** Wrap the list body in an elevated surface */
		framed?: boolean;
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
		totalItems,
		pageSize = 10,
		stats = [],
		empty = false,
		loading = false,
		emptyTitle = 'No results',
		emptyDescription = 'Try adjusting your filters or create a new item.',
		searchable = true,
		searchPlaceholder = 'Search…',
		framed = true,
		class: className = '',
		actions,
		toolbar,
		children,
		emptyAction,
		onquerychange,
		onpagechange
	}: DataListPageProps = $props();

	const rangeLabel = $derived.by(() => {
		if (totalItems == null || totalItems <= 0) return null;
		const start = (page - 1) * pageSize + 1;
		const end = Math.min(page * pageSize, totalItems);
		return `Showing ${start}–${end} of ${totalItems}`;
	});
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{/if}
		{/snippet}
	</PageHeader>

	{#if stats.length}
		<StatStrip items={stats} />
	{/if}

	<div class="space-y-3">
		<FilterBar
			bind:query
			bind:filters
			{searchable}
			placeholder={searchPlaceholder}
			{onquerychange}
		>
			{#snippet actions()}
				{#if toolbar}
					{@render toolbar()}
				{/if}
			{/snippet}
		</FilterBar>

		{#if rangeLabel && !empty}
			<p class="px-0.5 text-xs text-muted">{rangeLabel}</p>
		{/if}

		{#if framed}
			<Surface
				variant="elevated"
				padding="none"
				radius="xl"
				bordered
				class="overflow-hidden shadow-sm"
			>
				<LoadingOverlay active={loading} class="min-h-[16rem]">
					{#if empty && !loading}
						<div class="p-8">
							<EmptyState title={emptyTitle} description={emptyDescription}>
								{#snippet action()}
									{#if emptyAction}
										{@render emptyAction()}
									{/if}
								{/snippet}
							</EmptyState>
						</div>
					{:else if children}
						{@render children()}
					{/if}
				</LoadingOverlay>

				{#if !empty && totalPages > 1}
					<div
						class="flex flex-col gap-3 border-t border-border bg-surface-overlay/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<p class="text-xs text-muted">
							{rangeLabel ?? `Page ${page} of ${totalPages}`}
						</p>
						<Pagination bind:page {totalPages} onchange={onpagechange} />
					</div>
				{/if}
			</Surface>
		{:else}
			<LoadingOverlay active={loading} class="min-h-[16rem]">
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
				<div class="flex justify-end pt-2">
					<Pagination bind:page {totalPages} onchange={onpagechange} />
				</div>
			{/if}
		{/if}
	</div>
</div>
