<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import MetricGrid from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import type { SegmentItem } from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	export type DashboardPeriod = string;

	interface DashboardPageProps {
		title?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		metrics?: MetricItem[];
		metricCols?: 2 | 3 | 4;
		/** Period control value (e.g. 7d / 30d / 90d) */
		period?: DashboardPeriod;
		periods?: SegmentItem[];
		/** Shown near the header — e.g. “Updated 2m ago” */
		updatedLabel?: string;
		statusLabel?: string;
		empty?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		actions?: Snippet;
		/** Main content column (charts, tables) */
		primary?: Snippet;
		/** Right rail widgets */
		secondary?: Snippet;
		/** Full-width row below the main grid */
		footer?: Snippet;
		children?: Snippet;
		onperiodchange?: (period: string) => void;
	}

	let {
		title = 'Dashboard',
		description = 'Overview of your workspace activity.',
		breadcrumbs = [],
		metrics = [],
		metricCols = 4,
		period = $bindable('30d'),
		periods = [
			{ id: '7d', label: '7d' },
			{ id: '30d', label: '30d' },
			{ id: '90d', label: '90d' }
		],
		updatedLabel,
		statusLabel,
		empty = false,
		emptyTitle = 'Nothing here yet',
		emptyDescription = 'Connect a data source to populate this dashboard.',
		class: className = '',
		actions,
		primary,
		secondary,
		footer,
		children,
		onperiodchange
	}: DashboardPageProps = $props();

	const hasBody = $derived(!!children || !!primary || !!secondary || !!footer);
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2">
				{#if statusLabel}
					<Badge variant="success" size="sm" rounded dot>{statusLabel}</Badge>
				{/if}
				{#if updatedLabel}
					<span class="text-xs text-muted">{updatedLabel}</span>
				{/if}
			</div>
		{/snippet}
		{#snippet actions()}
			<div class="flex flex-wrap items-center gap-2">
				{#if periods.length}
					<SegmentedControl
						items={periods}
						bind:value={period}
						size="sm"
						onchange={(id) => onperiodchange?.(id)}
					/>
				{/if}
				{#if actions}
					{@render actions()}
				{/if}
			</div>
		{/snippet}
	</PageHeader>

	{#if metrics.length}
		<MetricGrid items={metrics} cols={metricCols} />
	{/if}

	{#if empty}
		<Card padding="lg" chrome={false}>
			<EmptyState title={emptyTitle} description={emptyDescription} />
		</Card>
	{:else if children}
		{@render children()}
	{:else if hasBody}
		<div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
			<div class="min-w-0 space-y-4">
				{#if primary}
					{@render primary()}
				{/if}
			</div>
			{#if secondary}
				<aside class="min-w-0 space-y-4">
					{@render secondary()}
				</aside>
			{/if}
		</div>
		{#if footer}
			<div class="space-y-4">
				{@render footer()}
			</div>
		{/if}
	{:else}
		<div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
			<Card class="min-w-0" padding="lg" chrome={false}>
				{#snippet header()}
					<div class="flex items-center justify-between gap-3">
						<p class="text-sm font-semibold text-primary">Performance</p>
						<span class="text-xs text-muted">Last {period}</span>
					</div>
				{/snippet}
				<p class="text-sm text-muted">
					Pass <code class="font-mono text-xs">primary</code> /
					<code class="font-mono text-xs">secondary</code> snippets to compose charts and widgets.
				</p>
			</Card>
			<Card padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Quick actions</p>
				{/snippet}
				<ul class="space-y-2 text-sm text-secondary">
					<li>Invite teammates</li>
					<li>Create a project</li>
					<li>View billing</li>
				</ul>
			</Card>
		</div>
	{/if}
</div>
