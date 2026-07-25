<script lang="ts">
	import VideoPlayer from './VideoPlayer.svelte';

	type Example = 'flower' | 'bunny' | 'sintel' | 'clip' | 'gallery' | 'no-preview';

	let {
		example = 'flower'
	}: {
		example?: Example;
	} = $props();

	const samples = {
		flower: {
			src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
			poster: undefined as string | undefined,
			title: 'Flower'
		},
		bunny: {
			src: 'https://media.w3.org/2010/05/bunny/movie.mp4',
			poster: 'https://media.w3.org/2010/05/bunny/poster.png',
			title: 'Big Buck Bunny'
		},
		sintel: {
			src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
			poster: 'https://media.w3.org/2010/05/sintel/poster.png',
			title: 'Sintel trailer'
		},
		clip: {
			src: 'https://www.w3schools.com/html/mov_bbb.mp4',
			poster: 'https://media.w3.org/2010/05/bunny/poster.png',
			title: 'Bunny short clip'
		}
	} as const;

	const gallery = [
		samples.flower,
		samples.clip,
		{
			src: 'https://media.w3.org/2010/05/video/movie_300.mp4',
			poster: 'https://media.w3.org/2010/05/video/poster.png',
			title: 'W3C sample'
		}
	];
</script>

{#if example === 'gallery'}
	<div class="w-full max-w-4xl space-y-4">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Video gallery</p>
			<p class="text-xs text-secondary">
				Varios players. Pasa el ratón por la barra de progreso para ver la miniatura.
			</p>
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			{#each gallery as item (item.src)}
				<VideoPlayer class="w-full" src={item.src} poster={item.poster} title={item.title} />
			{/each}
		</div>
	</div>
{:else if example === 'no-preview'}
	<div class="w-full max-w-xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Without hover preview</p>
			<p class="text-xs text-secondary">Misma API, con preview desactivado.</p>
		</div>
		<VideoPlayer
			class="w-full"
			src={samples.flower.src}
			poster={samples.flower.poster}
			title={samples.flower.title}
			preview={false}
		/>
	</div>
{:else}
	{@const item = samples[example]}
	<div class="w-full max-w-xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Video player</p>
			<p class="text-xs text-secondary">
				Fullscreen estilo YouTube: controles se ocultan sin movimiento. Doble click = fullscreen.
				Hover en progress → miniatura.
			</p>
		</div>
		<VideoPlayer class="w-full" src={item.src} poster={item.poster} title={item.title} />
	</div>
{/if}
