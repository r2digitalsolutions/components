<script lang="ts">
	import VideoEditorTemplate from './VideoEditorTemplate.svelte';
	import { createDemoVideoSequence } from '$lib/utils/videoSequence.js';

	let value = $state(createDemoVideoSequence());
</script>

<VideoEditorTemplate bind:value />
