<script lang="ts">
	import AudioEditorTemplate from './AudioEditorTemplate.svelte';
	import { createDemoAudioProject } from '$lib/utils/audioProject.js';

	let value = $state(createDemoAudioProject());
</script>

<AudioEditorTemplate bind:value />
