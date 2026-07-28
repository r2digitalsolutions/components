<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Toolbar from '$lib/components/molecules/Toolbar/Toolbar.svelte';
	import { formatTimecode } from '$lib/utils/mediaTime.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Square from '@lucide/svelte/icons/square';

	interface TransportControlsProps {
		playing?: boolean;
		currentTimeMs?: number;
		durationMs?: number;
		class?: string;
		onplay?: () => void;
		onpause?: () => void;
		onstop?: () => void;
	}

	let {
		playing = false,
		currentTimeMs = 0,
		durationMs = 0,
		class: className = '',
		onplay,
		onpause,
		onstop
	}: TransportControlsProps = $props();
</script>

<Toolbar label="Transport" dense class={className}>
	{#snippet center()}
		<IconButton
			label={playing ? 'Pause' : 'Play'}
			size="sm"
			variant="secondary"
			onclick={() => (playing ? onpause?.() : onplay?.())}
		>
			{#if playing}
				<Pause class="h-4 w-4" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</IconButton>
		<IconButton label="Stop" size="sm" variant="ghost" onclick={() => onstop?.()}>
			<Square class="h-3.5 w-3.5" />
		</IconButton>
		<span class="ml-2 font-mono text-xs text-secondary tabular-nums">
			{formatTimecode(currentTimeMs, { showMs: true })}
			<span class="text-muted"> / </span>
			{formatTimecode(durationMs)}
		</span>
	{/snippet}
</Toolbar>
