<script lang="ts">
	import Playhead from '$lib/components/atoms/Playhead/Playhead.svelte';
	import TimeRuler from '$lib/components/atoms/TimeRuler/TimeRuler.svelte';
	import TimelineGrid from '$lib/components/atoms/TimelineGrid/TimelineGrid.svelte';
	import MarqueeRect from '$lib/components/atoms/MarqueeRect/MarqueeRect.svelte';
	import TimelineTrack from '$lib/components/molecules/TimelineTrack/TimelineTrack.svelte';
	import VideoTrackHeader from '$lib/components/molecules/VideoTrackHeader/VideoTrackHeader.svelte';
	import TrackHeader from '$lib/components/molecules/TrackHeader/TrackHeader.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { MediaClip, MediaTrack, MediaTrackKind } from '$lib/utils/mediaTracks.js';
	import {
		clampMs,
		msToPx,
		pxPerMsFromZoom,
		pxToMs,
		snapStepForZoom,
		ticksForDuration
	} from '$lib/utils/mediaTime.js';
	import {
		attachMarqueeSelect,
		collectMarqueeItems,
		defaultMarqueeIgnore,
		resolveMarqueeSelection,
		type MarqueeRect as MarqueeBox
	} from '$lib/utils/marqueeSelect.js';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import { onDestroy } from 'svelte';

	interface MediaTimelineProps {
		tracks?: MediaTrack[];
		durationMs?: number;
		currentTimeMs?: number;
		zoom?: number;
		selectedClipIds?: string[];
		/** @deprecated use selectedClipIds */
		selectedClipId?: string | null;
		showHeaders?: boolean;
		headerVariant?: 'video' | 'audio' | 'plain';
		snap?: boolean;
		showTrackActions?: boolean;
		/** Allow drag-reorder of tracks via header grip */
		reorderTracks?: boolean;
		/** Show delete control on video track headers */
		allowRemoveTracks?: boolean;
		class?: string;
		onseek?: (ms: number) => void;
		onselectclip?: (clipId: string, e: MouseEvent) => void;
		oncontextmenuclip?: (clipId: string, e: MouseEvent) => void;
		oncontextmenutrack?: (trackId: string, e: MouseEvent) => void;
		onchangeclip?: (clip: MediaClip) => void;
		onmoveclips?: (clipIds: string[], deltaMs: number) => void;
		ondropclip?: (clipId: string, e: DragEvent) => void;
		ondroptrack?: (trackId: string, e: DragEvent, timeMs: number) => void;
		onchangetrack?: (track: MediaTrack) => void;
		onzoomchange?: (zoom: number) => void;
		onaddtrack?: (kind: MediaTrackKind) => void;
		onremovetrack?: (trackId: string) => void;
		/** Fired with new track id order after drag reorder */
		onreordertracks?: (orderedIds: string[]) => void;
		onemptyclick?: (e: MouseEvent) => void;
		/** Replace / add / toggle selection from marquee */
		onselectionchange?: (clipIds: string[]) => void;
	}

	let {
		tracks = [],
		durationMs = 30_000,
		currentTimeMs = $bindable(0),
		zoom = $bindable(1),
		selectedClipIds,
		selectedClipId = null,
		showHeaders = true,
		headerVariant = 'plain',
		snap = true,
		showTrackActions = false,
		reorderTracks = false,
		allowRemoveTracks = false,
		class: className = '',
		onseek,
		onselectclip,
		oncontextmenuclip,
		oncontextmenutrack,
		onchangeclip,
		onmoveclips,
		ondropclip,
		ondroptrack,
		onchangetrack,
		onzoomchange,
		onaddtrack,
		onremovetrack,
		onreordertracks,
		onemptyclick,
		onselectionchange
	}: MediaTimelineProps = $props();

	const resolvedSelected = $derived(
		selectedClipIds ?? (selectedClipId ? [selectedClipId] : [])
	);
	const pxPerMs = $derived(pxPerMsFromZoom(zoom));
	const contentWidth = $derived(Math.max(1, durationMs * pxPerMs));
	const playheadX = $derived(msToPx(currentTimeMs, pxPerMs));
	const ticks = $derived(ticksForDuration(durationMs, pxPerMs));
	const snapToMs = $derived(snap ? snapStepForZoom(pxPerMs) : 0);
	const headerW = $derived(reorderTracks || allowRemoveTracks ? 200 : 176);

	let scroller = $state<HTMLDivElement | null>(null);
	let tracksEl = $state<HTMLDivElement | null>(null);
	let dragTrackId = $state<string | null>(null);
	let dragTrackHeight = $state(44);
	let floatPos = $state({ x: 0, y: 0, w: 0 });
	let dragOffset = $state({ x: 0, y: 0 });
	let scrubbing = $state(false);
	let marquee = $state<MarqueeBox | null>(null);
	let disposeMarquee: (() => void) | null = null;
	const rulerH = 28;

	const draggingTrack = $derived(dragTrackId ? tracks.find((t) => t.id === dragTrackId) : null);

	$effect(() => {
		disposeMarquee?.();
		disposeMarquee = null;
		const el = tracksEl;
		if (!el || !onselectionchange) return;
		disposeMarquee = attachMarqueeSelect(el, {
			getItems: () => collectMarqueeItems(el),
			onRect: (r) => (marquee = r),
			shouldIgnore: (target) =>
				defaultMarqueeIgnore(target) ||
				(target instanceof Element &&
					Boolean(
						target.closest(
							'[data-marquee-id], [data-marquee-ignore], [aria-label="Playhead"], [role="slider"], .sticky'
						)
					)),
			onSelect: ({ ids, modifier }) => {
				onselectionchange(resolveMarqueeSelection(ids, resolvedSelected, modifier));
			}
		});
	});

	onDestroy(() => {
		disposeMarquee?.();
		endTrackReorder();
	});

	function seekFromClientX(clientX: number) {
		if (!scroller) return;
		const rect = scroller.getBoundingClientRect();
		const x = clientX - rect.left + scroller.scrollLeft - (showHeaders ? headerW : 0);
		const ms = clampMs(pxToMs(x, pxPerMs), 0, durationMs);
		currentTimeMs = ms;
		onseek?.(ms);
	}

	function seekToMs(ms: number) {
		currentTimeMs = clampMs(ms, 0, durationMs);
		onseek?.(currentTimeMs);
	}

	function setZoom(next: number) {
		zoom = Math.min(8, Math.max(0.25, next));
		onzoomchange?.(zoom);
	}

	function trackIndexFromPoint(clientY: number): number {
		if (!tracksEl) return -1;
		const rows = [...tracksEl.querySelectorAll<HTMLElement>('[data-track-row]')];
		if (!rows.length) return -1;
		for (let i = 0; i < rows.length; i++) {
			const rect = rows[i].getBoundingClientRect();
			const mid = rect.top + rect.height / 2;
			if (clientY < mid) return i;
		}
		return rows.length - 1;
	}

	function moveTrackToIndex(sourceId: string, toIndex: number) {
		const ids = tracks.map((t) => t.id);
		const from = ids.indexOf(sourceId);
		if (from < 0 || toIndex < 0 || toIndex >= ids.length || from === toIndex) return;
		const next = [...ids];
		next.splice(from, 1);
		next.splice(toIndex, 0, sourceId);
		onreordertracks?.(next);
	}

	function onTrackReorderMove(e: PointerEvent) {
		if (!dragTrackId) return;
		floatPos = {
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y,
			w: floatPos.w
		};
		const to = trackIndexFromPoint(e.clientY);
		if (to >= 0) moveTrackToIndex(dragTrackId, to);
	}

	function endTrackReorder() {
		dragTrackId = null;
		window.removeEventListener('pointermove', onTrackReorderMove);
		window.removeEventListener('pointerup', endTrackReorder);
		window.removeEventListener('pointercancel', endTrackReorder);
	}

	function startTrackReorder(trackId: string, e: PointerEvent) {
		if (!reorderTracks) return;
		const row = (e.currentTarget as HTMLElement).closest('[data-track-row]') as HTMLElement | null;
		if (!row) return;
		const rect = row.getBoundingClientRect();
		const scrollerRect = scroller?.getBoundingClientRect();
		const ghostW = Math.min(
			Math.max(headerW + 180, scroller?.clientWidth ?? 360),
			window.innerWidth - 16
		);
		const ghostX = scrollerRect?.left ?? Math.max(8, rect.left);
		dragTrackHeight = rect.height;
		dragOffset = { x: e.clientX - ghostX, y: e.clientY - rect.top };
		floatPos = { x: ghostX, y: rect.top, w: ghostW };
		dragTrackId = trackId;
		window.addEventListener('pointermove', onTrackReorderMove);
		window.addEventListener('pointerup', endTrackReorder);
		window.addEventListener('pointercancel', endTrackReorder);
	}
