<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import Pagination from '$lib/components/molecules/Pagination/Pagination.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import List from '$lib/components/molecules/List/List.svelte';
	import type { ListItem } from '$lib/components/molecules/List/List.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	export type SearchResultKind = 'doc' | 'component' | 'page' | 'person' | 'file' | string;

	export type SearchResultsLayout = 'list' | 'grid' | 'compact';

	export type SearchResultsSort = 'relevance' | 'newest' | 'oldest' | 'az';

	export interface SearchResultItem {
		id: string;
		title: string;
		description?: string;
		meta?: string;
		href?: string;
		kind?: SearchResultKind;
		badge?: string;
		badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		tags?: string[];
		image?: string;
		icon?: Component;
		author?: string;
		avatar?: string;
		date?: string | Date | number;
		score?: number;
	}

	export interface SearchSuggestion {
		id: string;
		label: string;
	}

	interface SearchResultsProps {
		query?: string;
		results?: SearchResultItem[];
		filters?: ChipBarItem[];
		filter?: string;
		sort?: SearchResultsSort;
		layout?: SearchResultsLayout;
		total?: number;
		page?: number;
		totalPages?: number;
		loading?: boolean;
		placeholder?: string;
		suggestions?: SearchSuggestion[];
		recent?: SearchSuggestion[];
		didYouMean?: string;
		showSort?: boolean;
		showLayoutToggle?: boolean;
		showPagination?: boolean;
		class?: string;
		children?: Snippet;
		emptyAction?: Snippet;
		toolbar?: Snippet;
		onsearch?: (q: string) => void;
		onfilter?: (id: string) => void;
		onsort?: (sort: SearchResultsSort) => void;
		onlayout?: (layout: SearchResultsLayout) => void;
		onselect?: (id: string) => void;
		onpage?: (page: number) => void;
		onsuggest?: (id: string) => void;
		onclearFilters?: () => void;
		oncorrection?: (term: string) => void;
	}

	let {
		query = $bindable(''),
		results = [],
		filters = [],
		filter = $bindable(''),
		sort = $bindable<SearchResultsSort>('relevance'),
		layout = $bindable<SearchResultsLayout>('list'),
		total,
		page = $bindable(1),
		totalPages = 1,
		loading = false,
		placeholder = 'Search docs, components, people…',
		suggestions = [],
		recent = [],
		didYouMean,
		showSort = true,
		showLayoutToggle = true,
		showPagination = true,
		class: className = '',
		children,
		emptyAction,
		toolbar,
		onsearch,
		onfilter,
		onsort,
		onlayout,
		onselect,
		onpage,
		onsuggest,
		onclearFilters,
		oncorrection
	}: SearchResultsProps = $props();

	const count = $derived(total ?? results.length);
	const hasQuery = $derived(query.trim().length > 0);
	const showIdle = $derived(!loading && !hasQuery && results.length === 0);
	const showEmpty = $derived(!loading && hasQuery && results.length === 0);

	const sortOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'newest', label: 'Newest' },
		{ value: 'oldest', label: 'Oldest' },
		{ value: 'az', label: 'A–Z' }
	];

	const listItems = $derived<ListItem[]>(
		results.map((r) => ({
			id: r.id,
			label: r.title,
			description: r.description,
			meta: r.meta
		}))
	);

	const byId = $derived(new Map(results.map((r) => [r.id, r])));

	function formatDate(value: string | Date | number) {
		const d = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(d.getTime())) return String(value);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function highlight(text: string, q: string) {
		const term = q.trim();
		if (!term) return [{ text, match: false }];
		const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const re = new RegExp(`(${escaped})`, 'ig');
		return text.split(re).filter(Boolean).map((part) => ({
			text: part,
			match: part.toLowerCase() === term.toLowerCase()
		}));
	}

	function kindLabel(kind?: string) {
		if (!kind) return null;
		return kind.charAt(0).toUpperCase() + kind.slice(1);
	}

	function applySuggestion(label: string, id?: string) {
		query = label;
		if (id) onsuggest?.(id);
		onsearch?.(label);
	}

	function clearAll() {
		filter = 'all';
		onclearFilters?.();
		onfilter?.('all');
	}
</script>

