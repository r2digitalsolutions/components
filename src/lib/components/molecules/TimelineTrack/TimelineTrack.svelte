<script lang="ts">
	import type { Snippet } from 'svelte';
	import TimelineClip from '$lib/components/molecules/TimelineClip/TimelineClip.svelte';
	import type { MediaClip, MediaTrack } from '$lib/utils/mediaTracks.js';
	import { moveClip, trimClipEnd, trimClipStart } from '$lib/utils/mediaTracks.js';
	import { snapMs } from '$lib/utils/mediaTime.js';

	interface TimelineTrackProps {
		track: MediaTrack;
		pxPerMs?: number;
		durationMs?: number;
		selectedClipIds?: string[];
		height?: number;
		snapToMs?: number;
		headerWidth?: number;
		header?: Snippet;
		class?: string;
		onselectclip?: (clipId: string, e: MouseEvent) => void;
		oncontextmenuclip?: (clipId: string, e: MouseEvent) => void;
		onchangeclip?: (clip: MediaClip) => void;
		oncontextmenutrack?: (trackId: string, e: MouseEvent) => void;
		/** Empty lane click (deselect) */
		onemptyclick?: (e: MouseEvent) => void;
	}

	let {
		track,
		pxPerMs = 0.05,
		durationMs = 30_000,
		selectedClipIds = [],
		height = 44,
		snapToMs = 0,
		headerWidth = 144,
		header,
		class: className = '',
		onselectclip,
		oncontextmenuclip,
		onchangeclip,
		oncontextmenutrack,
		onemptyclick
	}: TimelineTrackProps = $props();

	const width = $derived(Math.max(1, durationMs * pxPerMs));
	const selectedSet = $derived(new Set(selectedClipIds));

	function snap(ms: number) {
		return snapToMs > 0 ? snapMs(ms, snapToMs) : ms;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={['relative z-[1] flex min-w-0 border-b border-border', className]}
	style:height={`${height}px`}
	oncontextmenu={(e) => {
		const t = e.target as HTMLElement;
		if (t.closest('[aria-label]') && t.getAttribute('role') === 'button') return;
		oncontextmenutrack?.(track.id, e);
	}}
>
	{#if header}
		<div
			class="sticky left-0 z-10 flex shrink-0 items-center border-r border-border bg-surface-elevated px-1"
			style:width={`${headerWidth}px`}
		>
			{@render header()}
		</div>
	{/if}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="relative min-w-0 flex-1 overflow-hidden bg-transparent"
		style:width={`${width}px`}
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) onemptyclick?.(e);
		}}
	>
		{#each track.clips as clip (clip.id)}
			<TimelineClip
				{clip}
				{pxPerMs}
				selected={selectedSet.has(clip.id)}
				locked={track.locked}
				onclick={(e) => onselectclip?.(clip.id, e)}
				oncontextmenu={(e) => oncontextmenuclip?.(clip.id, e)}
				onmove={(startMs) => onchangeclip?.(moveClip(clip, snap(startMs)))}
				ontrimstart={(startMs) => onchangeclip?.(trimClipStart(clip, snap(startMs)))}
				ontrimend={(endMs) => onchangeclip?.(trimClipEnd(clip, snap(endMs)))}
			/>
		{/each}
	</div>
</div>
