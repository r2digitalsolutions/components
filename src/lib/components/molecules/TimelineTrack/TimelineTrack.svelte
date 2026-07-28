<script lang="ts">
	import type { Snippet } from 'svelte';
	import TimelineClip from '$lib/components/molecules/TimelineClip/TimelineClip.svelte';
	import type { MediaClip, MediaTrack } from '$lib/utils/mediaTracks.js';
	import { moveClip, trimClipEnd, trimClipStart } from '$lib/utils/mediaTracks.js';

	interface TimelineTrackProps {
		track: MediaTrack;
		pxPerMs?: number;
		durationMs?: number;
		selectedClipId?: string | null;
		height?: number;
		header?: Snippet;
		class?: string;
		onselectclip?: (clipId: string) => void;
		onchangeclip?: (clip: MediaClip) => void;
	}

	let {
		track,
		pxPerMs = 0.05,
		durationMs = 30_000,
		selectedClipId = null,
		height = 44,
		header,
		class: className = '',
		onselectclip,
		onchangeclip
	}: TimelineTrackProps = $props();

	const width = $derived(Math.max(1, durationMs * pxPerMs));
</script>

<div class={['flex min-w-0 border-b border-border', className]} style:height={`${height}px`}>
	{#if header}
		<div
			class="sticky left-0 z-10 flex w-36 shrink-0 items-center gap-2 border-r border-border bg-surface-elevated px-2"
		>
			{@render header()}
		</div>
	{/if}
	<div class="relative min-w-0 flex-1 overflow-hidden bg-surface/60" style:width={`${width}px`}>
		{#each track.clips as clip (clip.id)}
			<TimelineClip
				{clip}
				{pxPerMs}
				selected={selectedClipId === clip.id}
				locked={track.locked}
				onclick={() => onselectclip?.(clip.id)}
				onmove={(startMs) => onchangeclip?.(moveClip(clip, startMs))}
				ontrimstart={(startMs) => onchangeclip?.(trimClipStart(clip, startMs))}
				ontrimend={(endMs) => onchangeclip?.(trimClipEnd(clip, endMs))}
			/>
		{/each}
	</div>
</div>
