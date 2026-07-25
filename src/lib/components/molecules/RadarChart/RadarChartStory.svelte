<script lang="ts">
	import RadarChart from './RadarChart.svelte';
</script>

<div class="inline-block rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-center text-sm font-semibold text-primary">Skill profile</p>
	<RadarChart
		axes={[
			{ key: 'speed', label: 'Speed' },
			{ key: 'reliability', label: 'Reliability' },
			{ key: 'ux', label: 'UX' },
			{ key: 'security', label: 'Security' },
			{ key: 'docs', label: 'Docs' },
			{ key: 'support', label: 'Support' }
		]}
		series={[
			{
				label: 'Product A',
				values: { speed: 80, reliability: 90, ux: 70, security: 85, docs: 60, support: 75 }
			},
			{
				label: 'Product B',
				values: { speed: 65, reliability: 70, ux: 95, security: 60, docs: 85, support: 90 }
			}
		]}
	/>
</div>
