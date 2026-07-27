<script lang="ts">
	import AssetPickerPage from './AssetPickerPage.svelte';
	import type { PickerAsset } from './AssetPickerPage.svelte';

	let selected = $state<string[]>(['a2']);
	let query = $state('');

	const assets: PickerAsset[] = [
		{
			id: 'a1',
			name: 'hero-banner.png',
			url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
			type: 'PNG',
			size: '840 KB'
		},
		{
			id: 'a2',
			name: 'product-shot.jpg',
			url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
			type: 'JPG',
			size: '1.2 MB'
		},
		{
			id: 'a3',
			name: 'brand-guidelines.pdf',
			type: 'PDF',
			size: '2.4 MB'
		},
		{
			id: 'a4',
			name: 'logo-dark.svg',
			url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80',
			type: 'SVG',
			size: '12 KB'
		},
		{
			id: 'a5',
			name: 'team-photo.webp',
			url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
			type: 'WEBP',
			size: '560 KB'
		},
		{
			id: 'a6',
			name: 'release-notes.md',
			type: 'MD',
			size: '8 KB'
		}
	];
</script>

<div class="p-4 sm:p-6">
	<AssetPickerPage bind:selected bind:query {assets} />
</div>
