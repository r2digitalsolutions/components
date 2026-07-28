<script lang="ts" module>
	import type { CanvasLayerKind } from '$lib/utils/canvasDocument.js';

	export const CANVAS_ELEMENT_MIME = 'application/x-r2-canvas-element';

	export interface CanvasElementDef {
		id: string;
		label: string;
		kind: CanvasLayerKind;
		group: string;
		swatch?: string;
		/** Shown in the tile preview (emoji / glyph). */
		glyph?: string;
		partial?: {
			name?: string;
			text?: string;
			fontSize?: number;
			fontWeight?: number | string;
			fontFamily?: string;
			letterSpacing?: number;
			fill?: string;
			color?: string;
			borderRadius?: number;
			stroke?: string;
			strokeWidth?: number;
			textAlign?: 'left' | 'center' | 'right';
			textBackground?: string;
			clipChildren?: boolean;
			gap?: number;
			slotName?: string;
			columns?: number;
			rect?: { w: number; h: number };
		};
		/** Special tool action instead of placing a layer. */
		tool?: 'pen';
	}
</script>

<script lang="ts">
	interface CanvasElementsPanelProps {
		class?: string;
		onadd?: (def: CanvasElementDef) => void;
	}

	let { class: className = '', onadd }: CanvasElementsPanelProps = $props();

	const elements: CanvasElementDef[] = [
		/* —— Text —— */
		{
			id: 'heading',
			label: 'Heading',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Heading',
				text: 'Add a heading',
				fontSize: 56,
				fontWeight: 700,
				rect: { w: 440, h: 80 }
			}
		},
		{
			id: 'subheading',
			label: 'Subheading',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Subheading',
				text: 'Add a subheading',
				fontSize: 32,
				fontWeight: 600,
				rect: { w: 360, h: 56 }
			}
		},
		{
			id: 'title',
			label: 'Title',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Title',
				text: 'Title',
				fontSize: 42,
				fontWeight: 700,
				rect: { w: 380, h: 64 }
			}
		},
		{
			id: 'body',
			label: 'Body',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Body',
				text: 'Add a little bit of body text',
				fontSize: 18,
				fontWeight: 400,
				rect: { w: 320, h: 96 }
			}
		},
		{
			id: 'caption',
			label: 'Caption',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Caption',
				text: 'Caption text',
				fontSize: 14,
				fontWeight: 500,
				color: '#64748b',
				rect: { w: 280, h: 40 }
			}
		},
		{
			id: 'label',
			label: 'Label',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Label',
				text: 'LABEL',
				fontSize: 12,
				fontWeight: 700,
				color: '#94a3b8',
				letterSpacing: 2,
				rect: { w: 160, h: 28 }
			}
		},
		{
			id: 'quote',
			label: 'Quote',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Quote',
				text: '“A short quote”',
				fontSize: 28,
				fontWeight: 500,
				rect: { w: 400, h: 100 }
			}
		},
		{
			id: 'code',
			label: 'Code',
			kind: 'text',
			group: 'Text',
			partial: {
				name: 'Code',
				text: 'const x = 1;',
				fontSize: 16,
				fontWeight: 500,
				fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
				color: '#e2e8f0',
				textBackground: '#0f172a',
				rect: { w: 280, h: 48 }
			}
		},

		/* —— Stickies —— */
		{
			id: 'sticky-yellow',
			label: 'Yellow',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#fef08a',
			partial: { fill: '#fef08a', text: 'Note', color: '#713f12', fontSize: 20 }
		},
		{
			id: 'sticky-pink',
			label: 'Pink',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#fbcfe8',
			partial: { fill: '#fbcfe8', text: 'Note', color: '#9d174d', fontSize: 20 }
		},
		{
			id: 'sticky-green',
			label: 'Green',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#bbf7d0',
			partial: { fill: '#bbf7d0', text: 'Note', color: '#14532d', fontSize: 20 }
		},
		{
			id: 'sticky-blue',
			label: 'Blue',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#bae6fd',
			partial: { fill: '#bae6fd', text: 'Note', color: '#0c4a6e', fontSize: 20 }
		},
		{
			id: 'sticky-orange',
			label: 'Orange',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#fed7aa',
			partial: { fill: '#fed7aa', text: 'Note', color: '#9a3412', fontSize: 20 }
		},
		{
			id: 'sticky-purple',
			label: 'Purple',
			kind: 'sticky',
			group: 'Stickies',
			swatch: '#e9d5ff',
			partial: { fill: '#e9d5ff', text: 'Note', color: '#6b21a8', fontSize: 20 }
		},

		/* —— Shapes —— */
		{
			id: 'rect',
			label: 'Rectangle',
			kind: 'rect',
			group: 'Shapes',
			swatch: '#3b82f6',
			partial: { fill: '#3b82f6' }
		},
		{
			id: 'square',
			label: 'Square',
			kind: 'rect',
			group: 'Shapes',
			swatch: '#2563eb',
			partial: { name: 'Square', fill: '#2563eb', rect: { w: 200, h: 200 } }
		},
		{
			id: 'roundRect',
			label: 'Rounded',
			kind: 'roundRect',
			group: 'Shapes',
			swatch: '#8b5cf6',
			partial: { fill: '#8b5cf6', borderRadius: 28 }
		},
		{
			id: 'ellipse',
			label: 'Ellipse',
			kind: 'ellipse',
			group: 'Shapes',
			swatch: '#22c55e',
			partial: { fill: '#22c55e' }
		},
		{
			id: 'circle',
			label: 'Circle',
			kind: 'ellipse',
			group: 'Shapes',
			swatch: '#16a34a',
			partial: { name: 'Circle', fill: '#16a34a', rect: { w: 200, h: 200 } }
		},
		{
			id: 'triangle',
			label: 'Triangle',
			kind: 'triangle',
			group: 'Shapes',
			swatch: '#f59e0b',
			partial: { fill: '#f59e0b' }
		},
		{
			id: 'star',
			label: 'Star',
			kind: 'star',
			group: 'Shapes',
			swatch: '#ef4444',
			partial: { fill: '#ef4444' }
		},
		{
			id: 'hexagon',
			label: 'Hexagon',
			kind: 'hexagon',
			group: 'Shapes',
			swatch: '#06b6d4',
			partial: { fill: '#06b6d4' }
		},
		{
			id: 'pentagon',
			label: 'Pentagon',
			kind: 'pentagon',
			group: 'Shapes',
			swatch: '#a855f7',
			partial: { fill: '#a855f7' }
		},
		{
			id: 'diamond',
			label: 'Diamond',
			kind: 'diamond',
			group: 'Shapes',
			swatch: '#f43f5e',
			partial: { fill: '#f43f5e' }
		},
		{
			id: 'heart',
			label: 'Heart',
			kind: 'heart',
			group: 'Shapes',
			swatch: '#ec4899',
			partial: { fill: '#ec4899' }
		},
		{
			id: 'shape-coral',
			label: 'Coral',
			kind: 'roundRect',
			group: 'Shapes',
			swatch: '#fb7185',
			partial: { name: 'Coral', fill: '#fb7185', borderRadius: 20 }
		},
		{
			id: 'shape-teal',
			label: 'Teal',
			kind: 'ellipse',
			group: 'Shapes',
			swatch: '#14b8a6',
			partial: { name: 'Teal', fill: '#14b8a6' }
		},
		{
			id: 'shape-indigo',
			label: 'Indigo',
			kind: 'hexagon',
			group: 'Shapes',
			swatch: '#6366f1',
			partial: { name: 'Indigo', fill: '#6366f1' }
		},
		{
			id: 'shape-slate',
			label: 'Slate',
			kind: 'rect',
			group: 'Shapes',
			swatch: '#64748b',
			partial: { name: 'Slate', fill: '#64748b' }
		},

		/* —— Lines —— */
		{
			id: 'line',
			label: 'Line',
			kind: 'line',
			group: 'Lines',
			swatch: '#94a3b8',
			partial: { fill: '#94a3b8', rect: { w: 320, h: 4 } }
		},
		{
			id: 'line-thick',
			label: 'Thick',
			kind: 'line',
			group: 'Lines',
			swatch: '#475569',
			partial: { name: 'Thick line', fill: '#475569', strokeWidth: 8, rect: { w: 320, h: 8 } }
		},
		{
			id: 'line-v',
			label: 'Vertical',
			kind: 'line',
			group: 'Lines',
			swatch: '#94a3b8',
			partial: { name: 'Vertical', fill: '#94a3b8', strokeWidth: 4, rect: { w: 4, h: 280 } }
		},
		{
			id: 'arrow',
			label: 'Arrow',
			kind: 'arrow',
			group: 'Lines',
			swatch: '#0f172a',
			partial: { fill: '#0f172a', strokeWidth: 4, rect: { w: 280, h: 28 } }
		},
		{
			id: 'arrow-brand',
			label: 'Brand',
			kind: 'arrow',
			group: 'Lines',
			swatch: '#3b82f6',
			partial: { name: 'Brand arrow', fill: '#3b82f6', rect: { w: 280, h: 28 } }
		},
		{
			id: 'divider',
			label: 'Divider',
			kind: 'line',
			group: 'Lines',
			swatch: '#cbd5e1',
			partial: { name: 'Divider', fill: '#cbd5e1', rect: { w: 480, h: 2 } }
		},
		{
			id: 'pen-path',
			label: 'Path',
			kind: 'path',
			group: 'Lines',
			swatch: '#0f172a',
			tool: 'pen',
			partial: { name: 'Path', stroke: '#0f172a', strokeWidth: 3 }
		},

		/* —— Frames —— */
		{
			id: 'frame',
			label: 'Frame',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#e2e8f0',
			partial: {
				name: 'Frame',
				fill: '#f8fafc',
				borderRadius: 16,
				stroke: '#cbd5e1',
				strokeWidth: 2,
				rect: { w: 360, h: 240 }
			}
		},
		{
			id: 'pill',
			label: 'Pill',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#0ea5e9',
			partial: { name: 'Pill', fill: '#0ea5e9', borderRadius: 999, rect: { w: 200, h: 56 } }
		},
		{
			id: 'card',
			label: 'Card',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#ffffff',
			partial: {
				name: 'Card',
				fill: '#ffffff',
				borderRadius: 20,
				stroke: '#e2e8f0',
				strokeWidth: 1,
				rect: { w: 320, h: 200 }
			}
		},
		{
			id: 'badge',
			label: 'Badge',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#22c55e',
			partial: { name: 'Badge', fill: '#22c55e', borderRadius: 999, rect: { w: 120, h: 36 } }
		},
		{
			id: 'chip',
			label: 'Chip',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#f1f5f9',
			partial: {
				name: 'Chip',
				fill: '#f1f5f9',
				borderRadius: 999,
				stroke: '#cbd5e1',
				strokeWidth: 1,
				rect: { w: 140, h: 36 }
			}
		},
		{
			id: 'banner',
			label: 'Banner',
			kind: 'rect',
			group: 'Frames',
			swatch: '#0f172a',
			partial: { name: 'Banner', fill: '#0f172a', rect: { w: 640, h: 120 } }
		},
		{
			id: 'avatar',
			label: 'Avatar',
			kind: 'ellipse',
			group: 'Frames',
			swatch: '#94a3b8',
			partial: { name: 'Avatar', fill: '#94a3b8', rect: { w: 96, h: 96 } }
		},
		{
			id: 'button',
			label: 'Button',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#2563eb',
			partial: {
				name: 'Button',
				fill: '#2563eb',
				borderRadius: 12,
				rect: { w: 160, h: 48 }
			}
		},
		{
			id: 'panel',
			label: 'Panel',
			kind: 'roundRect',
			group: 'Frames',
			swatch: '#f8fafc',
			partial: {
				name: 'Panel',
				fill: '#f8fafc',
				borderRadius: 12,
				stroke: '#e2e8f0',
				strokeWidth: 1,
				rect: { w: 420, h: 280 }
			}
		},

		/* —— Panels (UMG) —— */
		{
			id: 'canvas-panel',
			label: 'Canvas',
			kind: 'canvasPanel',
			group: 'Panels',
			swatch: '#e2e8f0',
			partial: {
				name: 'Canvas Panel',
				fill: 'transparent',
				clipChildren: true,
				rect: { w: 400, h: 300 }
			}
		},
		{
			id: 'overlay-panel',
			label: 'Overlay',
			kind: 'overlay',
			group: 'Panels',
			swatch: '#cbd5e1',
			partial: {
				name: 'Overlay',
				fill: 'transparent',
				clipChildren: true,
				rect: { w: 320, h: 240 }
			}
		},
		{
			id: 'border-panel',
			label: 'Border',
			kind: 'border',
			group: 'Panels',
			swatch: '#ffffff',
			partial: {
				name: 'Border',
				fill: '#ffffff',
				borderRadius: 12,
				clipChildren: true,
				rect: { w: 320, h: 200 }
			}
		},
		{
			id: 'hbox-panel',
			label: 'HBox',
			kind: 'hBox',
			group: 'Panels',
			swatch: '#93c5fd',
			partial: { name: 'Horizontal Box', fill: 'transparent', gap: 8, rect: { w: 360, h: 80 } }
		},
		{
			id: 'vbox-panel',
			label: 'VBox',
			kind: 'vBox',
			group: 'Panels',
			swatch: '#86efac',
			partial: { name: 'Vertical Box', fill: 'transparent', gap: 8, rect: { w: 200, h: 240 } }
		},
		{
			id: 'sizebox-panel',
			label: 'Size Box',
			kind: 'sizeBox',
			group: 'Panels',
			swatch: '#fcd34d',
			partial: {
				name: 'Size Box',
				fill: 'transparent',
				clipChildren: true,
				rect: { w: 200, h: 200 }
			}
		},
		{
			id: 'scalebox-panel',
			label: 'Scale Box',
			kind: 'scaleBox',
			group: 'Panels',
			swatch: '#c4b5fd',
			partial: {
				name: 'Scale Box',
				fill: 'transparent',
				clipChildren: true,
				rect: { w: 240, h: 240 }
			}
		},
		{
			id: 'group-panel',
			label: 'Group',
			kind: 'group',
			group: 'Panels',
			swatch: '#94a3b8',
			partial: { name: 'Group', fill: 'transparent', rect: { w: 280, h: 200 } }
		},
		{
			id: 'named-slot',
			label: 'Named Slot',
			kind: 'namedSlot',
			group: 'Panels',
			swatch: '#3b82f6',
			partial: {
				name: 'Content',
				slotName: 'Content',
				fill: 'rgba(59,130,246,0.08)',
				rect: { w: 240, h: 140 }
			}
		},
		{
			id: 'scroll-box',
			label: 'Scroll Box',
			kind: 'scrollBox',
			group: 'Panels',
			swatch: '#64748b',
			partial: {
				name: 'Scroll Box',
				fill: 'transparent',
				clipChildren: true,
				rect: { w: 280, h: 320 }
			}
		},
		{
			id: 'wrap-box',
			label: 'Wrap Box',
			kind: 'wrapBox',
			group: 'Panels',
			swatch: '#f472b6',
			partial: { name: 'Wrap Box', fill: 'transparent', gap: 8, rect: { w: 360, h: 200 } }
		},
		{
			id: 'uniform-grid',
			label: 'Grid',
			kind: 'uniformGrid',
			group: 'Panels',
			swatch: '#38bdf8',
			partial: {
				name: 'Uniform Grid',
				fill: 'transparent',
				gap: 8,
				columns: 2,
				rect: { w: 320, h: 240 }
			}
		},

		/* —— Icons (emoji text) —— */
		{
			id: 'icon-star',
			label: 'Star',
			kind: 'text',
			group: 'Icons',
			glyph: '⭐',
			partial: { name: 'Star icon', text: '⭐', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-heart',
			label: 'Heart',
			kind: 'text',
			group: 'Icons',
			glyph: '❤️',
			partial: { name: 'Heart icon', text: '❤️', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-check',
			label: 'Check',
			kind: 'text',
			group: 'Icons',
			glyph: '✅',
			partial: { name: 'Check', text: '✅', fontSize: 56, textAlign: 'center', rect: { w: 72, h: 72 } }
		},
		{
			id: 'icon-fire',
			label: 'Fire',
			kind: 'text',
			group: 'Icons',
			glyph: '🔥',
			partial: { name: 'Fire', text: '🔥', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-spark',
			label: 'Spark',
			kind: 'text',
			group: 'Icons',
			glyph: '✨',
			partial: { name: 'Sparkles', text: '✨', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-rocket',
			label: 'Rocket',
			kind: 'text',
			group: 'Icons',
			glyph: '🚀',
			partial: { name: 'Rocket', text: '🚀', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-idea',
			label: 'Idea',
			kind: 'text',
			group: 'Icons',
			glyph: '💡',
			partial: { name: 'Idea', text: '💡', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-target',
			label: 'Target',
			kind: 'text',
			group: 'Icons',
			glyph: '🎯',
			partial: { name: 'Target', text: '🎯', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		},
		{
			id: 'icon-party',
			label: 'Party',
			kind: 'text',
			group: 'Icons',
			glyph: '🎉',
			partial: { name: 'Party', text: '🎉', fontSize: 64, textAlign: 'center', rect: { w: 80, h: 80 } }
		}
	];

	const groupOrder = ['Text', 'Stickies', 'Shapes', 'Lines', 'Frames', 'Panels', 'Icons'];

	const groups = $derived(
		groupOrder.map((name) => ({
			name,
			items: elements.filter((e) => e.group === name)
		}))
	);

	function beginDrag(e: DragEvent, el: CanvasElementDef) {
		if (!e.dataTransfer) return;
		e.dataTransfer.setData(CANVAS_ELEMENT_MIME, JSON.stringify(el));
		e.dataTransfer.setData('text/plain', el.label);
		e.dataTransfer.effectAllowed = 'copy';
	}
</script>

<div class={['flex h-full min-h-0 flex-col gap-4 overflow-auto p-3', className]}>
	<p class="text-[11px] text-muted">Click or drag onto the canvas</p>
	{#each groups as group (group.name)}
		<section class="flex flex-col gap-2">
			<h3 class="text-[11px] font-semibold uppercase tracking-wide text-muted">{group.name}</h3>
			<div class="grid grid-cols-3 gap-2">
				{#each group.items as el (el.id)}
					<button
						type="button"
						draggable="true"
						class="flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-transparent bg-surface px-1.5 py-2.5 text-center transition-colors hover:border-border hover:bg-surface-overlay active:cursor-grabbing"
						ondragstart={(e) => beginDrag(e, el)}
						onclick={() => onadd?.(el)}
					>
						<span
							class="flex h-11 w-full items-center justify-center rounded-md bg-[#eef1f5] dark:bg-surface-overlay"
						>
							{#if el.glyph}
								<span class="text-xl leading-none">{el.glyph}</span>
							{:else if el.kind === 'text'}
								<span
									class="font-semibold text-primary"
									style:font-size={el.id === 'heading' || el.id === 'title'
										? '18px'
										: el.id === 'subheading'
											? '14px'
											: el.id === 'code'
												? '10px'
												: '11px'}
								>
									{el.id === 'code' ? '</>' : 'Aa'}
								</span>
							{:else if el.kind === 'sticky'}
								<span
									class="flex h-8 w-8 items-center justify-center rounded-sm text-[9px] font-semibold"
									style:background={el.swatch}
									style:color={el.partial?.color ?? '#713f12'}
								>
									Note
								</span>
							{:else if el.kind === 'ellipse'}
								<span
									class="rounded-full"
									class:h-7={el.id !== 'avatar'}
									class:w-7={el.id !== 'avatar'}
									class:h-8={el.id === 'avatar'}
									class:w-8={el.id === 'avatar'}
									style:background={el.swatch}
								></span>
							{:else if el.kind === 'triangle'}
								<span
									class="h-0 w-0 border-x-[10px] border-b-[18px] border-x-transparent"
									style:border-bottom-color={el.swatch}
								></span>
							{:else if el.kind === 'star'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill={el.swatch}>
									<path
										d="M12 2.5l2.6 6.4 6.9.6-5.2 4.6 1.6 6.7L12 17.8 6.1 20.8l1.6-6.7L2.5 9.5l6.9-.6L12 2.5z"
									/>
								</svg>
							{:else if el.kind === 'hexagon'}
								<svg class="h-7 w-7" viewBox="0 0 100 100" fill={el.swatch}>
									<polygon points="25,5 75,5 95,50 75,95 25,95 5,50" />
								</svg>
							{:else if el.kind === 'pentagon'}
								<svg class="h-7 w-7" viewBox="0 0 100 100" fill={el.swatch}>
									<polygon points="50,5 95,38 78,95 22,95 5,38" />
								</svg>
							{:else if el.kind === 'diamond'}
								<svg class="h-7 w-7" viewBox="0 0 100 100" fill={el.swatch}>
									<polygon points="50,4 96,50 50,96 4,50" />
								</svg>
							{:else if el.kind === 'heart'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill={el.swatch}>
									<path
										d="M12 21s-6.7-4.35-9.33-7.6C.5 10.8 1.1 7.1 3.9 5.5 6.1 4.25 8.55 5 12 8.1c3.45-3.1 5.9-3.85 8.1-2.6 2.8 1.6 3.4 5.3 1.23 7.9C18.7 16.65 12 21 12 21z"
									/>
								</svg>
							{:else if el.tool === 'pen'}
								<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M4 20 L8 6 L14 14 L20 4"
										stroke={el.swatch}
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<circle cx="4" cy="20" r="1.5" fill={el.swatch} />
									<circle cx="8" cy="6" r="1.5" fill={el.swatch} />
									<circle cx="14" cy="14" r="1.5" fill={el.swatch} />
									<circle cx="20" cy="4" r="1.5" fill={el.swatch} />
								</svg>
							{:else if el.kind === 'line'}
								<span
									class="rounded-full"
									class:h-0.5={el.id !== 'line-v' && el.id !== 'line-thick'}
									class:w-10={el.id !== 'line-v'}
									class:h-8={el.id === 'line-v'}
									class:w-0.5={el.id === 'line-v'}
									class:h-1.5={el.id === 'line-thick'}
									style:background={el.swatch}
								></span>
							{:else if el.kind === 'arrow'}
								<svg class="h-4 w-10" viewBox="0 0 40 12" fill="none">
									<path
										d="M2 6h28M24 2l8 4-8 4"
										stroke={el.swatch}
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else}
								<span
									class="h-7 w-9 border border-black/5"
									style:background={el.swatch}
									style:border-radius="{el.partial?.borderRadius
										? Math.min(12, el.partial.borderRadius / 2)
										: 4}px"
								></span>
							{/if}
						</span>
						<span class="text-[10px] font-medium text-secondary">{el.label}</span>
					</button>
				{/each}
			</div>
		</section>
	{/each}
</div>
