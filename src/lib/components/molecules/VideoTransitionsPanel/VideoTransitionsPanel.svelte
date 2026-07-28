<script lang="ts" module>
	export interface VideoTransitionDef {
		id: string;
		label: string;
		group: string;
		type: string;
		durationMs: number;
		glyph?: string;
	}

	export const VIDEO_TRANSITION_MIME = 'application/x-r2-video-transition';
</script>

<script lang="ts">
	interface VideoTransitionsPanelProps {
		class?: string;
		disabled?: boolean;
		hint?: string;
		onapply?: (def: VideoTransitionDef) => void;
	}

	let {
		class: className = '',
		disabled = false,
		hint = 'Select a clip, or drag onto its end',
		onapply
	}: VideoTransitionsPanelProps = $props();

	const transitions: VideoTransitionDef[] = [
		/* Dissolve */
		{ id: 'crossfade', label: 'Crossfade', group: 'Dissolve', type: 'crossfade', durationMs: 900, glyph: '╳' },
		{ id: 'dip-black', label: 'Dip black', group: 'Dissolve', type: 'dip-black', durationMs: 1000, glyph: '■' },
		{ id: 'dip-white', label: 'Dip white', group: 'Dissolve', type: 'dip-white', durationMs: 1000, glyph: '□' },
		{ id: 'fade-soft', label: 'Soft fade', group: 'Dissolve', type: 'fade-soft', durationMs: 1200, glyph: '≈' },
		{ id: 'blur-dissolve', label: 'Blur', group: 'Dissolve', type: 'blur', durationMs: 1000, glyph: '◈' },
		{ id: 'flash', label: 'Flash', group: 'Dissolve', type: 'flash', durationMs: 500, glyph: '⚡' },
		/* Wipe */
		{ id: 'wipe-left', label: 'Wipe left', group: 'Wipe', type: 'wipe-left', durationMs: 900, glyph: '◀' },
		{ id: 'wipe-right', label: 'Wipe right', group: 'Wipe', type: 'wipe-right', durationMs: 900, glyph: '▶' },
		{ id: 'wipe-up', label: 'Wipe up', group: 'Wipe', type: 'wipe-up', durationMs: 900, glyph: '▲' },
		{ id: 'wipe-down', label: 'Wipe down', group: 'Wipe', type: 'wipe-down', durationMs: 900, glyph: '▼' },
		{ id: 'wipe-diagonal', label: 'Diagonal', group: 'Wipe', type: 'wipe-diagonal', durationMs: 900, glyph: '╱' },
		{ id: 'iris', label: 'Iris', group: 'Wipe', type: 'iris', durationMs: 900, glyph: '◎' },
		{ id: 'barn-doors', label: 'Barn doors', group: 'Wipe', type: 'barn-doors', durationMs: 900, glyph: ' ⟺ ' },
		/* Move */
		{ id: 'push-left', label: 'Push left', group: 'Move', type: 'push-left', durationMs: 900, glyph: '⇇' },
		{ id: 'push-right', label: 'Push right', group: 'Move', type: 'push-right', durationMs: 900, glyph: '⇉' },
		{ id: 'push-up', label: 'Push up', group: 'Move', type: 'push-up', durationMs: 900, glyph: '⇈' },
		{ id: 'push-down', label: 'Push down', group: 'Move', type: 'push-down', durationMs: 900, glyph: '⇊' },
		{ id: 'slide-left', label: 'Slide left', group: 'Move', type: 'slide-left', durationMs: 900, glyph: '◁' },
		{ id: 'slide-right', label: 'Slide right', group: 'Move', type: 'slide-right', durationMs: 900, glyph: '▷' },
		/* Style */
		{ id: 'zoom-through', label: 'Zoom in', group: 'Style', type: 'zoom-in', durationMs: 900, glyph: '⊕' },
		{ id: 'zoom-out', label: 'Zoom out', group: 'Style', type: 'zoom-out', durationMs: 900, glyph: '⊖' },
		{ id: 'spin', label: 'Spin', group: 'Style', type: 'spin', durationMs: 900, glyph: '↻' },
		{ id: 'flip-x', label: 'Flip H', group: 'Style', type: 'flip-x', durationMs: 900, glyph: '↔' },
		{ id: 'flip-y', label: 'Flip V', group: 'Style', type: 'flip-y', durationMs: 900, glyph: '↕' },
		{ id: 'squeeze-h', label: 'Squeeze H', group: 'Style', type: 'squeeze-h', durationMs: 800, glyph: '↔︎' },
		{ id: 'squeeze-v', label: 'Squeeze V', group: 'Style', type: 'squeeze-v', durationMs: 800, glyph: '↕︎' }
	];

	const groups = $derived(
		[...new Set(transitions.map((t) => t.group))].map((group) => ({
			group,
			items: transitions.filter((t) => t.group === group)
		}))
	);

	function onDragStart(e: DragEvent, item: VideoTransitionDef) {
		if (disabled) {
			e.preventDefault();
			return;
		}
		e.dataTransfer?.setData(VIDEO_TRANSITION_MIME, JSON.stringify(item));
		e.dataTransfer?.setData('text/plain', item.label);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy';
	}
</script>

<div class={['flex flex-col gap-4 p-2', className]}>
	{#if disabled}
		<p class="px-1 py-4 text-center text-xs text-muted">{hint}</p>
	{:else}
		<p class="px-1 text-[10px] leading-relaxed text-muted">
			CapCut-style: transition sits at the <strong class="font-medium text-secondary">end</strong> of
			a clip (into the next). Drag onto a clip or click with one selected.
		</p>
	{/if}
	{#each groups as { group, items } (group)}
		<section class="flex flex-col gap-2">
			<h3 class="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{group}</h3>
			<div class="grid grid-cols-3 gap-1.5">
				{#each items as item (item.id)}
					<button
						type="button"
						disabled={disabled}
						draggable={!disabled}
						ondragstart={(e) => onDragStart(e, item)}
						class="flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-1.5 py-2 text-center transition-colors enabled:hover:border-brand-500/50 enabled:hover:bg-surface-overlay active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
						onclick={() => onapply?.(item)}
					>
						<span
							class="flex h-9 w-full items-center justify-center rounded-md bg-surface text-sm font-semibold text-secondary"
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
