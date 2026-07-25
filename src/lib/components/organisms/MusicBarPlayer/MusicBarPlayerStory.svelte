<script lang="ts">
	import MusicBarPlayer from './MusicBarPlayer.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { PlaylistTrack } from '$lib/components/molecules/Playlist/Playlist.svelte';

	interface Props {
		variant?: 'fixed' | 'inline';
	}

	let { variant = 'fixed' }: Props = $props();

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
			title: 'Midnight City Lights',
			artist: 'Night Drive',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
			artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
			durationLabel: '7:05'
		},
		{
			id: '3',
			title: 'Analog Dreams',
			artist: 'Studio B',
			src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
			artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
			durationLabel: '5:44'
		}
	];

	let index = $state(0);
	let open = $state(true);
</script>

{#if variant === 'inline'}
	<div class="w-full max-w-4xl space-y-3">
		<p class="text-sm font-semibold text-primary">Inline bar</p>
		<p class="text-xs text-secondary">Sin <code class="text-primary">fixed</code> — útil embebido en layouts.</p>
		<MusicBarPlayer {tracks} bind:index bind:open fixed={false} />
	</div>
{:else}
	<div class="relative min-h-[22rem] w-full max-w-4xl space-y-4 pb-28">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Music bar player</p>
			<p class="text-xs leading-relaxed text-secondary">
				Barra tipo Spotify: progress arriba, info + controles + cola. En móvil, toca la pista para expandir.
			</p>
		</div>

		<div class="rounded-2xl border border-border bg-surface-overlay/40 p-4">
			<p class="mb-3 text-xs font-medium text-muted">Demo content above the bar</p>
			<div class="grid gap-2 sm:grid-cols-3">
				{#each tracks as t, i (t.id)}
					<button
						type="button"
						class="flex items-center gap-2 rounded-xl border border-border bg-surface-elevated p-2 text-left transition hover:border-brand-500/30"
						onclick={() => {
							index = i;
							open = true;
						}}
					>
						<img src={t.artwork} alt="" class="h-12 w-12 rounded-lg object-cover" />
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-primary">{t.title}</p>
							<p class="truncate text-[11px] text-muted">{t.artist}</p>
						</div>
					</button>
				{/each}
			</div>
			{#if !open}
				<div class="mt-3">
					<Button size="sm" variant="secondary" onclick={() => (open = true)}>Show player</Button>
				</div>
			{/if}
		</div>

		<!-- fixed bar renders to viewport; Storybook canvas needs room -->
		<MusicBarPlayer {tracks} bind:index bind:open fixed />
	</div>
{/if}
