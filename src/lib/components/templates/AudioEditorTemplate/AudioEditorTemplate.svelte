<script lang="ts">
	import AudioEditor from '$lib/components/organisms/AudioEditor/AudioEditor.svelte';
	import { emptyAudioProject, type AudioProject } from '$lib/utils/audioProject.js';

	interface AudioEditorTemplateProps {
		value?: AudioProject;
		class?: string;
		onchange?: (project: AudioProject) => void;
		onexport?: (payload: { format: 'json'; document: AudioProject }) => void;
	}

	let {
		value = $bindable(emptyAudioProject()),
		class: className = '',
		onchange,
		onexport
	}: AudioEditorTemplateProps = $props();
</script>

<div class={['flex h-dvh w-full flex-col bg-surface', className]}>
	<AudioEditor bind:value {onchange} {onexport} class="min-h-0 flex-1" />
</div>
