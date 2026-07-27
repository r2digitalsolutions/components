<script lang="ts">
	import AssetPickerPage from './AssetPickerPage.svelte';
	import type { PickerAsset, AssetPickerView } from './AssetPickerPage.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface Props {
		example?: 'default' | 'list' | 'single' | 'empty' | 'loading';
	}

	let { example = 'default' }: Props = $props();

	let selected = $state<string[]>(['a2']);
	let query = $state('');
	let view = $state<AssetPickerView>('grid');
	let last = $state('');

	const assets: PickerAsset[] = [
		{
			id: 'a1',
			name: 'hero-banner.png',
			url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
			type: 'PNG',
			size: '840 KB',
			folder: 'Marketing',
			modified: 'Jul 12'
		},
		{
			id: 'a2',
			name: 'product-shot.jpg',
			url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
			type: 'JPG',
			size: '1.2 MB',
			folder: 'Product',
			modified: 'Jul 18'
		},
		{
			id: 'a3',
			name: 'brand-guidelines.pdf',
			type: 'PDF',
			size: '2.4 MB',
			folder: 'Brand',
			modified: 'Jun 3'
		},
		{
			id: 'a4',
			name: 'logo-dark.svg',
			url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80',
			type: 'SVG',
			size: '12 KB',
			folder: 'Brand',
			modified: 'May 22'
		},
		{
			id: 'a5',
			name: 'team-photo.webp',
			url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
			type: 'WEBP',
			size: '560 KB',
			folder: 'People',
			modified: 'Jul 1'
		},
		{
			id: 'a6',
			name: 'release-notes.md',
			type: 'MD',
			size: '8 KB',
			folder: 'Engineering',
			modified: 'Jul 20'
		},
		{
			id: 'a7',
			name: 'q3-forecast.xlsx',
			type: 'XLSX',
			size: '320 KB',
			folder: 'Finance',
			modified: 'Jul 15'
		},
		{
			id: 'a8',
			name: 'demo-walkthrough.mp4',
			type: 'MP4',
			size: '48 MB',
			folder: 'Product',
			modified: 'Jul 8',
			disabled: true
		}
	];

	/** Solo al cambiar de story — no reescribir view/selected en cada interacción */
	$effect(() => {
		const ex = example;
		if (ex === 'list') {
			view = 'list';
			selected = ['a2', 'a3'];
			query = '';
		} else if (ex === 'single') {
			view = 'grid';
			selected = ['a1'];
			query = '';
		} else if (ex === 'default') {
			view = 'grid';
			selected = ['a2'];
			query = '';
		} else {
			view = 'grid';
			selected = [];
			query = '';
		}
	});
</script>

<div class="space-y-3 p-4 sm:p-6">
	{#if example === 'empty'}
		<AssetPickerPage
			assets={[]}
			bind:query
			onupload={() => (last = 'upload')}
			oncancel={() => (last = 'cancel')}
			emptyTitle="Library is empty"
			emptyDescription="Upload images, docs, or video to get started."
		/>
	{:else if example === 'loading'}
		<AssetPickerPage {assets} loading selected={[]} />
	{:else if example === 'single'}
		<AssetPickerPage
			title="Pick a cover image"
			description="Only one asset can be selected as the cover."
			{assets}
			bind:selected
			bind:query
			bind:view
			multiple={false}
			confirmLabel="Use cover"
			onconfirm={(ids) => (last = `confirm:${ids.join(',')}`)}
			oncancel={() => (last = 'cancel')}
			onupload={() => (last = 'upload')}
		/>
	{:else}
		<AssetPickerPage
			{assets}
			bind:selected
			bind:query
			bind:view
			multiple
			confirmLabel="Attach"
			onconfirm={(ids) => (last = `confirm:${ids.join(',')}`)}
			oncancel={() => (last = 'cancel')}
			onupload={() => (last = 'upload')}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost" onclick={() => (last = 'browse')}>Browse</Button>
				<Button size="sm" variant="secondary" onclick={() => (last = 'upload')}>Upload</Button>
			{/snippet}
		</AssetPickerPage>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">
			Last action: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
