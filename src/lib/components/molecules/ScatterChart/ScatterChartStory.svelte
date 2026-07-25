<script lang="ts">
	import ScatterChart from './ScatterChart.svelte';
</script>

<div class="inline-block rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Engagement vs revenue</p>
	<ScatterChart
		xLabel="Sessions"
		yLabel="Revenue"
		unitY="k"
		data={[
			{ x: 12, y: 4.2, group: 'Free', label: 'Acme' },
			{ x: 28, y: 8.1, group: 'Free' },
			{ x: 45, y: 14.5, group: 'Pro' },
			{ x: 62, y: 22.0, group: 'Pro' },
			{ x: 18, y: 3.5, group: 'Free' },
			{ x: 88, y: 41.2, group: 'Enterprise' },
			{ x: 71, y: 33.8, group: 'Enterprise' },
			{ x: 35, y: 11.2, group: 'Pro' },
			{ x: 95, y: 48.0, group: 'Enterprise' },
			{ x: 8, y: 1.8, group: 'Free' }
		]}
	/>
</div>
