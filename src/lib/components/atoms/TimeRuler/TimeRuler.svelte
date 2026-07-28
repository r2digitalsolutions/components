<script lang="ts">
	import { formatTimecode, ticksForDuration, type TimeTick } from '$lib/utils/mediaTime.js';

	interface TimeRulerProps {
		durationMs?: number;
		pxPerMs?: number;
		height?: number;
		/** Precomputed ticks; defaults to ticksForDuration. */
		ticks?: TimeTick[];
		class?: string;
		onclick?: (ms: number, e: MouseEvent) => void;
		/** Scrub while dragging on the ruler */
		onscrub?: (ms: number, e: PointerEvent) => void;
		onscrubstart?: (ms: number, e: PointerEvent) => void;
		onscrubend?: (ms: number, e: PointerEvent) => void;
	}

	let {
		durationMs = 30_000,
		pxPerMs = 0.05,
		height = 28,
		ticks: ticksProp,
		class: className = '',
		onclick,
		onscrub,
		onscrubstart,
		onscrubend
	}: TimeRulerProps = $props();

	const ticks = $derived(ticksProp ?? ticksForDuration(durationMs, pxPerMs));
	const width = $derived(Math.max(1, durationMs * pxPerMs));

	let scrubbing = $state(false);

	function msFromClientX(el: HTMLElement, clientX: number): number {
		const rect = el.getBoundingClientRect();
		const x = clientX - rect.left;
		return Math.max(0, Math.min(durationMs, x / pxPerMs));
	}

	function handleClick(e: MouseEvent) {
		if (scrubbing) return;
		const ms = msFromClientX(e.currentTarget as HTMLElement, e.clientX);
		onclick?.(ms, e);
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		const el = e.currentTarget as HTMLElement;
		el.setPointerCapture(e.pointerId);
		scrubbing = true;
		const ms = msFromClientX(el, e.clientX);
		onscrubstart?.(ms, e);
		onscrub?.(ms, e);
	}

	function onPointerMove(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		if (!el.hasPointerCapture(e.pointerId)) return;
		const ms = msFromClientX(el, e.clientX);
		onscrub?.(ms, e);
	}

	function onPointerUp(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		if (!el.hasPointerCapture(e.pointerId)) return;
		el.releasePointerCapture(e.pointerId);
		const ms = msFromClientX(el, e.clientX);
		onscrubend?.(ms, e);
		scrubbing = false;
	}

	function tickHeight(level: TimeTick['level']): string {
		if (level === 'major') return 'h-3.5';
		if (level === 'mid') return 'h-2.5';
		return 'h-1.5';
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role="presentation"
	class={[
		'relative shrink-0 cursor-ew-resize select-none border-b border-border bg-surface text-[10px] text-muted',
		scrubbing && 'cursor-grabbing',
		className
	]}
	style:height={`${height}px`}
	style:width={`${width}px`}
	onclick={handleClick}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	{#each ticks as tick (tick.ms)}
		<div
			class="pointer-events-none absolute top-0 flex h-full flex-col justify-end"
			style:left={`${tick.ms * pxPerMs}px`}
		>
			{#if tick.level === 'major'}
				<span class="mb-0.5 -translate-x-1/2 whitespace-nowrap pl-1 text-secondary">
					{formatTimecode(tick.ms)}
				</span>
			{/if}
			<div
				class={[
					'w-px bg-border-strong',
					tickHeight(tick.level),
					tick.level === 'minor' && 'opacity-40',
					tick.level === 'mid' && 'opacity-70'
				]}
			></div>
		</div>
	{/each}
</div>
