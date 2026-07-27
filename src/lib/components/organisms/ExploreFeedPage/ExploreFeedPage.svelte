<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import RecentSearches from '$lib/components/molecules/RecentSearches/RecentSearches.svelte';
	import SmartSuggestion from '$lib/components/molecules/SmartSuggestion/SmartSuggestion.svelte';
	import DateGroupedList from '$lib/components/molecules/DateGroupedList/DateGroupedList.svelte';
	import type { DateGroupedListGroup } from '$lib/components/molecules/DateGroupedList/DateGroupedList.svelte';
	import EntityPreview from '$lib/components/molecules/EntityPreview/EntityPreview.svelte';
	import SegmentedPager from '$lib/components/molecules/SegmentedPager/SegmentedPager.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Tile from '$lib/components/molecules/Tile/Tile.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import TrendingUp from '@lucide/svelte/icons/trending-up';

	export interface ExploreFeedItem {
		id: string;
		title: string;
		subtitle?: string;
		meta?: string;
		image?: string;
		kind?: string;
		/** Used by topic filters */
		topics?: string[];
		href?: string;
	}

	export interface ExploreFeedGroup {
		id: string;
		label: string;
		mode?: 'list' | 'cards';
		dateGroups?: DateGroupedListGroup[];
		items?: ExploreFeedItem[];
	}

	export interface ExploreSuggestion {
		id: string;
		title: string;
		body?: string;
		actionLabel?: string;
	}

	export interface ExploreFeaturedItem {
		id: string;
		title: string;
		description?: string;
		meta?: string;
		badge?: string;
		image?: string;
	}

	interface ExploreFeedPageProps {
		title?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		query?: string;
		recent?: string[];
		trending?: string[];
		filters?: ChipBarItem[];
		activeFilter?: string;
		suggestions?: ExploreSuggestion[];
		featured?: ExploreFeaturedItem[];
		groups?: ExploreFeedGroup[];
		activeSection?: number;
		loading?: boolean;
		searchPlaceholder?: string;
		showRecent?: boolean;
		showTrending?: boolean;
		showFilters?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		actions?: Snippet;
		emptyAction?: Snippet;
		onsearch?: (query: string) => void;
		onselect?: (id: string) => void;
		onfilterchange?: (id: string) => void;
		onsectionchange?: (index: number) => void;
		onclearrrecent?: () => void;
		onremoverecent?: (query: string) => void;
		onsuggestion?: (id: string) => void;
		ondismisssuggestion?: (id: string) => void;
	}

	let {
		title = 'Explore',
		description = 'Discover projects, people, and updates across your workspace.',
		breadcrumbs = [],
		query = $bindable(''),
		recent = $bindable<string[]>([]),
		trending = [],
		filters = [],
		activeFilter = $bindable(''),
		suggestions = [],
		featured = [],
		groups = [],
		activeSection = $bindable(0),
		loading = false,
		searchPlaceholder = 'Search projects, docs, people…',
		showRecent = true,
		showTrending = true,
		showFilters = true,
		emptyTitle = 'Start exploring',
		emptyDescription = 'Search above or pick a recent query to discover content.',
		class: className = '',
		actions,
		emptyAction,
		onsearch,
		onselect,
		onfilterchange,
		onsectionchange,
		onclearrrecent,
		onremoverecent,
		onsuggestion,
		ondismisssuggestion
	}: ExploreFeedPageProps = $props();

	let dismissedSuggestions = $state<string[]>([]);

	const visibleSuggestions = $derived(
		suggestions.filter((s) => !dismissedSuggestions.includes(s.id))
	);

	const filterId = $derived(activeFilter || filters[0]?.id || '');

	const filteredGroups = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const topic = filterId && filterId !== 'all' ? filterId : '';

		return groups.map((group) => {
			if (group.mode === 'list' && group.dateGroups?.length) {
				const dateGroups = group.dateGroups
					.map((dg) => ({
						...dg,
						items: dg.items.filter((item) => {
							if (q) {
								const hay = [item.title, item.subtitle, item.meta]
									.filter(Boolean)
									.join(' ')
									.toLowerCase();
								if (!hay.includes(q)) return false;
							}
							return true;
						})
					}))
					.filter((dg) => dg.items.length > 0);
				return { ...group, dateGroups };
			}

			const items = (group.items ?? []).filter((item) => {
				if (topic && item.topics?.length && !item.topics.includes(topic)) {
					if (item.kind?.toLowerCase() !== topic.toLowerCase()) return false;
				}
				if (topic && !item.topics?.length && item.kind) {
					if (item.kind.toLowerCase() !== topic.toLowerCase()) return false;
				}
				if (q) {
					const hay = [item.title, item.subtitle, item.meta, item.kind, ...(item.topics ?? [])]
						.filter(Boolean)
						.join(' ')
						.toLowerCase();
					if (!hay.includes(q)) return false;
				}
				return true;
			});
			return { ...group, items };
		});
	});

	const currentGroup = $derived(filteredGroups[activeSection]);
	const hasAnyResults = $derived(
		filteredGroups.some(
			(g) => (g.dateGroups?.length ?? 0) > 0 || (g.items?.length ?? 0) > 0
		)
	);
	const showSidebar = $derived(
		(showRecent && recent.length > 0) || (showTrending && trending.length > 0)
	);

	function handleSearch(q: string) {
		query = q;
		onsearch?.(q);
	}

	function dismissSuggestion(id: string) {
		dismissedSuggestions = [...dismissedSuggestions, id];
		ondismisssuggestion?.(id);
	}

	function handleFilter(id: string) {
		activeFilter = id;
		onfilterchange?.(id);
	}

	function handleSection(index: number) {
		activeSection = index;
		onsectionchange?.(index);
	}
