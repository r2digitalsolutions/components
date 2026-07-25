<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import Pause from '@lucide/svelte/icons/pause';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';

	export interface StorySlide {
		id?: string;
		/** Image or poster URL */
		src: string;
		duration?: number;
		caption?: string;
	}

	export interface StoryItem {
		id: string;
		name: string;
		avatar?: string;
		seen?: boolean;
		live?: boolean;
		/** “Your story” / add ring */
		add?: boolean;
		slides?: StorySlide[];
	}

	export type StoriesSize = 'sm' | 'md' | 'lg';

	interface StoriesProps {
		items?: StoryItem[];
		size?: StoriesSize;
		activeId?: string | null;
		open?: boolean;
		duration?: number;
		showLabels?: boolean;
		/** Min px to swipe between stories */
		swipeThreshold?: number;
		class?: string;
		onselect?: (id: string) => void;
		onopen?: (id: string) => void;
		onclose?: () => void;
		onseen?: (id: string) => void;
		onadd?: () => void;
		oncomplete?: () => void;
	}

	let {
		items = $bindable([] as StoryItem[]),
		size = 'md',
		activeId = $bindable<string | null>(null),
		open = $bindable(false),
		duration = 5000,
		showLabels = true,
		swipeThreshold = 64,
		class: className = '',
		onselect,
		onopen,
		onclose,
		onseen,
		onadd,
		oncomplete
	}: StoriesProps = $props();

	let slideIndex = $state(0);
	let progress = $state(0);
	let paused = $state(false);
	let muted = $state(true);
	let dragX = $state(0);
	let dragging = $state(false);

	let holdTimer: ReturnType<typeof setTimeout> | undefined;
	let raf = 0;
	let lastTs = 0;
	let startX = 0;
	let startY = 0;
	let startAt = 0;
	let moved = false;
	let pointerId: number | null = null;

	const avatarPx = $derived(size === 'sm' ? 40 : size === 'lg' ? 64 : 48);
	const itemWidth = $derived(size === 'sm' ? 'w-14' : size === 'lg' ? 'w-[4.75rem]' : 'w-16');

	const activeIndex = $derived(items.findIndex((i) => i.id === activeId));
	const activeItem = $derived(activeIndex >= 0 ? items[activeIndex] : null);
	const slides = $derived(
		activeItem?.slides?.length
			? activeItem.slides
			: activeItem
				? [{ src: activeItem.avatar ?? '', duration }]
				: []
	);
	const currentSlide = $derived(slides[slideIndex]);
	const slideDuration = $derived(currentSlide?.duration ?? duration);

	function initials(name: string) {
		const parts = name.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}

	function markSeen(id: string) {
		items = items.map((item) => (item.id === id ? { ...item, seen: true } : item));
		onseen?.(id);
	}

	function openStory(id: string) {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		if (item.add) {
			onadd?.();
			onselect?.(id);
			return;
		}
		activeId = id;
		slideIndex = 0;
		progress = 0;
		dragX = 0;
		open = true;
		onselect?.(id);
		onopen?.(id);
		markSeen(id);
	}

	function closeViewer() {
		open = false;
		paused = false;
		progress = 0;
		dragX = 0;
		dragging = false;
		onclose?.();
	}

	function goNextSlide() {
		lastTs = 0;
		if (slideIndex < slides.length - 1) {
			slideIndex += 1;
			progress = 0;
			return;
		}
		goNextStory();
	}

	function goPrevSlide() {
		lastTs = 0;
		if (progress > 0.15 || slideIndex > 0) {
			if (slideIndex > 0) slideIndex -= 1;
			progress = 0;
			return;
		}
		goPrevStory();
	}

	function goNextStory() {
		lastTs = 0;
		const next = items.slice(activeIndex + 1).find((i) => !i.add);
		if (!next) {
			oncomplete?.();
			closeViewer();
			return;
		}
		activeId = next.id;
		slideIndex = 0;
		progress = 0;
		dragX = 0;
		markSeen(next.id);
		onopen?.(next.id);
	}

	function goPrevStory() {
		lastTs = 0;
		const prev = items.slice(0, activeIndex).reverse().find((i) => !i.add);
		if (!prev) {
			progress = 0;
			dragX = 0;
			return;
		}
		activeId = prev.id;
		slideIndex = 0;
		progress = 0;
		dragX = 0;
		markSeen(prev.id);
		onopen?.(prev.id);
	}

	function onViewerPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		pointerId = e.pointerId;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		startX = e.clientX;
		startY = e.clientY;
		startAt = Date.now();
		moved = false;
		dragging = false;
		dragX = 0;
		clearTimeout(holdTimer);
		holdTimer = setTimeout(() => {
			if (!moved) paused = true;
		}, 140);
	}

	function onViewerPointerMove(e: PointerEvent) {
		if (pointerId !== e.pointerId) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
			moved = true;
			clearTimeout(holdTimer);
			if (paused && Math.abs(dx) > Math.abs(dy)) paused = false;
		}
		// Horizontal drag → peek next/prev story
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
			dragging = true;
			paused = true;
			dragX = dx;
		}
	}

	function onViewerPointerUp(e: PointerEvent) {
		if (pointerId !== null && e.pointerId !== pointerId) return;
		clearTimeout(holdTimer);
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		const elapsed = Date.now() - startAt;
		const wasDragging = dragging;
		const wasPaused = paused;

		pointerId = null;
		dragging = false;
		paused = false;

		if (wasDragging && Math.abs(dx) >= swipeThreshold && Math.abs(dx) > Math.abs(dy)) {
			dragX = 0;
			if (dx < 0) goNextStory();
			else goPrevStory();
			return;
		}

		dragX = 0;

		// Tap (not a drag / not a long-press pause)
		if (!moved && elapsed < 350 && !wasPaused) {
			const target = e.currentTarget as HTMLElement;
			const rect = target.getBoundingClientRect();
			const ratio = (e.clientX - rect.left) / rect.width;
			if (ratio < 0.33) goPrevSlide();
			else if (ratio > 0.66) goNextSlide();
		}
	}

	function onViewerPointerCancel() {
		clearTimeout(holdTimer);
		pointerId = null;
		dragging = false;
		paused = false;
		dragX = 0;
	}

	function tick(ts: number) {
		if (!open || !activeItem) {
			raf = requestAnimationFrame(tick);
			return;
		}
		if (!lastTs) lastTs = ts;
		const delta = ts - lastTs;
		lastTs = ts;

		if (!paused && !dragging && slides.length) {
			progress += delta / slideDuration;
			if (progress >= 1) {
				progress = 0;
				goNextSlide();
			}
		}
		raf = requestAnimationFrame(tick);
	}

	$effect(() => {
		if (open) {
			lastTs = 0;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(tick);
		} else {
			cancelAnimationFrame(raf);
			lastTs = 0;
		}
		return () => cancelAnimationFrame(raf);
	});

	$effect(() => {
		void slideIndex;
		void activeId;
		if (open) progress = 0;
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
		clearTimeout(holdTimer);
	});

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') closeViewer();
		if (e.key === 'ArrowRight') goNextSlide();
		if (e.key === 'ArrowLeft') goPrevSlide();
		if (e.key === ' ') {
			e.preventDefault();
			paused = !paused;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div
	class={[
		'flex gap-3 overflow-x-auto px-1 pt-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
		className
	]}
	role="group"
	aria-label="Stories"
>
	{#each items as item (item.id)}
		<button
			type="button"
			class={['flex shrink-0 flex-col items-center', itemWidth, item.live && !item.add ? 'gap-2' : 'gap-1.5']}
			onclick={() => openStory(item.id)}
		>
			<span
				class={[
					'relative inline-flex shrink-0 rounded-full',
					item.live && !item.add && 'mb-1',
					item.add
						? 'bg-border p-[2px]'
						: item.seen
							? 'bg-border p-[2px]'
							: item.live
								? 'bg-gradient-to-tr from-red-500 via-rose-500 to-orange-400 p-[2px]'
								: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-500 p-[2px]'
				]}
			>
				<span
					class="relative block overflow-hidden rounded-full bg-surface-elevated"
					style={`width:${avatarPx}px;height:${avatarPx}px`}
				>
					{#if item.add}
						<span
							class="flex h-full w-full items-center justify-center rounded-full border border-dashed border-border-strong bg-surface-overlay text-muted"
						>
							<Plus class={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
						</span>
					{:else if item.avatar}
						<img
							src={item.avatar}
							alt={item.name}
							class="h-full w-full rounded-full object-cover"
							draggable="false"
						/>
					{:else}
						<span
							class="flex h-full w-full items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white"
						>
							{initials(item.name)}
						</span>
					{/if}
				</span>
				{#if item.live && !item.add}
					<span
						class={[
							'absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-red-500 font-bold uppercase tracking-wide text-white shadow-sm ring-2 ring-surface-elevated',
							size === 'sm' ? 'px-1 py-px text-[8px]' : 'px-1.5 py-0.5 text-[9px]'
						]}
					>
						Live
					</span>
				{/if}
			</span>
			{#if showLabels}
				<span
					class={[
						'w-full truncate text-center text-[11px]',
						item.live && !item.add ? 'font-semibold text-red-500' : 'text-secondary'
					]}
				>
					{item.add ? 'Your story' : item.name}
				</span>
			{/if}
		</button>
	{/each}
</div>

{#if open && activeItem}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-0 sm:p-6"
		transition:fade={{ duration: 160 }}
		role="dialog"
		aria-modal="true"
		aria-label={`Story by ${activeItem.name}`}
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="relative h-full w-full max-w-md touch-pan-y overflow-hidden bg-black sm:h-[min(820px,100%)] sm:rounded-2xl sm:shadow-2xl"
			style={dragX
				? `transform: translate3d(${dragX * 0.35}px,0,0); transition: none;`
				: 'transform: translate3d(0,0,0); transition: transform 160ms ease;'}
			onpointerdown={onViewerPointerDown}
			onpointermove={onViewerPointerMove}
			onpointerup={onViewerPointerUp}
			onpointercancel={onViewerPointerCancel}
		>
			<!-- Progress -->
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
			>
				{#each slides as _, i}
					<div class="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
						<div
							class="h-full rounded-full bg-white"
							style={`width: ${i < slideIndex ? 100 : i === slideIndex ? progress * 100 : 0}%`}
						></div>
					</div>
				{/each}
			</div>

			<!-- Header -->
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-3 pt-[max(1.75rem,calc(env(safe-area-inset-top)+1.5rem))]"
			>
				<span class="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
					{#if activeItem.avatar}
						<img
							src={activeItem.avatar}
							alt={activeItem.name}
							class="h-full w-full object-cover"
							draggable="false"
						/>
					{:else}
						<span
							class="flex h-full w-full items-center justify-center bg-brand-500 text-[10px] font-semibold text-white"
						>
							{initials(activeItem.name)}
						</span>
					{/if}
				</span>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold text-white drop-shadow">{activeItem.name}</p>
					{#if currentSlide?.caption}
						<p class="truncate text-[11px] text-white/80 drop-shadow">{currentSlide.caption}</p>
					{/if}
				</div>
				<div class="pointer-events-auto flex items-center gap-1">
					{#if paused}
						<span class="rounded-full bg-white/15 p-1.5 text-white" aria-hidden="true">
							<Pause class="h-3.5 w-3.5" />
						</span>
					{/if}
					<button
						type="button"
						class="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
						aria-label={muted ? 'Unmute' : 'Mute'}
						onclick={(e) => {
							e.stopPropagation();
							muted = !muted;
						}}
					>
						{#if muted}
							<VolumeX class="h-4 w-4" />
						{:else}
							<Volume2 class="h-4 w-4" />
						{/if}
					</button>
					<button
						type="button"
						class="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
						aria-label="Close story"
						onclick={(e) => {
							e.stopPropagation();
							closeViewer();
						}}
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>

			<!-- Media (full bleed) -->
			<div class="absolute inset-0 bg-zinc-950">
				{#if currentSlide?.src}
					{#key `${activeItem.id}-${slideIndex}`}
						<img
							src={currentSlide.src}
							alt={currentSlide.caption ?? activeItem.name}
							class="absolute inset-0 h-full w-full object-cover"
							draggable="false"
						/>
					{/key}
				{:else}
					<div class="flex h-full w-full items-center justify-center text-sm text-white/60">
						No media
					</div>
				{/if}
			</div>

			{#if currentSlide?.caption}
				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-20"
				>
					<p class="text-sm leading-relaxed text-white">{currentSlide.caption}</p>
				</div>
			{/if}

			{#if dragging}
				<div
					class="pointer-events-none absolute inset-y-0 z-30 flex items-center text-xs font-semibold text-white/80"
					class:left-3={dragX > 0}
					class:right-3={dragX < 0}
				>
					{dragX > 0 ? 'Previous' : 'Next'}
				</div>
			{/if}
		</div>
	</div>
{/if}
