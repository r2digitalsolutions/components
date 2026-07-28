<script lang="ts">
	import TrimHandle from '$lib/components/atoms/TrimHandle/TrimHandle.svelte';
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import type { MediaClip } from '$lib/utils/mediaTracks.js';
	import { msToPx } from '$lib/utils/mediaTime.js';

	interface TimelineClipProps {
		clip: MediaClip;
		pxPerMs?: number;
		selected?: boolean;
		locked?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		onmove?: (startMs: number) => void;
		ontrimstart?: (startMs: number) => void;
		ontrimend?: (endMs: number) => void;
	}

	let {
		clip,
		pxPerMs = 0.05,
		selected = false,
		locked = false,
		class: className = '',
		onclick,
		onmove,
		ontrimstart,
		ontrimend
	}: TimelineClipProps = $props();

	const left = $derived(msToPx(clip.startMs, pxPerMs));
	const width = $derived(Math.max(8, msToPx(clip.endMs - clip.startMs, pxPerMs)));
	const bg = $derived(clip.color ?? '#3b82f6');

	let dragMode = $state<'move' | 'trimStart' | 'trimEnd' | null>(null);
	let originX = $state(0);
	let originStart = $state(0);
	let originEnd = $state(0);

	function beginMove(e: PointerEvent) {
		if (locked) return;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragMode = 'move';
		originX = e.clientX;
		originStart = clip.startMs;
		originEnd = clip.endMs;
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragMode || locked) return;
		const deltaMs = (e.clientX - originX) / pxPerMs;
		if (dragMode === 'move') onmove?.(Math.max(0, originStart + deltaMs));
		if (dragMode === 'trimStart') ontrimstart?.(originStart + deltaMs);
		if (dragMode === 'trimEnd') ontrimend?.(originEnd + deltaMs);
	}

	function onPointerUp(e: PointerEvent) {
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		dragMode = null;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role="button"
	tabindex="0"
	aria-label={clip.name}
	aria-pressed={selected}
	class={[
		'absolute top-1 bottom-1 overflow-hidden rounded-md border text-left text-xs text-white shadow-sm',
		selected ? 'ring-2 ring-white/80 ring-offset-1 ring-offset-transparent' : 'border-black/20',
		locked ? 'cursor-not-allowed opacity-70' : 'cursor-grab active:cursor-grabbing',
		className
	]}
	style:left={`${left}px`}
	style:width={`${width}px`}
	style:background={bg}
	onclick={(e) => {
		e.stopPropagation();
		onclick?.(e);
	}}
	onpointerdown={beginMove}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	<TrimHandle
		side="start"
		disabled={locked}
		ondragstart={(e) => {
			dragMode = 'trimStart';
			originX = e.clientX;
			originStart = clip.startMs;
		}}
		ondrag={(e) => {
			const deltaMs = (e.clientX - originX) / pxPerMs;
			ontrimstart?.(originStart + deltaMs);
		}}
	/>
	<div class="pointer-events-none flex h-full items-center gap-1.5 overflow-hidden px-2">
		<MediaKindIcon kind={clip.kind} size="sm" class="shrink-0 opacity-90" />
		<span class="truncate font-medium">{clip.name}</span>
	</div>
	<TrimHandle
		side="end"
		disabled={locked}
		ondragstart={(e) => {
			dragMode = 'trimEnd';
			originX = e.clientX;
			originEnd = clip.endMs;
		}}
		ondrag={(e) => {
			const deltaMs = (e.clientX - originX) / pxPerMs;
			ontrimend?.(originEnd + deltaMs);
		}}
	/>
</div>
