<script lang="ts">
	import VideoEditor from '$lib/components/organisms/VideoEditor/VideoEditor.svelte';
	import { emptyVideoSequence, type VideoSequence } from '$lib/utils/videoSequence.js';

	interface VideoEditorTemplateProps {
		value?: VideoSequence;
		class?: string;
		onchange?: (seq: VideoSequence) => void;
		onexport?: (payload: { format: 'json'; document: VideoSequence }) => void;
	}

	let {
		value = $bindable(emptyVideoSequence()),
		class: className = '',
		onchange,
		onexport
	}: VideoEditorTemplateProps = $props();
</script>

<div class={['flex h-dvh w-full flex-col bg-surface', className]}>
	<VideoEditor bind:value {onchange} {onexport} class="min-h-0 flex-1" />
</div>
