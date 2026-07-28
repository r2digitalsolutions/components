<script lang="ts">
	import VideoTrackHeader from './VideoTrackHeader.svelte';
	import { createMediaTrack } from '$lib/utils/mediaTracks.js';

	let track = $state(createMediaTrack({ name: 'V1', kind: 'video', color: '#3b82f6' }));
</script>

<div class="w-48 rounded-lg border border-border bg-surface-elevated p-2">
	<VideoTrackHeader {track} onchange={(t) => (track = t)} />
</div>
