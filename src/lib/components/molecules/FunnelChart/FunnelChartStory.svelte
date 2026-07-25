<script lang="ts">
	import FunnelChart from './FunnelChart.svelte';
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-4 text-sm font-semibold text-primary">Acquisition funnel</p>
	<FunnelChart
		data={[
			{ label: 'Visitors', value: 12500 },
			{ label: 'Signups', value: 4200 },
			{ label: 'Activated', value: 2100 },
			{ label: 'Trial', value: 980 },
			{ label: 'Paid', value: 340 }
		]}
	/>
</div>
