<script lang="ts">
	import WaveformRegion from './WaveformRegion.svelte';
	import { createMediaClip } from '$lib/utils/mediaTracks.js';

	const clip = createMediaClip({
		trackId: 't1',
		name: 'Drums',
		kind: 'audio',
		startMs: 500,
		endMs: 9000,
		color: '#3b82f6'
	});
</script>

<div class="relative h-16 w-full rounded-lg border border-border bg-surface">
	<WaveformRegion {clip} pxPerMs={0.06} selected progress={0.35} />
</div>
