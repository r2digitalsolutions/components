<script module lang="ts">
	let scrollLockCount = 0;

	export type BottomSheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

	const SIZE_MAX_HEIGHT: Record<BottomSheetSize, string> = {
		sm: '40vh',
		md: '55vh',
		lg: '70vh',
		xl: '88vh',
		full: '96vh'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';

	interface BottomSheetProps {
		id?: string;
		open?: boolean;
		title?: string;
		description?: string;
		/** Named height preset. Overridden by `maxHeight` when set. */
		size?: BottomSheetSize;
		/** Explicit max-height CSS value (e.g. `60vh`, `480px`). */
		maxHeight?: string;
		/** Max width on large screens (centered). */
		maxWidth?: string;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showHandle?: boolean;
		showClose?: boolean;
		blurBackdrop?: boolean;
		/** Drag the handle / header to dismiss. */
		draggable?: boolean;
		/** Pull down past threshold to close. */
		pullToClose?: boolean;
		/** Drag distance (px) required to dismiss. */
		dismissOffset?: number;
		class?: string;
		children?: Snippet;
		/** Replaces default title/description block. */
		header?: Snippet;
		/** Right side of the header (next to close). */
		actions?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		id = `bottom-sheet-${Math.random().toString(36).slice(2, 9)}`,
		open = $bindable(false),
		title,
		description,
		size = 'lg',
		maxHeight,
		maxWidth = '32rem',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showHandle = true,
		showClose = true,
		blurBackdrop = true,
		draggable = true,
		pullToClose = true,
		dismissOffset = 100,
		class: className = '',
		children,
		header,
		actions,
		footer,
		onclose
	}: BottomSheetProps = $props();

	type Motion = 'idle' | 'open' | 'closing';

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let motion = $state<Motion>('idle');
	let dragY = $state(0);
	let dragging = $state(false);
	let closeFallbackTimer: ReturnType<typeof setTimeout> | null = null;
	let enterRaf = 0;
	let pointerId: number | null = null;
	let dragStartY = 0;

	const titleId = $derived(`${id}-title`);
	const descriptionId = $derived(`${id}-description`);
	const ANIM_MS = 280;
	const resolvedMaxHeight = $derived(maxHeight ?? SIZE_MAX_HEIGHT[size]);

	$effect(() => {
		if (!dialogEl) return;

		if (open) {
			clearCloseFallback();
			cancelEnterRaf();
			dragY = 0;

			if (!dialogEl.open) {
				motion = 'idle';
				dialogEl.showModal();
				enterRaf = requestAnimationFrame(() => {
					enterRaf = requestAnimationFrame(() => {
						if (!open) return;
						motion = 'open';
					});
				});
			} else if (motion !== 'open') {
				motion = 'open';
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
		dragY = 0;
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

	function handleDialogClose() {
		cancelEnterRaf();
		clearCloseFallback();
		motion = 'idle';
		dragging = false;
		dragY = 0;
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
		if (event.propertyName !== 'transform') return;
		if (motion === 'closing') finishClose();
	}

	function canDragFromBody() {
		if (!bodyEl) return true;
		return bodyEl.scrollTop <= 0;
	}

	function beginDrag(e: PointerEvent) {
		if (!draggable || motion !== 'open') return;
		pointerId = e.pointerId;
		dragStartY = e.clientY;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}

	function onHandlePointerDown(e: PointerEvent) {
		beginDrag(e);
	}

	function onHeaderPointerDown(e: PointerEvent) {
		if (!draggable || motion !== 'open') return;
		const t = e.target as HTMLElement;
		if (t.closest('button, a, input, textarea, select, [data-no-drag]')) return;
		beginDrag(e);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || e.pointerId !== pointerId) return;
		dragY = Math.max(0, e.clientY - dragStartY);
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging || e.pointerId !== pointerId) return;
		dragging = false;
		pointerId = null;

		if (pullToClose && dragY >= dismissOffset) {
			close();
			return;
		}
		dragY = 0;
	}

	function onBodyTouchStart(e: TouchEvent) {
		if (!draggable || motion !== 'open' || !canDragFromBody()) return;
		const touch = e.touches[0];
		if (!touch) return;
		dragStartY = touch.clientY;
		dragging = true;
		pointerId = null;
	}

	function onBodyTouchMove(e: TouchEvent) {
		if (!dragging || pointerId !== null) return;
		const touch = e.touches[0];
		if (!touch) return;
		const delta = touch.clientY - dragStartY;
		if (delta < 0) {
			if (!canDragFromBody()) dragging = false;
			return;
		}
		if (!canDragFromBody()) {
			dragging = false;
			return;
		}
		e.preventDefault();
		dragY = delta;
	}

	function onBodyTouchEnd() {
		if (!dragging || pointerId !== null) return;
		dragging = false;
		if (pullToClose && dragY >= dismissOffset) {
			close();
			return;
		}
		dragY = 0;
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
		'bottom-sheet m-0 h-full w-full max-h-none max-w-none overflow-clip border-0 bg-transparent p-0 open:block',
		blurBackdrop && 'backdrop:bg-black/40 backdrop:backdrop-blur-[2px]',
		!blurBackdrop && 'backdrop:bg-black/40'
	]}
>
	<div
		class={[
			'bottom-sheet-panel relative mx-auto flex w-full flex-col overflow-hidden border border-border border-b-0 bg-surface-elevated shadow-xl outline-none',
			'rounded-t-2xl',
			dragging && 'bottom-sheet-panel--dragging',
			className
		]}
		style:max-width={maxWidth}
		style:max-height={resolvedMaxHeight}
		style:transform={
			motion === 'open'
				? `translateY(${dragY}px)`
				: motion === 'closing'
					? 'translateY(100%)'
					: 'translateY(100%)'
		}
		style:transition={dragging ? 'none' : `transform ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`}
		role="document"
		ontransitionend={handlePanelTransitionEnd}
	>
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

		{#if header || title || showClose || actions}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<header
				class="flex shrink-0 items-start gap-2 border-b border-border px-4 py-2.5"
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
							<h2 id={titleId} class="text-sm font-semibold text-primary">{title}</h2>
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
			class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3"
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
	.bottom-sheet {
		overflow: clip;
		overscroll-behavior: contain;
	}

	.bottom-sheet::backdrop {
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.bottom-sheet[data-motion='open']::backdrop {
		opacity: 1;
	}

	.bottom-sheet[data-motion='closing']::backdrop {
		opacity: 0;
	}

	.bottom-sheet-panel {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		will-change: transform;
	}

	.bottom-sheet-panel--dragging {
		transition: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.bottom-sheet::backdrop,
		.bottom-sheet-panel {
			transition-duration: 0.01ms !important;
		}
	}
</style>
