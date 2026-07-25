<script lang="ts">
	import Gauge from './Gauge.svelte';
</script>

<div class="inline-flex rounded-2xl border border-border bg-surface-elevated p-6">
	<Gauge
		value={72}
		label="CPU usage"
		unit="%"
		zones={[
			{ at: 0, color: '#22c55e' },
			{ at: 0.6, color: '#f59e0b' },
			{ at: 0.85, color: '#ef4444' }
		]}
	/>
</div>
