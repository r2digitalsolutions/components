<script lang="ts">
	import HorizontalBarChart from './HorizontalBarChart.svelte';
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Top categories</p>
	<HorizontalBarChart
		data={[
			{ label: 'Strength', value: 48 },
			{ label: 'Cardio', value: 36 },
			{ label: 'Mobility', value: 22 },
			{ label: 'HIIT', value: 18 },
			{ label: 'Yoga', value: 12 }
		]}
	/>
</div>
