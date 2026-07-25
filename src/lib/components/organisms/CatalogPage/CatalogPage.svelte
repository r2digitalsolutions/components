<script lang="ts">
	import QueryBar from '$lib/components/molecules/QueryBar/QueryBar.svelte';
	import SortSelect from '$lib/components/molecules/SortSelect/SortSelect.svelte';
	import FacetPanel from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import type { FacetGroupDef } from '$lib/components/molecules/FacetPanel/FacetPanel.svelte';
	import AdvancedFilters from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';
	import type { FilterFieldDef } from '$lib/utils/advancedFilters.js';
	import ProductCard from '$lib/components/molecules/ProductCard/ProductCard.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		asFilterGroup,
		createEmptyFilterState,
		filterParamsToSearch,
		flattenRules,
		formatRuleLabel,
		matchGroup,
		parseFilterParams,
		type AdvancedFilterGroup,
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
		/** Preferred: schema JSON for automatic filter UI */
		filterSchema?: FilterFieldSchema[];
		/** @deprecated Prefer filterSchema */
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
		filterSchema = [],
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
		if (field === 'name') return p.title;
		if (field === 'title') return p.title;
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
					clear: () => {
						const next = { ...bag, [field.id]: undefined };
						onFilterValues(next);
					}
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
		for (const rule of flattenRules(asFilterGroup(filters.advanced))) {
			chips.push({
				id: rule.id,
				label: formatRuleLabel(rule, fields),
				clear: () => {
					const root = asFilterGroup(filters.advanced);
					patch({ advanced: removeRuleFromGroup(root, rule.id) });
				}
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

		const advanced = asFilterGroup(filters.advanced);
		if (advanced.rules.length) {
			list = list.filter((p) =>
				matchGroup(advanced, (fieldId) => productField(p, fieldId))
			);
		}
		const sort = filters.sort ?? 'relevance';
		if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
		else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
		else if (sort === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		else if (sort === 'newest') list = list.reverse();
		return list;
	});

	function removeRuleFromGroup(group: AdvancedFilterGroup, ruleId: string): AdvancedFilterGroup {
		return {
			...group,
			rules: group.rules
				.filter((n) => n.id !== ruleId)
				.map((n) => (n.type === 'group' ? removeRuleFromGroup(n, ruleId) : n))
		};
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
				query={asFilterGroup(filters.advanced)}
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
			schema={resolvedSchema}
			values={filters.values ?? {}}
			onchange={onFilterValues}
			onclear={() => onFilterValues(clearFilterValues(resolvedSchema, filters.values ?? {}))}
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
