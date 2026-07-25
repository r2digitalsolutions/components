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
		variant?: 'gallery' | 'single' | 'many' | 'minimal';
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

	const images = $derived(
		variant === 'single' ? single : variant === 'many' ? many : gallery
	);

	const resolvedThumbnails = $derived(variant === 'minimal' ? false : showThumbnails);
	const resolvedCaptions = $derived(variant === 'minimal' ? false : showCaptions);
	const resolvedCounter = $derived(variant === 'minimal' ? false : showCounter);

	function openAt(i: number) {
		index = i;
		open = true;
	}
</script>

<div class="w-full max-w-3xl space-y-5">
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
				Click a thumbnail or open the gallery. Swipe sideways to change image, pull down to
				close, scroll or double-click to zoom.
			{/if}
		</p>
	</div>

	{#if variant !== 'single'}
		<div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
			{#each images.slice(0, variant === 'many' ? 10 : images.length) as img, i}
				<button
					type="button"
					class="group relative overflow-hidden rounded-xl ring-1 ring-border transition hover:ring-brand-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
					onclick={() => openAt(i)}
				>
					<img
						src={img.src}
						alt={img.alt}
						class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
					/>
					<span
						class="absolute inset-0 bg-black/0 transition group-hover:bg-black/20"
						aria-hidden="true"
					></span>
				</button>
			{/each}
		</div>
	{:else}
		<button
			type="button"
			class="group relative max-w-md overflow-hidden rounded-2xl ring-1 ring-border transition hover:ring-brand-500/50"
			onclick={() => openAt(0)}
		>
			<img
				src={single[0].src}
				alt={single[0].alt}
				class="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
			/>
		</button>
	{/if}

	<div class="flex flex-wrap gap-2">
		<Button size="sm" onclick={() => openAt(0)}>Open lightbox</Button>
		{#if images.length > 1}
			<Button size="sm" variant="outline" onclick={() => openAt(Math.min(2, images.length - 1))}>
				Open at #3
			</Button>
		{/if}
	</div>

	<dl class="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-border bg-surface-elevated p-3 text-[11px] sm:grid-cols-3">
		<div class="flex justify-between gap-2 sm:block">
			<dt class="text-muted">Images</dt>
			<dd class="font-medium tabular-nums text-primary">{images.length}</dd>
		</div>
		<div class="flex justify-between gap-2 sm:block">
			<dt class="text-muted">Drag</dt>
			<dd class="font-medium text-primary">{draggable ? 'on' : 'off'}</dd>
		</div>
		<div class="flex justify-between gap-2 sm:block">
			<dt class="text-muted">Zoom</dt>
			<dd class="font-medium text-primary">{zoomable ? 'on' : 'off'}</dd>
		</div>
		<div class="flex justify-between gap-2 sm:block">
			<dt class="text-muted">Loop</dt>
			<dd class="font-medium text-primary">{loop ? 'on' : 'off'}</dd>
		</div>
		<div class="flex justify-between gap-2 sm:block">
			<dt class="text-muted">Thumbnails</dt>
			<dd class="font-medium text-primary">{resolvedThumbnails ? 'on' : 'off'}</dd>
		</div>
		<div class="flex justify-between gap-2 sm:block">
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
