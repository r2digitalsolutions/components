<script module lang="ts">
	export type PricingLayout =
		| 'grid'
		| 'horizontal'
		| 'vertical'
		| 'bento'
		| 'compact'
		| 'split';

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
				return 'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory';
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
		<ul class={['flex-1', dense ? 'space-y-1.5' : 'space-y-2']}>
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
							<Badge size="sm" variant="primary">{badgeText}</Badge>
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
				<div class="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
					<p>
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
		<div class={[cardShell(plan, dense), large && 'justify-center']}>
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
					<Badge size="sm" variant="primary">{badgeText}</Badge>
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

			<div class={dense ? 'mb-4' : 'mb-6'}>
				{@render featureRows(plan, dense)}
			</div>

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
	{/if}
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

	{#if layout === 'split' && featuredPlan}
		<div class={containerClass} role="list">
			<div role="listitem" class="min-w-0">
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
				<div role="listitem" class={bentoSpan(plan)}>
					{@render planCard(plan, { large: !!plan.featured, dense: !plan.featured })}
				</div>
			{/each}
		</div>
	{:else if layout === 'horizontal'}
		<div class={containerClass} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem" class="min-w-72 w-72 shrink-0 snap-start">
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
		<div class={containerClass} role="list">
			{#each plans as plan (plan.id)}
				<div role="listitem" class="min-w-0">
					{@render planCard(plan, { dense: layout === 'compact' })}
				</div>
			{/each}
		</div>
	{/if}

	{#if footer}
		<div class="text-center text-xs text-muted">
			{@render footer()}
		</div>
	{/if}
</div>
