<script lang="ts">
	import VolumeControl from './VolumeControl.svelte';

	let {
		variant = 'inline'
	}: {
		variant?: 'inline' | 'compact';
	} = $props();

	let volume = $state(0.7);
	let muted = $state(false);
</script>

<div class="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="text-sm font-semibold text-primary">Volume control</p>
	<p class="text-xs text-secondary">
		{#if variant === 'compact'}
			Solo icono; el slider se expande al hover y se mantiene al arrastrar.
		{:else}
			Mute + slider siempre visible.
		{/if}
	</p>
	<div class="flex items-center justify-end gap-3 rounded-xl bg-surface px-3 py-2">
		<span class="text-[11px] text-muted">Hover →</span>
		<VolumeControl {variant} bind:value={volume} bind:muted showValue={variant === 'inline'} />
	</div>
	<p class="font-mono text-[11px] text-muted">
		volume={volume.toFixed(2)} · muted={String(muted)}
	</p>
</div>
