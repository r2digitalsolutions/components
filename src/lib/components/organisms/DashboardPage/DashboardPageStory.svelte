<script lang="ts">
	import DashboardPage from './DashboardPage.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';

	const metrics: MetricItem[] = [
		{ id: 'm1', label: 'MRR', value: '$24.8k', delta: '+6.2%', trend: 'up' },
		{ id: 'm2', label: 'Active users', value: '3,912', delta: '+118', trend: 'up' },
		{ id: 'm3', label: 'Conversion', value: '4.8%', delta: '-0.2%', trend: 'down' },
		{ id: 'm4', label: 'Tickets', value: '27', delta: 'stable', trend: 'neutral', badge: 'Support' }
	];
</script>

<div class="mx-auto max-w-5xl p-4">
	<DashboardPage
		title="Workspace overview"
		description="Key metrics for the last 30 days."
		breadcrumbs={[
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'dash', label: 'Dashboard' }
		]}
		{metrics}
	>
		{#snippet actions()}
			<Button size="sm" variant="secondary">Export</Button>
			<Button size="sm">New project</Button>
		{/snippet}
	</DashboardPage>
</div>
