<script lang="ts">
	import MediaAssetBrowser from './MediaAssetBrowser.svelte';
	import type { MediaAsset } from '$lib/utils/mediaTracks.js';

	let assets = $state<MediaAsset[]>([
		{ id: 'a1', kind: 'image', name: 'Sample.jpg', src: 'https://picsum.photos/400/225' }
	]);
	let selectedId = $state<string | null>('a1');
</script>

<div class="h-[420px] w-80 rounded-lg border border-border bg-surface-elevated">
	<MediaAssetBrowser
		bind:assets
		{selectedId}
		allowText
		onselect={(id) => (selectedId = id)}
	/>
</div>
