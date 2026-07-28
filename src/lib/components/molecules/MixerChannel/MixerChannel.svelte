<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import PanKnob from '$lib/components/atoms/PanKnob/PanKnob.svelte';
	import type { MixerChannelState } from '$lib/utils/audioProject.js';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import Headphones from '@lucide/svelte/icons/headphones';

	interface MixerChannelProps {
		channel: MixerChannelState;
		name?: string;
		color?: string;
		class?: string;
		onchange?: (channel: MixerChannelState) => void;
	}

	let {
		channel,
		name = 'Track',
		color = '#3b82f6',
		class: className = '',
		onchange
	}: MixerChannelProps = $props();

	const volumePct = $derived(Math.min(100, Math.max(0, channel.volume * 100)));

	function patch(partial: Partial<MixerChannelState>) {
		onchange?.({ ...channel, ...partial });
	}
</script>

<div
	class={[
		'flex w-20 flex-col items-center gap-2 rounded-lg border border-border bg-surface-elevated p-2',
		className
	]}
>
	<span class="h-1.5 w-full rounded-full" style:background={color} aria-hidden="true"></span>
	<span class="w-full truncate text-center text-[10px] font-medium text-secondary">{name}</span>
	<div class="relative flex h-32 w-full items-center justify-center py-1">
		<div class="relative h-full w-1.5 rounded-full bg-border-strong dark:bg-surface-overlay">
			<div
				class="absolute bottom-0 w-full rounded-full bg-brand-500"
				style:height="{volumePct}%"
			></div>
			<div
				class="pointer-events-none absolute left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-brand-500 bg-white shadow-md dark:bg-slate-900"
				style:bottom="{volumePct}%"
			>
				<span
					class="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500"
				></span>
			</div>
		</div>
		<input
			type="range"
			min={0}
			max={1}
			step={0.01}
			value={channel.volume}
			aria-label="{name} volume"
			class="absolute inset-0 h-full w-full cursor-pointer opacity-0 [writing-mode:vertical-lr]"
			style:direction="rtl"
			oninput={(e) => patch({ volume: Number(e.currentTarget.value) })}
		/>
	</div>
	<div class="flex items-center gap-0.5">
		<IconButton
			label={channel.muted ? 'Unmute' : 'Mute'}
			size="xs"
			onclick={() => patch({ muted: !channel.muted })}
		>
			{#if channel.muted}
				<VolumeX class="h-3.5 w-3.5" />
			{:else}
				<Volume2 class="h-3.5 w-3.5" />
			{/if}
		</IconButton>
		<IconButton
			label={channel.solo ? 'Unsolo' : 'Solo'}
			size="xs"
			onclick={() => patch({ solo: !channel.solo })}
		>
			<Headphones class={['h-3.5 w-3.5', channel.solo && 'text-brand-500']} />
		</IconButton>
	</div>
	<PanKnob
		value={channel.pan}
		size="sm"
		oninput={(pan) => patch({ pan })}
	/>
</div>
