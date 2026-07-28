<script lang="ts">
	import TimelineTrack from './TimelineTrack.svelte';
	import { createMediaTrack, createMediaClip } from '$lib/utils/mediaTracks.js';

	const track = createMediaTrack({
		name: 'V1',
		kind: 'video',
		clips: [
			createMediaClip({
				trackId: 't',
				name: 'A',
				kind: 'video',
				startMs: 0,
				endMs: 5000,
				color: '#3b82f6'
			}),
			createMediaClip({
				trackId: 't',
				name: 'B',
				kind: 'image',
				startMs: 6000,
				endMs: 12000,
				color: '#8b5cf6'
			})
		]
	});
</script>

<div class="overflow-x-auto rounded-lg border border-border">
	<TimelineTrack {track} durationMs={20000} pxPerMs={0.06} selectedClipId={track.clips[0]?.id}>
		{#snippet header()}
			<span class="truncate text-xs font-medium text-secondary">{track.name}</span>
		{/snippet}
	</TimelineTrack>
</div>
