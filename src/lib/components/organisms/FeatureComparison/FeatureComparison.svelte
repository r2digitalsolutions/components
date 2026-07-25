<script module lang="ts">
	export interface FeatureRow {
		id: string;
		label: string;
		values: (boolean | string)[];
		group?: string;
	}

	export interface FeatureComparisonPlan {
		id: string;
		name: string;
		price?: string;
		period?: string;
		description?: string;
		cta?: string;
		featured?: boolean;
		badge?: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface FeatureComparisonProps {
		/** Simple string headers, or rich plan columns */
		plans?: (string | FeatureComparisonPlan)[];
		features?: FeatureRow[];
		featuredBadgeLabel?: string;
		class?: string;
		onselect?: (id: string) => void;
	}

	let {
		plans = [],
		features = [],
		featuredBadgeLabel = 'Popular',
		class: className = '',
		onselect
	}: FeatureComparisonProps = $props();

	const resolvedPlans = $derived(
		plans.map((p, i) =>
			typeof p === 'string'
				? ({ id: `plan-${i}`, name: p } satisfies FeatureComparisonPlan)
				: p
		)
	);

	const hasRichHeader = $derived(
		resolvedPlans.some((p) => p.price || p.cta || p.description)
	);

	const grouped = $derived.by(() => {
		const groups: { label: string | null; rows: FeatureRow[] }[] = [];
		for (const row of features) {
			const key = row.group ?? null;
			const last = groups[groups.length - 1];
			if (last && last.label === key) last.rows.push(row);
			else groups.push({ label: key, rows: [row] });
		}
		return groups;
	});

	const colCount = $derived(Math.max(resolvedPlans.length, 1));
	const labelCol = 'minmax(10rem, 13rem)';
	const planCols = $derived(`repeat(${colCount}, minmax(9rem, 1fr))`);
	const matrixCols = $derived(`${labelCol} ${planCols}`);

	function normalizePeriod(period?: string) {
		if (!period) return '';
		const cleaned = period.replace(/^\/+/, '');
		return cleaned ? `/${cleaned}` : '';
	}
</script>

{#snippet cell(value: boolean | string)}
	{#if typeof value === 'boolean'}
		{#if value}
			<span class="inline-flex text-brand-600 dark:text-brand-400" aria-label="Included">
				<svg
					class="mx-auto h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					aria-hidden="true"
				>
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

<div
	class={[
		'w-full overflow-x-auto rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	{#if hasRichHeader}
		<div
			class="grid min-w-xl divide-x divide-border border-b border-border"
			style:grid-template-columns={matrixCols}
		>
			<!-- Spacer so plan cards share the same columns as the matrix below -->
			<div class="bg-surface-overlay/30" aria-hidden="true"></div>
			{#each resolvedPlans as plan (plan.id)}
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
					{#if plan.description}
						<p class="mt-1 min-h-8 max-w-40 text-xs leading-snug text-secondary">
							{plan.description}
						</p>
					{/if}
					{#if plan.price}
						<p class="mt-3">
							<span class="text-2xl font-semibold tracking-tight text-primary">{plan.price}</span>
							{#if plan.period}
								<span class="text-xs text-muted">{normalizePeriod(plan.period)}</span>
							{/if}
						</p>
					{/if}
					{#if plan.cta && onselect}
						<Button
							variant={plan.featured ? 'primary' : 'secondary'}
							size="sm"
							class="mt-4 w-full max-w-36"
							disabled={plan.disabled}
							onclick={() => onselect?.(plan.id)}
						>
							{plan.cta}
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div
		class="border-b border-border bg-surface-overlay/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted"
	>
		What's included
	</div>

	<div class="min-w-xl" role="table" aria-label="Feature comparison">
		<div
			class="grid divide-x divide-border border-b border-border bg-surface-overlay/40"
			style:grid-template-columns={matrixCols}
			role="row"
		>
			<div
				class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted"
				role="columnheader"
			>
				{hasRichHeader ? '' : 'Feature'}
			</div>
			{#each resolvedPlans as plan (plan.id)}
				<div
					class={[
						'px-4 py-3 text-center text-sm font-semibold text-primary',
						plan.featured && 'bg-brand-50/50 dark:bg-brand-950/15'
					]}
					role="columnheader"
				>
					{plan.name}
				</div>
			{/each}
		</div>

		{#each grouped as group, gi (group.label ?? `g-${gi}`)}
			{#if group.label}
				<div
					class="border-b border-border bg-surface-overlay/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted"
					role="row"
				>
					{group.label}
				</div>
			{/if}
			{#each group.rows as row, ri (row.id)}
				<div
					class={[
						'grid divide-x divide-border border-b border-border last:border-b-0',
						!group.label && ri % 2 === 1 && 'bg-surface-overlay/20'
					]}
					style:grid-template-columns={matrixCols}
					role="row"
				>
					<div class="flex items-center px-4 py-3.5 text-sm font-medium text-primary" role="rowheader">
						{row.label}
					</div>
					{#each row.values as value, vi}
						{@const plan = resolvedPlans[vi]}
						<div
							class={[
								'flex items-center justify-center px-4 py-3.5 text-center',
								plan?.featured && 'bg-brand-50/30 dark:bg-brand-950/10'
							]}
							role="cell"
						>
							{@render cell(value)}
						</div>
					{/each}
				</div>
			{/each}
		{/each}
	</div>
</div>
