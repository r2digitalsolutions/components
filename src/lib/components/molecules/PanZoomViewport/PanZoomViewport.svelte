<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import FullscreenToggle from '$lib/components/molecules/FullscreenToggle/FullscreenToggle.svelte';
	import { PAN_ZOOM_CTX, type PanZoomContext } from './panZoomContext.js';

	interface PanZoomViewportProps {
		minZoom?: number;
		maxZoom?: number;
		initialFit?: boolean;
		showControls?: boolean;
		showFullscreen?: boolean;
		height?: string;
		contentKey?: string | number | null;
		class?: string;
		children?: Snippet;
	}

	let {
		minZoom = 0.25,
		maxZoom = 2,
		initialFit = true,
		showControls = true,
		showFullscreen = true,
		height = 'min(70vh, 640px)',
		contentKey = null,
		class: className = '',
		children
	}: PanZoomViewportProps = $props();

	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let dragging = $state(false);
	let moved = $state(false);
	let suppressClick = $state(false);
	let pointerId = $state<number | null>(null);
	let startX = 0;
	let startY = 0;
	let originPanX = 0;
	let originPanY = 0;
	let fullscreen = $state(false);

	let shellEl = $state<HTMLDivElement | null>(null);
	let viewportEl = $state<HTMLDivElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);

	const MOVE_THRESHOLD = 6;
	const FIT_PADDING = 32;

	const shellHeight = $derived(fullscreen ? '100%' : height);

	function clampZoom(z: number) {
		return Math.min(maxZoom, Math.max(minZoom, z));
	}

	export function fitToContent() {
		if (!viewportEl || !contentEl) return;
		const vw = viewportEl.clientWidth;
		const vh = viewportEl.clientHeight;
		const cw = contentEl.scrollWidth;
		const ch = contentEl.scrollHeight;
		if (!vw || !vh || !cw || !ch) return;

		const next = clampZoom(Math.min((vw - FIT_PADDING) / cw, (vh - FIT_PADDING) / ch, 1));
		scale = next;
		panX = (vw - cw * next) / 2;
		panY = (vh - ch * next) / 2;
	}

	function zoomAt(nextScale: number, clientX?: number, clientY?: number) {
		if (!viewportEl) return;
		const prev = scale;
		const next = clampZoom(nextScale);
		if (next === prev) return;

		const rect = viewportEl.getBoundingClientRect();
		const px = clientX != null ? clientX - rect.left : rect.width / 2;
		const py = clientY != null ? clientY - rect.top : rect.height / 2;

		panX = px - ((px - panX) * next) / prev;
		panY = py - ((py - panY) * next) / prev;
		scale = next;
	}

	function zoomIn() {
		zoomAt(scale * 1.2);
	}

	function zoomOut() {
		zoomAt(scale / 1.2);
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.12 : 0.12;
		zoomAt(scale + delta * scale, e.clientX, e.clientY);
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		if ((e.target as HTMLElement).closest('[data-panzoom-chrome]')) return;

		dragging = true;
		moved = false;
		pointerId = e.pointerId;
		startX = e.clientX;
		startY = e.clientY;
		originPanX = panX;
		originPanY = panY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || pointerId !== e.pointerId) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (!moved && Math.hypot(dx, dy) >= MOVE_THRESHOLD) moved = true;
		panX = originPanX + dx;
		panY = originPanY + dy;
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging || pointerId !== e.pointerId) return;
		dragging = false;
		pointerId = null;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
		if (moved) suppressClick = true;
		moved = false;
	}

	function onDoubleClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('[data-panzoom-chrome]')) return;
		fitToContent();
	}

	function onFullscreenChange(active: boolean) {
		fullscreen = active;
		requestAnimationFrame(() => fitToContent());
	}

	const ctx: PanZoomContext = {
		consumeClick: () => {
			if (!suppressClick) return false;
			suppressClick = false;
			return true;
		}
	};

	setContext(PAN_ZOOM_CTX, ctx);

	$effect(() => {
		contentKey;
		if (!initialFit) return;
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => fitToContent());
		});
		return () => cancelAnimationFrame(id);
	});
</script>

<div
	bind:this={shellEl}
	class={[
		'relative overflow-hidden rounded-xl border border-border bg-surface-base/40',
		fullscreen && 'rounded-none border-0',
		className
	]}
	style:height={shellHeight}
>
	{#if showControls}
		<div
			class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border border-border bg-surface-elevated/95 p-1 shadow-sm backdrop-blur-sm"
			data-panzoom-chrome
		>
			<IconButton label="Alejar" size="sm" variant="ghost" onclick={zoomOut}>
				<span class="text-base leading-none font-medium">−</span>
			</IconButton>
			<span class="min-w-[3rem] px-1 text-center text-xs tabular-nums text-secondary">
				{Math.round(scale * 100)}%
			</span>
			<IconButton label="Acercar" size="sm" variant="ghost" onclick={zoomIn}>
				<span class="text-base leading-none font-medium">+</span>
			</IconButton>
			<IconButton label="Ajustar a vista" size="sm" variant="ghost" onclick={fitToContent}>
				<span class="text-xs font-semibold">⊡</span>
			</IconButton>
			{#if showFullscreen}
				<FullscreenToggle
					target={shellEl}
					size="sm"
					bind:active={fullscreen}
					enterLabel="Pantalla completa"
					exitLabel="Salir de pantalla completa"
					onchange={onFullscreenChange}
				/>
			{/if}
		</div>
	{/if}

	<div
		bind:this={viewportEl}
		class={[
			'h-full w-full touch-none select-none',
			dragging ? 'cursor-grabbing' : 'cursor-grab'
		]}
		onwheel={onWheel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		ondblclick={onDoubleClick}
		role="presentation"
	>
		<div
			bind:this={contentEl}
			class="inline-block will-change-transform"
			style:transform="translate({panX}px, {panY}px) scale({scale})"
			style:transform-origin="0 0"
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>
