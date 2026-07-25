<script module lang="ts">
	export type PricingLayout =
		| 'grid'
		| 'horizontal'
		| 'vertical'
		| 'bento'
		| 'compact'
		| 'split'
		| 'table';

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
		period?: string;
		periodYearly?: string;
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
		/** Explicit feature matrix for `layout="table"` (auto-built when omitted) */
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
		comparisonRows,
		showComparison = false,
		class: className = '',
		footer,
		onselect,
		onbillingperiodchange
	}: PricingTableProps = $props();

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
		if (billingPeriod === 'yearly') {
			return normalizePeriod(plan.periodYearly ?? 'yr');
		}
		return normalizePeriod(plan.period);
	}

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

	const showMatrix = $derived(layout === 'table' || showComparison);

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
</script>

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
				<div class="flex shrink-0 flex-col items-stretch gap-3 sm:w-40 sm:items-stretch">
					<p class="sm:text-right">
						<span class={['font-semibold text-primary', large ? 'text-4xl' : 'text-2xl']}>
							{displayPrice(plan)}
						</span>
						{#if displayPeriod(plan)}
							<span class="text-sm text-muted">{displayPeriod(plan)}</span>
						{/if}
					</p>
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

			<p class={dense ? 'mb-3' : 'mb-4'}>
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
			<span class="inline-flex text-brand-600 dark:text-brand-400" aria-label="Included">
				<svg class="mx-auto h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			</span>
		{:else}
			<span class="text-muted" aria-label="Not included">—</span>
		{/if}
	{:else}
		<span class="text-sm font-medium text-primary">{value}</span>
	{/if}
{/snippet}

{#snippet comparisonTable(withPricingHeader: boolean)}
	{@const colCount = Math.max(plans.length, 1)}
	{@const labelCol = 'minmax(10rem, 13rem)'}
	{@const planCols = `repeat(${colCount}, minmax(9rem, 1fr))`}
	{@const matrixCols = `${labelCol} ${planCols}`}
	<div class="w-full overflow-x-auto rounded-2xl border border-border bg-surface-elevated shadow-sm">
		{#if withPricingHeader}
			<!-- Same column template as matrix rows so cards line up with values -->
			<div
				class="grid min-w-160 divide-x divide-border border-b border-border"
				style:grid-template-columns={matrixCols}
			>
				<div class="bg-surface-overlay/30" aria-hidden="true"></div>
				{#each plans as plan (plan.id)}
					{@const badgeText = plan.badge ?? (plan.featured ? featuredBadgeLabel : undefined)}
					<div
						class={[
							'flex flex-col items-center px-4 py-6 text-center',
							plan.featured && 'bg-brand-50/70 dark:bg-brand-950/25'
						]}
					>
						<div class="flex min-h-6 flex-wrap items-center justify-center gap-1.5">
							<span class="text-sm font-semibold text-primary">{plan.name}</span>
							{#if badgeText}
								<Badge size="sm" variant="primary" class="whitespace-nowrap">{badgeText}</Badge>
							{/if}
						</div>
						<p class="mt-1 min-h-8 max-w-44 text-xs leading-snug text-secondary">
							{plan.description ?? '\u00a0'}
						</p>
						<p class="mt-3">
							<span class="text-3xl font-semibold tracking-tight text-primary">
								{displayPrice(plan)}
							</span>
							{#if displayPeriod(plan)}
								<span class="text-xs text-muted">{displayPeriod(plan)}</span>
							{/if}
						</p>
						<Button
							variant={plan.featured || selectedId === plan.id ? 'primary' : 'secondary'}
							size="sm"
							class="mt-4 w-full max-w-40"
							disabled={plan.disabled}
							onclick={() => select(plan.id, plan.disabled)}
						>
							{plan.cta ?? 'Get started'}
						</Button>
					</div>
				{/each}
			</div>
		{/if}

		<div
			class="border-b border-border bg-surface-overlay/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted"
		>
			What's included
		</div>

		<div class="min-w-160" role="table" aria-label="Plan feature comparison">
			<div
				class="grid divide-x divide-border border-b border-border bg-surface/80"
				style:grid-template-columns={matrixCols}
				role="row"
			>
				<div class="px-4 py-2.5" role="columnheader"></div>
				{#each plans as plan (plan.id)}
					<div
						class={[
							'px-4 py-2.5 text-center text-xs font-semibold text-secondary',
							plan.featured && 'bg-brand-50/40 text-brand-700 dark:bg-brand-950/15 dark:text-brand-300'
						]}
						role="columnheader"
					>
						{plan.name}
					</div>
				{/each}
			</div>

			{#each resolvedComparisonRows as row, ri (row.id)}
				<div
					class={[
						'grid divide-x divide-border border-b border-border last:border-b-0',
						ri % 2 === 1 && 'bg-surface-overlay/20'
					]}
					style:grid-template-columns={matrixCols}
					role="row"
				>
					<div
						class="flex items-center px-4 py-3.5 text-sm font-medium text-primary"
						role="rowheader"
					>
						{row.label}
					</div>
					{#each row.values as value, vi}
						{@const plan = plans[vi]}
						<div
							class={[
								'flex items-center justify-center px-4 py-3.5 text-center',
								plan?.featured && 'bg-brand-50/30 dark:bg-brand-950/10'
							]}
							role="cell"
						>
							{@render matrixCell(value)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class={['w-full space-y-4', className]}>
	{#if showBillingToggle}
		<div class="flex justify-center">
			<SegmentedControl
				size="sm"
				items={[
					{ id: 'monthly', label: 'Monthly' },
					{ id: 'yearly', label: 'Yearly' }
				]}
				bind:value={billingPeriod}
				onchange={onBillingChange}
			/>
		</div>
	{/if}

	{#if layout === 'table'}
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

	{#if showMatrix && layout !== 'table'}
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
