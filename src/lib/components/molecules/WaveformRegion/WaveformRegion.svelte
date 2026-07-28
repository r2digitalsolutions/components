<script lang="ts">
	import WaveBars from '$lib/components/atoms/WaveBars/WaveBars.svelte';
	import type { MediaClip } from '$lib/utils/mediaTracks.js';
	import { msToPx } from '$lib/utils/mediaTime.js';

	interface WaveformRegionProps {
		clip: MediaClip;
		pxPerMs?: number;
		selected?: boolean;
		progress?: number;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		onmove?: (startMs: number) => void;
	}

	let {
		clip,
		pxPerMs = 0.05,
		selected = false,
		progress,
		class: className = '',
		onclick,
		onmove
	}: WaveformRegionProps = $props();

	const left = $derived(msToPx(clip.startMs, pxPerMs));
	const width = $derived(Math.max(24, msToPx(clip.endMs - clip.startMs, pxPerMs)));
	const bg = $derived(clip.color ?? '#3b82f6');

	let dragging = $state(false);
	let originX = $state(0);
	let originStart = $state(0);

	function onPointerDown(e: PointerEvent) {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragging = true;
		originX = e.clientX;
		originStart = clip.startMs;
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const deltaMs = (e.clientX - originX) / pxPerMs;
		onmove?.(Math.max(0, originStart + deltaMs));
	}

	function onPointerUp(e: PointerEvent) {
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		dragging = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role="button"
	tabindex="0"
	aria-label={clip.name}
	aria-pressed={selected}
	class={[
		'absolute top-1 bottom-1 overflow-hidden rounded-md border px-1',
		selected ? 'ring-2 ring-white/70' : 'border-black/20',
		dragging ? 'cursor-grabbing' : 'cursor-grab',
		className
	]}
	style:left={`${left}px`}
	style:width={`${width}px`}
	style:background={`${bg}cc`}
	onclick={(e) => {
		e.stopPropagation();
		onclick?.(e);
	}}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	<span class="pointer-events-none absolute left-1 top-0.5 z-10 truncate text-[10px] font-medium text-white">
		{clip.name}
	</span>
	<div class="pointer-events-none mt-3 h-[calc(100%-0.75rem)]">
		<WaveBars height={28} progress={progress} tone="neutral" class="opacity-90" />
	</div>
</div>
