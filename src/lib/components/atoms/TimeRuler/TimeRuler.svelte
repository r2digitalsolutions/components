<script lang="ts">
	import { formatTimecode, ticksForDuration } from '$lib/utils/mediaTime.js';

	interface TimeRulerProps {
		durationMs?: number;
		pxPerMs?: number;
		height?: number;
		class?: string;
		onclick?: (ms: number, e: MouseEvent) => void;
	}

	let {
		durationMs = 30_000,
		pxPerMs = 0.05,
		height = 28,
		class: className = '',
		onclick
	}: TimeRulerProps = $props();

	const ticks = $derived(ticksForDuration(durationMs, pxPerMs));
	const width = $derived(Math.max(1, durationMs * pxPerMs));

	function handleClick(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX - rect.left;
		onclick?.(x / pxPerMs, e);
	}
</script>

<div
	role="presentation"
	class={[
		'relative shrink-0 select-none border-b border-border bg-surface text-[10px] text-muted',
		className
	]}
	style:height={`${height}px`}
	style:width={`${width}px`}
	onclick={handleClick}
>
	{#each ticks as tick (tick.ms)}
		<div
			class="absolute top-0 flex h-full flex-col justify-end"
			style:left={`${tick.ms * pxPerMs}px`}
		>
			<span
				class={[
					'mb-0.5 -translate-x-1/2 whitespace-nowrap pl-1',
					tick.major ? 'text-secondary' : 'text-muted/70'
				]}
			>
				{formatTimecode(tick.ms)}
			</span>
			<div
				class={['w-px bg-border-strong', tick.major ? 'h-3' : 'h-2 opacity-60']}
			></div>
		</div>
	{/each}
</div>
