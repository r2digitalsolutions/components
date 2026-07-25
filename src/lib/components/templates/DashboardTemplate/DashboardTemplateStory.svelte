<script lang="ts">
	import DashboardTemplate from './DashboardTemplate.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
</script>

<DashboardTemplate
	stats={[
		{ id: '1', label: 'Active users', value: '1,284', hint: '+8%' },
		{ id: '2', label: 'Sessions', value: '9.4k', hint: '+12%' },
		{ id: '3', label: 'Conversion', value: '3.1%', hint: 'Stable' },
		{ id: '4', label: 'MRR', value: '€18.2k', hint: '+€640' }
	]}
>
	{#snippet actions()}
		<Button size="sm">Export</Button>
	{/snippet}
	<div class="grid gap-4 md:grid-cols-2">
		<Card padding="lg" chrome={false}>
			{#snippet header()}
				<p class="text-sm font-semibold text-primary">Activity</p>
			{/snippet}
			<p class="text-sm text-secondary">Recent workspace events appear here.</p>
		</Card>
		<Card padding="lg" chrome={false}>
			{#snippet header()}
				<p class="text-sm font-semibold text-primary">Tasks</p>
			{/snippet}
			<p class="text-sm text-secondary">Open items and reminders.</p>
		</Card>
	</div>
</DashboardTemplate>
