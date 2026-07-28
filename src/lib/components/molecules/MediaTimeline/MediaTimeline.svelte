<script lang="ts">
	import Playhead from '$lib/components/atoms/Playhead/Playhead.svelte';
	import TimeRuler from '$lib/components/atoms/TimeRuler/TimeRuler.svelte';
	import TimelineTrack from '$lib/components/molecules/TimelineTrack/TimelineTrack.svelte';
	import VideoTrackHeader from '$lib/components/molecules/VideoTrackHeader/VideoTrackHeader.svelte';
	import TrackHeader from '$lib/components/molecules/TrackHeader/TrackHeader.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { MediaClip, MediaTrack } from '$lib/utils/mediaTracks.js';
	import { clampMs, msToPx, pxPerMsFromZoom, pxToMs } from '$lib/utils/mediaTime.js';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';

	interface MediaTimelineProps {
		tracks?: MediaTrack[];
		durationMs?: number;
		currentTimeMs?: number;
		zoom?: number;
		selectedClipId?: string | null;
		showHeaders?: boolean;
		headerVariant?: 'video' | 'audio' | 'plain';
		class?: string;
		onseek?: (ms: number) => void;
		onselectclip?: (clipId: string) => void;
		onchangeclip?: (clip: MediaClip) => void;
		onchangetrack?: (track: MediaTrack) => void;
		onzoomchange?: (zoom: number) => void;
	}

	let {
		tracks = [],
		durationMs = 30_000,
		currentTimeMs = $bindable(0),
		zoom = $bindable(1),
		selectedClipId = null,
		showHeaders = true,
		headerVariant = 'plain',
		class: className = '',
		onseek,
		onselectclip,
		onchangeclip,
		onchangetrack,
		onzoomchange
	}: MediaTimelineProps = $props();

	const pxPerMs = $derived(pxPerMsFromZoom(zoom));
	const contentWidth = $derived(Math.max(1, durationMs * pxPerMs));
	const playheadX = $derived(msToPx(currentTimeMs, pxPerMs));

	let scroller = $state<HTMLDivElement | null>(null);

	function seekFromClientX(clientX: number) {
		if (!scroller) return;
		const rect = scroller.getBoundingClientRect();
		const x = clientX - rect.left + scroller.scrollLeft - (showHeaders ? 144 : 0);
		const ms = clampMs(pxToMs(x, pxPerMs), 0, durationMs);
		currentTimeMs = ms;
		onseek?.(ms);
	}

	function setZoom(next: number) {
		zoom = Math.min(8, Math.max(0.25, next));
		onzoomchange?.(zoom);
	}
</script>

<div class={['flex flex-col overflow-hidden rounded-lg border border-border bg-surface', className]}>
	<div class="flex items-center justify-end gap-1 border-b border-border px-2 py-1">
		<IconButton label="Zoom out" size="xs" onclick={() => setZoom(zoom / 1.25)}>
			<ZoomOut class="h-3.5 w-3.5" />
		</IconButton>
		<IconButton label="Zoom in" size="xs" onclick={() => setZoom(zoom * 1.25)}>
			<ZoomIn class="h-3.5 w-3.5" />
		</IconButton>
	</div>
	<div bind:this={scroller} class="relative min-h-0 flex-1 overflow-auto">
		<div class="relative" style:width={`${contentWidth + (showHeaders ? 144 : 0)}px`}>
			<div class="sticky top-0 z-30 flex bg-surface">
				{#if showHeaders}
					<div class="sticky left-0 z-10 w-36 shrink-0 border-r border-border bg-surface-elevated"></div>
				{/if}
				<TimeRuler
					{durationMs}
					{pxPerMs}
					onclick={(ms) => {
						currentTimeMs = clampMs(ms, 0, durationMs);
						onseek?.(currentTimeMs);
					}}
				/>
			</div>

			<div class="relative">
				{#each tracks as track (track.id)}
					<TimelineTrack
						{track}
						{pxPerMs}
						{durationMs}
						{selectedClipId}
						onselectclip={onselectclip}
						onchangeclip={onchangeclip}
					>
						{#snippet header()}
							{#if showHeaders}
								{#if headerVariant === 'video' && onchangetrack}
									<VideoTrackHeader {track} onchange={onchangetrack} />
								{:else if headerVariant === 'audio' && onchangetrack}
									<TrackHeader {track} onchange={onchangetrack} />
								{:else}
									<span class="truncate text-xs font-medium text-secondary">{track.name}</span>
								{/if}
							{/if}
						{/snippet}
					</TimelineTrack>
				{/each}

				<div
					class="pointer-events-none absolute inset-y-0"
					style:left={`${showHeaders ? 144 : 0}px`}
					style:width={`${contentWidth}px`}
				>
					<div class="pointer-events-auto absolute inset-y-0" style:width={`${contentWidth}px`}>
						<Playhead
							x={playheadX}
							ondrag={(e) => seekFromClientX(e.clientX)}
							ondragstart={(e) => seekFromClientX(e.clientX)}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
