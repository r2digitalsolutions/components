<script lang="ts">
	import TimelineClip from './TimelineClip.svelte';
	import type { MediaClip } from '$lib/utils/mediaTracks.js';

	const clip: MediaClip = {
		id: 'c1',
		trackId: 't1',
		name: 'Intro',
		kind: 'video',
		startMs: 1000,
		endMs: 8000,
		color: '#8b5cf6'
	};
</script>

<div class="relative h-12 w-full rounded-lg border border-border bg-surface">
	<TimelineClip {clip} pxPerMs={0.08} selected />
</div>
