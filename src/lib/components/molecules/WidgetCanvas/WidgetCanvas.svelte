<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import {
		WIDGET_CANVAS_CONTEXT,
		snapToGrid,
		snapWidgetRect,
		clampWidgetRect,
		fitBoardToAutoCells,
		scrollBoardToAutoCells,
		type WidgetCanvasContext,
		type WidgetCanvasBounds,
		type WidgetRect
	} from './widgetCanvasContext.js';

	interface WidgetCanvasProps {
		/** Board width in px (modo scroll + fixed; en auto se redondea a celdas) */
		width?: number;
		/** Board height in px (modo scroll + fixed; en auto se redondea a celdas) */
		height?: number;
		/** Altura visible del viewport (ignored when `fill` is true) */
		viewportHeight?: number;
		/** Fill parent height instead of fixed viewportHeight */
		fill?: boolean;
		/** scroll = tablero grande · fit/fullscreen = sin scroll */
		mode?: 'scroll' | 'fit' | 'fullscreen';
		showGrid?: boolean;
		snap?: boolean;
		cellSize?: number;
		/** Auto: calcula cellSize para `autoCells` visibles en el viewport */
		cellSizeMode?: 'fixed' | 'auto';
		autoCells?: number;
		controls?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		width = 1600,
		height = 1000,
		viewportHeight = 520,
		fill = false,
		mode = $bindable<'scroll' | 'fit' | 'fullscreen'>('scroll'),
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
	let viewportW = $state(0);
	let viewportH = $state(0);
	/** Tablero efectivo cuando cellSizeMode === 'auto' (scroll o fit) */
	let boardW = $state(0);
	let boardH = $state(0);

	function getBounds(): WidgetCanvasBounds {
		if (cellSizeMode === 'auto' && boardW > 0 && boardH > 0) {
			return { width: boardW, height: boardH };
		}
		if (mode === 'scroll') {
			return { width, height };
		}
		return {
			width: viewportW || width,
			height: viewportH || height
		};
	}

	function syncLayout() {
		if (!viewportEl) return;
		const vw = viewportEl.clientWidth;
		const vh = viewportEl.clientHeight;
		if (vw <= 0 || vh <= 0) return;

		viewportW = vw;
		viewportH = vh;

		const n = Number(autoCells) || 8;

		if (cellSizeMode === 'auto') {
			if (mode === 'scroll') {
				const layout = scrollBoardToAutoCells(vw, vh, width, height, n);
				cellSize = layout.cellSize;
				boardW = layout.width;
				boardH = layout.height;
			} else {
				const layout = fitBoardToAutoCells(vw, vh, n);
				cellSize = layout.cellSize;
				boardW = layout.width;
				boardH = layout.height;
			}
		} else {
			boardW = 0;
			boardH = 0;
			if (mode !== 'scroll') {
				boardW = vw;
				boardH = vh;
			}
		}
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
		get autoCells() {
			return Number(autoCells) || 8;
		},
		get cellSizeMode() {
			return cellSizeMode;
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
	const effectiveViewportHeight = $derived(
		fill ? '100%' : mode === 'fullscreen' ? '100vh' : `${viewportHeight}px`
	);

	const statusLabel = $derived.by(() => {
		const b = getBounds();
		const n = Number(autoCells) || 8;
		if (cellSizeMode === 'auto') {
			if (mode === 'scroll') {
				return `${b.width}×${b.height} · ${n} celdas visibles · ${cellSize}px`;
			}
			return `${b.width}×${b.height} · ${n}×${n} · ${cellSize}px`;
		}
		return `${b.width}×${b.height} · celda ${cellSize}px`;
	});

	onMount(() => {
		if (!viewportEl) return;
		const measure = () => syncLayout();
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(viewportEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		mode;
		autoCells;
		cellSizeMode;
		width;
		height;
		viewportHeight;
		syncLayout();
	});

	const gridLine = 'color-mix(in oklab, var(--color-border, #e5e7eb) 70%, transparent)';
	/**
	 * Offset -1px: sin la línea gruesa en izq/arriba (queda en el edge del board),
	 * y sí aparece la de der/abajo (que el repeat normal no pinta).
	 */
	const gridStyle = $derived(
		showGrid
			? [
					`background-image:`,
					`linear-gradient(to right, ${gridLine} 1px, transparent 1px),`,
					`linear-gradient(to bottom, ${gridLine} 1px, transparent 1px);`,
					`background-size:${cellSize}px ${cellSize}px;`,
					`background-position:-1px -1px;`
				].join('')
			: ''
	);

	const boardStyle = $derived.by(() => {
		const b = getBounds();
		const center =
			mode !== 'scroll' && cellSizeMode === 'auto'
				? `margin:${Math.max(0, (viewportH - b.height) / 2)}px ${Math.max(0, (viewportW - b.width) / 2)}px 0;`
				: '';
		return `width:${b.width}px;height:${b.height}px;min-width:${b.width}px;min-height:${b.height}px;${center}${gridStyle}`;
	});
</script>

<div class={['flex w-full flex-col gap-2', fill && 'h-full min-h-0', className]}>
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
					Celdas
					<select
						class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
						value={autoCells}
						onchange={(e) => (autoCells = Number(e.currentTarget.value))}
					>
						{#each [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 32] as n (n)}
							<option value={n}>{n}</option>
						{/each}
					</select>
				</label>
			{/if}

			<span class="ml-auto text-[11px] tabular-nums text-muted">{statusLabel}</span>
		</div>
	{/if}

	<div
		class={[
			'w-full border border-border bg-surface',
			fill ? 'min-h-0 flex-1 rounded-none' : 'rounded-2xl',
			overflowClass
		].join(' ')}
		style={`height:${effectiveViewportHeight};`}
		bind:this={viewportEl}
	>
		<div
			class={[
				'relative overflow-hidden bg-surface',
				mode !== 'scroll' && cellSizeMode === 'auto' && 'ring-1 ring-border'
			]}
			style={boardStyle}
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>
