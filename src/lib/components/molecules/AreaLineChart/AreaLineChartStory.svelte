<script lang="ts">
	import AreaLineChart from './AreaLineChart.svelte';

	const weight = [
		{ label: 'Mar 3', value: 82.4 },
		{ label: 'Mar 10', value: 81.9 },
		{ label: 'Mar 17', value: 81.2 },
		{ label: 'Mar 24', value: 80.8 },
		{ label: 'Mar 31', value: 80.1 },
		{ label: 'Apr 7', value: 79.6 },
		{ label: 'Apr 14', value: 79.2 }
	];
</script>

<div class="max-w-xl rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Weight (kg)</p>
	<AreaLineChart data={weight} unit=" kg" />
</div>
