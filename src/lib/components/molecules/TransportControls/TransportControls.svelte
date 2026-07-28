<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import VolumeControl from '$lib/components/molecules/VolumeControl/VolumeControl.svelte';
	import Toolbar from '$lib/components/molecules/Toolbar/Toolbar.svelte';
	import { formatTimecode } from '$lib/utils/mediaTime.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Square from '@lucide/svelte/icons/square';
	import SkipBack from '@lucide/svelte/icons/skip-back';
	import SkipForward from '@lucide/svelte/icons/skip-forward';
	import ArrowLeftToLine from '@lucide/svelte/icons/arrow-left-to-line';
	import ArrowRightToLine from '@lucide/svelte/icons/arrow-right-to-line';

	const RATE_OPTIONS = [0.5, 1, 1.5, 2] as const;

	interface TransportControlsProps {
		playing?: boolean;
		currentTimeMs?: number;
		durationMs?: number;
		playbackRate?: number;
		muted?: boolean;
		volume?: number;
		/** Skip step in ms (default 5s) */
		skipMs?: number;
		class?: string;
		onplay?: () => void;
		onpause?: () => void;
		onstop?: () => void;
		onseekstart?: () => void;
		onseekend?: () => void;
		onseekback?: () => void;
		onseekforward?: () => void;
		onratechange?: (rate: number) => void;
		onmutechange?: (muted: boolean) => void;
		onvolumechange?: (volume: number) => void;
	}

	let {
		playing = false,
		currentTimeMs = 0,
		durationMs = 0,
		playbackRate = $bindable(1),
		muted = $bindable(false),
		volume = $bindable(1),
		skipMs = 5000,
		class: className = '',
		onplay,
		onpause,
		onstop,
		onseekstart,
		onseekend,
		onseekback,
		onseekforward,
		onratechange,
		onmutechange,
		onvolumechange
	}: TransportControlsProps = $props();

	function cycleRate() {
		const idx = RATE_OPTIONS.indexOf(playbackRate as (typeof RATE_OPTIONS)[number]);
		const next = RATE_OPTIONS[(idx + 1) % RATE_OPTIONS.length] ?? 1;
		playbackRate = next;
		onratechange?.(next);
	}

	const rateLabel = $derived(`${playbackRate}×`);
</script>

<Toolbar label="Transport" dense class={className}>
	{#snippet center()}
		<IconButton label="Go to start" size="sm" variant="ghost" onclick={() => onseekstart?.()}>
			<ArrowLeftToLine class="h-4 w-4" />
		</IconButton>
		<IconButton
			label={`Skip back ${skipMs / 1000}s`}
			size="sm"
			variant="ghost"
			onclick={() => onseekback?.()}
		>
			<SkipBack class="h-4 w-4" />
		</IconButton>
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
		<IconButton
			label={`Skip forward ${skipMs / 1000}s`}
			size="sm"
			variant="ghost"
			onclick={() => onseekforward?.()}
		>
			<SkipForward class="h-4 w-4" />
		</IconButton>
		<IconButton label="Go to end" size="sm" variant="ghost" onclick={() => onseekend?.()}>
			<ArrowRightToLine class="h-4 w-4" />
		</IconButton>
		<IconButton label="Stop" size="sm" variant="ghost" onclick={() => onstop?.()}>
			<Square class="h-3.5 w-3.5" />
		</IconButton>

		<button
			type="button"
			class="ml-1 inline-flex h-7 min-w-9 items-center justify-center rounded-md px-1.5 font-mono text-[11px] font-semibold tabular-nums text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			aria-label={`Playback speed ${rateLabel}`}
			title="Playback speed"
			onclick={cycleRate}
		>
			{rateLabel}
		</button>

		<span class="ml-2 font-mono text-xs text-secondary tabular-nums">
			{formatTimecode(currentTimeMs)}
			<span class="text-muted"> / </span>
			{formatTimecode(durationMs)}
		</span>
	{/snippet}

	{#snippet end()}
		<VolumeControl
			bind:value={volume}
			bind:muted
			variant="compact"
			onchange={(v) => onvolumechange?.(v)}
			onmutechange={(m) => onmutechange?.(m)}
		/>
	{/snippet}
</Toolbar>
