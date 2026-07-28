<script lang="ts" module>
	export interface VideoAnimationDef {
		id: string;
		label: string;
		group: string;
		/** CapCut-style: In / Out / Combo (sets both) */
		slot: 'in' | 'out' | 'combo';
		type: string;
		/** Used when slot is combo */
		outType?: string;
		durationMs: number;
		glyph?: string;
	}

	export const VIDEO_ANIMATION_MIME = 'application/x-r2-video-animation';
</script>

<script lang="ts">
	interface VideoAnimationsPanelProps {
		class?: string;
		disabled?: boolean;
		hint?: string;
		onapply?: (def: VideoAnimationDef) => void;
	}

	let {
		class: className = '',
		disabled = false,
		hint = 'Select a clip, or drag onto one',
		onapply
	}: VideoAnimationsPanelProps = $props();

	const animations: VideoAnimationDef[] = [
		/* —— In —— */
		{ id: 'fade-in', label: 'Fade in', group: 'In', slot: 'in', type: 'fade', durationMs: 500, glyph: '↗' },
		{ id: 'slide-up-in', label: 'Slide up', group: 'In', slot: 'in', type: 'slide-up', durationMs: 500, glyph: '↑' },
		{ id: 'slide-down-in', label: 'Slide down', group: 'In', slot: 'in', type: 'slide-down', durationMs: 500, glyph: '↓' },
		{ id: 'slide-left-in', label: 'Slide left', group: 'In', slot: 'in', type: 'slide-left', durationMs: 500, glyph: '←' },
		{ id: 'slide-right-in', label: 'Slide right', group: 'In', slot: 'in', type: 'slide-right', durationMs: 500, glyph: '→' },
		{ id: 'scale-in', label: 'Zoom in', group: 'In', slot: 'in', type: 'scale', durationMs: 400, glyph: '⊕' },
		{ id: 'grow-in', label: 'Grow', group: 'In', slot: 'in', type: 'grow', durationMs: 450, glyph: '▣' },
		{ id: 'shrink-in', label: 'Shrink in', group: 'In', slot: 'in', type: 'shrink', durationMs: 450, glyph: '▢' },
		{ id: 'pop-in', label: 'Pop', group: 'In', slot: 'in', type: 'pop', durationMs: 450, glyph: '✦' },
		{ id: 'rotate-in', label: 'Rotate in', group: 'In', slot: 'in', type: 'rotate', durationMs: 550, glyph: '↻' },
		{ id: 'spin-in', label: 'Spin', group: 'In', slot: 'in', type: 'spin', durationMs: 600, glyph: '⟳' },
		{ id: 'bounce-in', label: 'Bounce', group: 'In', slot: 'in', type: 'bounce', durationMs: 600, glyph: '↕' },
		{ id: 'drop-in', label: 'Drop', group: 'In', slot: 'in', type: 'drop', durationMs: 550, glyph: '⬇' },
		{ id: 'swing-in', label: 'Swing', group: 'In', slot: 'in', type: 'swing', durationMs: 600, glyph: '∿' },
		{ id: 'flip-x-in', label: 'Flip H', group: 'In', slot: 'in', type: 'flip-x', durationMs: 550, glyph: '↔' },
		{ id: 'flip-y-in', label: 'Flip V', group: 'In', slot: 'in', type: 'flip-y', durationMs: 550, glyph: '↕' },
		{ id: 'skew-in', label: 'Skew', group: 'In', slot: 'in', type: 'skew', durationMs: 500, glyph: '▱' },
		{ id: 'expand-h-in', label: 'Expand H', group: 'In', slot: 'in', type: 'expand-h', durationMs: 500, glyph: '⟷' },
		{ id: 'expand-v-in', label: 'Expand V', group: 'In', slot: 'in', type: 'expand-v', durationMs: 500, glyph: '↕︎' },
		{ id: 'blur-in', label: 'Blur in', group: 'In', slot: 'in', type: 'blur', durationMs: 550, glyph: '◈' },
		{ id: 'glow-in', label: 'Glow', group: 'In', slot: 'in', type: 'glow', durationMs: 500, glyph: '✧' },
		/* —— Out —— */
		{ id: 'fade-out', label: 'Fade out', group: 'Out', slot: 'out', type: 'fade', durationMs: 500, glyph: '↘' },
		{ id: 'slide-up-out', label: 'Slide up', group: 'Out', slot: 'out', type: 'slide-up', durationMs: 500, glyph: '↑' },
		{ id: 'slide-down-out', label: 'Slide down', group: 'Out', slot: 'out', type: 'slide-down', durationMs: 500, glyph: '↓' },
		{ id: 'slide-left-out', label: 'Slide left', group: 'Out', slot: 'out', type: 'slide-left', durationMs: 500, glyph: '←' },
		{ id: 'slide-right-out', label: 'Slide right', group: 'Out', slot: 'out', type: 'slide-right', durationMs: 500, glyph: '→' },
		{ id: 'scale-out', label: 'Zoom out', group: 'Out', slot: 'out', type: 'scale', durationMs: 400, glyph: '⊖' },
		{ id: 'grow-out', label: 'Grow out', group: 'Out', slot: 'out', type: 'grow', durationMs: 450, glyph: '▣' },
		{ id: 'shrink-out', label: 'Shrink', group: 'Out', slot: 'out', type: 'shrink', durationMs: 450, glyph: '▢' },
		{ id: 'pop-out', label: 'Pop out', group: 'Out', slot: 'out', type: 'pop', durationMs: 450, glyph: '✧' },
		{ id: 'rotate-out', label: 'Rotate out', group: 'Out', slot: 'out', type: 'rotate', durationMs: 550, glyph: '↺' },
		{ id: 'spin-out', label: 'Spin out', group: 'Out', slot: 'out', type: 'spin', durationMs: 600, glyph: '⟲' },
		{ id: 'bounce-out', label: 'Bounce', group: 'Out', slot: 'out', type: 'bounce', durationMs: 600, glyph: '↕' },
		{ id: 'drop-out', label: 'Drop', group: 'Out', slot: 'out', type: 'drop', durationMs: 550, glyph: '⬇' },
		{ id: 'swing-out', label: 'Swing', group: 'Out', slot: 'out', type: 'swing', durationMs: 600, glyph: '∿' },
		{ id: 'flip-x-out', label: 'Flip H', group: 'Out', slot: 'out', type: 'flip-x', durationMs: 550, glyph: '↔' },
		{ id: 'flip-y-out', label: 'Flip V', group: 'Out', slot: 'out', type: 'flip-y', durationMs: 550, glyph: '↕' },
		{ id: 'skew-out', label: 'Skew', group: 'Out', slot: 'out', type: 'skew', durationMs: 500, glyph: '▱' },
		{ id: 'expand-h-out', label: 'Collapse H', group: 'Out', slot: 'out', type: 'expand-h', durationMs: 500, glyph: '⟷' },
		{ id: 'expand-v-out', label: 'Collapse V', group: 'Out', slot: 'out', type: 'expand-v', durationMs: 500, glyph: '↕︎' },
		{ id: 'blur-out', label: 'Blur out', group: 'Out', slot: 'out', type: 'blur', durationMs: 550, glyph: '◈' },
		{ id: 'glow-out', label: 'Glow out', group: 'Out', slot: 'out', type: 'glow', durationMs: 500, glyph: '✧' },
		/* —— Combo —— */
		{
			id: 'fade-io',
			label: 'Fade I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'fade',
			outType: 'fade',
			durationMs: 500,
			glyph: '↕'
		},
		{
			id: 'slide-io',
			label: 'Slide I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'slide-up',
			outType: 'slide-down',
			durationMs: 500,
			glyph: '⇅'
		},
		{
			id: 'zoom-io',
			label: 'Zoom I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'scale',
			outType: 'scale',
			durationMs: 400,
			glyph: '⊙'
		},
		{
			id: 'pop-io',
			label: 'Pop I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'pop',
			outType: 'pop',
			durationMs: 450,
			glyph: '✦'
		},
		{
			id: 'spin-io',
			label: 'Spin I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'spin',
			outType: 'spin',
			durationMs: 550,
			glyph: '↻'
		},
		{
			id: 'flip-io',
			label: 'Flip I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'flip-x',
			outType: 'flip-y',
			durationMs: 550,
			glyph: '⧉'
		},
		{
			id: 'blur-io',
			label: 'Blur I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'blur',
			outType: 'blur',
			durationMs: 550,
			glyph: '◈'
		},
		{
			id: 'drop-io',
			label: 'Drop I/O',
			group: 'Combo',
			slot: 'combo',
			type: 'drop',
			outType: 'drop',
			durationMs: 550,
			glyph: '⬇'
		}
	];

	const groups = $derived(
		[...new Set(animations.map((a) => a.group))].map((group) => ({
			group,
			items: animations.filter((a) => a.group === group)
		}))
	);

	function onDragStart(e: DragEvent, item: VideoAnimationDef) {
		if (disabled) {
			e.preventDefault();
			return;
		}
		e.dataTransfer?.setData(VIDEO_ANIMATION_MIME, JSON.stringify(item));
		e.dataTransfer?.setData('text/plain', item.label);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy';
	}
</script>

<div class={['flex flex-col gap-4 p-2', className]}>
	{#if disabled}
		<p class="px-1 py-4 text-center text-xs text-muted">{hint}</p>
	{:else}
		<p class="px-1 text-[10px] leading-relaxed text-muted">
			CapCut-style: pick <strong class="font-medium text-secondary">In</strong> and/or
			<strong class="font-medium text-secondary"> Out</strong> (one each). Drag onto a clip or click
			with a clip selected.
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
