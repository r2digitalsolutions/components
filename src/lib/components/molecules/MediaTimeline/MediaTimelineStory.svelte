<script lang="ts">
	import MediaTimeline from './MediaTimeline.svelte';
	import { createDemoVideoSequence } from '$lib/utils/videoSequence.js';

	const seq = createDemoVideoSequence();
	let currentTimeMs = $state(2000);
	let zoom = $state(1.2);
	let selectedClipId = $state<string | null>(seq.tracks[0]?.clips[0]?.id ?? null);
</script>

<div class="h-64">
	<MediaTimeline
		tracks={seq.tracks}
		durationMs={seq.durationMs}
		bind:currentTimeMs
		bind:zoom
		{selectedClipId}
		onselectclip={(id) => (selectedClipId = id)}
	/>
</div>
