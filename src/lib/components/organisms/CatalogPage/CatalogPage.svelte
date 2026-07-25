<script lang="ts">
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import SortSelect from '$lib/components/molecules/SortSelect/SortSelect.svelte';
	import FacetPanel from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import type { FacetGroupDef } from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import ProductCard from '$lib/components/molecules/ProductCard/ProductCard.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import {
		createEmptyFilterState,
		type CatalogFilterState
	} from '$lib/utils/filterParams.js';
	import type { FilterFieldSchema, FilterValues } from '$lib/utils/filterSchema.js';
	import { clearFilterValues, isFilterValueActive } from '$lib/utils/filterSchema.js';

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
		/** Schema JSON for automatic filter UI */
		filterSchema?: FilterFieldSchema[];
		/** @deprecated Prefer filterSchema */
		facetGroups?: FacetGroupDef[];
		state?: CatalogFilterState;
		title?: string;
		searchPlaceholder?: string;
		class?: string;
		onstatechange?: (state: CatalogFilterState) => void;
		onadd?: (id: string) => void;
	}

	let {
		products = [],
		filterSchema = [],
		facetGroups = [],
		state: filters = $bindable(createEmptyFilterState()),
		title = 'Catalog',
		searchPlaceholder = 'Search products…',
		class: className = '',
		onstatechange,
		onadd
	}: CatalogPageProps = $props();

	const resolvedSchema = $derived.by((): FilterFieldSchema[] => {
		if (filterSchema.length) return filterSchema;
		const fieldsFromGroups: FilterFieldSchema[] = [
			{ id: 'price', label: 'Price', type: 'range', min: 0, max: 300, unit: '€' }
		];
		for (const g of facetGroups) {
			fieldsFromGroups.push({
				id: g.id,
				label: g.title,
				type: g.multiple === false ? 'radio' : 'checkbox',
				options: g.options,
				multiple: g.multiple ?? true,
				limit: g.limit
			});
		}
		return fieldsFromGroups;
	});

	function emit(next: CatalogFilterState) {
		filters = next;
		onstatechange?.(next);
	}

	function patch(partial: Partial<CatalogFilterState>) {
		emit({
			...filters,
			...partial,
			facets: partial.facets ?? filters.facets,
			advanced: partial.advanced ?? filters.advanced,
			values: partial.values ?? filters.values ?? {}
		});
	}

	function onFilterValues(next: FilterValues) {
		const facets: Record<string, string[]> = {};
		let price: CatalogFilterState['price'];
		for (const [id, value] of Object.entries(next)) {
			if (id === 'price' && Array.isArray(value) && typeof value[0] === 'number') {
				price = { min: value[0] as number, max: value[1] as number };
				continue;
			}
			if (Array.isArray(value) && value.every((v) => typeof v === 'string') && value.length) {
				facets[id] = value as string[];
			} else if (typeof value === 'string' && value) {
				facets[id] = [value];
			}
		}
		patch({ values: next, facets, price });
	}

	function productField(
		p: CatalogProduct,
		field: string
	): string | number | string[] | boolean | undefined {
		if (field === 'brand') return p.brand;
		if (field === 'color') return p.color;
		if (field === 'price') return p.price;
		if (field === 'tags') return p.tags;
		if (field === 'name' || field === 'title') return p.title;
		if (field === 'rating') return p.rating;
		return undefined;
	}

	const activeChips = $derived.by(() => {
		const chips: { id: string; label: string; clear: () => void }[] = [];
		const bag = filters.values ?? {};
		for (const field of resolvedSchema) {
			const value = bag[field.id];
			if (value === undefined || value === null || value === false || value === '') continue;
			if (field.type === 'range' && Array.isArray(value)) {
				chips.push({
					id: field.id,
					label: `${field.label} ${value[0]}–${value[1]}`,
					clear: () => onFilterValues({ ...bag, [field.id]: undefined })
				});
				continue;
			}
			if (Array.isArray(value)) {
				for (const v of value as string[]) {
					const opt = field.options?.find((o) => o.id === v);
					chips.push({
						id: `${field.id}:${v}`,
						label: `${field.label}: ${opt?.label ?? v}`,
						clear: () => {
							const list = (bag[field.id] as string[]).filter((x) => x !== v);
							onFilterValues({ ...bag, [field.id]: list });
						}
					});
				}
				continue;
			}
			if (typeof value === 'string' || typeof value === 'number' || value === true) {
				const opt = field.options?.find((o) => o.id === String(value));
				chips.push({
					id: field.id,
					label: `${field.label}: ${opt?.label ?? value}`,
					clear: () => onFilterValues({ ...bag, [field.id]: undefined })
				});
			}
		}
		return chips;
	});

	const filtered = $derived.by(() => {
		let list = [...products];
		const q = filters.q.trim().toLowerCase();
		if (q) {
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.subtitle?.toLowerCase().includes(q) ||
					p.brand?.toLowerCase().includes(q) ||
					(p.tags ?? []).some((t) => t.toLowerCase().includes(q))
			);
		}

		const bag = filters.values ?? {};
		for (const field of resolvedSchema) {
			const value = bag[field.id];
			if (!isFilterValueActive(field, value)) continue;

			if (field.type === 'range' && Array.isArray(value)) {
				const [min, max] = value as [number, number];
				list = list.filter((p) => p.price >= min && p.price <= max);
				continue;
			}

			if (field.type === 'rating' && typeof value === 'number') {
				list = list.filter((p) => (p.rating ?? 0) >= value);
				continue;
			}

			if (field.type === 'toggle' && value === true) {
				if (field.id === 'sale') {
					list = list.filter((p) => (p.tags ?? []).includes('sale') || Boolean(p.compareAt));
				}
				continue;
			}

			const selected = Array.isArray(value)
				? (value as string[])
				: typeof value === 'string'
					? [value]
					: [];
			if (!selected.length) continue;

			list = list.filter((p) => {
				if (field.id === 'brand') return selected.includes(p.brand ?? '');
				if (field.id === 'color') return selected.includes(p.color ?? '');
				if (field.id === 'tags') return selected.some((v) => (p.tags ?? []).includes(v));
				const raw = productField(p, field.id);
				if (Array.isArray(raw)) return selected.some((v) => raw.includes(v));
				return selected.includes(String(raw ?? ''));
			});
		}

		const sort = filters.sort ?? 'relevance';
		if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
		else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
		else if (sort === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		else if (sort === 'newest') list = list.reverse();
		return list;
	});

	function clearAll() {
		emit(createEmptyFilterState({ sort: filters.sort }));
	}
