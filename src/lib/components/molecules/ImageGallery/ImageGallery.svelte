<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import AspectRatio from '$lib/components/atoms/AspectRatio/AspectRatio.svelte';
	import ImageLightbox from '$lib/components/molecules/ImageLightbox/ImageLightbox.svelte';
	import type { LightboxImage } from '$lib/components/molecules/ImageLightbox/ImageLightbox.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';

	export interface GalleryImage {
		id: string;
		src: string;
		alt: string;
	}

	interface ImageGalleryProps {
		images?: GalleryImage[];
		cols?: 2 | 3 | 4;
		class?: string;
	}

	const { images = [], cols = 3, class: className = '' }: ImageGalleryProps = $props();

	let open = $state(false);
	let index = $state(0);

	const lightboxImages = $derived(
		images.map(
			(img): LightboxImage => ({
				src: img.src,
				alt: img.alt
			})
		)
	);

	function openAt(i: number) {
		index = i;
		open = true;
	}
</script>

<div class={className}>
	<Grid cols={1} gap="sm" class={cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}>
		{#each images as img, i (img.id)}
			<button
				type="button"
				class="overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
				onclick={() => openAt(i)}
			>
				<AspectRatio ratio={1}>
					<Image src={img.src} alt={img.alt} objectFit="cover" class="h-full w-full transition hover:scale-[1.02]" />
				</AspectRatio>
			</button>
		{/each}
	</Grid>

	{#if lightboxImages.length}
		<ImageLightbox bind:open images={lightboxImages} bind:index />
	{/if}
</div>
