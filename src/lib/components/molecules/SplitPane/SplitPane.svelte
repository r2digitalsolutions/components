<script lang="ts">
	import type { Snippet } from 'svelte';
	import SplitHandle from '$lib/components/atoms/SplitHandle/SplitHandle.svelte';
	import type { SplitOrientation } from '$lib/components/atoms/SplitHandle/SplitHandle.svelte';

	interface SplitPaneProps {
		orientation?: SplitOrientation;
		/** Size of the sized pane as percentage (bindable) */
		size?: number;
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		/** Which pane the size percentage applies to */
		sizePane?: 'start' | 'end';
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

	function setSize(next: number) {
		const clamped = Math.min(maxSize, Math.max(minSize, next));
		if (size !== undefined) {
			size = clamped;
		} else {
			internalSize = clamped;
		}
	}

	function applyPointer(e: PointerEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		let pct: number;
		if (isHorizontal) {
			pct = ((e.clientX - rect.left) / rect.width) * 100;
		} else {
			pct = ((e.clientY - rect.top) / rect.height) * 100;
		}
		setSize(sizeEnd ? 100 - pct : pct);
	}

	function startDrag(e: PointerEvent) {
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
		// Handle value is always the separator position from the start edge
		const separator = sizeEnd ? 100 - currentSize : currentSize;
		const nextSep = separator + delta;
		setSize(sizeEnd ? 100 - nextSep : nextSep);
	}

	const separatorValue = $derived(sizeEnd ? 100 - currentSize : currentSize);
	const separatorMin = $derived(sizeEnd ? 100 - maxSize : minSize);
	const separatorMax = $derived(sizeEnd ? 100 - minSize : maxSize);

	const startStyle = $derived(
		sizeEnd
			? 'flex:1;min-width:0;min-height:0;'
			: `${isHorizontal ? 'width' : 'height'}:${currentSize}%;flex:none;`
	);

	const endStyle = $derived(
		sizeEnd
			? `${isHorizontal ? 'width' : 'height'}:${currentSize}%;flex:none;`
			: 'flex:1;min-width:0;min-height:0;'
	);
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

	<div class="min-h-0 min-w-0 overflow-hidden" style={endStyle}>
		{#if end}
			{@render end()}
		{/if}
	</div>
</div>
