<script lang="ts">
	import QueryBar from '$lib/components/molecules/QueryBar/QueryBar.svelte';
	import SortSelect from '$lib/components/molecules/SortSelect/SortSelect.svelte';
	import FacetPanel from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import type { FacetGroupDef } from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import AdvancedFilters from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';
	import type { FilterFieldDef } from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';
	import ProductCard from '$lib/components/molecules/ProductCard/ProductCard.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		createEmptyFilterState,
		filterParamsToSearch,
		parseFilterParams,
		type AdvancedFilterClause,
		type AdvancedFilterValue,
		type CatalogFilterState,
		type FilterOperator
	} from '$lib/utils/filterParams.js';

	export interface CatalogProduct {
		id: string;
		title: string;
		subtitle?: string;
		image?: string;
		price: number;
		compareAt?: number;
		currency?: string;
		badge?: string;
		rating?: number;
		reviews?: number;
		brand?: string;
		color?: string;
		tags?: string[];
	}

	interface CatalogPageProps {
		products?: CatalogProduct[];
		facetGroups?: FacetGroupDef[];
		fields?: FilterFieldDef[];
		state?: CatalogFilterState;
		title?: string;
		showAdvanced?: boolean;
		showUrlSync?: boolean;
		class?: string;
		onstatechange?: (state: CatalogFilterState) => void;
		onadd?: (id: string) => void;
	}

	let {
		products = [],
		facetGroups = [],
		fields = [],
		state: filters = $bindable(createEmptyFilterState()),
		title = 'Catalog',
		showAdvanced = true,
		showUrlSync = false,
		class: className = '',
		onstatechange,
		onadd
	}: CatalogPageProps = $props();

	let urlPreview = $state('');
	let urlInput = $state('');
	let showAdvancedPanel = $state(false);

	function emit(next: CatalogFilterState) {
		filters = next;
		onstatechange?.(next);
	}

	function patch(partial: Partial<CatalogFilterState>) {
		emit({
			...filters,
			...partial,
			facets: partial.facets ?? filters.facets,
			advanced: partial.advanced ?? filters.advanced
		});
	}

	function productField(p: CatalogProduct, field: string): string | number | string[] | undefined {
		if (field === 'brand') return p.brand;
		if (field === 'color') return p.color;
		if (field === 'price') return p.price;
		if (field === 'tags') return p.tags;
		if (field === 'name') return p.title;
		if (field === 'title') return p.title;
		return undefined;
	}

	const activeChips = $derived.by(() => {
		const chips: { id: string; label: string; clear: () => void }[] = [];
		for (const [facetId, values] of Object.entries(filters.facets) as [string, string[]][]) {
			const group = facetGroups.find((g) => g.id === facetId);
			for (const v of values) {
				const opt = group?.options.find((o) => o.id === v);
				chips.push({
					id: `facet:${facetId}:${v}`,
					label: `${group?.title ?? facetId}: ${opt?.label ?? v}`,
					clear: () => {
						const nextValues = (filters.facets[facetId] ?? []).filter((x: string) => x !== v);
						const facets = { ...filters.facets };
						if (nextValues.length) facets[facetId] = nextValues;
						else delete facets[facetId];
						patch({ facets });
					}
				});
			}
		}
		for (const clause of filters.advanced) {
			const field = fields.find((f) => f.id === clause.field);
			const val = Array.isArray(clause.value) ? clause.value.join(', ') : String(clause.value);
			chips.push({
				id: clause.id,
				label: `${field?.label ?? clause.field} ${clause.op} ${val}`,
				clear: () =>
					patch({
						advanced: filters.advanced.filter((c: AdvancedFilterClause) => c.id !== clause.id)
					})
			});
		}
		if (filters.price?.min !== undefined || filters.price?.max !== undefined) {
			chips.push({
				id: 'price',
				label: `Price ${filters.price.min ?? '…'}–${filters.price.max ?? '…'}`,
				clear: () => patch({ price: undefined })
			});
		}
		return chips;
	});

	const filtered = $derived.by(() => {
		let list = [...products];
		const q = filters.q.trim().toLowerCase();
		if (q) {
			list = list.filter((p) => {
				if (
					p.title.toLowerCase().includes(q) ||
					p.subtitle?.toLowerCase().includes(q) ||
					p.brand?.toLowerCase().includes(q)
				) {
					return true;
				}
				return q.split(/\s+AND\s+/i).every((part: string) => {
					const m = part.match(/^(\w+)\s*[:=]\s*(.+)$/);
					if (!m) return true;
					const field = m[1];
					const value = m[2].replace(/^"|"$/g, '').toLowerCase();
					if (field === 'brand') return (p.brand ?? '').toLowerCase() === value;
					if (field === 'color') return (p.color ?? '').toLowerCase() === value;
					if (field === 'tags') return (p.tags ?? []).some((t) => t.toLowerCase() === value);
					const raw = productField(p, field);
					return `${raw ?? ''}`.toLowerCase().includes(value);
				});
			});
		}
		for (const [facetId, values] of Object.entries(filters.facets) as [string, string[]][]) {
			if (!values.length) continue;
			list = list.filter((p) => {
				if (facetId === 'brand') return values.includes(p.brand ?? '');
				if (facetId === 'color') return values.includes(p.color ?? '');
				if (facetId === 'tags') return values.some((v: string) => (p.tags ?? []).includes(v));
				return true;
			});
		}
		if (filters.price?.min !== undefined) {
			const min = filters.price.min;
			list = list.filter((p) => p.price >= min);
		}
		if (filters.price?.max !== undefined) {
			const max = filters.price.max;
			list = list.filter((p) => p.price <= max);
		}
		for (const clause of filters.advanced) {
			list = list.filter((p) => matchClause(p, clause.field, clause.op, clause.value));
		}
		const sort = filters.sort ?? 'relevance';
		if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
		else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
		else if (sort === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		else if (sort === 'newest') list = list.reverse();
		return list;
	});

	function matchClause(
		p: CatalogProduct,
		field: string,
		op: FilterOperator,
		value: AdvancedFilterValue
	): boolean {
		const raw = productField(p, field);

		if (op === 'between' && Array.isArray(value) && value.length === 2 && typeof value[0] === 'number') {
			const n = Number(raw);
			const min = value[0] as number;
			const max = value[1] as number;
			return n >= min && n <= max;
		}
		if (op === 'in' && Array.isArray(value)) {
			if (Array.isArray(raw)) return value.some((v) => raw.includes(String(v)));
			return value.map(String).includes(String(raw));
		}
		const left = String(raw ?? '').toLowerCase();
		const right = String(value).toLowerCase();
		if (op === 'eq') return left === right;
		if (op === 'neq') return left !== right;
		if (op === 'contains') return left.includes(right);
		const ln = Number(raw);
		const rn = Number(value);
		if (op === 'gt') return ln > rn;
		if (op === 'gte') return ln >= rn;
		if (op === 'lt') return ln < rn;
		if (op === 'lte') return ln <= rn;
		return true;
	}

	function copyUrl() {
		urlPreview = filterParamsToSearch(filters);
		urlInput = urlPreview;
		if (typeof navigator !== 'undefined' && navigator.clipboard && urlPreview) {
			void navigator.clipboard.writeText(urlPreview);
		}
	}

	function applyUrl() {
		emit(parseFilterParams(urlInput || urlPreview));
	}

	function clearAll() {
		emit(createEmptyFilterState({ sort: filters.sort }));
	}
</script>

<div class={['w-full space-y-4', className]}>
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-xl font-semibold text-primary">{title}</h1>
			<p class="text-sm text-muted">{filtered.length} of {products.length} products</p>
		</div>
		<SortSelect value={filters.sort ?? 'relevance'} onchange={(v) => patch({ sort: v })} />
	</div>

	<QueryBar
		value={filters.q}
		{fields}
		onchange={(q) => patch({ q })}
		onsubmit={(q) => patch({ q })}
	/>

	{#if activeChips.length}
		<div class="flex flex-wrap items-center gap-1.5">
			{#each activeChips as chip (chip.id)}
				<Chip size="sm" dismissible ondismiss={chip.clear}>{chip.label}</Chip>
			{/each}
			<button
				type="button"
				class="text-xs font-medium text-muted hover:text-primary"
				onclick={clearAll}
			>
				Clear all
			</button>
		</div>
	{/if}

	{#if showAdvanced}
		<div class="flex flex-wrap gap-2">
			<Button
				variant="secondary"
				size="sm"
				onclick={() => (showAdvancedPanel = !showAdvancedPanel)}
			>
				{showAdvancedPanel ? 'Hide advanced' : 'Advanced filters'}
			</Button>
			{#if showUrlSync}
				<Button variant="outline" size="sm" onclick={copyUrl}>Copy URL params</Button>
			{/if}
		</div>
		{#if showAdvancedPanel}
			<AdvancedFilters
				{fields}
				clauses={filters.advanced}
				onchange={(advanced) => patch({ advanced })}
			/>
		{/if}
	{/if}

	{#if showUrlSync}
		<div
			class="flex flex-col gap-2 rounded-xl border border-border bg-surface-overlay/60 p-3 sm:flex-row sm:items-end"
		>
			<label class="min-w-0 flex-1 space-y-1">
				<span class="text-xs font-medium text-muted">URL query</span>
				<input
					class="w-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 font-mono text-xs text-primary"
					bind:value={urlInput}
					placeholder="?q=brand:nike&f.brand=nike&sort=price_asc"
				/>
			</label>
			<div class="flex gap-2">
				<Button variant="secondary" size="sm" onclick={copyUrl}>Serialize</Button>
				<Button variant="primary" size="sm" onclick={applyUrl}>Apply from URL</Button>
			</div>
		</div>
		{#if urlPreview}
			<p class="font-mono text-[11px] text-muted">{urlPreview}</p>
		{/if}
	{/if}

	<div class="grid gap-4 lg:grid-cols-[16rem_1fr]">
		<FacetPanel
			groups={facetGroups}
			facets={filters.facets}
			price={filters.price}
			onchangefacets={(facets) => patch({ facets })}
			onchangeprice={(price) => patch({ price })}
			onclear={() => patch({ facets: {}, price: undefined })}
		/>

		{#if filtered.length}
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{#each filtered as product (product.id)}
					<ProductCard
						title={product.title}
						subtitle={product.subtitle}
						image={product.image}
						price={product.price}
						compareAt={product.compareAt}
						currency={product.currency ?? 'EUR'}
						badge={product.badge}
						rating={product.rating}
						reviews={product.reviews}
						onadd={() => onadd?.(product.id)}
					/>
				{/each}
			</div>
		{:else}
			<EmptyState title="No products" description="Try adjusting filters or clearing the query." />
		{/if}
	</div>
</div>
