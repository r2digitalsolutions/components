<script lang="ts">
	import CanvasInspector from './CanvasInspector.svelte';
	import { createCanvasLayer, emptyCanvasDocument } from '$lib/utils/canvasDocument.js';

	let layer = $state(
		createCanvasLayer('text', { name: 'Title', text: 'Hello', rect: { x: 10, y: 20, w: 200, h: 60 } })
	);
	let doc = $state(emptyCanvasDocument());
</script>

<div class="w-72 rounded-lg border border-border bg-surface-elevated">
	<CanvasInspector
		document={doc}
		{layer}
		ondocumentchange={(d) => (doc = d)}
		onchange={(l) => {
			layer = l;
		}}
	/>
</div>
