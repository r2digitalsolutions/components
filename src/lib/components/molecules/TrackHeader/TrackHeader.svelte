<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { MediaTrack } from '$lib/utils/mediaTracks.js';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Headphones from '@lucide/svelte/icons/headphones';
	import Circle from '@lucide/svelte/icons/circle';

	interface TrackHeaderProps {
		track: MediaTrack;
		class?: string;
		onchange?: (track: MediaTrack) => void;
	}

	let { track, class: className = '', onchange }: TrackHeaderProps = $props();

	function patch(partial: Partial<MediaTrack>) {
		onchange?.({ ...track, ...partial });
	}
</script>

<div class={['flex min-w-0 flex-1 items-center gap-1', className]}>
	<span
		class="h-2.5 w-2.5 shrink-0 rounded-full"
		style:background={track.color ?? '#3b82f6'}
		aria-hidden="true"
	></span>
	<span class="min-w-0 flex-1 truncate text-xs font-semibold text-primary">{track.name}</span>
	<IconButton
		label={track.armed ? 'Disarm' : 'Arm'}
		size="xs"
		onclick={() => patch({ armed: !track.armed })}
	>
		<Circle class={['h-3 w-3', track.armed ? 'fill-red-500 text-red-500' : 'text-muted']} />
	</IconButton>
	<IconButton
		label={track.muted ? 'Unmute' : 'Mute'}
		size="xs"
		onclick={() => patch({ muted: !track.muted })}
	>
		{#if track.muted}
			<VolumeX class="h-3.5 w-3.5" />
		{:else}
			<Volume2 class="h-3.5 w-3.5" />
		{/if}
	</IconButton>
	<IconButton
		label={track.solo ? 'Unsolo' : 'Solo'}
		size="xs"
		onclick={() => patch({ solo: !track.solo })}
	>
		<Headphones class={['h-3.5 w-3.5', track.solo && 'text-brand-500']} />
	</IconButton>
</div>
