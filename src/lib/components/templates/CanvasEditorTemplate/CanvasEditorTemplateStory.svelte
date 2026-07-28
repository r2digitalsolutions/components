<script lang="ts">
	import CanvasEditorTemplate from './CanvasEditorTemplate.svelte';
	import { createCanvasLayer, emptyCanvasDocument } from '$lib/utils/canvasDocument.js';

	let value = $state(
		emptyCanvasDocument({
			layers: [
				createCanvasLayer('text', {
					name: 'Welcome',
					text: 'Figma-like canvas',
					rect: { x: 200, y: 200, w: 400, h: 100 },
					zIndex: 0
				})
			]
		})
	);
</script>

<div class="fixed inset-0 overflow-hidden">
	<CanvasEditorTemplate bind:value class="!h-full" />
</div>
