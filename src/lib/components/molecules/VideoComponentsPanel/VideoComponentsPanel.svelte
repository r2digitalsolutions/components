<script lang="ts" module>
	export type VideoComponentKind = 'text' | 'image' | 'solid';

	export type VideoComponentRectPreset =
		| 'center'
		| 'lower-third'
		| 'top'
		| 'watermark'
		| 'full'
		| 'badge'
		| 'ticker'
		| 'side';

	export interface VideoComponentDef {
		id: string;
		label: string;
		group: string;
		glyph?: string;
		kind: VideoComponentKind;
		text?: string;
		durationMs: number;
		color?: string;
		textColor?: string;
		fontSize?: number;
		fontWeight?: number | string;
		fontFamily?: string;
		/** @deprecated use previewOpacity — kept for catalog entries */
		opacity?: number;
		/** Program monitor opacity when added */
		previewOpacity?: number;
		src?: string;
		textAlign?: 'left' | 'center' | 'right';
		/** Default placement on the program frame */
		rectPreset?: VideoComponentRectPreset;
	}

	export const VIDEO_COMPONENT_MIME = 'application/x-r2-video-component';
</script>

<script lang="ts">
	interface VideoComponentsPanelProps {
		class?: string;
		onadd?: (def: VideoComponentDef) => void;
	}

	let { class: className = '', onadd }: VideoComponentsPanelProps = $props();

	const components: VideoComponentDef[] = [
		/* —— Text —— */
		{
			id: 'heading',
			label: 'Heading',
			group: 'Text',
			glyph: 'H',
			kind: 'text',
			text: 'Add a heading',
			durationMs: 4000,
			color: '#6366f1',
			fontSize: 56,
			fontWeight: 700,
			textColor: '#ffffff',
			rectPreset: 'top'
		},
		{
			id: 'title',
			label: 'Title',
			group: 'Text',
			glyph: 'T',
			kind: 'text',
			text: 'Title',
			durationMs: 4000,
			color: '#6366f1',
			fontSize: 42,
			fontWeight: 700,
			textColor: '#ffffff',
			rectPreset: 'center'
		},
		{
			id: 'subtitle',
			label: 'Subtitle',
			group: 'Text',
			glyph: 'S',
			kind: 'text',
			text: 'Subtitle',
			durationMs: 4000,
			color: '#8b5cf6',
			fontSize: 28,
			fontWeight: 600,
			textColor: '#e2e8f0',
			rectPreset: 'center'
		},
		{
			id: 'body',
			label: 'Body',
			group: 'Text',
			glyph: 'B',
			kind: 'text',
			text: 'Body text for the scene',
			durationMs: 5000,
			color: '#64748b',
			fontSize: 18,
			fontWeight: 400,
			textColor: '#f8fafc',
			rectPreset: 'center'
		},
		{
			id: 'caption',
			label: 'Caption',
			group: 'Text',
			glyph: 'Cc',
			kind: 'text',
			text: 'Caption text',
			durationMs: 3000,
			color: '#14b8a6',
			fontSize: 16,
			fontWeight: 500,
			textColor: '#ffffff',
			rectPreset: 'lower-third'
		},
		{
			id: 'quote',
			label: 'Quote',
			group: 'Text',
			glyph: '“',
			kind: 'text',
			text: '“A short quote”',
			durationMs: 5000,
			color: '#a78bfa',
			fontSize: 28,
			fontWeight: 500,
			textColor: '#faf5ff',
			rectPreset: 'center'
		},
		{
			id: 'code',
			label: 'Code',
			group: 'Text',
			glyph: '</>',
			kind: 'text',
			text: 'const x = 1;',
			durationMs: 4000,
			color: '#0f172a',
			fontSize: 16,
			fontWeight: 500,
			fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
			textColor: '#e2e8f0',
			rectPreset: 'center'
		},
		{
			id: 'bullet',
			label: 'Bullets',
			group: 'Text',
			glyph: '•',
			kind: 'text',
			text: '• Point one\n• Point two\n• Point three',
			durationMs: 5000,
			color: '#38bdf8',
			fontSize: 22,
			fontWeight: 500,
			textColor: '#f0f9ff',
			textAlign: 'left',
			rectPreset: 'center'
		},

		/* —— Overlays —— */
		{
			id: 'lower-third',
			label: 'Lower third',
			group: 'Overlays',
			glyph: 'LT',
			kind: 'text',
			text: 'Name · Role',
			durationMs: 5000,
			color: '#0ea5e9',
			fontSize: 22,
			fontWeight: 600,
			textColor: '#ffffff',
			rectPreset: 'lower-third'
		},
		{
			id: 'name-plate',
			label: 'Name plate',
			group: 'Overlays',
			glyph: 'NP',
			kind: 'text',
			text: 'Jane Doe',
			durationMs: 5000,
			color: '#0284c7',
			fontSize: 20,
			fontWeight: 700,
			textColor: '#ffffff',
			rectPreset: 'lower-third'
		},
		{
			id: 'end-card',
			label: 'End card',
			group: 'Overlays',
			glyph: 'End',
			kind: 'text',
			text: 'Thanks for watching',
			durationMs: 5000,
			color: '#f59e0b',
			fontSize: 36,
			fontWeight: 700,
			textColor: '#ffffff',
			rectPreset: 'center'
		},
		{
			id: 'watermark',
			label: 'Watermark',
			group: 'Overlays',
			glyph: '©',
			kind: 'text',
			text: '© Brand',
			durationMs: 10_000,
			color: '#64748b',
			fontSize: 14,
			previewOpacity: 0.55,
			textColor: '#ffffff',
			rectPreset: 'watermark'
		},
		{
			id: 'countdown',
			label: 'Countdown',
			group: 'Overlays',
			glyph: '3',
			kind: 'text',
			text: '3',
			durationMs: 3000,
			color: '#ef4444',
			fontSize: 96,
			fontWeight: 800,
			textColor: '#ffffff',
			rectPreset: 'center'
		},
		{
			id: 'chapter',
			label: 'Chapter',
			group: 'Overlays',
			glyph: 'Ch',
			kind: 'text',
			text: 'Chapter 1',
			durationMs: 2500,
			color: '#22d3ee',
			fontSize: 32,
			fontWeight: 700,
			textColor: '#ecfeff',
			rectPreset: 'top'
		},
		{
			id: 'location',
			label: 'Location',
			group: 'Overlays',
			glyph: 'Loc',
			kind: 'text',
			text: 'Madrid, ES',
			durationMs: 4000,
			color: '#84cc16',
			fontSize: 18,
			fontWeight: 600,
			textColor: '#ffffff',
			rectPreset: 'badge'
		},
		{
			id: 'live-badge',
			label: 'Live',
			group: 'Overlays',
			glyph: '●',
			kind: 'text',
			text: 'LIVE',
			durationMs: 10_000,
			color: '#dc2626',
			fontSize: 16,
			fontWeight: 800,
			textColor: '#ffffff',
			rectPreset: 'badge'
		},
		{
			id: 'ticker',
			label: 'Ticker',
			group: 'Overlays',
			glyph: '…',
			kind: 'text',
			text: 'Breaking · Latest update scrolls here',
			durationMs: 8000,
			color: '#1e293b',
			fontSize: 16,
			fontWeight: 600,
			textColor: '#f8fafc',
			textAlign: 'left',
			rectPreset: 'ticker'
		},
		{
			id: 'callout',
			label: 'Callout',
			group: 'Overlays',
			glyph: '!',
			kind: 'text',
			text: 'Key takeaway',
			durationMs: 4000,
			color: '#f97316',
			fontSize: 24,
			fontWeight: 700,
			textColor: '#fff7ed',
			rectPreset: 'center'
		},

		/* —— Solids / plates —— */
		{
			id: 'solid-black',
			label: 'Black',
			group: 'Solids',
			glyph: '■',
			kind: 'solid',
			durationMs: 2000,
			color: '#000000',
			textColor: '#000000',
			rectPreset: 'full'
		},
		{
			id: 'solid-white',
			label: 'White',
			group: 'Solids',
			glyph: '□',
			kind: 'solid',
			durationMs: 2000,
			color: '#ffffff',
			textColor: '#ffffff',
			rectPreset: 'full'
		},
		{
			id: 'solid-brand',
			label: 'Brand',
			group: 'Solids',
			glyph: '■',
			kind: 'solid',
			durationMs: 2000,
			color: '#2563eb',
			rectPreset: 'full'
		},
		{
			id: 'vignette',
			label: 'Vignette',
			group: 'Solids',
			glyph: '◎',
			kind: 'solid',
			durationMs: 5000,
			color: '#000000',
			previewOpacity: 0.45,
			rectPreset: 'full'
		},
		{
			id: 'color-bars',
			label: 'Color bars',
			group: 'Solids',
			glyph: '▦',
			kind: 'image',
			durationMs: 3000,
			color: '#f97316',
			src: 'https://picsum.photos/seed/colorbar/1280/720',
			rectPreset: 'full'
		},
		{
			id: 'slate',
			label: 'Slate',
			group: 'Solids',
			glyph: 'Sl',
			kind: 'text',
			text: 'SCENE 01 · TAKE 01',
			durationMs: 3000,
			color: '#1e293b',
			fontSize: 28,
			fontWeight: 700,
			textColor: '#f8fafc',
			rectPreset: 'center'
		},
		{
			id: 'bar-left',
			label: 'Side bar',
			group: 'Solids',
			glyph: '▌',
			kind: 'solid',
			durationMs: 5000,
			color: '#0f172a',
			previewOpacity: 0.85,
			rectPreset: 'side'
		},
		{
			id: 'matte',
			label: 'Matte',
			group: 'Solids',
			glyph: '▣',
			kind: 'solid',
			durationMs: 5000,
			color: '#111827',
			previewOpacity: 0.7,
			rectPreset: 'full'
		},

		/* —— Shapes / accents —— */
		{
			id: 'pill-label',
			label: 'Pill',
			group: 'Shapes',
			glyph: '◯',
			kind: 'text',
			text: 'NEW',
			durationMs: 4000,
			color: '#22c55e',
			fontSize: 14,
			fontWeight: 800,
			textColor: '#052e16',
			rectPreset: 'badge'
		},
		{
			id: 'callout',
			label: 'Callout',
			group: 'Shapes',
			glyph: '!',
			kind: 'text',
			text: 'Look here',
			durationMs: 3500,
			color: '#f97316',
			fontSize: 20,
			fontWeight: 700,
			textColor: '#fff7ed',
			rectPreset: 'side'
		},
		{
			id: 'sticker-star',
			label: 'Star',
			group: 'Shapes',
			glyph: '★',
			kind: 'text',
			text: '★',
			durationMs: 3000,
			color: '#eab308',
			fontSize: 72,
			fontWeight: 700,
			textColor: '#fef08a',
			rectPreset: 'center'
		},
		{
			id: 'emoji-react',
			label: 'React',
			group: 'Shapes',
			glyph: '🔥',
			kind: 'text',
			text: '🔥',
			durationMs: 2500,
			color: '#ef4444',
			fontSize: 64,
			fontWeight: 700,
			textColor: '#ffffff',
			rectPreset: 'badge'
		},
		{
			id: 'progress-bar',
			label: 'Bar',
			group: 'Shapes',
			glyph: '▬',
			kind: 'solid',
			durationMs: 5000,
			color: '#3b82f6',
			previewOpacity: 0.9,
			rectPreset: 'ticker'
		},
		{
			id: 'vignette',
			label: 'Vignette',
			group: 'Shapes',
			glyph: '◎',
			kind: 'solid',
			durationMs: 8000,
			color: '#000000',
			previewOpacity: 0.35,
			rectPreset: 'full'
		}
	];

	const groups = $derived(
		[...new Set(components.map((c) => c.group))].map((group) => ({
			group,
			items: components.filter((c) => c.group === group)
		}))
	);

	function onDragStart(e: DragEvent, item: VideoComponentDef) {
		e.dataTransfer?.setData(VIDEO_COMPONENT_MIME, JSON.stringify(item));
		e.dataTransfer?.setData('text/plain', item.label);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy';
	}
</script>

<div class={['flex flex-col gap-4 p-2', className]}>
	<p class="px-1 text-[10px] leading-relaxed text-muted">
		Click to add on a new track, or drag onto the timeline.
	</p>
	{#each groups as { group, items } (group)}
		<section class="flex flex-col gap-2">
			<h3 class="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{group}</h3>
			<div class="grid grid-cols-3 gap-1.5">
				{#each items as item (item.id)}
					<button
						type="button"
						draggable="true"
						ondragstart={(e) => onDragStart(e, item)}
						class="flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-1.5 py-2 text-center transition-colors hover:border-brand-500/50 hover:bg-surface-overlay active:cursor-grabbing"
						onclick={() => onadd?.(item)}
					>
						<span
							class="flex h-9 w-full items-center justify-center rounded-md bg-surface text-xs font-semibold text-secondary"
							style:color={item.color}
							style:background={item.kind === 'solid' ? item.color : undefined}
						>
							{item.glyph ?? item.label.slice(0, 2)}
						</span>
						<span class="text-[10px] font-medium text-secondary">{item.label}</span>
					</button>
				{/each}
			</div>
		</section>
	{/each}
</div>
