<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sheet, { type SheetSize } from '$lib/components/organisms/Sheet/Sheet.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import Search from '@lucide/svelte/icons/search';
	import Clock from '@lucide/svelte/icons/clock';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import X from '@lucide/svelte/icons/x';

	export interface SearchSheetItem {
		id: string;
		label: string;
		description?: string;
		meta?: string;
	}

	interface SearchSheetProps {
		open?: boolean;
		query?: string;
		placeholder?: string;
		cancelLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		noResultsTitle?: string;
		noResultsDescription?: string;
		loading?: boolean;
		recent?: SearchSheetItem[];
		trending?: string[];
		suggestions?: SearchSheetItem[];
		filterSuggestions?: boolean;
		/** Forwarded to Sheet */
		size?: SheetSize;
		showHandle?: boolean;
		class?: string;
		children?: Snippet;
		onclose?: () => void;
		onsearch?: (query: string) => void;
		onselect?: (item: SearchSheetItem) => void;
		onclearrecent?: () => void;
		onremoverecent?: (id: string) => void;
	}

	let {
		open = $bindable(false),
		query = $bindable(''),
		placeholder = 'Search…',
		cancelLabel = 'Cancel',
		emptyTitle = 'Search',
		emptyDescription = 'Find people, places, and more.',
		noResultsTitle = 'No results',
		noResultsDescription = 'Try a different keyword or check your spelling.',
		loading = false,
		recent = [],
		trending = [],
		suggestions = [],
		filterSuggestions = true,
		size = 'full',
		showHandle = true,
		class: className = '',
		children,
		onclose,
		onsearch,
		onselect,
		onclearrecent,
		onremoverecent
	}: SearchSheetProps = $props();

	let inputHost = $state<HTMLDivElement | null>(null);

	const hasQuery = $derived(query.trim().length > 0);

	const filtered = $derived.by(() => {
		if (!filterSuggestions || !hasQuery) return suggestions;
		const q = query.trim().toLowerCase();
		return suggestions.filter(
			(s) =>
				s.label.toLowerCase().includes(q) ||
				s.description?.toLowerCase().includes(q) ||
				s.meta?.toLowerCase().includes(q)
		);
	});

	const showBuiltInResults = $derived(hasQuery && (suggestions.length > 0 || loading));
	const showIdle = $derived(!hasQuery);

	$effect(() => {
		if (!open) return;
		queueMicrotask(() => {
			const input = inputHost?.querySelector('input');
			input?.focus();
			input?.select();
		});
	});

	function close() {
		open = false;
		onclose?.();
	}

	function selectItem(item: SearchSheetItem) {
		query = item.label;
		onselect?.(item);
		onsearch?.(item.label);
	}

	function selectTrending(term: string) {
		query = term;
		onsearch?.(term);
		onselect?.({ id: `trend-${term}`, label: term });
	}

	function clearQuery() {
		query = '';
		onsearch?.('');
	}
</script>

<Sheet
	bind:open
	{size}
	{showHandle}
	showClose={false}
	accent="none"
	pullToClose
	draggable
	class={className}
	onclose={() => onclose?.()}
>
	{#snippet header()}
		<div class="flex items-center gap-2" data-no-drag bind:this={inputHost}>
			<div class="min-w-0 flex-1">
				<SearchBar
					bind:value={query}
					{placeholder}
					variant="soft"
					size="md"
					showButton={false}
					{loading}
					oninput={(v) => onsearch?.(v)}
					onsubmit={(v) => onsearch?.(v)}
					onclear={clearQuery}
				/>
			</div>
			<Button variant="ghost" size="sm" class="shrink-0 px-2" onclick={close}>
				{cancelLabel}
			</Button>
		</div>
	{/snippet}

	{#if showIdle}
		{#if recent.length}
			<section class="mb-5">
				<div class="mb-2 flex items-center justify-between gap-2">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted">Recent</p>
					{#if onclearrecent}
						<button
							type="button"
							class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
							onclick={() => onclearrecent?.()}
						>
							Clear
						</button>
					{/if}
				</div>
				<ul class="space-y-0.5">
					{#each recent as item (item.id)}
						<li>
							<div class="group flex items-center gap-1 rounded-xl hover:bg-surface-overlay">
								<button
									type="button"
									class="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5 text-left"
									onclick={() => selectItem(item)}
								>
									<span
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-overlay text-muted"
									>
										<Clock class="h-4 w-4" aria-hidden="true" />
									</span>
									<span class="min-w-0 flex-1">
										<span class="block truncate text-sm font-medium text-primary">{item.label}</span>
										{#if item.description}
											<span class="block truncate text-xs text-muted">{item.description}</span>
										{/if}
									</span>
								</button>
								{#if onremoverecent}
									<button
										type="button"
										class="mr-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-0 transition-opacity hover:bg-surface-elevated hover:text-primary group-hover:opacity-100"
										aria-label={`Remove ${item.label}`}
										onclick={() => onremoverecent?.(item.id)}
									>
										<X class="h-4 w-4" />
									</button>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if trending.length}
			<section class="mb-5">
				<div class="mb-2 flex items-center gap-1.5">
					<TrendingUp class="h-3.5 w-3.5 text-muted" aria-hidden="true" />
					<p class="text-xs font-semibold uppercase tracking-wide text-muted">Trending</p>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each trending as term (term)}
						<button type="button" onclick={() => selectTrending(term)}>
							<Chip size="sm">{term}</Chip>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if !recent.length && !trending.length && !children}
			<div class="flex flex-col items-center px-2 py-8 text-center">
				<span
					class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
				>
					<Search class="h-6 w-6" aria-hidden="true" />
				</span>
				<p class="text-sm font-semibold text-primary">{emptyTitle}</p>
				<p class="mt-1 max-w-xs text-xs leading-relaxed text-muted">{emptyDescription}</p>
			</div>
		{:else if children && !recent.length && !trending.length}
			{@render children()}
		{/if}
	{:else if loading}
		<div class="space-y-2">
			{#each [1, 2, 3, 4] as n (n)}
				<div class="flex items-center gap-3 rounded-xl px-2 py-2.5">
					<div class="h-9 w-9 animate-pulse rounded-full bg-surface-overlay"></div>
					<div class="min-w-0 flex-1 space-y-2">
						<div class="h-3 w-2/3 animate-pulse rounded bg-surface-overlay"></div>
						<div class="h-2.5 w-1/3 animate-pulse rounded bg-surface-overlay"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if showBuiltInResults}
		{#if filtered.length}
			<ul class="space-y-0.5" aria-label="Search results">
				{#each filtered as item (item.id)}
					<li>
						<button
							type="button"
							class="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surface-overlay"
							onclick={() => {
								selectItem(item);
								close();
							}}
						>
							<span
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"
							>
								<Search class="h-4 w-4" aria-hidden="true" />
							</span>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-medium text-primary">{item.label}</span>
								{#if item.description}
									<span class="block truncate text-xs text-muted">{item.description}</span>
								{/if}
							</span>
							{#if item.meta}
								<span class="shrink-0 text-[11px] text-muted">{item.meta}</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState
				title={noResultsTitle}
				description={noResultsDescription}
				class="border-0 bg-transparent shadow-none"
			/>
		{/if}
	{:else if children}
		{@render children()}
	{:else}
		<EmptyState
			title={noResultsTitle}
			description={noResultsDescription}
			class="border-0 bg-transparent shadow-none"
		/>
	{/if}
</Sheet>