</script>

<div class={['w-full space-y-5', className]}>
	<div class="space-y-3">
		<div class="flex flex-wrap items-end justify-between gap-3">
			<div class="min-w-0">
				<h1 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{title}</h1>
				<p class="text-sm text-muted">
					<span class="font-medium tabular-nums text-primary">{filtered.length}</span>
					of {products.length} products
					{#if filters.q.trim()}
						for “{filters.q.trim()}”
					{/if}
				</p>
			</div>
			<SortSelect value={filters.sort ?? 'relevance'} onchange={(v) => patch({ sort: v })} />
		</div>

		<SearchBar
			value={filters.q}
			placeholder={searchPlaceholder}
			size="lg"
			variant="soft"
			showButton={false}
			oninput={(q) => patch({ q })}
			onsubmit={(q) => patch({ q })}
			onclear={() => patch({ q: '' })}
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
	</div>

	<div class="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
		<aside class="min-w-0">
			<FacetPanel
				schema={resolvedSchema}
				values={filters.values ?? {}}
				onchange={onFilterValues}
				onclear={() => onFilterValues(clearFilterValues(resolvedSchema, filters.values ?? {}))}
			/>
		</aside>

		<section class="min-w-0">
			{#if filtered.length}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{#each filtered as product (product.id)}
						<ProductCard
							title={product.title}
							subtitle={product.subtitle}
							brand={product.brand}
							image={product.image}
							price={product.price}
							compareAt={product.compareAt}
							currency={product.currency ?? 'EUR'}
							badge={product.badge}
							rating={product.rating}
							reviews={product.reviews}
							wishlist
							onadd={() => onadd?.(product.id)}
						/>
					{/each}
				</div>
			{:else}
				<EmptyState
					title="No products"
					description="Try adjusting filters or clearing the search."
				/>
			{/if}
		</section>
	</div>
</div>
