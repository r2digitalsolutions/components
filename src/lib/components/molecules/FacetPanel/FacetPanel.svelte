<script lang="ts">
	import type { Snippet } from 'svelte';
	import FacetGroup from '$lib/components/molecules/FacetGroup/FacetGroup.svelte';
	import type { FacetOption } from '$lib/components/molecules/FacetGroup/FacetGroup.svelte';
	import RangeSlider from '$lib/components/atoms/RangeSlider/RangeSlider.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { CatalogPriceRange } from '$lib/utils/filterParams.js';

	export interface FacetGroupDef {
		id: string;
		title: string;
		options: FacetOption[];
		multiple?: boolean;
		limit?: number;
	}

	interface FacetPanelProps {
		title?: string;
		groups?: FacetGroupDef[];
		facets?: Record<string, string[]>;
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
		onchangefacets?: (facets: Record<string, string[]>) => void;
		onchangeprice?: (price: CatalogPriceRange | undefined) => void;
	}

	let {
		title = 'Filters',
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
		onchangefacets,
		onchangeprice
	}: FacetPanelProps = $props();

	const priceValue = $derived<[number, number]>([
		price?.min ?? priceMin,
		price?.max ?? priceMax
	]);

	const hasActive = $derived(
		Object.values(facets).some((v) => v.length > 0) ||
			price?.min !== undefined ||
			price?.max !== undefined
	);

	function setGroup(groupId: string, value: string[]) {
		const next = { ...facets };
		if (value.length) next[groupId] = value;
		else delete next[groupId];
		facets = next;
		onchangefacets?.(next);
	}

	function onPriceInput(value: [number, number]) {
		const next: CatalogPriceRange = {};
		if (value[0] > priceMin) next.min = value[0];
		if (value[1] < priceMax) next.max = value[1];
		price = next.min !== undefined || next.max !== undefined ? next : undefined;
		onchangeprice?.(price);
	}

	function clearAll() {
		facets = {};
		price = undefined;
		onclear?.();
		onchangefacets?.({});
		onchangeprice?.(undefined);
	}
</script>

<aside
	class={[
		'w-full rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="mb-3 flex items-center justify-between gap-2">
		{#if collapsible}
			<button
				type="button"
				class="flex flex-1 items-center justify-between text-left text-sm font-semibold text-primary"
				aria-expanded={!collapsed}
				onclick={() => (collapsed = !collapsed)}
			>
				{title}
				<svg
					class={['h-4 w-4 text-muted transition-transform', collapsed ? '' : 'rotate-180']}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		{:else}
			<h2 class="text-sm font-semibold text-primary">{title}</h2>
		{/if}
		{#if hasActive}
			<Button variant="ghost" size="xs" onclick={clearAll}>{clearLabel}</Button>
		{/if}
	</div>

	{#if !collapsed}
		<div class="space-y-5">
			{#if showPrice}
				<div class="space-y-2">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted">Price</p>
					<RangeSlider
						min={priceMin}
						max={priceMax}
						step={priceStep}
						unit={priceUnit}
						size="sm"
						value={priceValue}
						oninput={onPriceInput}
						onchange={onPriceInput}
					/>
				</div>
			{/if}

			{#each groups as group (group.id)}
				<FacetGroup
					id={group.id}
					title={group.title}
					options={group.options}
					multiple={group.multiple ?? true}
					limit={group.limit ?? 6}
					value={facets[group.id] ?? []}
					onchange={(v) => setGroup(group.id, v)}
				/>
			{/each}

			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</aside>
