<script lang="ts">
	import MediaStage from './MediaStage.svelte';
	import { createCanvasLayer, emptyCanvasDocument } from '$lib/utils/canvasDocument.js';

	let doc = $state(
		emptyCanvasDocument({
			layers: [
				createCanvasLayer('image', {
					name: 'Photo',
					src: 'https://picsum.photos/seed/canvas-photo/480/320',
					rect: { x: 120, y: 80, w: 480, h: 320 },
					zIndex: 0
				}),
				createCanvasLayer('text', {
					name: 'Title',
					text: 'Canvas',
					rect: { x: 160, y: 120, w: 240, h: 64 },
					zIndex: 1
				})
			]
		})
	);
	let selectedIds = $state<string[]>([doc.layers[1]?.id].filter(Boolean) as string[]);
</script>

<div class="h-[520px] overflow-hidden rounded-lg border border-border">
	<MediaStage
		document={doc}
		{selectedIds}
		onselect={(ids) => (selectedIds = ids)}
		onlayerchange={(layer) => {
			doc = { ...doc, layers: doc.layers.map((l) => (l.id === layer.id ? layer : l)) };
		}}
	/>
</div>
