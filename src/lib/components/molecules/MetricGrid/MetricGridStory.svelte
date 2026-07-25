<script lang="ts">
	import MetricGrid from './MetricGrid.svelte';
	import type { MetricItem } from './MetricGrid.svelte';

	const items: MetricItem[] = [
		{ id: '1', label: 'Revenue', value: '$48.2k', delta: '+12%', trend: 'up', badge: 'Live' },
		{ id: '2', label: 'Users', value: '12.4k', delta: '+3.1%', trend: 'up' },
		{ id: '3', label: 'Churn', value: '1.8%', delta: '-0.4%', trend: 'down' },
		{ id: '4', label: 'NPS', value: '62', delta: '+2', trend: 'up' }
	];
</script>

<MetricGrid {items} cols={4} />
