<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import {
		WIDGET_CANVAS_CONTEXT,
		snapToGrid,
		snapWidgetRect,
		clampWidgetRect,
		type WidgetCanvasContext,
		type WidgetCanvasBounds,
		type WidgetRect
	} from './widgetCanvasContext.js';

	interface WidgetCanvasProps {
		/** Board width in px (solo modo 'scroll') — widgets pueden moverse en ese espacio */
		width?: number;
		/** Board height in px (solo modo 'scroll') — widgets pueden moverse en ese espacio */
		height?: number;
		/** Visible viewport height (scroll dentro / modo fit) */
		viewportHeight?: number;
		/** 'scroll' mantiene el board fijo; 'fit'/'fullscreen' elimina scroll y ajusta el board al viewport */
		mode?: 'scroll' | 'fit' | 'fullscreen';
		/** Show grid overlay */
		showGrid?: boolean;
		/** Snap drag/resize to cellSize */
		snap?: boolean;
		/** Grid / snap cell size */
		cellSize?: number;
		/** Auto calcula cellSize para que quepan 'autoCells' celdas en el viewport */
		cellSizeMode?: 'fixed' | 'auto';
		autoCells?: number;
		/** Built-in toolbar: grid / size / snap */
		controls?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		width = 1600,
		height = 1000,
		viewportHeight = 520,
		mode = 'scroll',
		showGrid = $bindable(true),
		snap = $bindable(true),
		cellSize = $bindable(24),
		cellSizeMode = $bindable<'fixed' | 'auto'>('fixed'),
		autoCells = $bindable(8),
		controls = true,
		class: className = '',
		children
	}: WidgetCanvasProps = $props();

	const cellOptions = [8, 12, 16, 24, 32, 48];

	let viewportEl = $state<HTMLDivElement | null>(null);
	let effectiveWidth = $state(width);
	let effectiveHeight = $state(height);

	function getBounds(): WidgetCanvasBounds {
		return {
			width: mode === 'scroll' ? width : effectiveWidth,
			height: mode === 'scroll' ? height : effectiveHeight
		};
	}

	function computeAutoCellSize(w: number, h: number): number {
		const denom = Math.max(1, autoCells);
		// Usamos el eje menor para garantizar que no “salga cortado”.
		const raw = Math.floor(Math.min(w, h) / denom);
		return Math.max(8, raw);
	}

	const api: WidgetCanvasContext = {
		get showGrid() {
			return showGrid;
		},
		get snap() {
			return snap;
		},
		get cellSize() {
			return cellSize;
		},
		getBounds,
		snapValue(value: number) {
			return snapToGrid(value, cellSize, snap);
		},
		snapRect(rect: WidgetRect, minW: number, minH: number) {
			return snapWidgetRect(rect, cellSize, snap, minW, minH);
		},
		clampRect(rect: WidgetRect, minW: number, minH: number) {
			return clampWidgetRect(rect, getBounds(), minW, minH);
		}
	};

	setContext(WIDGET_CANVAS_CONTEXT, api);

	const overflowClass = $derived(mode === 'scroll' ? 'overflow-auto' : 'overflow-hidden');
	const effectiveViewportHeight = $derived(mode === 'fullscreen' ? '100vh' : `${viewportHeight}px`);

	onMount(() => {
		if (!viewportEl) return;
		const update = () => {
			if (!viewportEl) return;
			if (mode !== 'scroll') {
				effectiveWidth = viewportEl.clientWidth;
				effectiveHeight = viewportEl.clientHeight;
				if (cellSizeMode === 'auto') {
					cellSize = computeAutoCellSize(effectiveWidth, effectiveHeight);
				}
			}
		};
		update();

		const ro = new ResizeObserver(() => update());
		ro.observe(viewportEl);
		return () => ro.disconnect();
	});

	// Por si el story cambia props justo al montar (o cambia modo/celda),
	// aseguramos que "auto" se recalcula también de forma reactiva.
	$effect(() => {
		if (!viewportEl) return;
		if (mode === 'scroll') return;
		effectiveWidth = viewportEl.clientWidth;
		effectiveHeight = viewportEl.clientHeight;
		if (cellSizeMode === 'auto') {
			cellSize = computeAutoCellSize(effectiveWidth, effectiveHeight);
		}
	});

	const gridStyle = $derived(
		showGrid
			? `background-image:linear-gradient(to right, color-mix(in oklab, var(--color-border, #e5e7eb) 70%, transparent) 1px, transparent 1px),linear-gradient(to bottom, color-mix(in oklab, var(--color-border, #e5e7eb) 70%, transparent) 1px, transparent 1px);background-size:${cellSize}px ${cellSize}px;`
			: ''
	);

	const boardStyle = $derived(
		`width:${getBounds().width}px;height:${getBounds().height}px;min-width:${getBounds().width}px;min-height:${getBounds().height}px;${gridStyle}`
	);
</script>

<div class={['flex w-full flex-col gap-2', className]}>
	{#if controls}
		<div
			class="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-elevated px-3 py-2"
		>
			<label class="inline-flex items-center gap-1.5 text-xs text-secondary">
				<input type="checkbox" class="rounded border-border" bind:checked={showGrid} />
				Rejilla
			</label>

			<label class="inline-flex items-center gap-1.5 text-xs text-secondary">
				<input type="checkbox" class="rounded border-border" bind:checked={snap} />
				Snap
			</label>

			<label class="inline-flex items-center gap-1.5 text-xs text-secondary">
				Modo
				<select
					class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
					bind:value={mode}
				>
					<option value="scroll">scroll</option>
					<option value="fit">fit (sin scroll)</option>
					<option value="fullscreen">fullscreen</option>
				</select>
			</label>

			<label class="inline-flex items-center gap-1.5 text-xs text-secondary">
				Celda
				<select
					class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
					bind:value={cellSizeMode}
				>
					<option value="fixed">fixed</option>
					<option value="auto">auto</option>
				</select>
			</label>

			{#if cellSizeMode === 'fixed'}
				<select
					class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
					value={cellSize}
					onchange={(e) => (cellSize = Number(e.currentTarget.value))}
				>
					{#each cellOptions as size (size)}
						<option value={size}>{size}px</option>
					{/each}
				</select>
			{:else}
				<label class="inline-flex items-center gap-1 text-xs text-secondary">
					autoCells
					<select
						class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
						value={autoCells}
						onchange={(e) => (autoCells = Number(e.currentTarget.value))}
					>
						{#each [6, 8, 10, 12] as n (n)}
							<option value={n}>{n}</option>
						{/each}
					</select>
				</label>
			{/if}

			<span class="ml-auto text-[11px] tabular-nums text-muted">
				{getBounds().width}×{getBounds().height} · cell {cellSize}px
			</span>
		</div>
	{/if}

	<div
		class={['w-full rounded-2xl border border-border bg-surface', overflowClass].join(' ')}
		style={`height:${effectiveViewportHeight};`}
		bind:this={viewportEl}
	>
		<div class="relative" style={boardStyle}>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>
