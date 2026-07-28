<script lang="ts">
	import CanvasEditor from '$lib/components/organisms/CanvasEditor/CanvasEditor.svelte';
	import type { CanvasDocument } from '$lib/utils/canvasDocument.js';
	import { emptyCanvasDocument } from '$lib/utils/canvasDocument.js';
	import type { MediaAsset } from '$lib/utils/mediaTracks.js';

	interface CanvasEditorTemplateProps {
		value?: CanvasDocument;
		assets?: MediaAsset[];
		class?: string;
		onchange?: (doc: CanvasDocument) => void;
		onexport?: (payload: { format: 'json'; document: CanvasDocument }) => void;
	}

	let {
		value = $bindable(emptyCanvasDocument()),
		assets = $bindable<MediaAsset[]>([]),
		class: className = '',
		onchange,
		onexport
	}: CanvasEditorTemplateProps = $props();
</script>

<div class={['flex h-dvh w-full flex-col bg-surface', className]}>
	<CanvasEditor bind:value bind:assets {onchange} {onexport} class="min-h-0 flex-1" />
</div>
