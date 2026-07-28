<script lang="ts">
	import TrackHeader from './TrackHeader.svelte';
	import { createMediaTrack } from '$lib/utils/mediaTracks.js';

	let track = $state(createMediaTrack({ name: 'Drums', kind: 'audio', color: '#3b82f6' }));
</script>

<div class="w-52 rounded-lg border border-border bg-surface-elevated p-2">
	<TrackHeader {track} onchange={(t) => (track = t)} />
</div>
