<script lang="ts">
	import Playhead from '$lib/components/atoms/Playhead/Playhead.svelte';
	import TimeRuler from '$lib/components/atoms/TimeRuler/TimeRuler.svelte';
	import TimelineGrid from '$lib/components/atoms/TimelineGrid/TimelineGrid.svelte';
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
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';

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
		onchangetrack?: (track: MediaTrack) => void;
		onzoomchange?: (zoom: number) => void;
		onaddtrack?: (kind: MediaTrackKind) => void;
		onremovetrack?: (trackId: string) => void;
		/** Fired with new track id order after drag reorder */
		onreordertracks?: (orderedIds: string[]) => void;
		onemptyclick?: (e: MouseEvent) => void;
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
		onchangetrack,
		onzoomchange,
		onaddtrack,
		onremovetrack,
		onreordertracks,
		onemptyclick
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
	let dragTrackId = $state<string | null>(null);
	let dropTrackId = $state<string | null>(null);
	let scrubbing = $state(false);
	const rulerH = 28;

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

	function onTrackDragOver(trackId: string, e: DragEvent) {
		if (!reorderTracks || !dragTrackId) return;
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dropTrackId = trackId;
	}

	function onTrackDrop(targetId: string, e: DragEvent) {
		if (!reorderTracks) return;
		e.preventDefault();
		const sourceId = dragTrackId ?? e.dataTransfer?.getData('text/plain');
		dragTrackId = null;
		dropTrackId = null;
		if (!sourceId || sourceId === targetId) return;
		const ids = tracks.map((t) => t.id);
		const from = ids.indexOf(sourceId);
		const to = ids.indexOf(targetId);
		if (from < 0 || to < 0) return;
		const next = [...ids];
		next.splice(from, 1);
		next.splice(to, 0, sourceId);
		onreordertracks?.(next);
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
					<div
						class={[
							'relative',
							dragTrackId === track.id && 'opacity-50',
							dropTrackId === track.id && dragTrackId && dragTrackId !== track.id
								? 'ring-1 ring-inset ring-brand-500'
								: ''
						]}
						ondragover={(e) => onTrackDragOver(track.id, e)}
						ondragleave={() => {
							if (dropTrackId === track.id) dropTrackId = null;
						}}
						ondrop={(e) => onTrackDrop(track.id, e)}
					>
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
											ondragstart={(id) => (dragTrackId = id)}
											ondragend={() => {
												dragTrackId = null;
												dropTrackId = null;
											}}
										/>
									{:else if headerVariant === 'audio' && onchangetrack}
										<TrackHeader {track} onchange={onchangetrack} />
									{:else}
										<span class="truncate text-xs font-medium text-secondary">{track.name}</span>
									{/if}
								{/if}
							{/snippet}
						</TimelineTrack>
					</div>
				{/each}

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
