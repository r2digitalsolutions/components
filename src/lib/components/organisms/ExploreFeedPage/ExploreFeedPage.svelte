<script lang="ts">
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import RecentSearches from '$lib/components/molecules/RecentSearches/RecentSearches.svelte';
	import SmartSuggestion from '$lib/components/molecules/SmartSuggestion/SmartSuggestion.svelte';
	import DateGroupedList from '$lib/components/molecules/DateGroupedList/DateGroupedList.svelte';
	import type { DateGroupedListGroup } from '$lib/components/molecules/DateGroupedList/DateGroupedList.svelte';
	import EntityPreview from '$lib/components/molecules/EntityPreview/EntityPreview.svelte';
	import SegmentedPager from '$lib/components/molecules/SegmentedPager/SegmentedPager.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';

	export interface ExploreFeedItem {
		id: string;
		title: string;
		subtitle?: string;
		meta?: string;
		image?: string;
		kind?: string;
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

	interface ExploreFeedPageProps {
		title?: string;
		query?: string;
		recent?: string[];
		suggestions?: ExploreSuggestion[];
		groups?: ExploreFeedGroup[];
		activeSection?: number;
		class?: string;
		onsearch?: (query: string) => void;
		onselect?: (id: string) => void;
	}

	let {
		title = 'Explore',
		query = $bindable(''),
		recent = [],
		suggestions = [],
		groups = [],
		activeSection = $bindable(0),
		class: className = '',
		onsearch,
		onselect
	}: ExploreFeedPageProps = $props();

	let dismissedSuggestions = $state<string[]>([]);

	const visibleSuggestions = $derived(
		suggestions.filter((s) => !dismissedSuggestions.includes(s.id))
	);
	const currentGroup = $derived(groups[activeSection]);
	const hasContent = $derived(groups.some((g) => (g.dateGroups?.length ?? 0) > 0 || (g.items?.length ?? 0) > 0));

	function handleSearch(q: string) {
		query = q;
		onsearch?.(q);
	}

	function dismissSuggestion(id: string) {
		dismissedSuggestions = [...dismissedSuggestions, id];
	}
</script>

<div class={['mx-auto w-full max-w-4xl space-y-5', className]}>
	<header class="space-y-1">
		<h1 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{title}</h1>
		<p class="text-sm text-muted">Discover projects, people, and updates across your workspace.</p>
	</header>

	<SearchBar
		bind:value={query}
		placeholder="Search projects, docs, people…"
		size="lg"
		variant="soft"
		shortcut="⌘K"
		showButton={false}
		onsubmit={handleSearch}
		onclear={() => handleSearch('')}
	/>

	<div class="grid gap-4 sm:grid-cols-2">
		{#if recent.length}
			<section class="rounded-xl border border-border bg-surface-elevated p-4">
				<RecentSearches
					items={recent}
					onselect={(q) => handleSearch(q)}
				/>
			</section>
		{/if}

		{#if visibleSuggestions.length}
			<section class="space-y-3 sm:col-span-2">
				{#each visibleSuggestions as suggestion (suggestion.id)}
					<SmartSuggestion
						title={suggestion.title}
						body={suggestion.body}
						actionLabel={suggestion.actionLabel}
						onaction={() => onselect?.(suggestion.id)}
						ondismiss={() => dismissSuggestion(suggestion.id)}
					/>
				{/each}
			</section>
		{/if}
	</div>

	{#if groups.length}
		<SegmentedPager
			pages={groups.map((g) => ({ id: g.id, label: g.label }))}
			bind:active={activeSection}
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
									onclick={() => onselect?.(item.id)}
								/>
							</li>
						{/each}
					</ul>
				{:else}
					<EmptyState
						title="Nothing in this section"
						description="Check back later or try another category."
					/>
				{/if}
			{/if}
		</SegmentedPager>
	{:else if !hasContent && !recent.length}
		<EmptyState
			title="Start exploring"
			description="Search above or pick a recent query to discover content."
		/>
	{/if}
</div>
