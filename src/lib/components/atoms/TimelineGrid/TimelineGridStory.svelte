<script lang="ts">
	import TimelineGrid from './TimelineGrid.svelte';
</script>

<div class="relative h-40 overflow-hidden rounded-lg border border-border bg-surface">
	<TimelineGrid durationMs={30000} pxPerMs={0.1} class="absolute inset-0" />
</div>
