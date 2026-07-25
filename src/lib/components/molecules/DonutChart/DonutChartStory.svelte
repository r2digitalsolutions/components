<script lang="ts">
	import DonutChart from './DonutChart.svelte';
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Traffic sources</p>
	<DonutChart
		data={[
			{ label: 'Organic', value: 42 },
			{ label: 'Direct', value: 28 },
			{ label: 'Referral', value: 18 },
			{ label: 'Social', value: 12 }
		]}
		unit="%"
	/>
</div>
