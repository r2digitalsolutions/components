<script lang="ts">
	import Heatmap from './Heatmap.svelte';

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const hours = ['6a', '9a', '12p', '3p', '6p', '9p'];

	const data = days.flatMap((_, row) =>
		hours.map((_, col) => ({
			row,
			col,
			value: Math.round(Math.abs(Math.sin(row * 1.3 + col * 0.7)) * 10 + (row + col) % 4)
		}))
	);
</script>

<div class="max-w-lg rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Activity heatmap</p>
	<Heatmap {data} rows={days} cols={hours} />
</div>
