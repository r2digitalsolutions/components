<script lang="ts">
	import StackedBarChart from './StackedBarChart.svelte';
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Sessions by type</p>
	<StackedBarChart
		labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
		series={[
			{ id: 'strength', label: 'Strength', values: [2, 1, 2, 0, 3, 1, 0] },
			{ id: 'cardio', label: 'Cardio', values: [1, 2, 0, 2, 1, 2, 1] },
			{ id: 'mobility', label: 'Mobility', values: [0, 1, 1, 1, 0, 1, 2] }
		]}
	/>
</div>
