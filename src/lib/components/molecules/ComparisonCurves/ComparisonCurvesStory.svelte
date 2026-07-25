<script lang="ts">
	import ComparisonCurves from './ComparisonCurves.svelte';
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">With plan vs without</p>
	<ComparisonCurves
		labels={['Now', '', '', '', '12 wk']}
		series={[
			{
				id: 'plan',
				label: 'With plan',
				values: [82, 80.5, 79, 77.5, 76],
				showArea: true
			},
			{
				id: 'none',
				label: 'Without plan',
				values: [82, 81.5, 81, 80.8, 80.5],
				dashed: true,
				color: '#a1a1aa'
			}
		]}
	/>
</div>
