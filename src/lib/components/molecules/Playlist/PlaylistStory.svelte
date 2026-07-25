<script lang="ts">
	import Playlist from './Playlist.svelte';
	import type { PlaylistTrack } from './Playlist.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		example = 'player',
		density = 'comfortable',
		showAlbum = false,
		showHeader = true
	}: {
		example?: 'player' | 'compact' | 'minimal' | 'empty' | 'likes';
		density?: 'comfortable' | 'compact' | 'minimal';
		showAlbum?: boolean;
		showHeader?: boolean;
	} = $props();

	let tracks = $state<PlaylistTrack[]>([
		{
			id: '1',
			title: 'Neon Skyline',
			artist: 'Night Drive',
			album: 'After Hours',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
			durationLabel: '3:42',
			liked: true
		},
		{
			id: '2',
			title: 'Static Bloom',
			artist: 'Velvet Circuit',
			album: 'Analog Hearts',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
			durationLabel: '4:05',
			explicit: true
		},
		{
			id: '3',
			title: 'Glass Harbor',
			artist: 'Northbound',
			album: 'Coastal',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
			artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
			durationLabel: '2:58',
			liked: true
		},
		{
			id: '4',
			title: 'Low Tide',
			artist: 'Northbound',
			album: 'Coastal',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
			durationLabel: '5:11'
		},
		{
			id: '5',
			title: 'Midnight Relay',
			artist: 'Tape Deck',
			album: 'Frequencies',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop',
			durationLabel: '3:27',
			explicit: true
		}
	]);

	let activeId = $state('1');
	let playing = $state(true);

	function select(track: PlaylistTrack) {
		if (activeId === track.id) {
			playing = !playing;
			return;
		}
		activeId = track.id;
		playing = true;
	}

	function toggleLike(track: PlaylistTrack) {
		tracks = tracks.map((t) => (t.id === track.id ? { ...t, liked: !t.liked } : t));
	}

	const moreBtn =
		'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-surface-overlay hover:text-primary';
</script>

<div class="w-full max-w-lg space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Playlist</p>
		<p class="text-xs text-secondary">
			Header, equalizer al reproducir, likes, álbum, densidades y scroll.
		</p>
	</div>

	{#if example === 'empty'}
		<Playlist title="Liked Songs" showHeader emptyLabel="Save tracks to hear them here" />
	{:else if example === 'compact'}
		<Playlist
			{tracks}
			{activeId}
			{playing}
			title="Queue"
			density="compact"
			showHeader
			maxHeight="16rem"
			onselect={(t) => select(t)}
		/>
	{:else if example === 'minimal'}
		<Playlist
			{tracks}
			{activeId}
			{playing}
			density="minimal"
			showArtwork={false}
			numbered
			onselect={(t) => select(t)}
		/>
	{:else if example === 'likes'}
		<Playlist
			{tracks}
			{activeId}
			{playing}
			title="Favorites"
			subtitle="Your likes"
			showHeader
			showAlbum
			onselect={(t) => select(t)}
			onlike={(t) => toggleLike(t)}
		>
			{#snippet headerActions()}
				<Button size="xs" variant="secondary">
					<Shuffle class="mr-1 h-3.5 w-3.5" strokeWidth={2} />
					Shuffle
				</Button>
			{/snippet}
			{#snippet rowActions(track)}
				<button type="button" class={moreBtn} aria-label={`More for ${track.title}`}>
					<MoreHorizontal class="h-3.5 w-3.5" strokeWidth={2} />
				</button>
			{/snippet}
		</Playlist>
	{:else}
		<Playlist
			{tracks}
			{activeId}
			{playing}
			title="Evening mix"
			{density}
			{showAlbum}
			{showHeader}
			maxHeight="20rem"
			onselect={(t) => select(t)}
			onlike={(t) => toggleLike(t)}
		>
			{#snippet headerActions()}
				<button type="button" class={moreBtn} aria-label="Playlist options">
					<MoreHorizontal class="h-4 w-4" strokeWidth={2} />
				</button>
			{/snippet}
		</Playlist>
		<p class="text-[11px] text-muted">
			Playing: {tracks.find((t) => t.id === activeId)?.title ?? '—'} · {playing ? '▶' : '❚❚'}
		</p>
	{/if}
</div>
