<script lang="ts">
	import CanvasEditor from './CanvasEditor.svelte';
	import { createCanvasLayer, emptyCanvasDocument } from '$lib/utils/canvasDocument.js';

	let value = $state(
		emptyCanvasDocument({
			width: 1280,
			height: 720,
			background: '#ffffff',
			layers: [
				createCanvasLayer('image', {
					name: 'Photo',
					src: 'https://picsum.photos/seed/canvas-photo/640/400',
					rect: { x: 160, y: 100, w: 640, h: 400 },
					zIndex: 0
				}),
				createCanvasLayer('text', {
					name: 'Headline',
					text: 'Design',
					fontSize: 56,
					fontWeight: 700,
					color: '#0f172a',
					rect: { x: 200, y: 140, w: 360, h: 72 },
					zIndex: 1
				})
			]
		})
	);
</script>

<!-- Edge-to-edge in Storybook fullscreen — no padding / radius gap -->
<div class="fixed inset-0 overflow-hidden bg-surface">
	<CanvasEditor bind:value class="h-full" />
</div>
