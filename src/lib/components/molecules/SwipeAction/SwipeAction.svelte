<script module lang="ts">
	export type SwipeActionVariant = 'default' | 'danger' | 'warning' | 'success' | 'brand' | 'muted';

	export interface SwipeActionItem {
		id: string;
		label: string;
		/** Short label under icon; defaults to `label` */
		hint?: string;
		variant?: SwipeActionVariant;
		disabled?: boolean;
		onclick?: () => void;
	}

	const VARIANT_CLASS: Record<SwipeActionVariant, string> = {
		default: 'bg-surface-overlay text-primary hover:bg-border',
		danger: 'bg-red-500 text-white hover:bg-red-600',
		warning: 'bg-amber-500 text-white hover:bg-amber-600',
		success: 'bg-emerald-500 text-white hover:bg-emerald-600',
		brand: 'bg-brand-500 text-white hover:bg-brand-600',
		muted: 'bg-zinc-500 text-white hover:bg-zinc-600'
	};

	const ACTION_WIDTH = 72;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SwipeActionProps {
		/** Actions revealed by swiping right (content moves right → left panel) */
		leftActions?: SwipeActionItem[];
		/** Actions revealed by swiping left (content moves left → right panel) */
		rightActions?: SwipeActionItem[];
		/** px to commit open. Default ~ half an action width */
		threshold?: number;
		disabled?: boolean;
		/** Close the row after an action is pressed. Default true */
		closeOnAction?: boolean;
		class?: string;
		children?: Snippet;
		/** Custom left panel (overrides `leftActions` rendering) */
		left?: Snippet;
		/** Custom right panel (overrides `rightActions` rendering) */
		right?: Snippet;
		/** @deprecated Prefer `right` — kept for existing call sites */
		actions?: Snippet;
		onopen?: (side: 'left' | 'right') => void;
		onclose?: () => void;
		onaction?: (action: SwipeActionItem, side: 'left' | 'right') => void;
	}

	let {
		leftActions = [],
		rightActions = [],
		threshold,
		disabled = false,
		closeOnAction = true,
		class: className = '',
		children,
		left,
		right,
		actions,
		onopen,
		onclose,
		onaction
	}: SwipeActionProps = $props();

	let offset = $state(0);
	let openSide = $state<'left' | 'right' | null>(null);
	let dragging = $state(false);
	let startX = 0;
	let startY = 0;
	let startOffset = 0;
	let axisLocked: 'none' | 'h' | 'v' = 'none';
	let activePointerId: number | null = null;
	let contentEl = $state<HTMLDivElement | null>(null);

	const rightPanel = $derived(right ?? actions);
	const leftWidth = $derived.by(() => {
		if (leftActions.length) return leftActions.length * ACTION_WIDTH;
		if (left) return ACTION_WIDTH * 2;
		return 0;
	});
	const rightWidth = $derived.by(() => {
		if (rightActions.length) return rightActions.length * ACTION_WIDTH;
		if (rightPanel) return ACTION_WIDTH * 2;
		return 0;
	});
	const maxLeft = $derived(leftWidth);
	const maxRight = $derived(rightWidth);
	const commitThreshold = $derived(threshold ?? Math.min(56, Math.max(40, ACTION_WIDTH * 0.55)));

	function clamp(n: number) {
		return Math.min(maxLeft, Math.max(-maxRight, n));
	}

	function clearSelection() {
		try {
			window.getSelection()?.removeAllRanges();
		} catch {
			/* ignore */
		}
	}

	function bindWindowListeners() {
		window.addEventListener('pointermove', onWindowPointerMove, { passive: false });
		window.addEventListener('pointerup', onWindowPointerUp);
		window.addEventListener('pointercancel', onWindowPointerUp);
	}

	function unbindWindowListeners() {
		window.removeEventListener('pointermove', onWindowPointerMove);
		window.removeEventListener('pointerup', onWindowPointerUp);
		window.removeEventListener('pointercancel', onWindowPointerUp);
	}

	function onPointerDown(e: PointerEvent) {
		if (disabled || e.button !== 0) return;
		const t = e.target as HTMLElement | null;
		if (t?.closest('button, a, input, textarea, select, [data-no-swipe]')) return;

		activePointerId = e.pointerId;
		startX = e.clientX;
		startY = e.clientY;
		startOffset = offset;
		axisLocked = 'none';
		dragging = true;
		clearSelection();
		contentEl?.setPointerCapture?.(e.pointerId);
		bindWindowListeners();
	}

	function onWindowPointerMove(e: PointerEvent) {
		if (!dragging || e.pointerId !== activePointerId) return;

		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		if (axisLocked === 'none') {
			if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
			if (Math.abs(dy) > Math.abs(dx)) {
				// Vertical scroll intent — abort swipe.
				axisLocked = 'v';
				dragging = false;
				activePointerId = null;
				unbindWindowListeners();
				return;
			}
			axisLocked = 'h';
			clearSelection();
		}

		if (axisLocked !== 'h') return;

		e.preventDefault();
		clearSelection();
		offset = clamp(startOffset + dx);
	}

	function settle() {
		if (offset >= commitThreshold && maxLeft > 0) {
			offset = maxLeft;
			if (openSide !== 'left') {
				openSide = 'left';
				onopen?.('left');
			}
			return;
		}
		if (offset <= -commitThreshold && maxRight > 0) {
			offset = -maxRight;
			if (openSide !== 'right') {
				openSide = 'right';
				onopen?.('right');
			}
			return;
		}
		const wasOpen = openSide !== null;
		offset = 0;
		openSide = null;
		if (wasOpen) onclose?.();
	}

	function endDrag(e?: PointerEvent) {
		if (e && activePointerId !== null && e.pointerId !== activePointerId) return;

		const shouldSettle = axisLocked === 'h';
		dragging = false;
		if (activePointerId !== null && contentEl?.hasPointerCapture?.(activePointerId)) {
			try {
				contentEl.releasePointerCapture(activePointerId);
			} catch {
				/* ignore */
			}
		}
		activePointerId = null;
		unbindWindowListeners();
		if (shouldSettle) settle();
		axisLocked = 'none';
	}

	function onWindowPointerUp(e: PointerEvent) {
		endDrag(e);
	}

	function close() {
		const wasOpen = openSide !== null;
		offset = 0;
		openSide = null;
		dragging = false;
		axisLocked = 'none';
		activePointerId = null;
		unbindWindowListeners();
		if (wasOpen) onclose?.();
	}

	function runAction(action: SwipeActionItem, side: 'left' | 'right') {
		if (action.disabled) return;
		action.onclick?.();
		onaction?.(action, side);
		if (closeOnAction) close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (disabled) return;
		if (e.key === 'Escape' && openSide) {
			e.preventDefault();
			close();
			return;
		}
		if (e.key === 'ArrowLeft' && maxRight > 0) {
			e.preventDefault();
			offset = -maxRight;
			openSide = 'right';
			onopen?.('right');
		}
		if (e.key === 'ArrowRight' && maxLeft > 0) {
			e.preventDefault();
			offset = maxLeft;
			openSide = 'left';
			onopen?.('left');
		}
	}

	function onSelectStart(e: Event) {
		if (dragging || axisLocked === 'h') e.preventDefault();
	}

