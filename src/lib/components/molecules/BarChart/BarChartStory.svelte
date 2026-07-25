<script lang="ts">
	import BarChart from './BarChart.svelte';
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Workouts / week</p>
	<BarChart
		data={[
			{ label: 'W1', value: 3 },
			{ label: 'W2', value: 5 },
			{ label: 'W3', value: 4 },
			{ label: 'W4', value: 2 },
			{ label: 'W5', value: 6 },
			{ label: 'W6', value: 4 }
		]}
	/>
</div>
