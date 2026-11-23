<script lang="ts">
	export interface LightboxImage {
		src: string;
		thumbSrc?: string; // filmstrip; defaults to poster, then src
		alt?: string;
		caption?: string;
		/** `video` plays `src` (a file) or, with `embed`, loads it in an iframe (YouTube, Vimeo…). Default `image`. */
		type?: 'image' | 'video';
		poster?: string;
		/** Video only: `src` is a player URL to embed instead of a video file. */
		embed?: boolean;
		/** Video only: portrait (9:16) instead of landscape (16:9). */
		vertical?: boolean;
	}

	export interface LightboxLabels {
		close?: string;
		previous?: string;
		next?: string;
		zoomIn?: string;
		zoomOut?: string;
		resetZoom?: string;
		thumbnails?: string;
		preview?: string;
	}

	interface ImageLightboxProps {
		open?: boolean;
		images?: LightboxImage[];
		index?: number;
		/** Wrap around at ends. Default true. */
		loop?: boolean;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showClose?: boolean;
		showNav?: boolean;
		/** Filmstrip under the image. Default: on when 2+ images. */
		showThumbnails?: boolean;
		showCounter?: boolean;
		showCaptions?: boolean;
		blurBackdrop?: boolean;
		/** Wheel / double-click zoom + pan when zoomed. */
		zoomable?: boolean;
		/** Horizontal swipe between images; pan when zoomed. */
		draggable?: boolean;
		/** Pull down to close when not zoomed. Default true. */
		dismissible?: boolean;
		minZoom?: number;
		maxZoom?: number;
		/** Texts of the buttons, for translated apps. English by default. */
		labels?: LightboxLabels;
		class?: string;
		onclose?: () => void;
		onchange?: (index: number) => void;
	}

	let {
		open = $bindable(false),
		images = [],
		index = $bindable(0),
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
		minZoom = 1,
		maxZoom = 4,
		labels = {},
		class: className = '',
		onclose,
		onchange
	}: ImageLightboxProps = $props();

	const current = $derived(images[index]);
	const isVideo = $derived(current?.type === 'video');
	// Videos are not zoomed: wheel, double click and +/- are left to the player.
	const canZoom = $derived(zoomable && !isVideo);
	const text = $derived({
		close: 'Close',
		previous: 'Previous image',
		next: 'Next image',
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out',
		resetZoom: 'Reset zoom',
		thumbnails: 'Image thumbnails',
		preview: 'Preview',
		...labels
	});
	const hasMany = $derived(images.length > 1);
	const canPrev = $derived(hasMany && (loop || index > 0));
	const canNext = $derived(hasMany && (loop || index < images.length - 1));
	const showStrip = $derived(showThumbnails && hasMany);

	let scale = $state(1);
	let offsetX = $state(0);
	let offsetY = $state(0);
	let dragging = $state(false);
	let dragMode = $state<'idle' | 'pan' | 'swipe' | 'dismiss'>('idle');
	let pointerId = $state<number | null>(null);
	let startX = $state(0);
	let startY = $state(0);
	let originX = $state(0);
	let originY = $state(0);
	let swipeX = $state(0);
	let dismissY = $state(0);
	let imageLoaded = $state(false);
	let moved = $state(false);
	let stageEl = $state<HTMLDivElement | null>(null);
	let stripEl = $state<HTMLDivElement | null>(null);
	let suppressClick = $state(false);

	const SWIPE_THRESHOLD = 80;
	const DISMISS_THRESHOLD = 140;
	const MOVE_THRESHOLD = 12;

	function resetTransform() {
		scale = 1;
		offsetX = 0;
		offsetY = 0;
		swipeX = 0;
		dismissY = 0;
		dragMode = 'idle';
		dragging = false;
		moved = false;
	}

	function close() {
		open = false;
		resetTransform();
		onclose?.();
	}

	function goTo(next: number) {
		if (!images.length) return;
		let i = next;
		if (loop) {
			i = ((next % images.length) + images.length) % images.length;
		} else {
			i = Math.max(0, Math.min(images.length - 1, next));
		}
		if (i === index) return;
		index = i;
		resetTransform();
		imageLoaded = false;
		onchange?.(i);
	}

	function prev() {
		if (!canPrev) return;
		goTo(index - 1);
	}

	function next() {
		if (!canNext) return;
		goTo(index + 1);
	}

	function clampZoom(z: number) {
		return Math.min(maxZoom, Math.max(minZoom, z));
	}

	function zoomAt(nextScale: number, clientX?: number, clientY?: number) {
		if (!canZoom) return;
		const prev = scale;
		const next = clampZoom(nextScale);
		if (next === prev) return;

		if (next === minZoom) {
			scale = minZoom;
			offsetX = 0;
			offsetY = 0;
			return;
		}

		if (stageEl && clientX != null && clientY != null) {
			const rect = stageEl.getBoundingClientRect();
			const cx = clientX - rect.left - rect.width / 2;
			const cy = clientY - rect.top - rect.height / 2;
			const ratio = next / prev;
			offsetX = cx - (cx - offsetX) * ratio;
			offsetY = cy - (cy - offsetY) * ratio;
		}

		scale = next;
	}

	function toggleZoom(e?: MouseEvent) {
		if (!canZoom || suppressClick) return;
		if (scale > minZoom) {
			resetTransform();
		} else {
			zoomAt(2, e?.clientX, e?.clientY);
		}
	}

	function onWheel(e: WheelEvent) {
		if (!open || !canZoom) return;
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.2 : 0.2;
		zoomAt(scale + delta, e.clientX, e.clientY);
	}

	function onPointerDown(e: PointerEvent) {
		if (!draggable || e.button !== 0) return;
		const target = e.target as HTMLElement;
		if (target.closest('[data-lightbox-chrome]')) return;

		dragging = true;
		moved = false;
		pointerId = e.pointerId;
		startX = e.clientX;
		startY = e.clientY;
		originX = offsetX;
		originY = offsetY;
		swipeX = 0;
		dismissY = 0;
		dragMode = scale > minZoom ? 'pan' : 'idle';
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || pointerId !== e.pointerId) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		if (!moved && Math.hypot(dx, dy) >= MOVE_THRESHOLD) {
			moved = true;
		}

		if (dragMode === 'pan' || scale > minZoom) {
			dragMode = 'pan';
			offsetX = originX + dx;
			offsetY = originY + dy;
			return;
		}

		if (dragMode === 'idle') {
			if (Math.hypot(dx, dy) < MOVE_THRESHOLD) return;
			const absX = Math.abs(dx);
			const absY = Math.abs(dy);
			// Clear vertical-down → dismiss; clear horizontal → swipe
			if (dismissible && dy > 0 && absY > absX * 1.35) {
				dragMode = 'dismiss';
			} else if (absX > absY * 1.15) {
				dragMode = 'swipe';
			} else {
				return; // ambiguous — wait
			}
		}

		if (dragMode === 'dismiss') {
			dismissY = Math.max(0, dy);
			swipeX = 0;
			return;
		}

		if (dragMode === 'swipe') {
			dismissY = 0;
			if (!hasMany) {
				swipeX = dx * 0.2;
				return;
			}
			const blockedLeft = dx > 0 && !canPrev;
			const blockedRight = dx < 0 && !canNext;
			swipeX = blockedLeft || blockedRight ? dx * 0.2 : dx;
		}
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging || pointerId !== e.pointerId) return;
		dragging = false;
		pointerId = null;

		if (moved) {
			suppressClick = true;
			moved = false;
			setTimeout(() => {
				suppressClick = false;
			}, 0);
		}

		if (dragMode === 'dismiss') {
			if (dismissY >= DISMISS_THRESHOLD) close();
			else dismissY = 0;
			dragMode = 'idle';
			return;
		}

		if (dragMode === 'swipe') {
			if (swipeX <= -SWIPE_THRESHOLD && canNext) next();
			else if (swipeX >= SWIPE_THRESHOLD && canPrev) prev();
			else swipeX = 0;
			dragMode = 'idle';
			return;
		}

		swipeX = 0;
		dismissY = 0;
		dragMode = 'idle';
	}

	function onPointerCancel(e: PointerEvent) {
		if (pointerId !== e.pointerId) return;
		dragging = false;
		pointerId = null;
		swipeX = 0;
		dismissY = 0;
		dragMode = 'idle';
	}

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape' && closeOnEscape) {
			e.preventDefault();
			close();
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
		if (e.key === '+' || e.key === '=') {
			e.preventDefault();
			zoomAt(scale + 0.25);
		}
		if (e.key === '-' || e.key === '_') {
			e.preventDefault();
			zoomAt(scale - 0.25);
		}
		if (e.key === '0') {
			e.preventDefault();
			resetTransform();
		}
	}

	function onBackdropClick(e: MouseEvent) {
		if (!closeOnBackdrop || suppressClick) return;
		const t = e.target as HTMLElement;
		if (t === e.currentTarget || t === stageEl) close();
	}

	$effect(() => {
		if (!open) return;
		if (images.length && (index < 0 || index >= images.length)) {
			index = Math.max(0, Math.min(index, images.length - 1));
		}
	});

	$effect(() => {
		if (!open || typeof window === 'undefined') return;
		window.addEventListener('keydown', onKey);
		const prevOverflow = document.body.style.overflow;
		const prevHtml = document.documentElement.style.overflow;
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			document.documentElement.style.overflow = prevHtml;
		};
	});

	$effect(() => {
		if (open) {
			resetTransform();
			imageLoaded = false;
		}
	});

	$effect(() => {
		if (!open || !showStrip || !stripEl) return;
		const active = stripEl.querySelector<HTMLElement>(`[data-thumb-index="${index}"]`);
		if (!active) return;
		active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	});

	const backdropOpacity = $derived(Math.max(0.4, 1 - dismissY / (DISMISS_THRESHOLD * 2.4)));
	const imageStyle = $derived.by(() => {
		const tx = offsetX + swipeX;
		const ty = offsetY + dismissY;
		const fade = dismissY > 0 ? Math.max(0.45, 1 - dismissY / 320) : 1;
		return `transform: translate3d(${tx}px, ${ty}px, 0) scale(${scale}); opacity: ${fade}`;
	});
	const transitioning = $derived(!dragging);

	/** Promotes the node to the top layer; removing it from the DOM leaves the layer automatically. */
	function topLayer(node: HTMLElement) {
		node.showPopover?.();
	}
