<script lang="ts">
	import AudioEditor from './AudioEditor.svelte';
	import { createDemoAudioProject } from '$lib/utils/audioProject.js';

	let value = $state(createDemoAudioProject());
</script>

<div class="h-[780px] w-full overflow-hidden rounded-xl border border-border">
	<AudioEditor bind:value />
</div>
