<script module lang="ts">
	let scrollLockCount = 0;

	export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
	export type SheetAccent = 'none' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

	/** Named presets → viewport height fractions (0–1). */
	export const SHEET_SIZE_SNAPS: Record<SheetSize, number[]> = {
		sm: [0.38],
		md: [0.55],
		lg: [0.48, 0.82],
		xl: [0.35, 0.62, 0.94],
		full: [0.96]
	};

	const ACCENT_COLORS: Record<Exclude<SheetAccent, 'none'>, string> = {
		brand: 'var(--color-brand-500, #6366f1)',
		success: '#22c55e',
		warning: '#f59e0b',
		danger: '#ef4444',
		info: '#0ea5e9'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';

	interface SheetProps {
		id?: string;
		open?: boolean;
		title?: string;
		description?: string;
		/** Preset that defines default snap breakpoints */
		size?: SheetSize;
		/** Custom snap points as viewport fractions (0–1). Overrides size preset. */
		snaps?: number[];
		/** Current snap index (bindable) */
		snapIndex?: number;
		accent?: SheetAccent | (string & {});
		showHandle?: boolean;
		showClose?: boolean;
		/** Show snap breakpoint dots when there are 2+ snaps */
		showSnaps?: boolean;
		/** Draw the top accent stripe (the colored top edge) */
		borderTop?: boolean;
		/** Allow dragging the sheet between snaps */
		draggable?: boolean;
		/** Pull down past the lowest snap to dismiss */
		pullToClose?: boolean;
		/** Extra drag (px) below lowest snap required to dismiss */
		dismissOffset?: number;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		blurBackdrop?: boolean;
		/** Max width on large screens (centered) */
		maxWidth?: string;
		class?: string;
		children?: Snippet;
		/** Replaces default title/description block */
		header?: Snippet;
		/** Right side of the header (next to close) */
		actions?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
		onsnap?: (index: number, fraction: number) => void;
	}

	let {
		id = `sheet-${Math.random().toString(36).slice(2, 9)}`,
		open = $bindable(false),
		title,
		description,
		size = 'md',
		snaps,
		snapIndex = $bindable(0),
		accent = 'brand',
		showHandle = true,
		showClose = true,
		showSnaps = true,
		borderTop = false,
		draggable = true,
		pullToClose = true,
		dismissOffset = 80,
		closeOnBackdrop = true,
		closeOnEscape = true,
		blurBackdrop = true,
		maxWidth = '32rem',
		class: className = '',
		children,
		header,
		actions,
		footer,
		onclose,
		onsnap
	}: SheetProps = $props();

	type Motion = 'idle' | 'open' | 'closing';

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let motion = $state<Motion>('idle');
	let dragging = $state(false);
	/** Current height as fraction of viewport */
	let heightFrac = $state(0);

	let dragStartY = 0;
	let dragStartFrac = 0;
	let closeFallbackTimer: ReturnType<typeof setTimeout> | null = null;
	let enterRaf = 0;
	let pointerId: number | null = null;

	const titleId = $derived(`${id}-title`);
	const descriptionId = $derived(`${id}-description`);
	const ANIM_MS = 320;

	const points = $derived.by(() => {
		const raw = snaps?.length ? snaps : SHEET_SIZE_SNAPS[size];
		return [...raw].map((n) => Math.min(0.98, Math.max(0.12, n))).sort((a, b) => a - b);
	});

	const accentColor = $derived(
		accent === 'none'
			? null
			: accent in ACCENT_COLORS
				? ACCENT_COLORS[accent as Exclude<SheetAccent, 'none'>]
				: String(accent)
	);

	const lowest = $derived(points[0] ?? 0.4);
	const highest = $derived(points[points.length - 1] ?? 0.9);

	$effect(() => {
		if (!dialogEl) return;

		if (open) {
			clearCloseFallback();
			cancelEnterRaf();
			const idx = clampIndex(snapIndex);
			if (idx !== snapIndex) snapIndex = idx;

			if (!dialogEl.open) {
				motion = 'idle';
				heightFrac = 0;
				dialogEl.showModal();
				enterRaf = requestAnimationFrame(() => {
					enterRaf = requestAnimationFrame(() => {
						if (!open) return;
						motion = 'open';
						heightFrac = points[idx] ?? highest;
						onsnap?.(idx, heightFrac);
					});
				});
			} else if (motion !== 'open') {
				motion = 'open';
				heightFrac = points[idx] ?? highest;
			}
			return;
		}

		if (dialogEl.open && motion !== 'closing') {
			startClosing();
		}
	});

	$effect(() => {
		const locked = open || motion === 'closing';
		if (!locked || typeof document === 'undefined') return;

		scrollLockCount += 1;
		if (scrollLockCount === 1) {
			const scrollbar = window.innerWidth - document.documentElement.clientWidth;
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
			if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
		}

		return () => {
			scrollLockCount = Math.max(0, scrollLockCount - 1);
			if (scrollLockCount === 0) {
				document.documentElement.style.overflow = '';
				document.body.style.overflow = '';
				document.body.style.paddingRight = '';
			}
		};
	});

	function clampIndex(i: number) {
		return Math.min(points.length - 1, Math.max(0, i));
	}

	function nearestSnap(frac: number): number {
		let best = 0;
		let dist = Infinity;
		for (let i = 0; i < points.length; i++) {
			const d = Math.abs(points[i] - frac);
			if (d < dist) {
				dist = d;
				best = i;
			}
		}
		return best;
	}

	function cancelEnterRaf() {
		if (enterRaf) {
			cancelAnimationFrame(enterRaf);
			enterRaf = 0;
		}
	}

	function clearCloseFallback() {
		if (closeFallbackTimer !== null) {
			clearTimeout(closeFallbackTimer);
			closeFallbackTimer = null;
		}
	}

	function startClosing() {
		if (motion === 'closing' || !dialogEl?.open) return;
		cancelEnterRaf();
		dragging = false;
		motion = 'closing';
		heightFrac = 0;
		clearCloseFallback();
		closeFallbackTimer = setTimeout(finishClose, ANIM_MS + 40);
	}

	function finishClose() {
		if (motion !== 'closing') return;
		clearCloseFallback();
		motion = 'idle';
		if (dialogEl?.open) dialogEl.close();
	}

	function close() {
		if (!dialogEl?.open || motion === 'closing' || !open) return;
		open = false;
		onclose?.();
	}

	function goToSnap(index: number) {
		const idx = clampIndex(index);
		snapIndex = idx;
		heightFrac = points[idx];
		onsnap?.(idx, heightFrac);
	}

	function handleDialogClose() {
		cancelEnterRaf();
		clearCloseFallback();
		motion = 'idle';
		dragging = false;
		if (open) {
			open = false;
			onclose?.();
		}
	}

	function handleCancelEvent(event: Event) {
		event.preventDefault();
		if (!closeOnEscape) return;
		close();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!closeOnBackdrop || event.target !== dialogEl) return;
		close();
	}

	function handlePanelTransitionEnd(event: TransitionEvent) {
		if (event.target !== event.currentTarget) return;
		if (event.propertyName !== 'height' && event.propertyName !== 'transform') return;
		if (motion === 'closing') finishClose();
	}

	function canDragFromBody() {
		if (!bodyEl) return true;
		return bodyEl.scrollTop <= 0;
	}

	function onHandlePointerDown(e: PointerEvent) {
		if (!draggable || motion !== 'open') return;
		beginDrag(e);
	}

	function onHeaderPointerDown(e: PointerEvent) {
		if (!draggable || motion !== 'open') return;
		const t = e.target as HTMLElement;
		if (t.closest('button, a, input, textarea, select, [data-no-drag]')) return;
		beginDrag(e);
	}

	function beginDrag(e: PointerEvent) {
		pointerId = e.pointerId;
		dragStartY = e.clientY;
		dragStartFrac = heightFrac;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || e.pointerId !== pointerId) return;
		const vh = window.innerHeight || 1;
		const delta = dragStartY - e.clientY;
		let next = dragStartFrac + delta / vh;
		const max = highest + 0.02;
		const min = pullToClose ? Math.max(0.05, lowest - dismissOffset / vh - 0.08) : lowest;
		heightFrac = Math.min(max, Math.max(min, next));
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging || e.pointerId !== pointerId) return;
		dragging = false;
		pointerId = null;

		const vh = window.innerHeight || 1;
		const belowLowest = heightFrac < lowest - dismissOffset / vh / 2;

		if (pullToClose && belowLowest) {
			close();
			return;
		}

		const idx = nearestSnap(heightFrac);
		goToSnap(idx);
	}

	function onBodyTouchStart(e: TouchEvent) {
		if (!draggable || motion !== 'open' || !canDragFromBody()) return;
		const touch = e.touches[0];
		if (!touch) return;
		dragStartY = touch.clientY;
		dragStartFrac = heightFrac;
		dragging = true;
	}

	function onBodyTouchMove(e: TouchEvent) {
		if (!dragging || pointerId !== null) return;
		const touch = e.touches[0];
		if (!touch) return;
		const vh = window.innerHeight || 1;
		const delta = dragStartY - touch.clientY;
		if (delta < 0 && !canDragFromBody()) {
			dragging = false;
			return;
		}
		if (delta < 0) e.preventDefault();
		let next = dragStartFrac + delta / vh;
		const max = highest + 0.02;
		const min = pullToClose ? Math.max(0.05, lowest - dismissOffset / vh - 0.08) : lowest;
		heightFrac = Math.min(max, Math.max(min, next));
	}

	function onBodyTouchEnd() {
		if (!dragging || pointerId !== null) return;
		dragging = false;
		const vh = window.innerHeight || 1;
		const belowLowest = heightFrac < lowest - dismissOffset / vh / 2;
		if (pullToClose && belowLowest) {
			close();
			return;
		}
		goToSnap(nearestSnap(heightFrac));
	}