<div class={['w-full space-y-5', className]}>
	<div class="space-y-3">
		<SearchBar
			bind:value={query}
			{placeholder}
			{loading}
			size="lg"
			variant="soft"
			shortcut="⌘K"
			onsubmit={(q) => onsearch?.(q)}
			oninput={(q) => {
				if (!q.trim()) onsearch?.('');
			}}
		/>

		{#if filters.length}
			<div class="flex flex-wrap items-center gap-2">
				<div class="min-w-0 flex-1">
					<ChipBar
						bind:value={filter}
						items={filters}
						size="sm"
						onchange={(id) => onfilter?.(id)}
					/>
				</div>
				{#if filter && filter !== 'all'}
					<Button size="xs" variant="ghost" onclick={clearAll}>
						<X class="mr-1 h-3.5 w-3.5" aria-hidden="true" />
						Clear
					</Button>
				{/if}
			</div>
		{/if}
	</div>

	{#if didYouMean && hasQuery}
		<p class="text-sm text-secondary">
			Did you mean
			<button
				type="button"
				class="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
				onclick={() => {
					query = didYouMean;
					oncorrection?.(didYouMean);
					onsearch?.(didYouMean);
				}}
			>
				{didYouMean}
			</button>
			?
		</p>
	{/if}

	{#if showIdle}
		<div class="grid gap-4 sm:grid-cols-2">
			{#if recent.length}
				<section class="rounded-2xl border border-border bg-surface-elevated/70 p-4">
					<div class="mb-3 flex items-center gap-2">
						<Search class="h-4 w-4 text-muted" aria-hidden="true" />
						<Text size="xs" tone="muted" as="p" class="font-semibold uppercase tracking-wide">
							Recent
						</Text>
					</div>
					<ul class="space-y-1">
						{#each recent as item (item.id)}
							<li>
								<button
									type="button"
									class="w-full rounded-lg px-2.5 py-2 text-left text-sm text-primary transition-colors hover:bg-surface-overlay"
									onclick={() => applySuggestion(item.label, item.id)}
								>
									{item.label}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
			{#if suggestions.length}
				<section class="rounded-2xl border border-border bg-surface-elevated/70 p-4">
					<div class="mb-3 flex items-center gap-2">
						<Sparkles class="h-4 w-4 text-muted" aria-hidden="true" />
						<Text size="xs" tone="muted" as="p" class="font-semibold uppercase tracking-wide">
							Suggestions
						</Text>
					</div>
					<ul class="space-y-1">
						{#each suggestions as item (item.id)}
							<li>
								<button
									type="button"
									class="w-full rounded-lg px-2.5 py-2 text-left text-sm text-primary transition-colors hover:bg-surface-overlay"
									onclick={() => applySuggestion(item.label, item.id)}
								>
									{item.label}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
			{#if !recent.length && !suggestions.length}
				<EmptyState
					title="Search the library"
					description="Try a component name, doc title, or author."
				/>
			{/if}
		</div>
	{:else}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm text-secondary">
				{#if loading}
					<span class="inline-flex items-center gap-2">
						<span
							class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
						></span>
						Searching…
					</span>
				{:else}
					<span class="font-semibold text-primary tabular-nums">{count}</span>
					result{count === 1 ? '' : 's'}
					{#if query}
						for <span class="font-medium text-primary">“{query}”</span>
					{/if}
				{/if}
			</p>

			<div class="flex flex-wrap items-center gap-2">
				{#if toolbar}
					{@render toolbar()}
				{/if}

				{#if showSort}
					<div class="w-[9.5rem]">
						<Select
							bind:value={sort}
							size="sm"
							placeholder="Sort by"
							options={sortOptions}
							onchange={(value) => onsort?.(value as SearchResultsSort)}
						/>
					</div>
				{/if}

				{#if showLayoutToggle}
					<SegmentedControl
						bind:value={layout}
						size="sm"
						items={[
							{ id: 'list', label: 'List' },
							{ id: 'grid', label: 'Grid' },
							{ id: 'compact', label: 'Compact' }
						]}
						onchange={(id) => onlayout?.(id as SearchResultsLayout)}
					/>
				{/if}
			</div>
		</div>

		{#if children}
			{@render children()}
		{:else if loading}
			<ul
				class={[
					layout === 'grid' && 'grid gap-3 sm:grid-cols-2',
					layout !== 'grid' && 'space-y-2'
				]}
			>
				{#each Array.from({ length: 5 }, (_, i) => i) as i}
					<li
						class="rounded-2xl border border-border bg-surface-elevated p-4"
						aria-hidden="true"
					>
						<div class="flex gap-3">
							<Skeleton variant="rounded" width="2.75rem" height="2.75rem" />
							<div class="min-w-0 flex-1 space-y-2">
								<Skeleton variant="text" width="{60 + (i % 3) * 10}%" height="0.85rem" />
								<Skeleton variant="text" width="90%" height="0.65rem" />
								<Skeleton variant="text" width="40%" height="0.55rem" />
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else if showEmpty}
			<EmptyState
				title="No results"
				description={`Nothing matched “${query}”. Try another keyword or clear filters.`}
			>
				{#snippet action()}
					{#if emptyAction}
						{@render emptyAction()}
					{:else}
						<Button
							size="sm"
							variant="secondary"
							onclick={() => {
								query = '';
								clearAll();
								onsearch?.('');
							}}
						>
							Clear search
						</Button>
					{/if}
				{/snippet}
			</EmptyState>
		{:else if layout === 'grid'}
			<ul class="grid gap-3 sm:grid-cols-2">
				{#each results as item (item.id)}
					<li>
						<button
							type="button"
							class="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
							onclick={() => onselect?.(item.id)}
						>
							{#if item.image}
								<img src={item.image} alt="" class="aspect-[16/9] w-full object-cover" />
							{/if}
							<div class="flex flex-1 flex-col gap-2 p-4">
								<div class="flex flex-wrap items-center gap-1.5">
									{#if item.kind}
										<Badge size="sm" variant="secondary">{kindLabel(item.kind)}</Badge>
									{/if}
									{#if item.badge}
										<Badge size="sm" variant={item.badgeVariant ?? 'primary'}>{item.badge}</Badge>
									{/if}
								</div>
								<span class="text-sm font-semibold text-primary">
									{#each highlight(item.title, query) as part}
										{#if part.match}
											<mark class="rounded-sm bg-brand-500/15 text-brand-700 dark:text-brand-300">{part.text}</mark>
										{:else}
											{part.text}
										{/if}
									{/each}
								</span>
								{#if item.description}
									<span class="line-clamp-2 text-xs leading-relaxed text-secondary">
										{item.description}
									</span>
								{/if}
								{#if item.meta || item.date}
									<span class="mt-auto pt-1 text-[11px] text-muted">
										{#if item.meta}{item.meta}{/if}
										{#if item.meta && item.date} · {/if}
										{#if item.date}{formatDate(item.date)}{/if}
									</span>
								{/if}
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<List
				items={listItems}
				variant="divided"
				size={layout === 'compact' ? 'sm' : 'md'}
				onclick={(row) => onselect?.(row.id)}
			>
				{#snippet item(row)}
					{@const full = byId.get(row.id)}
					{#if full}
						<div
							class={[
								'flex w-full text-left',
								layout === 'compact' ? 'items-center gap-3 px-3.5 py-2.5' : 'gap-3 px-4 py-3.5'
							]}
						>
							{#if full.image}
								<img
									src={full.image}
									alt=""
									class={[
										'shrink-0 rounded-xl object-cover',
										layout === 'compact' ? 'h-9 w-9' : 'h-12 w-12'
									]}
								/>
							{:else if full.avatar || full.author}
								<Avatar
									src={full.avatar}
									name={full.author ?? full.title}
									size={layout === 'compact' ? 'sm' : 'md'}
								/>
							{:else if full.icon}
								{@const Icon = full.icon}
								<span
									class={[
										'inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400',
										layout === 'compact' ? 'h-9 w-9' : 'h-11 w-11'
									]}
								>
									<Icon class={layout === 'compact' ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
								</span>
							{:else}
								<span
									class={[
										'inline-flex shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-muted',
										layout === 'compact' ? 'h-9 w-9' : 'h-11 w-11'
									]}
								>
									<Search class={layout === 'compact' ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
								</span>
							{/if}

							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-1.5">
									<span
										class={[
											'font-semibold text-primary',
											layout === 'compact' ? 'text-sm' : 'text-sm sm:text-[0.95rem]'
										]}
									>
										{#each highlight(full.title, query) as part}
											{#if part.match}
												<mark
													class="rounded-sm bg-brand-500/15 px-0.5 text-brand-700 dark:text-brand-300"
													>{part.text}</mark
												>
											{:else}
												{part.text}
											{/if}
										{/each}
									</span>
									{#if full.badge}
										<Badge size="sm" variant={full.badgeVariant ?? 'primary'}>{full.badge}</Badge>
									{/if}
									{#if full.kind && layout !== 'compact'}
										<Badge size="sm" variant="secondary">{kindLabel(full.kind)}</Badge>
									{/if}
								</div>

								{#if full.description && layout !== 'compact'}
									<p class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-secondary sm:text-[13px]">
										{full.description}
									</p>
								{/if}

								<div
									class={[
										'flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted',
										layout === 'compact' ? 'mt-0.5' : 'mt-1.5'
									]}
								>
									{#if full.kind && layout === 'compact'}
										<span>{kindLabel(full.kind)}</span>
										<span aria-hidden="true">·</span>
									{/if}
									{#if full.meta}
										<span>{full.meta}</span>
									{/if}
									{#if full.author}
										{#if full.meta}<span aria-hidden="true">·</span>{/if}
										<span>{full.author}</span>
									{/if}
									{#if full.date}
										<span aria-hidden="true">·</span>
										<span>{formatDate(full.date)}</span>
									{/if}
									{#if full.score != null}
										<span aria-hidden="true">·</span>
										<span class="tabular-nums">{Math.round(full.score * 100)}% match</span>
									{/if}
								</div>

								{#if full.tags?.length && layout === 'list'}
									<div class="mt-2 flex flex-wrap gap-1">
										{#each full.tags.slice(0, 4) as tag}
											<span
												class="rounded-md bg-surface-overlay px-1.5 py-0.5 text-[10px] font-medium text-secondary"
											>
												{tag}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/snippet}
			</List>
		{/if}

		{#if showPagination && totalPages > 1 && !loading && results.length}
			<div class="flex justify-center pt-1">
				<Pagination
					bind:page
					{totalPages}
					onchange={(p) => onpage?.(p)}
				/>
			</div>
		{/if}
	{/if}
</div>
