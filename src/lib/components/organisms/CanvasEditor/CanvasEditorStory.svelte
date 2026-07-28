<script lang="ts">
	import CanvasEditor from './CanvasEditor.svelte';
	import ToastContainer from '$lib/components/organisms/Toast/ToastContainer.svelte';
	import {
		createCanvasLayer,
		defaultSlotFromRect,
		emptyCanvasDocument,
		type CanvasExposedProp,
		type CanvasLayer
	} from '$lib/utils/canvasDocument.js';
	import { createWidgetDefinition } from '$lib/utils/canvasWidget.js';
	import { uid } from '$lib/utils/mediaTracks.js';

	function withId(layer: CanvasLayer, id: string): CanvasLayer {
		return { ...layer, id };
	}

	const titleId = uid('layer');
	const borderId = uid('layer');
	const overlayId = uid('layer');
	const imageId = uid('layer');
	const slotId = uid('layer');
	const titleExpose: CanvasExposedProp = {
		id: uid('exp'),
		targetLayerId: titleId,
		field: 'text',
		label: 'Title',
		exposed: true
	};

	const cardWidget = createWidgetDefinition({
		name: 'Card',
		width: 320,
		height: 260,
		background: 'transparent',
		layers: [
			withId(
				createCanvasLayer('border', {
					name: 'Card Border',
					fill: '#ffffff',
					borderRadius: 16,
					clipChildren: true,
					parentId: null,
					rect: { x: 0, y: 0, w: 320, h: 260 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 320, h: 260 }),
					zIndex: 0
				}),
				borderId
			),
			withId(
				createCanvasLayer('overlay', {
					name: 'Content',
					fill: 'transparent',
					clipChildren: true,
					parentId: borderId,
					rect: { x: 0, y: 0, w: 320, h: 260 },
					slot: {
						anchors: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
						offsets: { left: 0, top: 0, right: 0, bottom: 0 }
					},
					zIndex: 0
				}),
				overlayId
			),
			withId(
				createCanvasLayer('image', {
					name: 'Thumb',
					src: 'https://picsum.photos/seed/umg-card/320/120',
					parentId: overlayId,
					rect: { x: 0, y: 0, w: 320, h: 110 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 320, h: 110 }),
					zIndex: 0
				}),
				imageId
			),
			withId(
				createCanvasLayer('text', {
					name: 'Title',
					text: 'Card title',
					fontSize: 22,
					fontWeight: 700,
					color: '#0f172a',
					parentId: overlayId,
					rect: { x: 16, y: 122, w: 288, h: 36 },
					slot: defaultSlotFromRect({ x: 16, y: 122, w: 288, h: 36 }),
					zIndex: 1
				}),
				titleId
			),
			withId(
				createCanvasLayer('namedSlot', {
					name: 'Footer',
					slotName: 'Footer',
					fill: 'rgba(59,130,246,0.06)',
					parentId: overlayId,
					rect: { x: 12, y: 168, w: 296, h: 72 },
					slot: defaultSlotFromRect({ x: 12, y: 168, w: 296, h: 72 }),
					zIndex: 2
				}),
				slotId
			)
		],
		exposed: [titleExpose]
	});

	const panelId = uid('layer');
	const hboxId = uid('layer');
	const wrapId = uid('layer');
	const gridId = uid('layer');
	const cardAId = uid('layer');

	let value = $state(
		emptyCanvasDocument({
			width: 1280,
			height: 720,
			background: '#f1f5f9',
			widgets: [cardWidget],
			layers: [
				withId(
					createCanvasLayer('canvasPanel', {
						name: 'Root Canvas',
						fill: 'transparent',
						clipChildren: true,
						rect: { x: 0, y: 0, w: 1280, h: 720 },
						slot: {
							anchors: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
							offsets: { left: 0, top: 0, right: 0, bottom: 0 }
						},
						zIndex: 0
					}),
					panelId
				),
				withId(
					createCanvasLayer('widget', {
						name: 'Card A',
						definitionId: cardWidget.id,
						parentId: panelId,
						overrides: { [titleExpose.id]: 'Hello UMG' },
						rect: { x: 48, y: 48, w: 320, h: 260 },
						slot: defaultSlotFromRect({ x: 48, y: 48, w: 320, h: 260 }),
						zIndex: 0
					}),
					cardAId
				),
				createCanvasLayer('text', {
					name: 'Footer fill',
					text: 'Injected via Named Slot',
					fontSize: 14,
					fontWeight: 600,
					color: '#1d4ed8',
					parentId: cardAId,
					fillSlot: 'Footer',
					rect: { x: 0, y: 0, w: 280, h: 40 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 280, h: 40 }),
					zIndex: 0
				}),
				createCanvasLayer('widget', {
					name: 'Card B',
					definitionId: cardWidget.id,
					parentId: panelId,
					overrides: { [titleExpose.id]: 'Reusable widget' },
					rect: { x: 400, y: 48, w: 320, h: 260 },
					slot: defaultSlotFromRect({ x: 400, y: 48, w: 320, h: 260 }),
					zIndex: 1
				}),
				withId(
					createCanvasLayer('hBox', {
						name: 'Toolbar',
						fill: 'transparent',
						gap: 12,
						parentId: panelId,
						rect: { x: 48, y: 340, w: 480, h: 56 },
						slot: defaultSlotFromRect({ x: 48, y: 340, w: 480, h: 56 }),
						zIndex: 2
					}),
					hboxId
				),
				createCanvasLayer('roundRect', {
					name: 'Action',
					fill: '#2563eb',
					borderRadius: 10,
					parentId: hboxId,
					rect: { x: 0, y: 0, w: 120, h: 40 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 120, h: 40 }),
					zIndex: 0
				}),
				createCanvasLayer('roundRect', {
					name: 'Secondary',
					fill: '#e2e8f0',
					borderRadius: 10,
					parentId: hboxId,
					rect: { x: 0, y: 0, w: 120, h: 40 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 120, h: 40 }),
					zIndex: 1
				}),
				withId(
					createCanvasLayer('wrapBox', {
						name: 'Tags',
						fill: 'transparent',
						gap: 8,
						parentId: panelId,
						rect: { x: 48, y: 420, w: 320, h: 100 },
						slot: defaultSlotFromRect({ x: 48, y: 420, w: 320, h: 100 }),
						zIndex: 3
					}),
					wrapId
				),
				createCanvasLayer('roundRect', {
					name: 'Tag A',
					fill: '#bfdbfe',
					borderRadius: 999,
					parentId: wrapId,
					rect: { x: 0, y: 0, w: 88, h: 28 },
					zIndex: 0
				}),
				createCanvasLayer('roundRect', {
					name: 'Tag B',
					fill: '#bbf7d0',
					borderRadius: 999,
					parentId: wrapId,
					rect: { x: 0, y: 0, w: 100, h: 28 },
					zIndex: 1
				}),
				createCanvasLayer('roundRect', {
					name: 'Tag C',
					fill: '#fde68a',
					borderRadius: 999,
					parentId: wrapId,
					rect: { x: 0, y: 0, w: 72, h: 28 },
					zIndex: 2
				}),
				createCanvasLayer('roundRect', {
					name: 'Tag D',
					fill: '#fbcfe8',
					borderRadius: 999,
					parentId: wrapId,
					rect: { x: 0, y: 0, w: 110, h: 28 },
					zIndex: 3
				}),
				withId(
					createCanvasLayer('uniformGrid', {
						name: 'Grid',
						fill: 'transparent',
						gap: 10,
						columns: 2,
						parentId: panelId,
						rect: { x: 400, y: 340, w: 280, h: 180 },
						slot: defaultSlotFromRect({ x: 400, y: 340, w: 280, h: 180 }),
						zIndex: 4
					}),
					gridId
				),
				createCanvasLayer('rect', {
					name: 'Cell 1',
					fill: '#93c5fd',
					parentId: gridId,
					rect: { x: 0, y: 0, w: 80, h: 80 },
					zIndex: 0
				}),
				createCanvasLayer('rect', {
					name: 'Cell 2',
					fill: '#86efac',
					parentId: gridId,
					rect: { x: 0, y: 0, w: 80, h: 80 },
					zIndex: 1
				}),
				createCanvasLayer('rect', {
					name: 'Cell 3',
					fill: '#fcd34d',
					parentId: gridId,
					rect: { x: 0, y: 0, w: 80, h: 80 },
					zIndex: 2
				}),
				createCanvasLayer('rect', {
					name: 'Cell 4',
					fill: '#c4b5fd',
					parentId: gridId,
					rect: { x: 0, y: 0, w: 80, h: 80 },
					zIndex: 3
				}),
				createCanvasLayer('scrollBox', {
					name: 'Scroll',
					fill: '#fff',
					clipChildren: true,
					borderRadius: 8,
					parentId: panelId,
					rect: { x: 720, y: 340, w: 200, h: 180 },
					slot: defaultSlotFromRect({ x: 720, y: 340, w: 200, h: 180 }),
					zIndex: 5
				})
			]
		})
	);

	// Tall content inside scroll box (parentId set after — find scroll by name)
	const scroll = value.layers.find((l) => l.kind === 'scrollBox');
	if (scroll) {
		value = {
			...value,
			layers: [
				...value.layers,
				createCanvasLayer('text', {
					name: 'Scroll line 1',
					text: 'Scrollable content',
					fontSize: 16,
					parentId: scroll.id,
					rect: { x: 12, y: 12, w: 160, h: 32 },
					zIndex: 0
				}),
				createCanvasLayer('text', {
					name: 'Scroll line 2',
					text: 'Below the fold…',
					fontSize: 14,
					color: '#64748b',
					parentId: scroll.id,
					rect: { x: 12, y: 200, w: 160, h: 32 },
					zIndex: 1
				})
			]
		};
	}
</script>

<!-- Edge-to-edge in Storybook fullscreen — no padding / radius gap -->
<div class="fixed inset-0 overflow-hidden bg-surface">
	<CanvasEditor bind:value class="h-full" />
	<ToastContainer />
</div>
