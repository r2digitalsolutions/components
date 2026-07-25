<script lang="ts">
	import MultiLineChart from './MultiLineChart.svelte';

	const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
</script>

<div class="max-w-xl rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Wellness (1–5)</p>
	<MultiLineChart
		{labels}
		yMin={0.5}
		yMax={5.5}
		series={[
			{ id: 'sleep', label: 'Sleep', color: '#6366f1', values: [3, 4, 3, 5, 4, 4] },
			{ id: 'recovery', label: 'Recovery', color: '#22c55e', values: [2, 3, 4, 4, 3, 5] },
			{ id: 'energy', label: 'Energy', color: '#f59e0b', values: [3, 3, 4, 3, 4, 4] }
		]}
	/>
</div>
