<script lang="ts">
	import type { Snippet } from 'svelte';
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

	export type GalleryLayout = 'grid' | 'featured' | 'masonry' | 'hero';

	interface ImageGalleryProps {
		images?: GalleryImage[];
		cols?: 2 | 3 | 4;
		layout?: GalleryLayout;
		showCaptions?: boolean;
		/** Footer line under the gallery. Default true. */
		showHint?: boolean;
		hint?: string;
		class?: string;
		empty?: Snippet;
	}

	const {
		images = [],
		cols = 3,
		layout = 'grid',
		showCaptions = false,
		showHint = true,
		hint,
		class: className = '',
		empty
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

	const heroVisible = $derived(images.slice(0, layout === 'hero' && images.length > 4 ? 4 : images.length));
	const heroExtra = $derived(Math.max(0, images.length - heroVisible.length));
	const hintText = $derived(
		hint ?? `${images.length} photos · click to open lightbox`
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

	const heroGridClass = $derived.by(() => {
		const n = heroVisible.length;
		if (n <= 1) return 'grid-cols-1';
		if (n === 2) return 'grid-cols-2';
		return 'grid-cols-2 grid-rows-2';
	});

	const heroMainSpan = $derived.by(() => {
		const n = heroVisible.length;
		if (n === 3) return 'row-span-2';
		return '';
	});
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
					class={['flex h-full w-full items-end bg-gradient-to-br p-4', tones[i % tones.length]]}
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

{#snippet fillTile(img: GalleryImage, i: number, spanClass = '', extra = 0)}
	<button
		type="button"
		class={[
			'group relative min-h-0 overflow-hidden rounded-xl border border-border bg-surface-overlay text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
			spanClass
		]}
		onclick={() => openAt(i)}
	>
		{#if failed[img.id]}
			<div class={['flex h-full w-full items-end bg-gradient-to-br p-4', tones[i % tones.length]]}>
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
			class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
		></div>
		<span
			class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
		>
			<Expand class="h-4 w-4" />
		</span>
		{#if extra > 0}
			<span
				class="absolute inset-0 flex items-center justify-center bg-neutral-950/55 text-lg font-semibold text-white"
			>
				+{extra}
			</span>
		{/if}
	</button>
{/snippet}

<div class={['w-full space-y-3', className]}>
	{#if images.length === 0}
		{#if empty}
			{@render empty()}
		{:else}
			<div
				class="flex min-h-64 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-overlay px-6 text-sm text-muted"
			>
				No images yet
			</div>
		{/if}
	{:else if layout === 'hero'}
		<div class={['grid h-72 gap-2 sm:h-80', heroGridClass]}>
			{#each heroVisible as img, i (img.id)}
				{@render fillTile(
					img,
					i,
					i === 0 ? heroMainSpan : '',
					i === heroVisible.length - 1 ? heroExtra : 0
				)}
			{/each}
		</div>
	{:else if layout === 'featured'}
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
						class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
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

	{#if images.length && showHint}
		<p class="text-xs text-muted">{hintText}</p>
	{/if}

	{#if lightboxImages.length}
		<ImageLightbox bind:open images={lightboxImages} bind:index />
	{/if}
</div>
