<script lang="ts">
	import MusicPlayer from './MusicPlayer.svelte';
	import type { PlaylistTrack } from '$lib/components/molecules/Playlist/Playlist.svelte';

	const tracks: PlaylistTrack[] = [
		{
			id: '1',
			title: 'SoundHelix Song 1',
			artist: 'SoundHelix',
			album: 'Helix Sessions',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
			durationLabel: '6:12'
		},
		{
			id: '2',
			title: 'SoundHelix Song 2',
			artist: 'Tycho-inspired',
			album: 'Analog Dreams',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
			durationLabel: '7:05'
		},
		{
			id: '3',
			title: 'SoundHelix Song 3',
			artist: 'Night Drive',
			album: 'After Hours',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
			artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
			durationLabel: '5:44'
		},
		{
			id: '4',
			title: 'SoundHelix Song 4',
			artist: 'Analog Dreams',
			album: 'Studio B',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
			artwork: 'https://images.unsplash.com/photo-1459749411175-04bf529277ed?w=600&h=600&fit=crop',
			durationLabel: '4:58'
		}
	];

	let index = $state(0);
</script>

<div class="w-full max-w-4xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Music player</p>
		<p class="text-xs leading-relaxed text-secondary">
			Now-playing con artwork blur, cola, shuffle/repeat y like.
		</p>
	</div>

	<MusicPlayer
		{tracks}
		bind:index
		title="Focus Mix"
		subtitle="Playlist"
		class="w-full"
	/>
</div>
