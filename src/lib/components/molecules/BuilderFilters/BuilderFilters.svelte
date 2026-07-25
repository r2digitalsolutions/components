<script lang="ts">
	import FacetGroup from '$lib/components/molecules/FacetGroup/FacetGroup.svelte';
	import RangeSlider from '$lib/components/atoms/RangeSlider/RangeSlider.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		clearFilterValues,
		countActiveFilters,
		groupFilterSchema,
		type FilterFieldSchema,
		type FilterValues,
		type FilterValue
	} from '$lib/utils/filterSchema.js';

	interface BuilderFiltersProps {
		/** JSON/schema that drives all controls — no hardcoded binds per field */
		schema?: FilterFieldSchema[];
		/** Single values bag keyed by field id */
		values?: FilterValues;
		title?: string;
		clearLabel?: string;
		collapsible?: boolean;
		collapsed?: boolean;
		class?: string;
		onchange?: (values: FilterValues) => void;
		onclear?: () => void;
	}

	let {
		schema = [],
		values = $bindable({} as FilterValues),
		title = 'Filters',
		clearLabel = 'Clear all',
		collapsible = false,
		collapsed = $bindable(false),
		class: className = '',
		onchange,
		onclear
	}: BuilderFiltersProps = $props();

	const groups = $derived(groupFilterSchema(schema));
	const activeCount = $derived(countActiveFilters(schema, values));

	function setValue(id: string, value: FilterValue) {
		const next = { ...values, [id]: value };
		// Drop empty arrays / undefined to keep the bag clean
		if (
			value === undefined ||
			value === null ||
			value === false ||
			(Array.isArray(value) && value.length === 0)
		) {
			if (Array.isArray(value) && value.length === 0) next[id] = [];
			else if (value === false) next[id] = false;
			else delete next[id];
		}
		values = next;
		onchange?.(next);
	}

	function asStringList(value: FilterValue): string[] {
		if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
			return value as string[];
		}
		if (typeof value === 'string' && value) return [value];
		return [];
	}

	function asRange(
		field: FilterFieldSchema,
		value: FilterValue
	): [number, number] {
		const min = field.min ?? 0;
		const max = field.max ?? 100;
		if (
			Array.isArray(value) &&
			value.length === 2 &&
			typeof value[0] === 'number' &&
			typeof value[1] === 'number'
		) {
			return [value[0], value[1]];
		}
		return [min, max];
	}

	function onRange(field: FilterFieldSchema, next: [number, number]) {
		const min = field.min ?? 0;
		const max = field.max ?? 100;
		if (next[0] <= min && next[1] >= max) {
			setValue(field.id, undefined);
			return;
		}
		setValue(field.id, next);
	}

	function clearAll() {
		values = clearFilterValues(schema, values);
		onclear?.();
		onchange?.(values);
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
				<span>
					{title}
					{#if activeCount}
						<span class="ml-1 text-xs font-medium text-muted">({activeCount})</span>
					{/if}
				</span>
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
			<h2 class="text-sm font-semibold text-primary">
				{title}
				{#if activeCount}
					<span class="ml-1 text-xs font-medium text-muted">({activeCount})</span>
				{/if}
			</h2>
		{/if}
		{#if activeCount}
			<Button variant="ghost" size="xs" onclick={clearAll}>{clearLabel}</Button>
		{/if}
	</div>

	{#if !collapsed}
		<div class="space-y-5">
			{#each groups as group (group.category ?? '__root')}
				{#if group.category}
					<p class="text-[11px] font-semibold uppercase tracking-wider text-muted">
						{group.category}
					</p>
				{/if}

				{#each group.fields as field (field.id)}
					{#if field.type === 'checkbox' || field.type === 'radio'}
						<FacetGroup
							id={field.id}
							title={field.label}
							options={field.options ?? []}
							multiple={field.type === 'checkbox' ? (field.multiple ?? true) : false}
							limit={field.limit ?? 6}
							value={asStringList(values[field.id])}
							onchange={(v) =>
								setValue(field.id, field.type === 'radio' ? (v[0] ?? undefined) : v)}
						/>
					{:else if field.type === 'range'}
						<div class="space-y-2">
							<p class="text-xs font-semibold uppercase tracking-wide text-muted">
								{field.label}
							</p>
							<RangeSlider
								min={field.min ?? 0}
								max={field.max ?? 100}
								step={field.step ?? 1}
								unit={field.unit ?? ''}
								size="sm"
								value={asRange(field, values[field.id])}
								oninput={(v) => onRange(field, v)}
								onchange={(v) => onRange(field, v)}
							/>
						</div>
					{:else if field.type === 'toggle'}
						<div class="flex items-center justify-between gap-3">
							<span class="text-sm text-secondary">{field.label}</span>
							<Toggle
								checked={Boolean(values[field.id])}
								onchange={(checked) => setValue(field.id, checked)}
							/>
						</div>
					{:else if field.type === 'rating'}
						<div class="space-y-2">
							<p class="text-xs font-semibold uppercase tracking-wide text-muted">
								{field.label}
							</p>
							<Rating
								value={typeof values[field.id] === 'number' ? (values[field.id] as number) : 0}
								max={field.maxRating ?? 5}
								onchange={(v) => setValue(field.id, v || undefined)}
							/>
						</div>
					{:else if field.type === 'select'}
						<Select
							label={field.label}
							size="sm"
							placeholder={field.label}
							options={(field.options ?? []).map((o) => ({
								value: o.id,
								label: o.label,
								disabled: o.disabled
							}))}
							value={typeof values[field.id] === 'string' ? (values[field.id] as string) : ''}
							onchange={(v) => setValue(field.id, v || undefined)}
						/>
					{/if}
				{/each}
			{/each}

			{#if !schema.length}
				<p class="text-xs text-muted">Pass a <code class="text-primary">schema</code> JSON to render filters.</p>
			{/if}
		</div>
	{/if}
</aside>
