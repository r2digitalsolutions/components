<script lang="ts">
	import Playlist from './Playlist.svelte';
	import type { PlaylistTrack } from './Playlist.svelte';

	const tracks: PlaylistTrack[] = [
		{
			id: '1',
			title: 'SoundHelix Song 1',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
			durationLabel: '6:12'
		},
		{
			id: '2',
			title: 'SoundHelix Song 2',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
			durationLabel: '7:05'
		},
		{
			id: '3',
			title: 'SoundHelix Song 3',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
			artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
			durationLabel: '5:44'
		}
	];

	let activeId = $state('1');
	let playing = $state(false);
</script>

<div class="w-full max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Playlist</p>
	<Playlist
		{tracks}
		{activeId}
		{playing}
		onselect={(t) => {
			activeId = t.id;
			playing = true;
		}}
	/>
</div>
