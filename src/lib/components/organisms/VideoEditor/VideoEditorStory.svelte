<script lang="ts">
	import VideoEditor from './VideoEditor.svelte';
	import { createDemoVideoSequence } from '$lib/utils/videoSequence.js';

	let value = $state(createDemoVideoSequence());
</script>

<div class="h-[780px] w-full overflow-hidden rounded-xl border border-border">
	<VideoEditor bind:value />
</div>
