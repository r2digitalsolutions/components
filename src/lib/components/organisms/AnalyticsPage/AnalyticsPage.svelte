<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import MetricGrid from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import AreaLineChart from '$lib/components/molecules/AreaLineChart/AreaLineChart.svelte';
	import type { AreaLinePoint } from '$lib/components/molecules/AreaLineChart/AreaLineChart.svelte';
	import DonutChart from '$lib/components/molecules/DonutChart/DonutChart.svelte';
	import type { DonutSlice } from '$lib/components/molecules/DonutChart/DonutChart.svelte';
	import HorizontalBarChart from '$lib/components/molecules/HorizontalBarChart/HorizontalBarChart.svelte';
	import type { HBarPoint } from '$lib/components/molecules/HorizontalBarChart/HorizontalBarChart.svelte';
	import BarChart from '$lib/components/molecules/BarChart/BarChart.svelte';
	import type { BarChartPoint } from '$lib/components/molecules/BarChart/BarChart.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import type { SegmentItem } from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import LogViewer from '$lib/components/molecules/LogViewer/LogViewer.svelte';
	import type { LogEntry } from '$lib/components/molecules/LogViewer/LogViewer.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Download from '@lucide/svelte/icons/download';
	import TrendingUp from '@lucide/svelte/icons/trending-up';

	export interface AnalyticsInsight {
		id: string;
		title: string;
		detail: string;
		tone?: 'info' | 'success' | 'warning';
	}

	interface AnalyticsPageProps {
		title?: string;
		description?: string;
		metrics?: MetricItem[];
		/** Primary trend series (sessions / revenue / etc.) */
		series?: AreaLinePoint[];
		seriesLabel?: string;
		seriesUnit?: string;
		sources?: DonutSlice[];
		topPages?: HBarPoint[];
		/** Secondary bar series (e.g. conversions by day) */
		secondarySeries?: BarChartPoint[];
		secondaryLabel?: string;
		insights?: AnalyticsInsight[];
		logs?: LogEntry[];
		period?: string;
		periods?: SegmentItem[];
		updatedLabel?: string;
		live?: boolean;
		empty?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		actions?: Snippet;
		onperiodchange?: (period: string) => void;
		onexport?: () => void;
	}

	let {
		title = 'Analytics',
		description = 'Product and revenue metrics for the selected range.',
		metrics = [
			{
				id: '1',
				label: 'Sessions',
				value: '48.2k',
				delta: '+8.2%',
				trend: 'up',
				description: 'vs previous period'
			},
			{
				id: '2',
				label: 'Conversion',
				value: '3.4%',
				delta: '+0.2%',
				trend: 'up',
				description: 'checkout → paid'
			},
			{
				id: '3',
				label: 'Bounce rate',
				value: '41%',
				delta: '−1.1%',
				trend: 'down',
				description: 'lower is better'
			},
			{
				id: '4',
				label: 'Revenue',
				value: '$12.8k',
				delta: '+5.4%',
				trend: 'up',
				description: 'net of refunds'
			}
		],
		series = [
			{ label: 'Mon', value: 42 },
			{ label: 'Tue', value: 55 },
			{ label: 'Wed', value: 48 },
			{ label: 'Thu', value: 70 },
			{ label: 'Fri', value: 63 },
			{ label: 'Sat', value: 40 },
			{ label: 'Sun', value: 36 }
		],
		seriesLabel = 'Sessions',
		seriesUnit = 'k',
		sources = [
			{ label: 'Direct', value: 38 },
			{ label: 'Search', value: 29 },
			{ label: 'Social', value: 18 },
			{ label: 'Referral', value: 15 }
		],
		topPages = [
			{ label: '/pricing', value: 8420 },
			{ label: '/docs', value: 6210 },
			{ label: '/blog', value: 4180 },
			{ label: '/signup', value: 2940 },
			{ label: '/changelog', value: 1820 }
		],
		secondarySeries = [
			{ label: 'Mon', value: 12 },
			{ label: 'Tue', value: 18 },
			{ label: 'Wed', value: 15 },
			{ label: 'Thu', value: 24 },
			{ label: 'Fri', value: 21 },
			{ label: 'Sat', value: 9 },
			{ label: 'Sun', value: 7 }
		],
		secondaryLabel = 'Conversions',
		insights = [
			{
				id: '1',
				title: 'Search traffic up 14%',
				detail: 'Organic landing pages are driving more qualified sessions.',
				tone: 'success'
			},
			{
				id: '2',
				title: 'Checkout drop-off at step 2',
				detail: 'Payment method selection shows a 12% abandon rate.',
				tone: 'warning'
			},
			{
				id: '3',
				title: 'Peak hours: 10–12 CET',
				detail: 'Schedule campaigns and deploys outside this window.',
				tone: 'info'
			}
		],
		logs = [],
		period = $bindable('7d'),
		periods = [
			{ id: '24h', label: '24h' },
			{ id: '7d', label: '7d' },
			{ id: '30d', label: '30d' },
			{ id: '90d', label: '90d' }
		],
		updatedLabel = 'Updated 2m ago',
		live = true,
		empty = false,
		emptyTitle = 'No analytics yet',
		emptyDescription = 'Connect a data source or wait for traffic to populate this page.',
		class: className = '',
		actions,
		onperiodchange,
		onexport
	}: AnalyticsPageProps = $props();

	const periodLabel = $derived(periods.find((p) => p.id === period)?.label ?? period);

	const toneClass: Record<NonNullable<AnalyticsInsight['tone']>, string> = {
		info: 'bg-sky-500',
		success: 'bg-emerald-500',
		warning: 'bg-amber-500'
	};
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2">
				{#if live}
					<Badge variant="success" size="sm" rounded dot>Live</Badge>
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
				{#if onexport}
					<Button size="sm" variant="secondary" onclick={() => onexport?.()}>
						<Download class="h-3.5 w-3.5" strokeWidth={2} />
						Export
					</Button>
				{/if}
				{#if actions}
					{@render actions()}
				{/if}
			</div>
		{/snippet}
	</PageHeader>

	{#if empty}
		<Card padding="lg" chrome={false}>
			<EmptyState title={emptyTitle} description={emptyDescription} />
		</Card>
	{:else}
		{#if metrics.length}
			<MetricGrid items={metrics} cols={4} />
		{/if}

		<!-- Primary charts -->
		<div class="grid gap-4 lg:grid-cols-5">
			<Card class="min-w-0 lg:col-span-3" padding="lg" chrome={false}>
				{#snippet header()}
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<p class="text-sm font-semibold text-primary">{seriesLabel}</p>
							<p class="text-[11px] text-muted">Trend · last {periodLabel}</p>
						</div>
						<span
							class="inline-flex items-center gap-1 rounded-lg bg-brand-500/10 px-2 py-1 text-[11px] font-medium text-brand-600 dark:text-brand-400"
						>
							<TrendingUp class="h-3 w-3" strokeWidth={2.5} />
							Trend
						</span>
					</div>
				{/snippet}
				<AreaLineChart data={series} height={220} unit={seriesUnit} />
			</Card>

			<Card class="min-w-0 lg:col-span-2" padding="lg" chrome={false}>
				{#snippet header()}
					<div>
						<p class="text-sm font-semibold text-primary">Traffic sources</p>
						<p class="text-[11px] text-muted">Share of sessions</p>
					</div>
				{/snippet}
				<DonutChart data={sources} size={160} thickness={26} centerLabel="Sessions" unit="%" />
			</Card>
		</div>

		<!-- Secondary charts + insights -->
		<div class="grid gap-4 lg:grid-cols-5">
			<Card class="min-w-0 lg:col-span-2" padding="lg" chrome={false}>
				{#snippet header()}
					<div>
						<p class="text-sm font-semibold text-primary">Top pages</p>
						<p class="text-[11px] text-muted">By pageviews</p>
					</div>
				{/snippet}
				{#if topPages.length}
					<HorizontalBarChart data={topPages} />
				{:else}
					<p class="text-sm text-muted">No page data for this range.</p>
				{/if}
			</Card>

			<Card class="min-w-0 lg:col-span-2" padding="lg" chrome={false}>
				{#snippet header()}
					<div>
						<p class="text-sm font-semibold text-primary">{secondaryLabel}</p>
						<p class="text-[11px] text-muted">Daily · last {periodLabel}</p>
					</div>
				{/snippet}
				{#if secondarySeries.length}
					<BarChart data={secondarySeries} height={200} />
				{:else}
					<p class="text-sm text-muted">No conversion data for this range.</p>
				{/if}
			</Card>

			<Card class="min-w-0 lg:col-span-1" padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Insights</p>
				{/snippet}
				{#if insights.length}
					<ul class="space-y-3">
						{#each insights as insight (insight.id)}
							<li class="space-y-1">
								<div class="flex items-start gap-2">
									<span
										class={[
											'mt-0.5 h-2 w-2 shrink-0 rounded-full',
											toneClass[insight.tone ?? 'info']
										]}
										aria-hidden="true"
									></span>
									<div class="min-w-0">
										<p class="text-xs font-semibold leading-snug text-primary">{insight.title}</p>
										<p class="mt-0.5 text-[11px] leading-relaxed text-muted">{insight.detail}</p>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-muted">No insights yet.</p>
				{/if}
			</Card>
		</div>

		{#if logs.length}
			<Card padding="none" chrome={false} class="overflow-hidden">
				{#snippet header()}
					<div class="px-4 pt-4 sm:px-5">
						<p class="text-sm font-semibold text-primary">Pipeline activity</p>
						<p class="text-[11px] text-muted">Recent ingest and job events</p>
					</div>
				{/snippet}
				<div class="px-2 pb-2 sm:px-3 sm:pb-3">
					<LogViewer entries={logs} class="border-0 shadow-none" />
				</div>
			</Card>
		{/if}
	{/if}
</div>
