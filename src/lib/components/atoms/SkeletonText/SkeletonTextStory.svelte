<script lang="ts">
	import SkeletonText from './SkeletonText.svelte';

	let props = $props<{ lines?: number }>();

	const lines = $derived(props.lines ?? 4);
</script>

<div class="w-80 max-w-full space-y-3 rounded-xl border border-border bg-surface-elevated p-4">
	<div class="h-4 w-1/3 animate-pulse rounded bg-surface-overlay"></div>
	<SkeletonText {lines} />
</div>