</script>

<div
	class={[
		'relative overflow-hidden rounded-xl border border-border bg-surface-elevated select-none',
		className
	]}
>
	{#if maxLeft > 0}
		<div
			class="absolute inset-y-0 left-0 flex items-stretch"
			style:width={`${maxLeft}px`}
			aria-hidden={openSide !== 'left'}
		>
			{#if left}
				{@render left()}
			{:else}
				{#each leftActions as action (action.id)}
					<button
						type="button"
						class={[
							'flex w-[72px] shrink-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition-colors',
							VARIANT_CLASS[action.variant ?? 'default'],
							action.disabled && 'cursor-not-allowed opacity-50'
						]}
						disabled={action.disabled}
						aria-label={action.label}
						onclick={() => runAction(action, 'left')}
					>
						<span class="leading-tight">{action.label}</span>
						{#if action.hint}
							<span class="text-[10px] font-normal opacity-80">{action.hint}</span>
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	{/if}

	{#if maxRight > 0}
		<div
			class="absolute inset-y-0 right-0 flex items-stretch justify-end"
			style:width={`${maxRight}px`}
			aria-hidden={openSide !== 'right'}
		>
			{#if rightPanel}
				{@render rightPanel()}
			{:else}
				{#each rightActions as action (action.id)}
					<button
						type="button"
						class={[
							'flex w-[72px] shrink-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition-colors',
							VARIANT_CLASS[action.variant ?? 'default'],
							action.disabled && 'cursor-not-allowed opacity-50'
						]}
						disabled={action.disabled}
						aria-label={action.label}
						onclick={() => runAction(action, 'right')}
					>
						<span class="leading-tight">{action.label}</span>
						{#if action.hint}
							<span class="text-[10px] font-normal opacity-80">{action.hint}</span>
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	{/if}

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={contentEl}
		role="group"
		tabindex={disabled ? -1 : 0}
		aria-label="Swipeable row. Arrow keys reveal actions."
		class={[
			'swipe-action-content relative z-[1] bg-surface-elevated select-none',
			disabled ? 'cursor-not-allowed opacity-60' : dragging ? 'cursor-grabbing' : 'cursor-grab',
			!dragging && 'transition-transform duration-200 ease-out'
		]}
		style:transform={`translateX(${offset}px)`}
		style:touch-action="pan-y"
		onpointerdown={onPointerDown}
		onselectstart={onSelectStart}
		onkeydown={onKeydown}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.swipe-action-content,
	.swipe-action-content :global(*) {
		-webkit-user-select: none;
		user-select: none;
		-webkit-user-drag: none;
	}
</style>
