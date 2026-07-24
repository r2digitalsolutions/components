<script lang="ts">
	interface SkeletonTextProps {
		lines?: number;
		lastLineWidth?: string;
		class?: string;
	}

	let {
		lines = 3,
		lastLineWidth = '66%',
		class: className = ''
	}: SkeletonTextProps = $props();

	const indexes = $derived(Array.from({ length: lines }, (_, i) => i));
</script>

<div class={['flex w-full flex-col gap-2', className]} aria-hidden="true">
	{#each indexes as i (i)}
		{@const isLast = i === lines - 1 && lines > 1}
		<div
			class="h-3 animate-pulse rounded-md bg-surface-overlay"
			style:width={isLast ? lastLineWidth : '100%'}
		></div>
	{/each}
</div>