</script>

<div
	class={[
		'flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface',
		className
	]}
>
	<div class="flex shrink-0 items-center gap-2 border-b border-border px-2 py-1">
		{#if showTrackActions}
			<Button size="xs" variant="ghost" onclick={() => onaddtrack?.('video')}>+ Video</Button>
			<Button size="xs" variant="ghost" onclick={() => onaddtrack?.('audio')}>+ Audio</Button>
		{/if}
		<div class="ml-auto flex items-center gap-1">
			<IconButton label="Zoom out" size="xs" onclick={() => setZoom(zoom / 1.25)}>
				<ZoomOut class="h-3.5 w-3.5" />
			</IconButton>
			<IconButton label="Zoom in" size="xs" onclick={() => setZoom(zoom * 1.25)}>
				<ZoomIn class="h-3.5 w-3.5" />
			</IconButton>
		</div>
	</div>
	<div bind:this={scroller} class="relative min-h-0 flex-1 overflow-auto">
		<div class="relative" style:width={`${contentWidth + (showHeaders ? headerW : 0)}px`}>
			<div class="sticky top-0 z-30 flex bg-surface">
				{#if showHeaders}
					<div
						class="sticky left-0 z-10 shrink-0 border-r border-border bg-surface-elevated"
						style:width={`${headerW}px`}
						style:height={`${rulerH}px`}
					></div>
				{/if}
				<div class="relative" style:width={`${contentWidth}px`}>
					<TimeRuler
						{durationMs}
						{pxPerMs}
						{ticks}
						height={rulerH}
						onclick={(ms) => seekToMs(ms)}
						onscrub={(ms) => seekToMs(ms)}
						onscrubstart={() => (scrubbing = true)}
						onscrubend={() => (scrubbing = false)}
					/>
					<!-- Head sits on top of the time guide -->
					<Playhead
						x={playheadX}
						variant="head"
						headSize={rulerH}
						height={rulerH}
						dragging={scrubbing}
						class="pointer-events-auto"
						ondrag={(e) => seekFromClientX(e.clientX)}
						ondragstart={(e) => {
							scrubbing = true;
							seekFromClientX(e.clientX);
						}}
						ondragend={() => (scrubbing = false)}
					/>
				</div>
			</div>

			<div
				bind:this={tracksEl}
				class="relative"
				role="presentation"
				onclick={(e) => {
					if (e.target === e.currentTarget) onemptyclick?.(e);
				}}
			>
				<div
					class="absolute inset-y-0 z-0"
					style:left={`${showHeaders ? headerW : 0}px`}
					style:width={`${contentWidth}px`}
				>
					<TimelineGrid {durationMs} {pxPerMs} {ticks} />
				</div>

				{#each tracks as track (track.id)}
					{@const isDragging = dragTrackId === track.id}
					<div
						data-track-row
						data-track-id={track.id}
						class={[
							'relative',
							isDragging &&
								'rounded-md border border-dashed border-brand-400 bg-brand-50/50 dark:bg-brand-950/30'
						]}
						style:height={isDragging ? `${dragTrackHeight}px` : undefined}
					>
						{#if isDragging}
							<div
								class="flex h-full items-center gap-2 px-3"
								style:padding-left={showHeaders ? undefined : undefined}
							>
								<div class="sticky left-0 flex items-center gap-2" style:width={`${headerW}px`}>
									<span class="text-[10px] font-medium text-brand-600 dark:text-brand-400"
										>Drop here</span
									>
								</div>
							</div>
						{:else}
							<TimelineTrack
								{track}
								{pxPerMs}
								{durationMs}
								selectedClipIds={resolvedSelected}
								{snapToMs}
								headerWidth={headerW}
								onselectclip={onselectclip}
								oncontextmenuclip={oncontextmenuclip}
								oncontextmenutrack={oncontextmenutrack}
								onchangeclip={onchangeclip}
								{onmoveclips}
								{ondropclip}
								{ondroptrack}
								{onemptyclick}
							>
								{#snippet header()}
									{#if showHeaders}
										{#if headerVariant === 'video' && onchangetrack}
											<VideoTrackHeader
												{track}
												onchange={onchangetrack}
												draggable={reorderTracks}
												canRemove={allowRemoveTracks && tracks.length > 1}
												onremove={onremovetrack}
												onreorderstart={startTrackReorder}
											/>
										{:else if headerVariant === 'audio' && onchangetrack}
											<TrackHeader {track} onchange={onchangetrack} />
										{:else}
											<span class="truncate text-xs font-medium text-secondary">{track.name}</span>
										{/if}
									{/if}
								{/snippet}
							</TimelineTrack>
						{/if}
					</div>
				{/each}

				<MarqueeRect rect={marquee} />

				<!-- Needle continues through the tracks -->
				<div
					class="pointer-events-none absolute inset-y-0 z-20"
					style:left={`${showHeaders ? headerW : 0}px`}
					style:width={`${contentWidth}px`}
				>
					<Playhead
						x={playheadX}
						variant="line"
						class="pointer-events-auto"
						dragging={scrubbing}
						ondrag={(e) => seekFromClientX(e.clientX)}
						ondragstart={(e) => {
							scrubbing = true;
							seekFromClientX(e.clientX);
						}}
						ondragend={() => (scrubbing = false)}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

{#if draggingTrack && dragTrackId}
	<div
		class="pointer-events-none fixed z-[200] overflow-hidden rounded-lg border border-brand-400 bg-surface-elevated shadow-xl ring-2 ring-brand-500/25"
		style:left={`${floatPos.x}px`}
		style:top={`${floatPos.y}px`}
		style:width={`${floatPos.w}px`}
		style:height={`${dragTrackHeight}px`}
		aria-hidden="true"
	>
		<div class="flex h-full items-center border-b border-border/60 bg-surface-elevated">
			<div
				class="flex h-full shrink-0 items-center gap-1.5 border-r border-border px-1.5"
				style:width={`${headerW}px`}
			>
				<span class="flex h-6 w-5 items-center justify-center text-muted">
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<circle cx="9" cy="7" r="1.5" />
						<circle cx="15" cy="7" r="1.5" />
						<circle cx="9" cy="12" r="1.5" />
						<circle cx="15" cy="12" r="1.5" />
						<circle cx="9" cy="17" r="1.5" />
						<circle cx="15" cy="17" r="1.5" />
					</svg>
				</span>
				<span
					class="h-2 w-2 shrink-0 rounded-full"
					style:background={draggingTrack.color ??
						(draggingTrack.kind === 'audio' ? '#10b981' : '#3b82f6')}
				></span>
				<span class="min-w-0 flex-1 truncate text-xs font-semibold text-primary"
					>{draggingTrack.name}</span
				>
			</div>
			<div class="relative min-h-0 min-w-0 flex-1 self-stretch bg-surface/80">
				{#each draggingTrack.clips as clip (clip.id)}
					{@const left = msToPx(clip.startMs, pxPerMs)}
					{@const w = Math.max(8, msToPx(clip.endMs - clip.startMs, pxPerMs))}
					<div
						class="absolute top-1 bottom-1 overflow-hidden rounded-md border border-black/20 text-[10px] text-white"
						style:left={`${left}px`}
						style:width={`${w}px`}
						style:background={clip.color ?? draggingTrack.color ?? '#3b82f6'}
					>
						<span class="block truncate px-1.5 py-0.5 font-medium">{clip.name}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
