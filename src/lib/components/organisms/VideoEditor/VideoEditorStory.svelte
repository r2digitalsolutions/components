<script lang="ts">
	import VideoEditor from './VideoEditor.svelte';
	import { createDemoVideoSequence } from '$lib/utils/videoSequence.js';

	let value = $state(createDemoVideoSequence());
</script>

<!-- Edge-to-edge in Storybook — same pattern as CanvasEditor -->
<div class="fixed inset-0 overflow-hidden bg-surface">
	<VideoEditor bind:value class="h-full" />
</div>
