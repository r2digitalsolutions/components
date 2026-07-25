<script lang="ts">
	import type { Snippet } from 'svelte';
	import BuilderFilters from '$lib/components/molecules/BuilderFilters/BuilderFilters.svelte';
	import type { CatalogPriceRange } from '$lib/utils/filterParams.js';
	import {
		type FilterFieldSchema,
		type FilterOption,
		type FilterValues
	} from '$lib/utils/filterSchema.js';

	/** @deprecated Prefer `FilterFieldSchema` in `schema` */
	export interface FacetGroupDef {
		id: string;
		title: string;
		options: FilterOption[];
		multiple?: boolean;
		limit?: number;
		category?: string;
	}

	interface FacetPanelProps {
		title?: string;
		/**
		 * Preferred: schema JSON that auto-renders via BuilderFilters.
		 * Pair with `bind:values` — one bag for all fields.
		 */
		schema?: FilterFieldSchema[];
		values?: FilterValues;
		/** @deprecated Prefer `schema` + `values` */
		groups?: FacetGroupDef[];
		/** @deprecated Prefer `values` */
		facets?: Record<string, string[]>;
		/** @deprecated Prefer a `range` field in `schema` */
		price?: CatalogPriceRange;
		priceMin?: number;
		priceMax?: number;
		priceStep?: number;
		priceUnit?: string;
		showPrice?: boolean;
		collapsible?: boolean;
		collapsed?: boolean;
		clearLabel?: string;
		class?: string;
		children?: Snippet;
		onclear?: () => void;
		onchange?: (values: FilterValues) => void;
		/** @deprecated */
		onchangefacets?: (facets: Record<string, string[]>) => void;
		/** @deprecated */
		onchangeprice?: (price: CatalogPriceRange | undefined) => void;
	}

	let {
		title = 'Filters',
		schema,
		values = $bindable({} as FilterValues),
		groups = [],
		facets = $bindable({} as Record<string, string[]>),
		price = $bindable<CatalogPriceRange | undefined>(undefined),
		priceMin = 0,
		priceMax = 500,
		priceStep = 1,
		priceUnit = '€',
		showPrice = true,
		collapsible = false,
		collapsed = $bindable(false),
		clearLabel = 'Clear all',
		class: className = '',
		children,
		onclear,
		onchange,
		onchangefacets,
		onchangeprice
	}: FacetPanelProps = $props();

	const useSchemaApi = $derived(Boolean(schema?.length));

	const resolvedSchema = $derived.by((): FilterFieldSchema[] => {
		if (schema?.length) return schema;
		const fields: FilterFieldSchema[] = [];
		if (showPrice) {
			fields.push({
				id: 'price',
				label: 'Price',
				type: 'range',
				min: priceMin,
				max: priceMax,
				step: priceStep,
				unit: priceUnit
			});
		}
		for (const g of groups) {
			fields.push({
				id: g.id,
				label: g.title,
				type: g.multiple === false ? 'radio' : 'checkbox',
				category: g.category,
				options: g.options,
				multiple: g.multiple ?? true,
				limit: g.limit
			});
		}
		return fields;
	});

	function legacyToValues(): FilterValues {
		const next: FilterValues = {};
		for (const [id, list] of Object.entries(facets)) next[id] = [...list];
		if (showPrice && (price?.min !== undefined || price?.max !== undefined)) {
			next.price = [price?.min ?? priceMin, price?.max ?? priceMax];
		}
		return next;
	}

	function valuesToLegacy(next: FilterValues) {
		const nextFacets: Record<string, string[]> = {};
		for (const [id, value] of Object.entries(next)) {
			if (id === 'price') continue;
			if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
				if (value.length) nextFacets[id] = value as string[];
			} else if (typeof value === 'string' && value) {
				nextFacets[id] = [value];
			}
		}
		facets = nextFacets;
		onchangefacets?.(nextFacets);

		const range = next.price;
		if (
			Array.isArray(range) &&
			range.length === 2 &&
			typeof range[0] === 'number' &&
			typeof range[1] === 'number'
		) {
			const p: CatalogPriceRange = {};
			if (range[0] > priceMin) p.min = range[0];
			if (range[1] < priceMax) p.max = range[1];
			price = p.min !== undefined || p.max !== undefined ? p : undefined;
		} else {
			price = undefined;
		}
		onchangeprice?.(price);
	}

	let legacyValues = $state<FilterValues>({});

	$effect(() => {
		if (useSchemaApi) return;
		legacyValues = legacyToValues();
	});

	function onValuesChange(next: FilterValues) {
		if (useSchemaApi) {
			values = next;
			onchange?.(next);
			return;
		}
		legacyValues = next;
		valuesToLegacy(next);
		onchange?.(next);
	}
</script>

<div class={className}>
	{#if useSchemaApi}
		<BuilderFilters
			schema={resolvedSchema}
			bind:values
			{title}
			{clearLabel}
			{collapsible}
			bind:collapsed
			onchange={onValuesChange}
			onclear={() => onclear?.()}
		/>
	{:else}
		<BuilderFilters
			schema={resolvedSchema}
			bind:values={legacyValues}
			{title}
			{clearLabel}
			{collapsible}
			bind:collapsed
			onchange={onValuesChange}
			onclear={() => onclear?.()}
		/>
	{/if}
	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
</div>
