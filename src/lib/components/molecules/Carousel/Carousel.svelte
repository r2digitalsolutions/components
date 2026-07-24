<script lang="ts">
	import { on } from 'svelte/events';

	export interface CarouselItem {
		id: string;
		title?: string;
		description?: string;
		image?: string;
		bgColor?: string;
	}

	interface CarouselProps {
		items?: CarouselItem[];
		index?: number;
		autoplay?: boolean;
		interval?: number;
		loop?: boolean;
		showDots?: boolean;
		showArrows?: boolean;
		class?: string;
	}

	let {
		items = [],
		index = $bindable(0),
		autoplay = false,
		interval = 5000,
		loop = true,
		showDots = true,
		showArrows = true,
		class: className = ''
	}: CarouselProps = $props();

	let trackEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragDeltaX = $state(0);

	const clampedIndex = $derived(Math.max(0, Math.min(index, items.length - 1)));
	const canPrev = $derived(loop || clampedIndex > 0);
	const canNext = $derived(loop || clampedIndex < items.length - 1);

	function goTo(i: number) {
		if (!items.length) return;
		if (loop) {
			index = (i + items.length) % items.length;
		} else {
			index = Math.max(0, Math.min(i, items.length - 1));
		}
	}

	function prev() {
		goTo(clampedIndex - 1);
	}

	function next() {
		goTo(clampedIndex + 1);
	}

	$effect(() => {
		if (!autoplay || items.length <= 1) return;
		const id = setInterval(next, interval);
		return () => clearInterval(id);
	});

	$effect(() => {
		if (!trackEl) return;
		const offKey = on(trackEl, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
		});
		return offKey;
	});

	function onPointerDown(e: PointerEvent) {
		isDragging = true;
		dragStartX = e.clientX;
		dragDeltaX = 0;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;
		dragDeltaX = e.clientX - dragStartX;
	}

	function onPointerUp() {
		if (!isDragging) return;
		isDragging = false;
		if (dragDeltaX < -50) next();
		else if (dragDeltaX > 50) prev();
		dragDeltaX = 0;
	}
</script>

<div
	class={['relative overflow-hidden rounded-xl bg-surface-elevated select-none', className]}
	role="region"
	aria-label="Carousel"
>
	<!-- Track -->
	<div
		bind:this={trackEl}
		tabindex="0"
		aria-live="polite"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		class="relative overflow-hidden focus:outline-none"
		style="touch-action: pan-y;"
	>
		<div
			class="flex transition-transform duration-500 ease-in-out will-change-transform"
			style={`transform: translateX(calc(-${clampedIndex * 100}% + ${isDragging ? dragDeltaX : 0}px))`}
		>
			{#each items as item (item.id)}
				<div
					class="w-full shrink-0 relative aspect-[16/9] flex flex-col items-center justify-center overflow-hidden"
					aria-roledescription="slide"
				>
					{#if item.image}
						<img
							src={item.image}
							alt={item.title ?? ''}
							class="absolute inset-0 h-full w-full object-cover"
							draggable="false"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
					{:else}
						<div
							class="absolute inset-0"
							style={item.bgColor ? `background-color: ${item.bgColor}` : ''}
						></div>
					{/if}

					{#if item.title || item.description}
						<div class="relative z-10 px-8 py-6 text-center">
							{#if item.title}
								<h3 class={['text-xl font-bold', item.image ? 'text-white' : 'text-primary']}>
									{item.title}
								</h3>
							{/if}
							{#if item.description}
								<p class={['mt-2 text-sm', item.image ? 'text-white/80' : 'text-secondary']}>
									{item.description}
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Arrows -->
	{#if showArrows && items.length > 1}
		<button
			type="button"
			aria-label="Previous slide"
			onclick={prev}
			disabled={!canPrev}
			class={[
				'absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 disabled:opacity-30',
			]}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<button
			type="button"
			aria-label="Next slide"
			onclick={next}
			disabled={!canNext}
			class={[
				'absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 disabled:opacity-30',
			]}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}

	<!-- Slide counter -->
	<div class="absolute top-3 right-3 z-20 rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
		{clampedIndex + 1} / {items.length}
	</div>

	<!-- Dots -->
	{#if showDots && items.length > 1}
		<div class="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5" role="tablist" aria-label="Slide indicators">
			{#each items as item, i (item.id)}
				<button
					type="button"
					role="tab"
					aria-selected={i === clampedIndex}
					aria-label={`Slide ${i + 1}`}
					onclick={() => goTo(i)}
					class={[
						'h-2 rounded-full transition-all duration-300',
						i === clampedIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
					]}
				></button>
			{/each}
		</div>
	{/if}
</div>
