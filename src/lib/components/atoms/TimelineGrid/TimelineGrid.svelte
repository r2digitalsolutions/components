<script lang="ts">
	import { ticksForDuration, type TimeTick } from '$lib/utils/mediaTime.js';

	interface TimelineGridProps {
		durationMs?: number;
		pxPerMs?: number;
		/** Precomputed ticks; defaults to ticksForDuration. */
		ticks?: TimeTick[];
		class?: string;
	}

	let {
		durationMs = 30_000,
		pxPerMs = 0.05,
		ticks: ticksProp,
		class: className = ''
	}: TimelineGridProps = $props();

	const ticks = $derived(ticksProp ?? ticksForDuration(durationMs, pxPerMs));
	const width = $derived(Math.max(1, durationMs * pxPerMs));
</script>

<div
	aria-hidden="true"
	class={['pointer-events-none absolute inset-y-0 left-0 z-0', className]}
	style:width={`${width}px`}
>
	{#each ticks as tick (tick.ms)}
		<div
			class={[
				'absolute inset-y-0 w-px',
				tick.level === 'major' && 'bg-border-strong/50',
				tick.level === 'mid' && 'bg-border/40',
				tick.level === 'minor' && 'bg-border/20'
			]}
			style:left={`${tick.ms * pxPerMs}px`}
		></div>
	{/each}
</div>
