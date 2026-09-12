<script module lang="ts">
	export type PricingLayout =
		| 'grid'
		| 'horizontal'
		| 'vertical'
		| 'bento'
		| 'compact'
		| 'split'
		| 'table'
		| 'list'
		| 'compare';

	export type PricingFeature =
		| string
		| {
				label: string;
				included?: boolean;
				hint?: string;
		  };

	export interface PricingPlan {
		id: string;
		name: string;
		price: string;
		/** Yearly price when billing toggle is yearly */
		priceYearly?: string;
		/** Struck-through list price (optional) */
		compareAtPrice?: string;
		period?: string;
		periodYearly?: string;
		/** Small hint under the price (e.g. savings) */
		priceNote?: string;
		description?: string;
		features: PricingFeature[];
		cta?: string;
		featured?: boolean;
		badge?: string;
		disabled?: boolean;
		/** Bento cell span override */
		span?: 1 | 2;
	}

	/** Explicit comparison matrix row (optional; table layout can auto-build) */
	export interface PricingComparisonRow {
		id: string;
		label: string;
		/** One value per plan, in the same order as `plans` */
		values: (boolean | string)[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';

	interface PricingTableProps {
		plans?: PricingPlan[];
		layout?: PricingLayout;
		/** Grid columns (grid/compact). Auto from plan count when omitted. */
		columns?: 2 | 3 | 4;
		selectedId?: string;
		featuredBadgeLabel?: string;
		showFeatures?: boolean;
		maxFeatures?: number;
		/** Show monthly/yearly toggle when plans have priceYearly */
		showBillingToggle?: boolean;
		billingPeriod?: 'monthly' | 'yearly';
		billingLabels?: { monthly?: string; yearly?: string };
		/** Explicit feature matrix for compare/list/table (auto-built when omitted) */
		comparisonRows?: PricingComparisonRow[];
		/** Append comparison matrix below card layouts */
		showComparison?: boolean;
		class?: string;
		footer?: Snippet;
		onselect?: (id: string) => void;
		onbillingperiodchange?: (period: 'monthly' | 'yearly') => void;
	}

	let {
		plans = [],
		layout = 'grid',
		columns,
		selectedId = $bindable(''),
		featuredBadgeLabel = 'Popular',
		showFeatures = true,
		maxFeatures,
		showBillingToggle = false,
		billingPeriod = $bindable<'monthly' | 'yearly'>('monthly'),
		billingLabels,
		comparisonRows,
		showComparison = false,
		class: className = '',
		footer,
		onselect,
		onbillingperiodchange
	}: PricingTableProps = $props();

	const isCompareLayout = $derived(
		layout === 'table' || layout === 'list' || layout === 'compare'
	);

	const resolvedColumns = $derived.by(() => {
		if (columns) return columns;
		const n = plans.length;
		if (n <= 2) return 2 as const;
		if (n >= 4) return 4 as const;
		return 3 as const;
	});

	const gridCols: Record<2 | 3 | 4, string> = {
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-2 xl:grid-cols-4'
	};

	const containerClass = $derived.by(() => {
		switch (layout) {
			case 'horizontal':
				return 'flex items-stretch gap-4 overflow-x-auto pb-2 snap-x snap-mandatory';
			case 'vertical':
				return 'flex flex-col gap-3';
			case 'bento':
				return 'grid gap-4 md:grid-cols-4 md:auto-rows-fr';
			case 'compact':
				return ['grid gap-3', gridCols[resolvedColumns]];
			case 'split':
				return 'grid gap-4 lg:grid-cols-[1.15fr_0.85fr]';
			case 'grid':
			default:
				return ['grid gap-4', gridCols[resolvedColumns]];
		}
	});

	const featuredPlan = $derived(plans.find((p) => p.featured) ?? plans[0]);
	const sidePlans = $derived(
		layout === 'split' ? plans.filter((p) => p.id !== featuredPlan?.id) : plans
	);

	function normalizePeriod(period?: string) {
		if (!period) return '';
		const cleaned = period.replace(/^\/+/, '');
		return cleaned ? `/${cleaned}` : '';
	}

	function displayPrice(plan: PricingPlan) {
		if (billingPeriod === 'yearly' && plan.priceYearly) return plan.priceYearly;
		return plan.price;
	}

	function displayPeriod(plan: PricingPlan) {
		if (billingPeriod === 'yearly' && plan.priceYearly) {
			return normalizePeriod(plan.periodYearly ?? 'yr');
		}
		return normalizePeriod(plan.period);
	}

	const canToggleBilling = $derived(
		showBillingToggle && plans.some((p) => Boolean(p.priceYearly))
	);

	function featureList(plan: PricingPlan) {
		const list = plan.features.map((f) =>
			typeof f === 'string' ? { label: f, included: true as boolean | undefined } : f
		);
		if (maxFeatures != null && list.length > maxFeatures) {
			return {
				visible: list.slice(0, maxFeatures),
				more: list.length - maxFeatures
			};
		}
		return { visible: list, more: 0 };
	}

	function planFeatureMap(plan: PricingPlan) {
		const map = new Map<string, boolean | string>();
		for (const f of plan.features) {
			if (typeof f === 'string') map.set(f, true);
			else map.set(f.label, f.included === false ? false : true);
		}
		return map;
	}

	const resolvedComparisonRows = $derived.by((): PricingComparisonRow[] => {
		if (comparisonRows?.length) return comparisonRows;

		const labels: string[] = [];
		const seen = new Set<string>();
		for (const plan of plans) {
			for (const f of plan.features) {
				const label = typeof f === 'string' ? f : f.label;
				if (!seen.has(label)) {
					seen.add(label);
					labels.push(label);
				}
			}
		}

		const maps = plans.map(planFeatureMap);
		return labels.map((label, i) => ({
			id: `feat-${i}-${label}`,
			label,
			values: maps.map((m) => m.get(label) ?? false)
		}));
	});

	const showMatrix = $derived(isCompareLayout || showComparison);

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		selectedId = id;
		onselect?.(id);
	}

	function cardShell(plan: PricingPlan, dense = false) {
		const selected = selectedId === plan.id;
		const featured = !!plan.featured;
		return [
			'flex h-full flex-col rounded-2xl border transition-[box-shadow,border-color,transform] duration-200',
			dense ? 'p-4' : 'p-5',
			featured
				? 'border-brand-500 bg-brand-50/50 shadow-lg dark:bg-brand-950/20'
				: 'border-border bg-surface-elevated',
			selected && !featured && 'ring-2 ring-brand-500/40 border-brand-400',
			plan.disabled && 'opacity-50'
		];
	}

	function bentoSpan(plan: PricingPlan) {
		const featured = plan.span === 2 || (!plan.span && plan.featured);
		if (featured) return 'md:col-span-2 md:row-span-2';
		return 'md:col-span-2';
	}

	function onBillingChange(id: string) {
		billingPeriod = id as 'monthly' | 'yearly';
		onbillingperiodchange?.(billingPeriod);
	}

	/** Selection chrome only on the plan header — never paint feature rows. */
	function planHeaderClass(plan: PricingPlan) {
		const selected = selectedId === plan.id;
		return [
			plan.featured && !selected && 'bg-brand-50/40 dark:bg-brand-950/15',
			selected && 'bg-surface-elevated'
		];
	}
</script>

{#snippet priceBlock(plan: PricingPlan, opts?: { large?: boolean; dense?: boolean; align?: 'left' | 'center' | 'right' })}
	{@const large = opts?.large ?? false}
	{@const dense = opts?.dense ?? false}
	{@const align = opts?.align ?? 'left'}
	<div
		class={[
			align === 'center' && 'text-center',
			align === 'right' && 'text-right'
		]}
	>
		{#if plan.compareAtPrice}
			<p class={['text-muted line-through', dense ? 'text-[11px]' : 'text-xs']}>
				{plan.compareAtPrice}
			</p>
		{/if}
		<p>
			<span
				class={[
					'font-semibold text-primary',
					large ? 'text-4xl' : dense ? 'text-2xl' : 'text-3xl'
				]}
			>
				{displayPrice(plan)}
			</span>
			{#if displayPeriod(plan)}
				<span class="text-sm text-muted">{displayPeriod(plan)}</span>
			{/if}
		</p>
		{#if plan.priceNote}
			<p class={['mt-1 font-medium text-brand-600 dark:text-brand-400', dense ? 'text-[11px]' : 'text-xs']}>
				{plan.priceNote}
			</p>
		{/if}
	</div>
{/snippet}

{#snippet featureRows(plan: PricingPlan, dense = false)}
	{@const { visible, more } = featureList(plan)}
	{#if showFeatures && visible.length}
		<ul class={dense ? 'space-y-1.5' : 'space-y-2'}>
			{#each visible as feature (feature.label)}
				<li
					class={[
						'flex items-start gap-2 text-secondary',
						dense ? 'text-xs' : 'text-sm',
						feature.included === false && 'text-muted line-through'
					]}
				>
					<span
						class={[
							'mt-0.5 shrink-0',
							feature.included === false
								? 'text-muted'
								: 'text-brand-600 dark:text-brand-400'
						]}
						aria-hidden="true"
					>
						{feature.included === false ? '–' : '✓'}
					</span>
					<span>
						{feature.label}
						{#if feature.hint}
							<span class="block text-[11px] text-muted no-underline">{feature.hint}</span>
						{/if}
					</span>
				</li>
			{/each}
			{#if more > 0}
				<li class="text-xs text-muted">+{more} more</li>
			{/if}
		</ul>
	{/if}
{/snippet}

{#snippet planCard(plan: PricingPlan, opts?: { dense?: boolean; horizontal?: boolean; large?: boolean })}
	{@const dense = opts?.dense ?? false}
	{@const horizontal = opts?.horizontal ?? false}
	{@const large = opts?.large ?? false}
	{@const badgeText = plan.badge ?? (plan.featured ? featuredBadgeLabel : undefined)}

	{#if horizontal}
		<div class={cardShell(plan, true)}>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="min-w-0 flex-1 space-y-1">
					<div class="flex flex-wrap items-center gap-2">
						<p class="text-sm font-semibold text-primary">{plan.name}</p>
						{#if badgeText}
							<Badge size="sm" variant="primary" class="shrink-0 whitespace-nowrap">
								{badgeText}
							</Badge>
						{/if}
					</div>
					{#if plan.description}
						<p class="text-xs text-secondary">{plan.description}</p>
					{/if}
					{#if showFeatures}
						<div class="pt-2">
							{@render featureRows(plan, true)}
						</div>
					{/if}
				</div>
				<div class="flex shrink-0 flex-col items-stretch gap-3 sm:w-44 sm:items-stretch">
					{@render priceBlock(plan, { large, dense: true, align: 'right' })}
					<Button
						variant={plan.featured || selectedId === plan.id ? 'primary' : 'secondary'}
						size="sm"
						disabled={plan.disabled}
						onclick={() => select(plan.id, plan.disabled)}
					>
						{plan.cta ?? 'Get started'}
					</Button>
				</div>
			</div>
		</div>
	{:else}
		<div class={cardShell(plan, dense)}>
			<div class={['flex items-start justify-between gap-2', dense ? 'mb-3' : 'mb-4']}>
				<div class="min-w-0">
					<p class={['font-semibold text-primary', large ? 'text-base' : 'text-sm']}>
						{plan.name}
					</p>
					{#if plan.description}
						<p class={['mt-1 text-secondary', dense ? 'text-[11px]' : 'text-xs']}>
							{plan.description}
						</p>
					{/if}
				</div>
				{#if badgeText}
					<Badge size="sm" variant="primary" class="shrink-0 whitespace-nowrap">
						{badgeText}
					</Badge>
				{/if}
			</div>

			<div class={dense ? 'mb-3' : 'mb-4'}>
				{@render priceBlock(plan, { large, dense })}
			</div>

			<div class="mb-auto flex-1">
				{@render featureRows(plan, dense)}
			</div>

			<div class={['shrink-0', dense ? 'pt-3' : 'pt-6']}>
				<Button
					variant={plan.featured || selectedId === plan.id ? 'primary' : 'secondary'}
					fullWidth
					size={dense ? 'sm' : 'md'}
					disabled={plan.disabled}
					onclick={() => select(plan.id, plan.disabled)}
				>
					{plan.cta ?? 'Get started'}
				</Button>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet matrixCell(value: boolean | string)}
	{#if typeof value === 'boolean'}
		{#if value}
			<span
				class="inline-flex text-brand-600 dark:text-brand-400"
				aria-label="Included"
			>
				<Check class="mx-auto h-4 w-4" strokeWidth={2.75} aria-hidden="true" />
			</span>
		{:else}
			<span class="inline-flex text-muted" aria-label="Not included">
				<X class="mx-auto h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
			</span>
		{/if}
	{:else}
		<span class="text-sm font-medium text-primary">{value}</span>
	{/if}
{/snippet}

{#snippet comparisonTable(withPricingHeader: boolean)}
	<div class="w-full overflow-x-auto rounded-xl border border-border bg-surface-elevated">
		<table class="w-full min-w-160 border-collapse text-sm" aria-label="Plan feature comparison">
			<thead class="sticky top-0 z-30">
				{#if withPricingHeader}
					<tr class="border-b border-border bg-surface-elevated shadow-sm">
						<th
							scope="col"
							class="sticky left-0 z-40 bg-surface-elevated px-4 py-4 text-left align-bottom"
						>
							<span class="text-muted text-[11px] font-semibold tracking-wide uppercase">
								Incluye
							</span>
						</th>
						{#each plans as plan (plan.id)}
							{@const badgeText =
								plan.badge ?? (plan.featured ? featuredBadgeLabel : undefined)}
							{@const selected = selectedId === plan.id}
							<th
								scope="col"
								class={[
									'min-w-40 px-3 py-4 text-center align-top font-normal',
									planHeaderClass(plan)
								]}
							>
								<button
									type="button"
									class={[
										'flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-2 text-center transition-colors',
										selected
											? 'border-border-strong bg-surface-overlay ring-2 ring-border'
											: 'border-transparent',
										!plan.disabled && !selected && 'hover:border-border hover:bg-surface-overlay/40',
										plan.disabled && 'cursor-not-allowed opacity-50'
									]}
									disabled={plan.disabled}
									aria-pressed={selected}
									onclick={() => select(plan.id, plan.disabled)}
								>
									<div class="flex min-h-6 flex-wrap items-center justify-center gap-1.5">
										<span class="text-sm font-semibold text-primary">{plan.name}</span>
										{#if badgeText}
											<Badge
												size="sm"
												variant={selected ? 'default' : 'primary'}
												class="whitespace-nowrap"
											>
												{badgeText}
											</Badge>
										{/if}
									</div>
									{#if plan.description}
										<p class="line-clamp-2 max-w-44 text-xs leading-snug text-secondary">
											{plan.description}
										</p>
									{/if}
									{@render priceBlock(plan, { dense: true, align: 'center' })}
									<span
										class={[
											'inline-flex h-8 w-full max-w-40 items-center justify-center rounded-lg px-3 text-xs font-medium',
											selected
												? 'bg-surface-overlay text-primary ring-2 ring-border-strong'
												: plan.featured
													? 'bg-brand-600 text-white'
													: 'bg-surface-overlay text-primary ring-1 ring-border'
										]}
									>
										{plan.cta ?? 'Select'}
									</span>
								</button>
							</th>
						{/each}
					</tr>
				{:else}
					<tr class="border-b border-border bg-surface/80">
						<th
							scope="col"
							class="sticky left-0 z-40 bg-surface px-4 py-2.5 text-left"
						></th>
						{#each plans as plan (plan.id)}
							{@const selected = selectedId === plan.id}
							<th
								scope="col"
								class={[
									'px-3 py-2.5 text-center text-xs font-semibold text-secondary',
									planHeaderClass(plan)
								]}
							>
								<button
									type="button"
									class={[
										'w-full rounded-lg border px-2 py-1 transition-colors',
										selected
											? 'border-border-strong bg-surface-overlay text-primary ring-2 ring-border'
											: 'border-transparent hover:bg-surface-overlay/60'
									]}
									disabled={plan.disabled}
									aria-pressed={selected}
									onclick={() => select(plan.id, plan.disabled)}
								>
									{plan.name}
								</button>
							</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each resolvedComparisonRows as row, ri (row.id)}
					<tr
						class={[
							'border-b border-border last:border-b-0',
							ri % 2 === 1 && 'bg-surface-overlay/25'
						]}
					>
						<th
							scope="row"
							class={[
								'sticky left-0 z-10 border-r border-border px-4 py-3 text-left text-sm font-medium text-primary',
								ri % 2 === 1 ? 'bg-surface-overlay/40' : 'bg-surface-elevated'
							]}
						>
							{row.label}
						</th>
						{#each row.values as value, vi (`${row.id}-${plans[vi]?.id ?? vi}`)}
							<td class="px-3 py-3 text-center">
								{@render matrixCell(value)}
							</td>
						{/each}
					</tr>
				{:else}
					<tr>
						<td
							class="text-muted px-4 py-8 text-center text-sm"
							colspan={Math.max(plans.length, 1) + 1}
						>
							Sin características para comparar.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<div class={['w-full space-y-4', className]}>
	{#if canToggleBilling}
		<div class="flex justify-center">
			<SegmentedControl
				size="sm"
				items={[
					{ id: 'monthly', label: billingLabels?.monthly ?? 'Monthly' },
					{ id: 'yearly', label: billingLabels?.yearly ?? 'Yearly' }
				]}
				bind:value={billingPeriod}
				onchange={onBillingChange}
			/>
		</div>
	{/if}

	{#if plans.length === 0}
		<p class="text-muted rounded-xl border border-border bg-surface-elevated px-4 py-8 text-center text-sm">
			No hay tarifas disponibles para este periodo.
		</p>
	{:else if isCompareLayout}
		{@render comparisonTable(true)}
	{:else if layout === 'split' && featuredPlan}
		<div class={containerClass} role="list">
			<div role="listitem" class="h-full min-w-0">
				{@render planCard(featuredPlan, { large: true })}
			</div>
			<div class="flex min-w-0 flex-col gap-3" role="list">
				{#each sidePlans as plan (plan.id)}
					<div role="listitem">
						{@render planCard(plan, { horizontal: true, dense: true })}
					</div>
				{/each}
			</div>
		</div>
	{:else if layout === 'bento'}
		<div class={containerClass} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem" class={['h-full', bentoSpan(plan)]}>
					{@render planCard(plan, { large: !!plan.featured, dense: !plan.featured })}
				</div>
			{/each}
		</div>
	{:else if layout === 'horizontal'}
		<div class={containerClass} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem" class="h-auto min-w-72 w-72 shrink-0 snap-start self-stretch">
					{@render planCard(plan)}
				</div>
			{/each}
		</div>
	{:else if layout === 'vertical'}
		<div class={containerClass} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem">
					{@render planCard(plan, { horizontal: true })}
				</div>
			{/each}
		</div>
	{:else}
		<!-- grid | compact -->
		<div class={['items-stretch', containerClass]} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem" class="h-full min-w-0">
					{@render planCard(plan, { dense: layout === 'compact' })}
				</div>
			{/each}
		</div>
	{/if}

	{#if showMatrix && !isCompareLayout}
		<div class="pt-2">
			{@render comparisonTable(false)}
		</div>
	{/if}

	{#if footer}
		<div class="text-center text-xs text-muted">
			{@render footer()}
		</div>
	{/if}
</div>
