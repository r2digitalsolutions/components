<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { MediaTrack } from '$lib/utils/mediaTracks.js';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Lock from '@lucide/svelte/icons/lock';
	import LockOpen from '@lucide/svelte/icons/lock-open';
	import Headphones from '@lucide/svelte/icons/headphones';

	interface VideoTrackHeaderProps {
		track: MediaTrack;
		class?: string;
		onchange?: (track: MediaTrack) => void;
	}

	let { track, class: className = '', onchange }: VideoTrackHeaderProps = $props();

	function patch(partial: Partial<MediaTrack>) {
		onchange?.({ ...track, ...partial });
	}
</script>

<div class={['flex min-w-0 flex-1 items-center gap-1', className]}>
	<span
		class="h-2 w-2 shrink-0 rounded-full"
		style:background={track.color ?? (track.kind === 'audio' ? '#10b981' : '#3b82f6')}
		aria-hidden="true"
	></span>
	<span class="min-w-0 flex-1 truncate text-xs font-medium text-secondary">{track.name}</span>
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
	<IconButton
		label={track.locked ? 'Unlock' : 'Lock'}
		size="xs"
		onclick={() => patch({ locked: !track.locked })}
	>
		{#if track.locked}
			<Lock class="h-3.5 w-3.5" />
		{:else}
			<LockOpen class="h-3.5 w-3.5" />
		{/if}
	</IconButton>
</div>
