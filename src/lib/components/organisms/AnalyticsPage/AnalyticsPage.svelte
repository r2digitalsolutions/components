<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import MetricGrid from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import Chart from '$lib/components/molecules/Chart/Chart.svelte';
	import type { ChartPoint } from '$lib/components/molecules/Chart/Chart.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import LogViewer from '$lib/components/molecules/LogViewer/LogViewer.svelte';
	import type { LogEntry } from '$lib/components/molecules/LogViewer/LogViewer.svelte';
	import Sparkline from '$lib/components/atoms/Sparkline/Sparkline.svelte';

	interface AnalyticsPageProps {
		title?: string;
		metrics?: MetricItem[];
		series?: ChartPoint[];
		logs?: LogEntry[];
		query?: string;
		filters?: FilterChip[];
		class?: string;
		actions?: Snippet;
	}

	let {
		title = 'Analytics',
		metrics = [
			{ id: '1', label: 'Sessions', value: '48.2k', delta: '+8%', trend: 'up' },
			{ id: '2', label: 'Conversion', value: '3.4%', delta: '+0.2%', trend: 'up' },
			{ id: '3', label: 'Bounce', value: '41%', delta: '-1.1%', trend: 'down' },
			{ id: '4', label: 'Revenue', value: '$12.8k', delta: '+5%', trend: 'up' }
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
		logs = [],
		query = $bindable(''),
		filters = $bindable<FilterChip[]>([{ id: '7d', label: 'Last 7 days' }]),
		class: className = '',
		actions
	}: AnalyticsPageProps = $props();
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader {title} description="Product and revenue metrics for the selected range.">
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{:else}
				<Sparkline data={[3, 5, 4, 7, 8, 6, 9]} width={88} height={28} />
			{/if}
		{/snippet}
	</PageHeader>

	<FilterBar bind:query bind:filters placeholder="Filter metrics…" />

	<MetricGrid items={metrics} cols={4} />

	<div class="grid gap-4 lg:grid-cols-5">
		<Card class="lg:col-span-3" padding="lg" chrome={false}>
			{#snippet header()}
				<p class="text-sm font-semibold text-primary">Sessions</p>
			{/snippet}
			<Chart type="line" data={series} />
		</Card>
		<Card class="lg:col-span-2" padding="lg" chrome={false}>
			{#snippet header()}
				<p class="text-sm font-semibold text-primary">Traffic sources</p>
			{/snippet}
			<Chart
				type="donut"
				data={[
					{ label: 'Direct', value: 38 },
					{ label: 'Search', value: 29 },
					{ label: 'Social', value: 18 },
					{ label: 'Referral', value: 15 }
				]}
			/>
		</Card>
	</div>

	{#if logs.length}
		<LogViewer entries={logs} />
	{/if}
</div>
