<script lang="ts">
	import TimeRuler from './TimeRuler.svelte';
</script>

<div class="overflow-x-auto rounded-lg border border-border bg-surface-elevated p-2">
	<TimeRuler durationMs={60000} pxPerMs={0.08} />
</div>
