<script lang="ts" module>
	export interface VideoAnimationDef {
		id: string;
		label: string;
		group: string;
		slot: 'in' | 'out';
		type: string;
		durationMs: number;
		glyph?: string;
	}
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
		hint = 'Select a clip',
		onapply
	}: VideoAnimationsPanelProps = $props();

	const animations: VideoAnimationDef[] = [
		{ id: 'fade-in', label: 'Fade in', group: 'In', slot: 'in', type: 'fade', durationMs: 500, glyph: '↗' },
		{ id: 'slide-in', label: 'Slide in', group: 'In', slot: 'in', type: 'slide', durationMs: 500, glyph: '→' },
		{ id: 'scale-in', label: 'Scale in', group: 'In', slot: 'in', type: 'scale', durationMs: 400, glyph: '⊕' },
		{ id: 'fade-out', label: 'Fade out', group: 'Out', slot: 'out', type: 'fade', durationMs: 500, glyph: '↘' },
		{ id: 'slide-out', label: 'Slide out', group: 'Out', slot: 'out', type: 'slide', durationMs: 500, glyph: '←' },
		{ id: 'scale-out', label: 'Scale out', group: 'Out', slot: 'out', type: 'scale', durationMs: 400, glyph: '⊖' }
	];

	const groups = $derived(
		[...new Set(animations.map((a) => a.group))].map((group) => ({
			group,
			items: animations.filter((a) => a.group === group)
		}))
	);
</script>

<div class={['flex flex-col gap-4 p-2', className]}>
	{#if disabled}
		<p class="px-1 py-4 text-center text-xs text-muted">{hint}</p>
	{/if}
	{#each groups as { group, items } (group)}
		<section class="flex flex-col gap-2">
			<h3 class="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{group}</h3>
			<div class="grid grid-cols-3 gap-1.5">
				{#each items as item (item.id)}
					<button
						type="button"
						disabled={disabled}
						class="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-1.5 py-2 text-center transition-colors enabled:hover:border-brand-500/50 enabled:hover:bg-surface-overlay disabled:cursor-not-allowed disabled:opacity-50"
						onclick={() => onapply?.(item)}
					>
						<span class="flex h-9 w-full items-center justify-center rounded-md bg-surface text-sm font-semibold text-secondary">
							{item.glyph ?? item.label.slice(0, 2)}
						</span>
						<span class="text-[10px] font-medium text-secondary">{item.label}</span>
					</button>
				{/each}
			</div>
		</section>
	{/each}
</div>
