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
		oncontextmenu?: (e: MouseEvent) => void;
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
		oncontextmenu,
		onmove,
		ontrimstart,
		ontrimend
	}: TimelineClipProps = $props();

	const left = $derived(msToPx(clip.startMs, pxPerMs));
	const width = $derived(Math.max(8, msToPx(clip.endMs - clip.startMs, pxPerMs)));
	const bg = $derived(clip.color ?? '#3b82f6');

	let dragMode = $state<'move' | null>(null);
	let originX = $state(0);
	let originStart = $state(0);

	function beginMove(e: PointerEvent) {
		if (locked || e.button !== 0) return;
		e.stopPropagation();
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragMode = 'move';
		originX = e.clientX;
		originStart = clip.startMs;
	}

	function onPointerMove(e: PointerEvent) {
		if (locked) return;
		if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
		if (dragMode !== 'move') return;
		const deltaMs = (e.clientX - originX) / pxPerMs;
		onmove?.(Math.max(0, originStart + deltaMs));
	}

	function onPointerUp(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
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
		'absolute top-1 bottom-1 z-1 touch-none overflow-hidden rounded-md border text-left text-xs text-white shadow-sm',
		selected
			? 'z-10 border-2 border-white shadow-md ring-2 ring-brand-500 ring-offset-1 ring-offset-surface'
			: 'border-black/25',
		locked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
		className
	]}
	style:left={`${left}px`}
	style:width={`${width}px`}
	style:background={bg}
	style:opacity={locked ? Math.min(0.7, clip.opacity ?? 1) : (clip.opacity ?? 1)}
	style:filter={selected ? 'brightness(1.12)' : undefined}
	onclick={(e) => {
		e.stopPropagation();
		onclick?.(e);
	}}
	oncontextmenu={(e) => {
		e.preventDefault();
		e.stopPropagation();
		oncontextmenu?.(e);
	}}
	onpointerdown={beginMove}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	<TrimHandle
		side="start"
		disabled={locked}
		ondragstart={(e) => {
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
			originX = e.clientX;
			originStart = clip.endMs;
		}}
		ondrag={(e) => {
			const deltaMs = (e.clientX - originX) / pxPerMs;
			ontrimend?.(originStart + deltaMs);
		}}
	/>
</div>
