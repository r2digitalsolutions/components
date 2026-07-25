<script lang="ts">
	import AudioPlayer from './AudioPlayer.svelte';
	import Playlist from '$lib/components/molecules/Playlist/Playlist.svelte';
	import type { PlaylistTrack } from '$lib/components/molecules/Playlist/Playlist.svelte';

	let {
		variant = 'full'
	}: {
		variant?: 'full' | 'compact' | 'with-playlist';
	} = $props();

	const tracks: PlaylistTrack[] = [
		{
			id: '1',
			title: 'SoundHelix Song 1',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
			durationLabel: '6:12'
		},
		{
			id: '2',
			title: 'SoundHelix Song 2',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
			durationLabel: '7:05'
		},
		{
			id: '3',
			title: 'SoundHelix Song 3',
			artist: 'SoundHelix',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
			artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
			durationLabel: '5:44'
		}
	];

	let index = $state(0);
	let playing = $state(false);
	let autoplay = $state(false);
	const track = $derived(tracks[index]);

	function goTo(i: number, play = true) {
		index = (i + tracks.length) % tracks.length;
		autoplay = play;
	}

	function previous() {
		goTo(index - 1);
	}
	function next() {
		goTo(index + 1);
	}
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Audio player</p>
		<p class="text-xs leading-relaxed text-secondary">
			{#if variant === 'with-playlist'}
				Prev/next cambian de pista. El seek pausa y no escribe en el audio hasta soltar (sin lag).
			{:else}
				Seek sin lag. Prev/next = pista anterior/siguiente (o reinicia si vas &gt;3s).
			{/if}
		</p>
	</div>

	{#if variant === 'with-playlist'}
		<AudioPlayer
			variant="full"
			src={track.src}
			title={track.title}
			artist={track.artist}
			artwork={track.artwork}
			{autoplay}
			canPrevious={true}
			canNext={true}
			onprevious={previous}
			onnext={next}
			onended={next}
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
		/>
		<Playlist
			{tracks}
			activeId={track.id}
			{playing}
			onselect={(_, i) => goTo(i)}
		/>
	{:else}
		<AudioPlayer
			variant={variant === 'compact' ? 'compact' : 'full'}
			src={track.src}
			title={track.title}
			artist={track.artist}
			artwork={track.artwork}
			onprevious={previous}
			onnext={next}
		/>
	{/if}
</div>
