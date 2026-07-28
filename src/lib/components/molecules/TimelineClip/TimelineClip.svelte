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
		ondragoverclip?: (e: DragEvent) => void;
		ondropclip?: (e: DragEvent) => void;
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
		ontrimend,
		ondragoverclip,
		ondropclip
	}: TimelineClipProps = $props();

	const left = $derived(msToPx(clip.startMs, pxPerMs));
	const width = $derived(Math.max(8, msToPx(clip.endMs - clip.startMs, pxPerMs)));
	const bg = $derived(clip.color ?? '#3b82f6');
	const inW = $derived(
		clip.animationIn ? Math.min(width * 0.45, msToPx(clip.animationIn.durationMs, pxPerMs)) : 0
	);
	const outW = $derived(
		clip.animationOut ? Math.min(width * 0.45, msToPx(clip.animationOut.durationMs, pxPerMs)) : 0
	);
	const transW = $derived(
		clip.transitionOut
			? Math.min(width * 0.5, Math.max(10, msToPx(clip.transitionOut.durationMs, pxPerMs)))
			: 0
	);

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
	data-marquee-id={clip.id}
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
	ondragover={(e) => {
		e.preventDefault();
		e.stopPropagation();
		ondragoverclip?.(e);
	}}
	ondrop={(e) => {
		e.preventDefault();
		e.stopPropagation();
		ondropclip?.(e);
	}}
>
	<!-- CapCut-style: In wedge -->
	{#if clip.animationIn && inW > 2}
		<div
			class="pointer-events-none absolute inset-y-0 left-0 z-0 bg-gradient-to-r from-emerald-400/70 to-transparent"
			style:width={`${inW}px`}
			title={`In: ${clip.animationIn.type}`}
		></div>
	{/if}
	<!-- CapCut-style: Out wedge -->
	{#if clip.animationOut && outW > 2}
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-0 bg-gradient-to-l from-amber-400/70 to-transparent"
			style:width={`${outW}px`}
			title={`Out: ${clip.animationOut.type}`}
		></div>
	{/if}
	<!-- Transition window at clip end -->
	{#if clip.transitionOut && transW > 2}
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-[1] bg-gradient-to-l from-fuchsia-500/55 to-transparent"
			style:width={`${transW}px`}
			title={`Transition: ${clip.transitionOut.type} · ${(clip.transitionOut.durationMs / 1000).toFixed(1)}s`}
		></div>
	{/if}
	<!-- CapCut-style: transition diamond at clip end -->
	{#if clip.transitionOut}
		<div
			class="pointer-events-none absolute top-1/2 right-0 z-20 flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center"
			title={`Transition: ${clip.transitionOut.type}`}
		>
			<span
				class="block h-2.5 w-2.5 rotate-45 border border-white/80 bg-fuchsia-400 shadow-sm"
			></span>
		</div>
	{/if}

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
	<div class="pointer-events-none relative z-10 flex h-full items-center gap-1.5 overflow-hidden px-2">
		<MediaKindIcon kind={clip.kind} size="sm" class="shrink-0 opacity-90" />
		<span class="truncate font-medium">{clip.name}</span>
		{#if clip.animationIn || clip.animationOut}
			<span class="ml-auto shrink-0 rounded bg-black/25 px-1 text-[9px] uppercase tracking-wide">
				{clip.animationIn && clip.animationOut ? 'I/O' : clip.animationIn ? 'In' : 'Out'}
			</span>
		{/if}
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
