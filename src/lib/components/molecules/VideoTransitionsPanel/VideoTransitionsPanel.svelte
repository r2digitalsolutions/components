<script lang="ts" module>
	export interface VideoTransitionDef {
		id: string;
		label: string;
		group: string;
		type: string;
		durationMs: number;
		glyph?: string;
	}
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
		hint = 'Select a clip',
		onapply
	}: VideoTransitionsPanelProps = $props();

	const transitions: VideoTransitionDef[] = [
		{ id: 'crossfade', label: 'Crossfade', group: 'Dissolve', type: 'crossfade', durationMs: 500, glyph: '╳' },
		{ id: 'dip-black', label: 'Dip to black', group: 'Dissolve', type: 'dip-black', durationMs: 700, glyph: '■' },
		{ id: 'dip-white', label: 'Dip to white', group: 'Dissolve', type: 'dip-white', durationMs: 700, glyph: '□' },
		{ id: 'wipe-left', label: 'Wipe left', group: 'Wipe', type: 'wipe-left', durationMs: 600, glyph: '◀' },
		{ id: 'wipe-right', label: 'Wipe right', group: 'Wipe', type: 'wipe-right', durationMs: 600, glyph: '▶' },
		{ id: 'wipe-up', label: 'Wipe up', group: 'Wipe', type: 'wipe-up', durationMs: 600, glyph: '▲' }
	];

	const groups = $derived(
		[...new Set(transitions.map((t) => t.group))].map((group) => ({
			group,
			items: transitions.filter((t) => t.group === group)
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
