<script lang="ts">
	import LatencyPill from './LatencyPill.svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
	<LatencyPill ms={42} label="p50" />
	<LatencyPill ms={128} label="p95" />
	<LatencyPill ms={412} label="p99" />
	<LatencyPill ms={85} tone="good" size="md" />
	<LatencyPill ms={220} tone="warn" />
	<LatencyPill ms={890} tone="bad" />
</div>
