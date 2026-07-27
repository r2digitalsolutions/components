<script lang="ts">
	import type { Snippet } from 'svelte';
	import SplitHandle from '$lib/components/atoms/SplitHandle/SplitHandle.svelte';
	import type { SplitOrientation } from '$lib/components/atoms/SplitHandle/SplitHandle.svelte';

	interface SplitPaneProps {
		orientation?: SplitOrientation;
		/** Size of the sized pane (bindable). Unit controlled by `unit`. */
		size?: number;
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		/** Which pane the size applies to */
		sizePane?: 'start' | 'end';
		/** `percent` (default) or absolute `px` relative to the container. */
		unit?: 'percent' | 'px';
		/**
		 * Collapse a pane to its content intrinsic size (e.g. Panel header).
		 * The sibling fills the remaining space; the handle is hidden.
		 */
		startCollapsed?: boolean;
		endCollapsed?: boolean;
		/**
		 * Idle: thin accent line. Hover / focus / drag: full grip.
		 * Pass-through to SplitHandle.
		 */
		revealOnHover?: boolean;
		class?: string;
		start?: Snippet;
		end?: Snippet;
	}

	let {
		orientation = 'horizontal',
		size = $bindable(undefined as number | undefined),
		defaultSize = 50,
		minSize = 15,
		maxSize = 85,
		sizePane = 'start',
		unit = 'percent',
		startCollapsed = false,
		endCollapsed = false,
		revealOnHover = false,
		class: className = '',
		start,
		end
	}: SplitPaneProps = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);
	// Intentionally capture initial defaultSize for uncontrolled mode
	let internalSize = $state(defaultSize);
	let activePointerId = $state<number | null>(null);

	const isHorizontal = $derived(orientation === 'horizontal');
	const currentSize = $derived(size ?? internalSize);
	const sizeEnd = $derived(sizePane === 'end');
	const isPx = $derived(unit === 'px');
	const eitherCollapsed = $derived(startCollapsed || endCollapsed);
	const bothCollapsed = $derived(startCollapsed && endCollapsed);

	function containerSpan(): number {
		if (!containerEl) return isPx ? 1000 : 100;
		const rect = containerEl.getBoundingClientRect();
		return isHorizontal ? rect.width : rect.height;
	}

	function setSize(next: number) {
		const clamped = Math.min(maxSize, Math.max(minSize, next));
		if (size !== undefined) {
			size = clamped;
		} else {
			internalSize = clamped;
		}
	}

	function applyPointer(e: PointerEvent) {
		if (!containerEl || eitherCollapsed) return;
		const rect = containerEl.getBoundingClientRect();
		const span = isHorizontal ? rect.width : rect.height;
		const offset = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top;
		if (isPx) {
			const fromStart = offset;
			setSize(sizeEnd ? span - fromStart : fromStart);
			return;
		}
		const pct = (offset / span) * 100;
		setSize(sizeEnd ? 100 - pct : pct);
	}

	function startDrag(e: PointerEvent) {
		if (eitherCollapsed) return;
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		e.preventDefault();
		isDragging = true;
		activePointerId = e.pointerId;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		applyPointer(e);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging || e.pointerId !== activePointerId) return;
		applyPointer(e);
	}

	function stopDrag(e: PointerEvent) {
		if (e.pointerId !== activePointerId) return;
		const el = e.currentTarget as HTMLElement;
		if (el.hasPointerCapture?.(e.pointerId)) {
			el.releasePointerCapture(e.pointerId);
		}
		isDragging = false;
		activePointerId = null;
	}

	function onAdjust(delta: number) {
		if (eitherCollapsed) return;
		if (isPx) {
			const span = containerSpan();
			const separator = sizeEnd ? span - currentSize : currentSize;
			const nextSep = separator + delta * 4;
			setSize(sizeEnd ? span - nextSep : nextSep);
			return;
		}
		const separator = sizeEnd ? 100 - currentSize : currentSize;
		const nextSep = separator + delta;
		setSize(sizeEnd ? 100 - nextSep : nextSep);
	}

	const separatorValue = $derived.by(() => {
		if (!isPx) return sizeEnd ? 100 - currentSize : currentSize;
		const span = containerSpan() || 1;
		const fromStart = sizeEnd ? span - currentSize : currentSize;
		return (fromStart / span) * 100;
	});
	const separatorMin = $derived.by(() => {
		if (!isPx) return sizeEnd ? 100 - maxSize : minSize;
		const span = containerSpan() || 1;
		const fromStartMin = sizeEnd ? span - maxSize : minSize;
		return (fromStartMin / span) * 100;
	});
	const separatorMax = $derived.by(() => {
		if (!isPx) return sizeEnd ? 100 - minSize : maxSize;
		const span = containerSpan() || 1;
		const fromStartMax = sizeEnd ? span - minSize : maxSize;
		return (fromStartMax / span) * 100;
	});

	/** Collapsed panes shrink to content (Panel header); sibling fills. */
	const collapsedStyle = 'flex:none;align-self:stretch;';
	const fillStyle = 'flex:1;min-width:0;min-height:0;';

	function sizedStyle(): string {
		return isPx
			? `${isHorizontal ? 'width' : 'height'}:${currentSize}px;flex:none;`
			: `${isHorizontal ? 'width' : 'height'}:${currentSize}%;flex:none;`;
	}

	const startStyle = $derived.by(() => {
		if (bothCollapsed) return collapsedStyle;
		if (startCollapsed) return collapsedStyle;
		if (endCollapsed) return fillStyle;
		return sizeEnd ? fillStyle : sizedStyle();
	});

	const endStyle = $derived.by(() => {
		if (bothCollapsed) return collapsedStyle;
		if (endCollapsed) return collapsedStyle;
		if (startCollapsed) return fillStyle;
		return sizeEnd ? sizedStyle() : fillStyle;
	});
</script>

<div
	bind:this={containerEl}
	class={[
		'flex min-h-0 min-w-0 overflow-hidden',
		isHorizontal ? 'flex-row' : 'flex-col',
		isDragging && (isHorizontal ? 'cursor-col-resize select-none' : 'cursor-row-resize select-none'),
		className
	]}
>
	<div class="min-h-0 min-w-0 overflow-hidden" style={startStyle}>
		{#if start}
			{@render start()}
		{/if}
	</div>

	{#if !eitherCollapsed}
		<SplitHandle
			{orientation}
			value={separatorValue}
			min={separatorMin}
			max={separatorMax}
			dragging={isDragging}
			{revealOnHover}
			onpointerdown={startDrag}
			onpointermove={onPointerMove}
			onpointerup={stopDrag}
			onpointercancel={stopDrag}
			onadjust={onAdjust}
		/>
	{/if}

	<div class="min-h-0 min-w-0 overflow-hidden" style={endStyle}>
		{#if end}
			{@render end()}
		{/if}
	</div>
</div>
