<script lang="ts">
	import MediaAssetCard from './MediaAssetCard.svelte';
</script>

<div class="grid max-w-sm grid-cols-2 gap-2">
	<MediaAssetCard
		asset={{ id: '1', kind: 'image', name: 'Hero.jpg', src: 'https://picsum.photos/320/180' }}
		selected
	/>
	<MediaAssetCard asset={{ id: '2', kind: 'audio', name: 'Take_01.wav' }} />
	<MediaAssetCard asset={{ id: '3', kind: 'video', name: 'Broll.mp4' }} />
	<MediaAssetCard asset={{ id: '4', kind: 'text', name: 'Title' }} />
</div>
