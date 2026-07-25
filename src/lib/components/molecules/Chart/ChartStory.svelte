<script lang="ts">
	import Chart from './Chart.svelte';
	import AreaLineChart from '$lib/components/molecules/AreaLineChart/AreaLineChart.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let props = $props<{ type?: 'line' | 'bar' | 'donut' }>();

	const data = [
		{ label: 'Mon', value: 12 },
		{ label: 'Tue', value: 18 },
		{ label: 'Wed', value: 9 },
		{ label: 'Thu', value: 22 },
		{ label: 'Fri', value: 16 },
		{ label: 'Sat', value: 11 },
		{ label: 'Sun', value: 7 }
	];
</script>

<div class="max-w-lg space-y-6">
	<div class="rounded-2xl border border-border bg-surface-elevated p-4">
		<p class="mb-2 text-sm font-semibold text-primary">Chart (simple)</p>
		<Chart type={props.type ?? 'bar'} {data} />
	</div>

	<div class="rounded-2xl border border-border bg-surface-elevated p-4">
		<p class="mb-2 text-sm font-semibold text-primary">Prefer for dashboards</p>
		<Text size="xs" tone="muted" class="mb-3">
			Use AreaLineChart, MultiLineChart and BarChart — ported from Atom progreso / check-in.
		</Text>
		<AreaLineChart
			data={data.map((d) => ({ label: d.label, value: d.value }))}
			height={160}
		/>
	</div>
</div>