</script>

<dialog
	bind:this={dialogEl}
	{id}
	data-motion={motion}
	aria-labelledby={title || header ? titleId : undefined}
	aria-describedby={description ? descriptionId : undefined}
	onclose={handleDialogClose}
	oncancel={handleCancelEvent}
	onclick={handleBackdropClick}
	class={[
		'sheet m-0 h-full w-full max-h-none max-w-none overflow-clip border-0 bg-transparent p-0 open:block',
		blurBackdrop && 'backdrop:bg-black/40 backdrop:backdrop-blur-sm',
		!blurBackdrop && 'backdrop:bg-black/40'
	]}
>
	<div
		class={[
			'sheet-panel relative mx-auto flex w-full flex-col overflow-hidden bg-surface-elevated outline-none',
			'rounded-t-2xl',
			borderTop ? 'sheet-panel--bordered border border-b-0 border-border shadow-2xl' : 'sheet-panel--unbordered',
			dragging && 'sheet-panel--dragging',
			className
		]}
		data-border-top={borderTop ? 'true' : 'false'}
		style:max-width={maxWidth}
		style:height={motion === 'idle' ? '0px' : `${heightFrac * 100}vh`}
		style:transition={dragging ? 'none' : `height ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`}
		role="document"
		ontransitionend={handlePanelTransitionEnd}
	>
		{#if borderTop && accentColor}
			<div
				class="sheet-accent h-1 w-full shrink-0"
				style:background={accentColor}
				aria-hidden="true"
			></div>
		{/if}

		{#if showHandle}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="group/handle flex shrink-0 cursor-grab justify-center pt-2.5 pb-1 active:cursor-grabbing"
				aria-hidden="true"
				onpointerdown={onHandlePointerDown}
				onpointermove={onPointerMove}
				onpointerup={onPointerUp}
				onpointercancel={onPointerUp}
			>
				<span
					class={[
						'h-1 w-10 rounded-full transition-[background-color,transform] duration-150',
						dragging
							? 'scale-x-125 bg-brand-500'
							: 'bg-border-strong group-hover/handle:scale-x-125 group-hover/handle:bg-brand-500/70'
					]}
				></span>
			</div>
		{/if}

		{#if showSnaps && points.length > 1}
			<div
				class={[
					'flex shrink-0 justify-center gap-1.5 px-4',
					showHandle ? 'pb-2 pt-0.5' : borderTop && accentColor ? 'pt-2 pb-2' : 'pt-3 pb-2'
				]}
				aria-label="Sheet size"
				role="group"
			>
				{#each points as p, i}
					<button
						type="button"
						class={[
							'h-1.5 rounded-full transition-all',
							snapIndex === i
								? 'w-4 bg-brand-500'
								: 'w-1.5 bg-border-strong hover:bg-secondary'
						]}
						aria-label={`Snap ${Math.round(p * 100)}%`}
						aria-pressed={snapIndex === i}
						onclick={() => goToSnap(i)}
					></button>
				{/each}
			</div>
		{/if}

		{#if header || title || showClose || actions}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<header
				class="flex shrink-0 items-start gap-2 border-b border-border px-4 py-3"
				onpointerdown={onHeaderPointerDown}
				onpointermove={onPointerMove}
				onpointerup={onPointerUp}
				onpointercancel={onPointerUp}
			>
				{#if header}
					<div class="min-w-0 flex-1" id={titleId}>
						{@render header()}
					</div>
				{:else}
					<div class="min-w-0 flex-1">
						{#if title}
							<h2 id={titleId} class="text-base font-semibold text-primary">{title}</h2>
						{/if}
						{#if description}
							<p id={descriptionId} class="mt-0.5 text-xs text-secondary">{description}</p>
						{/if}
					</div>
				{/if}

				<div class="flex shrink-0 items-center gap-1" data-no-drag>
					{#if actions}
						{@render actions()}
					{/if}
					{#if showClose}
						<CloseButton onclick={close} label="Close sheet" />
					{/if}
				</div>
			</header>
		{/if}

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={bodyEl}
			class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 text-sm text-primary"
			ontouchstart={onBodyTouchStart}
			ontouchmove={onBodyTouchMove}
			ontouchend={onBodyTouchEnd}
		>
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if footer}
			<footer class="shrink-0 border-t border-border px-4 py-3">
				{@render footer()}
			</footer>
		{/if}
	</div>
</dialog>

<style>
	.sheet {
		overflow: clip;
		overscroll-behavior: contain;
	}

	.sheet::backdrop {
		opacity: 0;
		transition: opacity 0.22s ease;
	}

	.sheet[data-motion='open']::backdrop {
		opacity: 1;
		transition-duration: 0.28s;
	}

	.sheet[data-motion='closing']::backdrop {
		opacity: 0;
	}

	.sheet-panel {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		will-change: height;
	}

	/* No CSS border — and no ambient shadow rim (shadow-2xl's negative
	   spread draws a dark outline around the rounded top that looks like a border). */
	.sheet-panel--unbordered {
		border: 0 !important;
		border-style: none !important;
		box-shadow:
			0 18px 28px -6px rgb(0 0 0 / 0.2),
			0 8px 12px -6px rgb(0 0 0 / 0.12) !important;
	}

	.sheet-panel--bordered {
		border-bottom: none !important;
	}

	.sheet-panel--dragging {
		transition: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.sheet::backdrop,
		.sheet-panel {
			transition-duration: 0.01ms !important;
		}
	}
</style>