</script>

{#if open && current}
	<!-- popover=manual → browser top layer: fixed page chrome (bottom navs, headers) can't cover it -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		popover="manual"
		use:topLayer
		class={[
			'inset-0 m-0 p-0 fixed z-50 flex h-dvh max-h-none w-screen max-w-none flex-col overflow-visible border-0',
			blurBackdrop && 'backdrop-blur-xl',
			className
		]}
		style:background={`rgba(9,9,11,${0.95 * backdropOpacity})`}
		role="dialog"
		aria-modal="true"
		aria-label={current.alt ?? current.caption ?? 'Image preview'}
		onclick={onBackdropClick}
	>
		<!-- Top bar -->
		<header
			data-lightbox-chrome
			class="gap-3 px-4 py-3 sm:px-5 relative z-20 flex shrink-0 items-center justify-between"
		>
			<div class="min-w-0 flex-1">
				{#if showCounter}
					<p class="text-sm font-medium text-white/90 tabular-nums">
						{#if hasMany}
							{index + 1}<span class="text-white/35"> / {images.length}</span>
						{:else}
							{text.preview}
						{/if}
						{#if canZoom && scale > minZoom}
							<span class="ml-2 text-xs font-normal text-white/40">{Math.round(scale * 100)}%</span>
						{/if}
					</p>
				{/if}
			</div>

			<div class="gap-1 flex items-center">
				{#if canZoom}
					<button
						type="button"
						class="h-9 w-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center transition disabled:opacity-30"
						onclick={() => zoomAt(scale - 0.25)}
						aria-label={text.zoomOut}
						disabled={scale <= minZoom}
					>
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" d="M5 12h14" />
						</svg>
					</button>
					<button
						type="button"
						class="h-9 w-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center transition disabled:opacity-30"
						onclick={() => (scale > minZoom ? resetTransform() : zoomAt(2))}
						aria-label={scale > minZoom ? text.resetZoom : text.zoomIn}
					>
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
						>
							<circle cx="11" cy="11" r="7" />
							<path stroke-linecap="round" d="M21 21l-4.3-4.3" />
							{#if scale <= minZoom}
								<path stroke-linecap="round" d="M11 8v6M8 11h6" />
							{/if}
						</svg>
					</button>
				{/if}
				{#if showClose}
					<button
						type="button"
						class="ml-1 h-9 w-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center transition"
						onclick={close}
						aria-label={text.close}
					>
						<svg
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</header>

		<!-- Stage -->
		<div
			bind:this={stageEl}
			class={[
				'min-h-0 px-12 sm:px-16 relative flex flex-1 items-center justify-center',
				!isVideo && (scale > minZoom || (draggable && hasMany)) ? 'cursor-grab' : 'cursor-default',
				dragging && 'cursor-grabbing'
			]}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerCancel}
			onwheel={onWheel}
			ondblclick={toggleZoom}
			role="presentation"
		>
			{#if showNav && canPrev}
				<button
					data-lightbox-chrome
					type="button"
					class="left-2 h-10 w-10 text-white/50 hover:bg-white/10 hover:text-white sm:left-3 absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition"
					onclick={(e) => {
						e.stopPropagation();
						prev();
					}}
					aria-label={text.previous}
				>
					<svg
						class="h-6 w-6"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
			{/if}

			{#if showNav && canNext}
				<button
					data-lightbox-chrome
					type="button"
					class="right-2 h-10 w-10 text-white/50 hover:bg-white/10 hover:text-white sm:right-3 absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition"
					onclick={(e) => {
						e.stopPropagation();
						next();
					}}
					aria-label={text.next}
				>
					<svg
						class="h-6 w-6"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			{/if}

			<figure
				class={[
					'max-w-5xl relative flex max-h-full flex-col items-center will-change-transform',
					transitioning && 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
				]}
				style={imageStyle}
			>
				{#if isVideo}
					<!-- data-lightbox-chrome: clicks and drags on the player go to its controls, not to swipe -->
					<div
						data-lightbox-chrome
						class={[
							'rounded-lg bg-black shadow-2xl overflow-hidden',
							current.vertical
								? 'aspect-[9/16] h-[min(72vh,860px)] max-w-[88vw]'
								: 'aspect-video max-h-[min(72vh,860px)] w-[min(88vw,1024px)]'
						]}
					>
						{#key current.src}
							{#if current.embed}
								<iframe
									src={current.src}
									title={current.alt ?? current.caption ?? 'Video'}
									class="h-full w-full border-0"
									allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
									allowfullscreen
									referrerpolicy="strict-origin-when-cross-origin"
								></iframe>
							{:else}
								<!-- svelte-ignore a11y_media_has_caption -->
								<video
									src={current.src}
									poster={current.poster}
									class="h-full w-full object-contain"
									controls
									autoplay
									playsinline
									preload="metadata"
								></video>
							{/if}
						{/key}
					</div>
				{:else}
					{#if !imageLoaded}
						<div class="inset-0 absolute flex items-center justify-center" aria-hidden="true">
							<span
								class="h-7 w-7 animate-spin border-white/15 border-t-white/70 rounded-full border-2"
							></span>
						</div>
					{/if}
					<img
						src={current.src}
						alt={current.alt ?? ''}
						draggable="false"
						class={[
							'max-h-[min(72vh,860px)] max-w-[min(100%,88vw)] object-contain select-none',
							!imageLoaded && 'opacity-0',
							imageLoaded && 'opacity-100 transition-opacity duration-300'
						]}
						onload={() => (imageLoaded = true)}
					/>
				{/if}
			</figure>
		</div>

		<!-- Bottom dock -->
		<footer
			data-lightbox-chrome
			class="border-white/[0.06] bg-zinc-950/80 px-0 pb-3 pt-3 backdrop-blur-xl sm:pb-4 sm:pt-3.5 relative z-20 shrink-0 border-t"
		>
			{#if showCaptions && (current.caption || current.alt)}
				<p class="mb-3 px-4 text-sm text-white/65 sm:px-5 truncate text-center">
					{current.caption ?? current.alt}
				</p>
			{/if}

			{#if showStrip}
				<div class="relative">
					<div
						class="inset-y-0 left-0 w-8 from-zinc-950/90 sm:w-12 pointer-events-none absolute z-10 bg-gradient-to-r to-transparent"
						aria-hidden="true"
					></div>
					<div
						class="inset-y-0 right-0 w-8 from-zinc-950/90 sm:w-12 pointer-events-none absolute z-10 bg-gradient-to-l to-transparent"
						aria-hidden="true"
					></div>

					<div
						bind:this={stripEl}
						class="gap-2.5 px-4 py-2 sm:gap-3 sm:px-6 sm:py-2.5 flex [scrollbar-width:none] overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
						role="tablist"
						aria-label={text.thumbnails}
					>
						{#each images as img, i (img.src + i)}
							{@const active = i === index}
							<button
								type="button"
								role="tab"
								data-thumb-index={i}
								aria-selected={active}
								aria-label={img.alt ?? `Image ${i + 1}`}
								onclick={() => goTo(i)}
								class={[
									'group rounded-lg focus-visible:ring-white/70 focus-visible:ring-offset-zinc-950 relative shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
									'transition-[transform,opacity] duration-200',
									active ? 'z-[1] scale-105 opacity-100' : 'opacity-45 hover:opacity-85'
								]}
							>
								<span
									class={[
										'rounded-lg bg-white/5 shadow-lg block overflow-hidden ring-2 transition',
										active ? 'ring-white' : 'group-hover:ring-white/25 ring-transparent'
									]}
								>
									{#if img.type !== 'video' || img.thumbSrc || img.poster}
										<img
											src={img.thumbSrc ?? img.poster ?? img.src}
											alt=""
											class="h-14 sm:h-16 sm:w-24 w-[4.5rem] object-cover"
											draggable="false"
										/>
									{:else}
										<span class="h-14 bg-zinc-800 sm:h-16 sm:w-24 block w-[4.5rem]"></span>
									{/if}
								</span>
								{#if img.type === 'video'}
									<span
										class="inset-0 pointer-events-none absolute flex items-center justify-center"
										aria-hidden="true"
									>
										<svg
											class="h-6 w-6 text-white drop-shadow"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M8 5.5v13l11-6.5z" />
										</svg>
									</span>
								{/if}
								{#if active}
									<span
										class="-bottom-1.5 h-0.5 w-5 bg-white absolute left-1/2 -translate-x-1/2 rounded-full"
										aria-hidden="true"
									></span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</footer>
	</div>
{/if}
