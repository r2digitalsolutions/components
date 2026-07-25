<script lang="ts">
	import DashboardPage from './DashboardPage.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import AreaLineChart from '$lib/components/molecules/AreaLineChart/AreaLineChart.svelte';
	import DonutChart from '$lib/components/molecules/DonutChart/DonutChart.svelte';
	import ActivityFeed from '$lib/components/organisms/ActivityFeed/ActivityFeed.svelte';
	import type { ActivityItem } from '$lib/components/organisms/ActivityFeed/ActivityFeed.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';

	let {
		empty = false
	}: {
		empty?: boolean;
	} = $props();

	let period = $state('30d');

	const metrics: MetricItem[] = [
		{
			id: 'm1',
			label: 'MRR',
			value: '$24.8k',
			delta: '+6.2%',
			trend: 'up',
			description: 'vs previous period'
		},
		{
			id: 'm2',
			label: 'Active users',
			value: '3,912',
			delta: '+118',
			trend: 'up',
			description: 'Daily active'
		},
		{
			id: 'm3',
			label: 'Conversion',
			value: '4.8%',
			delta: '-0.2%',
			trend: 'down',
			description: 'Trial → paid'
		},
		{
			id: 'm4',
			label: 'Open tickets',
			value: '27',
			delta: 'stable',
			trend: 'neutral',
			badge: 'Support'
		}
	];

	const revenue = [
		{ label: 'Week 1', value: 18.2 },
		{ label: 'Week 2', value: 19.4 },
		{ label: 'Week 3', value: 21.1 },
		{ label: 'Week 4', value: 20.6 },
		{ label: 'Week 5', value: 22.8 },
		{ label: 'Week 6', value: 24.8 }
	];

	const channels = [
		{ label: 'Product', value: 42, color: 'var(--color-brand-500, #6366f1)' },
		{ label: 'Sales', value: 28, color: '#22c55e' },
		{ label: 'Partners', value: 18, color: '#f59e0b' },
		{ label: 'Other', value: 12, color: '#0ea5e9' }
	];

	const activity: ActivityItem[] = [
		{
			id: '1',
			actor: 'Ada Lovelace',
			action: 'published',
			target: 'Billing v2',
			date: Date.now() - 1000 * 60 * 12,
			type: 'success',
			tags: ['Release']
		},
		{
			id: '2',
			actor: 'Alan Turing',
			action: 'commented on',
			target: 'API keys rotation',
			date: Date.now() - 1000 * 60 * 55,
			type: 'info'
		},
		{
			id: '3',
			actor: 'Grace Hopper',
			action: 'invited',
			target: '3 teammates',
			date: Date.now() - 1000 * 60 * 60 * 5,
			type: 'default'
		},
		{
			id: '4',
			actor: 'System',
			action: 'flagged',
			target: 'elevated error rate',
			date: Date.now() - 1000 * 60 * 60 * 9,
			type: 'warning',
			meta: 'eu-west-1'
		}
	];

	const projects = [
		{ id: '1', name: 'Checkout redesign', owner: 'Ada', progress: 72, status: 'On track' },
		{ id: '2', name: 'Mobile auth', owner: 'Grace', progress: 44, status: 'At risk' },
		{ id: '3', name: 'Docs portal', owner: 'Alan', progress: 88, status: 'On track' }
	];
</script>

<div class="min-h-dvh w-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
	<DashboardPage
		title="Workspace overview"
		description="Revenue, engagement, and delivery health for your team."
		breadcrumbs={[
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'dash', label: 'Dashboard' }
		]}
		{metrics}
		bind:period
		updatedLabel="Updated 2 minutes ago"
		statusLabel="Live"
		{empty}
	>
		{#snippet actions()}
			<Button size="sm" variant="secondary">Export</Button>
			<Button size="sm">New project</Button>
		{/snippet}

		{#snippet primary()}
			<Card padding="lg" chrome={false} class="overflow-hidden">
				{#snippet header()}
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<p class="text-sm font-semibold text-primary">Revenue</p>
							<p class="text-xs text-muted">MRR trajectory · last {period}</p>
						</div>
						<Badge variant="success" size="sm" rounded>+6.2%</Badge>
					</div>
				{/snippet}
				<AreaLineChart data={revenue} height={220} unit="k" showDots interactive />
			</Card>

			<Card padding="none" chrome={false} class="overflow-hidden">
				{#snippet header()}
					<div class="flex items-center justify-between gap-2 px-5 pt-4">
						<p class="text-sm font-semibold text-primary">Active projects</p>
						<button type="button" class="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
							View all
						</button>
					</div>
				{/snippet}
				<ul class="divide-y divide-border">
					{#each projects as project}
						<li class="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-primary">{project.name}</p>
								<p class="text-xs text-muted">Owner · {project.owner}</p>
							</div>
							<div class="w-full sm:w-40">
								<ProgressBar value={project.progress} size="sm" />
							</div>
							<Badge
								size="sm"
								rounded
								variant={project.status === 'On track' ? 'success' : 'warning'}
							>
								{project.status}
							</Badge>
						</li>
					{/each}
				</ul>
			</Card>
		{/snippet}

		{#snippet secondary()}
			<Card padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Acquisition</p>
				{/snippet}
				<DonutChart
					data={channels}
					size={160}
					thickness={26}
					centerLabel="Share"
					showLegend
				/>
			</Card>

			<Card padding="lg" chrome={false}>
				{#snippet header()}
					<div class="flex items-center justify-between gap-2">
						<p class="text-sm font-semibold text-primary">Activity</p>
						<span class="text-[11px] text-muted">Today</span>
					</div>
				{/snippet}
				<ActivityFeed items={activity} size="sm" maxHeight="16rem" />
			</Card>

			<Card padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Quick actions</p>
				{/snippet}
				<div class="space-y-2">
					<Button variant="secondary" size="sm" fullWidth>Invite teammates</Button>
					<Button variant="secondary" size="sm" fullWidth>Create project</Button>
					<Button variant="ghost" size="sm" fullWidth>Open billing</Button>
				</div>
				<div class="mt-4 flex -space-x-2">
					{#each ['Ada', 'Alan', 'Grace', 'Kathy'] as name}
						<Avatar {name} size="sm" />
					{/each}
					<span
						class="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-overlay text-[10px] font-semibold text-secondary"
					>
						+8
					</span>
				</div>
			</Card>
		{/snippet}
	</DashboardPage>
</div>
