<script lang="ts">
	import AspectRatio from '$lib/components/atoms/AspectRatio/AspectRatio.svelte';
	import ImageLightbox from '$lib/components/molecules/ImageLightbox/ImageLightbox.svelte';
	import type { LightboxImage } from '$lib/components/molecules/ImageLightbox/ImageLightbox.svelte';
	import Expand from '@lucide/svelte/icons/expand';

	export interface GalleryImage {
		id: string;
		src: string;
		alt: string;
		caption?: string;
	}

	type GalleryLayout = 'grid' | 'featured' | 'masonry';

	interface ImageGalleryProps {
		images?: GalleryImage[];
		cols?: 2 | 3 | 4;
		layout?: GalleryLayout;
		showCaptions?: boolean;
		class?: string;
	}

	const {
		images = [],
		cols = 3,
		layout = 'grid',
		showCaptions = false,
		class: className = ''
	}: ImageGalleryProps = $props();

	let open = $state(false);
	let index = $state(0);
	let failed = $state<Record<string, boolean>>({});

	const lightboxImages = $derived(
		images.map(
			(img): LightboxImage => ({
				src: img.src,
				alt: img.alt,
				caption: img.caption
			})
		)
	);

	const gridClass = $derived(
		cols === 2
			? 'grid-cols-1 sm:grid-cols-2'
			: cols === 4
				? 'grid-cols-2 lg:grid-cols-4'
				: 'grid-cols-2 lg:grid-cols-3'
	);

	const tones = [
		'from-slate-600 to-slate-800',
		'from-sky-500 to-indigo-700',
		'from-emerald-500 to-teal-800',
		'from-amber-500 to-orange-700',
		'from-rose-500 to-pink-800',
		'from-violet-500 to-purple-800'
	];

	function openAt(i: number) {
		index = i;
		open = true;
	}

	function markFailed(id: string) {
		failed = { ...failed, [id]: true };
	}
</script>

{#snippet tile(img: GalleryImage, i: number, ratio = 1, featured = false)}
	<button
		type="button"
		class={[
			'group relative overflow-hidden rounded-2xl border border-border bg-surface-overlay text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
			featured && 'sm:col-span-2 sm:row-span-2'
		]}
		onclick={() => openAt(i)}
	>
		<AspectRatio {ratio}>
			{#if failed[img.id]}
				<div
					class={[
						'flex h-full w-full items-end bg-gradient-to-br p-4',
						tones[i % tones.length]
					]}
				>
					<span class="text-sm font-medium text-white/90">{img.alt}</span>
				</div>
			{:else}
				<img
					src={img.src}
					alt={img.alt}
					loading="eager"
					decoding="async"
					class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
					onerror={() => markFailed(img.id)}
				/>
			{/if}

			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
			></div>
			<span
				class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
			>
				<Expand class="h-4 w-4" />
			</span>
			{#if showCaptions && (img.caption || img.alt)}
				<span
					class="absolute inset-x-0 bottom-0 truncate px-3 py-2.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100"
				>
					{img.caption ?? img.alt}
				</span>
			{/if}
		</AspectRatio>
	</button>
{/snippet}

<div class={['w-full space-y-3', className]}>
	{#if images.length === 0}
		<div
			class="flex min-h-64 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-overlay px-6 text-sm text-muted"
		>
			No images yet
		</div>
	{:else if layout === 'featured' && images.length > 0}
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{@render tile(images[0], 0, 1, true)}
			{#each images.slice(1) as img, i (img.id)}
				{@render tile(img, i + 1, 1)}
			{/each}
		</div>
	{:else if layout === 'masonry'}
		<div class="columns-1 gap-3 sm:columns-2 lg:columns-3">
			{#each images as img, i (img.id)}
				<button
					type="button"
					class="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface-overlay text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
					onclick={() => openAt(i)}
				>
					{#if failed[img.id]}
						<div
							class={[
								'flex aspect-[4/3] w-full items-end bg-gradient-to-br p-4',
								tones[i % tones.length]
							]}
						>
							<span class="text-sm font-medium text-white/90">{img.alt}</span>
						</div>
					{:else}
						<img
							src={img.src}
							alt={img.alt}
							loading="eager"
							decoding="async"
							class="w-full object-cover transition duration-300 group-hover:scale-[1.02]"
							style:aspect-ratio={i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '5/4'}
							onerror={() => markFailed(img.id)}
						/>
					{/if}
					<span
						class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
					>
						<Expand class="h-4 w-4" />
					</span>
				</button>
			{/each}
		</div>
	{:else}
		<div class={['grid gap-3', gridClass]}>
			{#each images as img, i (img.id)}
				{@render tile(img, i)}
			{/each}
		</div>
	{/if}

	{#if images.length}
		<p class="text-xs text-muted">{images.length} photos · click to open lightbox</p>
	{/if}

	{#if lightboxImages.length}
		<ImageLightbox bind:open images={lightboxImages} bind:index />
	{/if}
</div>
