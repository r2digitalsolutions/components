<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { MediaTrack } from '$lib/utils/mediaTracks.js';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Lock from '@lucide/svelte/icons/lock';
	import LockOpen from '@lucide/svelte/icons/lock-open';
	import Headphones from '@lucide/svelte/icons/headphones';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	interface VideoTrackHeaderProps {
		track: MediaTrack;
		class?: string;
		draggable?: boolean;
		canRemove?: boolean;
		onchange?: (track: MediaTrack) => void;
		onremove?: (trackId: string) => void;
		ondragstart?: (trackId: string, e: DragEvent) => void;
		ondragend?: () => void;
	}

	let {
		track,
		class: className = '',
		draggable = false,
		canRemove = false,
		onchange,
		onremove,
		ondragstart,
		ondragend
	}: VideoTrackHeaderProps = $props();

	function patch(partial: Partial<MediaTrack>) {
		onchange?.({ ...track, ...partial });
	}
</script>

<div class={['flex min-w-0 flex-1 items-center gap-1', className]}>
	{#if draggable}
		<span
			class="shrink-0 cursor-grab touch-none text-muted active:cursor-grabbing"
			draggable="true"
			aria-hidden="true"
			title="Drag to reorder"
			ondragstart={(e) => {
				e.dataTransfer?.setData('text/plain', track.id);
				if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
				ondragstart?.(track.id, e);
			}}
			ondragend={() => ondragend?.()}
		>
			<GripVertical class="h-3.5 w-3.5" />
		</span>
	{/if}
	<span
		class="h-2 w-2 shrink-0 rounded-full"
		style:background={track.color ?? (track.kind === 'audio' ? '#10b981' : '#3b82f6')}
		aria-hidden="true"
	></span>
	<span class="min-w-0 flex-1 truncate text-xs font-semibold text-primary" title={track.name}>
		{track.name}
	</span>
	<div class="flex shrink-0 items-center">
		<IconButton
			label={track.muted ? 'Unmute' : 'Mute'}
			size="xs"
			class="!h-5 !w-5"
			onclick={() => patch({ muted: !track.muted })}
		>
			{#if track.muted}
				<VolumeX class="h-3 w-3" />
			{:else}
				<Volume2 class="h-3 w-3" />
			{/if}
		</IconButton>
		<IconButton
			label={track.solo ? 'Unsolo' : 'Solo'}
			size="xs"
			class="!h-5 !w-5"
			onclick={() => patch({ solo: !track.solo })}
		>
			<Headphones class={['h-3 w-3', track.solo && 'text-brand-500']} />
		</IconButton>
		<IconButton
			label={track.locked ? 'Unlock' : 'Lock'}
			size="xs"
			class="!h-5 !w-5"
			onclick={() => patch({ locked: !track.locked })}
		>
			{#if track.locked}
				<Lock class="h-3 w-3" />
			{:else}
				<LockOpen class="h-3 w-3" />
			{/if}
		</IconButton>
		{#if canRemove && onremove}
			<IconButton
				label="Delete track"
				size="xs"
				class="!h-5 !w-5"
				onclick={() => onremove(track.id)}
			>
				<Trash2 class="h-3 w-3" />
			</IconButton>
		{/if}
	</div>
</div>
