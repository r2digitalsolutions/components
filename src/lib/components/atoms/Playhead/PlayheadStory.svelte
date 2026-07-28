<script lang="ts">
	import Playhead from './Playhead.svelte';
</script>

<div class="relative h-40 overflow-hidden rounded-lg border border-border bg-surface-elevated">
	<div class="absolute inset-x-0 top-0 h-6 border-b border-border bg-surface"></div>
	<Playhead x={120} />
	<Playhead x={280} class="opacity-40" />
</div>
