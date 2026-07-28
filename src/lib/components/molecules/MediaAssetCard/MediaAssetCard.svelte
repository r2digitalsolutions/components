<script lang="ts">
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import type { MediaAsset } from '$lib/utils/mediaTracks.js';

	interface MediaAssetCardProps {
		asset: MediaAsset;
		selected?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		ondblclick?: (e: MouseEvent) => void;
	}

	let {
		asset,
		selected = false,
		class: className = '',
		onclick,
		ondblclick
	}: MediaAssetCardProps = $props();
</script>

<button
	type="button"
	class={[
		'flex w-full flex-col overflow-hidden rounded-lg border text-left transition-colors',
		selected
			? 'border-brand-500 ring-2 ring-brand-500/30'
			: 'border-border hover:border-border-strong hover:bg-surface-overlay/50',
		'bg-surface-elevated',
		className
	]}
	{onclick}
	{ondblclick}
>
	<div class="relative aspect-video w-full bg-surface">
		{#if asset.kind === 'image' && asset.src}
			<img src={asset.src} alt="" class="h-full w-full object-cover" />
		{:else if asset.kind === 'video' && asset.src}
			<video src={asset.src} muted class="h-full w-full object-cover"></video>
		{:else}
			<div class="flex h-full items-center justify-center text-muted">
				<MediaKindIcon kind={asset.kind} size="lg" />
			</div>
		{/if}
	</div>
	<div class="flex items-center gap-1.5 px-2 py-1.5">
		<MediaKindIcon kind={asset.kind} size="sm" class="shrink-0 text-secondary" />
		<span class="truncate text-xs font-medium text-primary">{asset.name}</span>
	</div>
</button>
