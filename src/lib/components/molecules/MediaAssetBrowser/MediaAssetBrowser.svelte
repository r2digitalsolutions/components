<script lang="ts">
	import FileUploader from '$lib/components/organisms/FileUploader/FileUploader.svelte';
	import MediaAssetCard from '$lib/components/molecules/MediaAssetCard/MediaAssetCard.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		createMediaAsset,
		kindFromFile,
		type MediaAsset,
		type MediaAssetKind
	} from '$lib/utils/mediaTracks.js';

	interface MediaAssetBrowserProps {
		assets?: MediaAsset[];
		selectedId?: string | null;
		accept?: string;
		helperText?: string;
		allowText?: boolean;
		class?: string;
		onassetschange?: (assets: MediaAsset[]) => void;
		onselect?: (id: string) => void;
		onadd?: (asset: MediaAsset) => void;
	}

	let {
		assets = $bindable<MediaAsset[]>([]),
		selectedId = null,
		accept = 'image/*,video/*,audio/*',
		helperText = 'Images, video or audio',
		allowText = false,
		class: className = '',
		onassetschange,
		onselect,
		onadd
	}: MediaAssetBrowserProps = $props();

	function emit(next: MediaAsset[]) {
		assets = next;
		onassetschange?.(next);
	}

	function handleFiles(files: File[]) {
		const created: MediaAsset[] = [];
		for (const file of files) {
			const kind = kindFromFile(file);
			if (kind === 'text') continue;
			const asset = createMediaAsset({
				kind,
				name: file.name,
				src: URL.createObjectURL(file)
			});
			created.push(asset);
			onadd?.(asset);
		}
		if (created.length) emit([...assets, ...created]);
	}

	function addText() {
		const asset = createMediaAsset({ kind: 'text' as MediaAssetKind, name: 'Text layer' });
		onadd?.(asset);
		emit([...assets, asset]);
	}
</script>

<div class={['flex h-full min-h-0 flex-col gap-3 p-2', className]}>
	<FileUploader
		label="Upload"
		{accept}
		{helperText}
		variant="multiple"
		view="grid"
		showViewToggle={false}
		maxSizeMb={200}
		onchange={handleFiles}
	/>
	{#if allowText}
		<Button variant="secondary" size="sm" onclick={addText}>Add text</Button>
	{/if}
	<div class="min-h-0 flex-1 overflow-auto">
		{#if assets.length === 0}
			<p class="px-1 py-6 text-center text-xs text-muted">No assets yet</p>
		{:else}
			<div class="grid grid-cols-2 gap-2">
				{#each assets as asset (asset.id)}
					<MediaAssetCard
						{asset}
						selected={selectedId === asset.id}
						onclick={() => onselect?.(asset.id)}
						ondblclick={() => onselect?.(asset.id)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
