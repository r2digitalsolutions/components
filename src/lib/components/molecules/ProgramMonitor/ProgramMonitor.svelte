<script lang="ts">
	import type { MediaClip, MediaTrack } from '$lib/utils/mediaTracks.js';
	import { findClipAt } from '$lib/utils/mediaTracks.js';

	interface ProgramMonitorProps {
		width?: number;
		height?: number;
		background?: string;
		currentTimeMs?: number;
		tracks?: MediaTrack[];
		class?: string;
	}

	let {
		width = 1280,
		height = 720,
		background = '#0a0a0a',
		currentTimeMs = 0,
		tracks = [],
		class: className = ''
	}: ProgramMonitorProps = $props();

	const activeVideo = $derived(
		findClipAt(tracks, currentTimeMs, 'video') ?? findClipAt(tracks, currentTimeMs, 'image')
	);
	const activeAudio = $derived(findClipAt(tracks, currentTimeMs, 'audio'));

	function sourceTime(clip: MediaClip): number {
		const trim = clip.trimInMs ?? 0;
		return Math.max(0, currentTimeMs - clip.startMs + trim) / 1000;
	}
</script>

<div
	class={[
		'relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-border',
		className
	]}
	style:background
	style:aspect-ratio={`${width} / ${height}`}
>
	{#if activeVideo?.src && activeVideo.kind === 'video'}
		<video
			src={activeVideo.src}
			class="h-full w-full object-contain"
			muted
			playsinline
			currentTime={sourceTime(activeVideo)}
		></video>
	{:else if activeVideo?.src && activeVideo.kind === 'image'}
		<img src={activeVideo.src} alt={activeVideo.name} class="h-full w-full object-contain" />
	{:else if activeVideo}
		<div class="flex flex-col items-center gap-2 text-secondary">
			<span class="rounded-md bg-surface-overlay px-3 py-1.5 text-sm font-medium text-primary">
				{activeVideo.name}
			</span>
			<span class="text-xs text-muted">No media source</span>
		</div>
	{:else}
		<span class="text-sm text-muted">No clip at playhead</span>
	{/if}

	{#if activeAudio?.src}
		<audio src={activeAudio.src} currentTime={sourceTime(activeAudio)} class="hidden"></audio>
	{/if}

	<div
		class="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white"
	>
		{Math.round(currentTimeMs)}ms
	</div>
</div>