</script>

<div class={['mx-auto w-full max-w-5xl space-y-5', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{/if}
		{/snippet}
	</PageHeader>

	<SearchBar
		bind:value={query}
		placeholder={searchPlaceholder}
		size="lg"
		variant="soft"
		shortcut="⌘K"
		showButton={false}
		onsubmit={handleSearch}
		onclear={() => handleSearch('')}
		oninput={(v) => onsearch?.(v)}
	/>

	{#if showFilters && filters.length}
		<ChipBar
			items={filters}
			bind:value={activeFilter}
			size="sm"
			variant="soft"
			onchange={handleFilter}
		/>
	{/if}

	{#if visibleSuggestions.length}
		<section class="space-y-3">
			{#each visibleSuggestions as suggestion (suggestion.id)}
				<SmartSuggestion
					title={suggestion.title}
					body={suggestion.body}
					actionLabel={suggestion.actionLabel}
					onaction={() => {
						onsuggestion?.(suggestion.id);
						onselect?.(suggestion.id);
					}}
					ondismiss={() => dismissSuggestion(suggestion.id)}
				/>
			{/each}
		</section>
	{/if}

	{#if featured.length}
		<section class="space-y-2">
			<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Featured</p>
			<ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each featured as item (item.id)}
					<li>
						<Tile
							title={item.title}
							subtitle={item.description}
							meta={item.meta}
							accent="brand"
							variant="card"
							onclick={() => onselect?.(item.id)}
						>
							{#snippet trailing()}
								{#if item.badge}
									<Badge size="sm" variant="secondary">{item.badge}</Badge>
								{/if}
							{/snippet}
						</Tile>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class={['grid gap-5', showSidebar && 'lg:grid-cols-[16rem_minmax(0,1fr)]']}>
		{#if showSidebar}
			<aside class="min-w-0 space-y-4">
				{#if showRecent && recent.length}
					<section class="rounded-xl border border-border bg-surface-elevated p-4">
						<RecentSearches
							items={recent}
							onselect={(q) => handleSearch(q)}
							onremove={onremoverecent}
							onclear={onclearrrecent}
						/>
					</section>
				{/if}

				{#if showTrending && trending.length}
					<section class="rounded-xl border border-border bg-surface-elevated p-4">
						<div class="mb-2.5 flex items-center gap-1.5">
							<TrendingUp class="h-3.5 w-3.5 text-muted" aria-hidden="true" />
							<p class="text-xs font-semibold uppercase tracking-wide text-muted">Trending</p>
						</div>
						<div class="flex flex-wrap gap-1.5">
							{#each trending as term (term)}
								<Chip size="sm" onclick={() => handleSearch(term)}>{term}</Chip>
							{/each}
						</div>
					</section>
				{/if}
			</aside>
		{/if}

		<section class="min-w-0 space-y-4">
			{#if loading}
				<div
					class="flex min-h-[14rem] items-center justify-center rounded-xl border border-dashed border-border"
				>
					<p class="text-sm text-muted">Loading explore feed…</p>
				</div>
			{:else if groups.length}
				<SegmentedPager
					pages={filteredGroups.map((g) => ({ id: g.id, label: g.label }))}
					bind:active={activeSection}
					onchange={handleSection}
				>
					{#if currentGroup}
						{#if currentGroup.mode === 'list' && currentGroup.dateGroups?.length}
							<DateGroupedList
								groups={currentGroup.dateGroups}
								onitemclick={(id) => onselect?.(id)}
							/>
						{:else if currentGroup.items?.length}
							<ul class="grid gap-2 sm:grid-cols-2">
								{#each currentGroup.items as item (item.id)}
									<li>
										<EntityPreview
											title={item.title}
											subtitle={item.subtitle}
											meta={item.meta}
											image={item.image}
											kind={item.kind}
											href={item.href}
											onclick={() => onselect?.(item.id)}
										/>
									</li>
								{/each}
							</ul>
						{:else}
							<EmptyState
								title="Nothing in this section"
								description={query
									? 'Try another search or clear filters.'
									: 'Check back later or try another category.'}
							>
								{#snippet action()}
									{#if query}
										<Button size="sm" variant="secondary" onclick={() => handleSearch('')}>
											Clear search
										</Button>
									{:else if emptyAction}
										{@render emptyAction()}
									{/if}
								{/snippet}
							</EmptyState>
						{/if}
					{/if}
				</SegmentedPager>

				{#if !hasAnyResults && (query || (filterId && filterId !== 'all'))}
					<p class="text-center text-xs text-muted">
						No matches for
						{#if query}
							“{query}”
						{/if}
						{#if query && filterId && filterId !== 'all'}
							·
						{/if}
						{#if filterId && filterId !== 'all'}
							filter “{filters.find((f) => f.id === filterId)?.label ?? filterId}”
						{/if}
					</p>
				{/if}
			{:else}
				<EmptyState title={emptyTitle} description={emptyDescription}>
					{#snippet action()}
						{#if emptyAction}
							{@render emptyAction()}
						{/if}
					{/snippet}
				</EmptyState>
			{/if}
		</section>
	</div>
</div>
