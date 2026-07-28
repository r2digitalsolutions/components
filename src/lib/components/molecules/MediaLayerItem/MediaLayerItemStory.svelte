<script lang="ts">
	import MediaLayerItem from './MediaLayerItem.svelte';
	import { createCanvasLayer } from '$lib/utils/canvasDocument.js';

	const layer = createCanvasLayer('text', {
		name: 'Hello',
		text: 'Hello',
		rect: { x: 40, y: 40, w: 200, h: 80 }
	});
</script>

<div class="relative h-64 w-full rounded-lg border border-border bg-neutral-900">
	<MediaLayerItem {layer} selected />
</div>
