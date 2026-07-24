<script lang="ts">
	import Carousel, { type CarouselItem } from './Carousel.svelte';

	let {
		autoplay = false,
		loop = true,
		showDots = true,
		showArrows = true,
		interval = 3000,
		example = 'images'
	}: {
		autoplay?: boolean;
		loop?: boolean;
		showDots?: boolean;
		showArrows?: boolean;
		interval?: number;
		example?: 'images' | 'colors';
	} = $props();

	const imageItems: CarouselItem[] = [
		{
			id: '1',
			title: 'Mountain Sunrise',
			description: 'A breathtaking view of the mountains at dawn.',
			image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70'
		},
		{
			id: '2',
			title: 'Ocean Calm',
			description: 'The peaceful sound of gentle waves on the shore.',
			image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=70'
		},
		{
			id: '3',
			title: 'City Lights',
			description: 'A modern city skyline glowing at night.',
			image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=70'
		},
		{
			id: '4',
			title: 'Forest Path',
			description: 'A quiet walk through an ancient forest.',
			image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=70'
		}
	];

	const colorItems: CarouselItem[] = [
		{ id: 'a', title: 'Slide 1', description: 'First slide content', bgColor: 'oklch(0.55 0.18 260)' },
		{ id: 'b', title: 'Slide 2', description: 'Second slide content', bgColor: 'oklch(0.55 0.18 160)' },
		{ id: 'c', title: 'Slide 3', description: 'Third slide content', bgColor: 'oklch(0.55 0.18 30)' }
	];

	const items = $derived(example === 'images' ? imageItems : colorItems);

	let index = $state(0);
</script>

<div class="w-full max-w-xl space-y-3">
	<Carousel
		{items}
		bind:index
		{autoplay}
		{loop}
		{showDots}
		{showArrows}
		{interval}
	/>
	<p class="text-xs text-muted text-center">
		Slide activo: <span class="text-primary font-medium">{index + 1}</span> de {items.length}
	</p>
</div>
