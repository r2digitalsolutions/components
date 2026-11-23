<script lang="ts">
	import ImageLightbox from './ImageLightbox.svelte';
	import type { LightboxImage } from './ImageLightbox.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let {
		loop = true,
		closeOnBackdrop = true,
		closeOnEscape = true,
		showClose = true,
		showNav = true,
		showThumbnails = true,
		showCounter = true,
		showCaptions = true,
		blurBackdrop = true,
		zoomable = true,
		draggable = true,
		dismissible = true,
		variant = 'gallery'
	}: {
		loop?: boolean;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showClose?: boolean;
		showNav?: boolean;
		showThumbnails?: boolean;
		showCounter?: boolean;
		showCaptions?: boolean;
		blurBackdrop?: boolean;
		zoomable?: boolean;
		draggable?: boolean;
		dismissible?: boolean;
		variant?: 'gallery' | 'single' | 'many' | 'minimal' | 'media';
	} = $props();

	let open = $state(false);
	let index = $state(0);

	const gallery: LightboxImage[] = [
		{
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
			alt: 'Mountains',
			caption: 'Alpine ridge at dusk — swipe to browse, pull down to close.'
		},
		{
			src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600',
			alt: 'Forest',
			caption: 'Morning light through the canopy'
		},
		{
			src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600',
			alt: 'Path',
			caption: 'A quiet forest path'
		},
		{
			src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600',
			alt: 'Fog',
			caption: 'Fog rolling over the hills'
		},
		{
			src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1600',
			alt: 'Lake',
			caption: 'Still water reflections'
		}
	];

	const single: LightboxImage[] = [
		{
			src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600',
			alt: 'Lake mountains',
			caption: 'Single image — zoom with scroll or double-click, then drag to pan.'
		}
	];

	const many: LightboxImage[] = Array.from({ length: 12 }, (_, i) => ({
		src: `https://picsum.photos/seed/lightbox${i}/1200/800`,
		alt: `Photo ${i + 1}`,
		caption: `Sample photo ${i + 1} of 12`
	}));

	const media: LightboxImage[] = [
		gallery[0],
		{
			type: 'video',
			src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
			poster: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
			caption: 'A video file: plays with native controls, no zoom'
		},
		gallery[1],
		{
			type: 'video',
			embed: true,
			src: 'https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ',
			poster: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
			caption: 'An embedded player (YouTube)'
		}
	];

	const images = $derived(
		variant === 'single'
			? single
			: variant === 'many'
				? many
				: variant === 'media'
					? media
					: gallery
	);

	const resolvedThumbnails = $derived(variant === 'minimal' ? false : showThumbnails);
	const resolvedCaptions = $derived(variant === 'minimal' ? false : showCaptions);
	const resolvedCounter = $derived(variant === 'minimal' ? false : showCounter);

	function openAt(i: number) {
		index = i;
		open = true;
	}
</script>

<div class="max-w-3xl space-y-5 w-full">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Image lightbox</p>
		<p class="text-xs leading-relaxed text-secondary">
			{#if variant === 'single'}
				One image with zoom and pan. Double-click or use the zoom controls.
			{:else if variant === 'many'}
				Long gallery with thumbnail strip — swipe or use arrows to navigate.
			{:else if variant === 'minimal'}
				Chrome reduced: no thumbnails, captions, or counter.
			{:else}
				Click a thumbnail or open the gallery. Swipe sideways to change image, pull down to close,
				scroll or double-click to zoom.
			{/if}
		</p>
	</div>

	{#if variant !== 'single'}
		<div class="gap-2 sm:grid-cols-5 grid grid-cols-3">
			{#each images.slice(0, variant === 'many' ? 10 : images.length) as img, i}
				<button
					type="button"
					class="group rounded-xl ring-border hover:ring-brand-500/50 focus-visible:ring-brand-500/40 relative overflow-hidden ring-1 transition focus-visible:ring-2 focus-visible:outline-none"
					onclick={() => openAt(i)}
				>
					<img
						src={img.type === 'video' ? (img.poster ?? '') : img.src}
						alt={img.alt}
						class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
					/>
					<span
						class="inset-0 bg-black/0 group-hover:bg-black/20 absolute transition"
						aria-hidden="true"
					></span>
				</button>
			{/each}
		</div>
	{:else}
		<button
			type="button"
			class="group max-w-md rounded-2xl ring-border hover:ring-brand-500/50 relative overflow-hidden ring-1 transition"
			onclick={() => openAt(0)}
		>
			<img
				src={single[0].src}
				alt={single[0].alt}
				class="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
			/>
		</button>
	{/if}

	<div class="gap-2 flex flex-wrap">
		<Button size="sm" onclick={() => openAt(0)}>Open lightbox</Button>
		{#if images.length > 1}
			<Button size="sm" variant="outline" onclick={() => openAt(Math.min(2, images.length - 1))}>
				Open at #3
			</Button>
		{/if}
	</div>

	<dl
		class="gap-x-4 gap-y-1.5 rounded-xl border-border bg-surface-elevated p-3 sm:grid-cols-3 grid grid-cols-2 border text-[11px]"
	>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Images</dt>
			<dd class="font-medium text-primary tabular-nums">{images.length}</dd>
		</div>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Drag</dt>
			<dd class="font-medium text-primary">{draggable ? 'on' : 'off'}</dd>
		</div>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Zoom</dt>
			<dd class="font-medium text-primary">{zoomable ? 'on' : 'off'}</dd>
		</div>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Loop</dt>
			<dd class="font-medium text-primary">{loop ? 'on' : 'off'}</dd>
		</div>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Thumbnails</dt>
			<dd class="font-medium text-primary">{resolvedThumbnails ? 'on' : 'off'}</dd>
		</div>
		<div class="gap-2 sm:block flex justify-between">
			<dt class="text-muted">Blur</dt>
			<dd class="font-medium text-primary">{blurBackdrop ? 'on' : 'off'}</dd>
		</div>
	</dl>
</div>

<ImageLightbox
	bind:open
	bind:index
	{images}
	{loop}
	{closeOnBackdrop}
	{closeOnEscape}
	{showClose}
	{showNav}
	showThumbnails={resolvedThumbnails}
	showCounter={resolvedCounter}
	showCaptions={resolvedCaptions}
	{blurBackdrop}
	{zoomable}
	{draggable}
	{dismissible}
/>
