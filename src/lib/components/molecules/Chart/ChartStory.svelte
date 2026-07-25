<script lang="ts">
	import Chart from './Chart.svelte';

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

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<Chart type={props.type ?? 'bar'} {data} />
</div>
