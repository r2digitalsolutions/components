<script lang="ts">
	import SkeletonCard from './SkeletonCard.svelte';

	let props = $props<{ media?: boolean; lines?: number }>();
</script>

<div class="grid max-w-3xl gap-4 sm:grid-cols-2">
	<SkeletonCard media={props.media ?? true} lines={props.lines ?? 3} />
	<SkeletonCard media={false} lines={4} />
</div>
