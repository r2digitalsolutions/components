<script lang="ts">
	import type { Snippet } from 'svelte';
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import type { WidgetResizeEdge } from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import {
		type GridItem,
		DEFAULT_COLS,
		DEFAULT_ROW_HEIGHT,
		DEFAULT_GAP,
		updateItem,
		layoutBounds,
		clampItem
	} from '$lib/utils/layoutGrid.js';

	export type { GridItem };

	export interface DashboardWidgetMeta {
		id: string;
		title?: string;
		description?: string;
		type?: string;
	}

	interface DashboardGridProps {
		layout?: GridItem[];
		/** Optional titles/meta keyed by layout id */
		widgets?: DashboardWidgetMeta[];
		cols?: number;
		rowHeight?: number;
		gap?: number;
		editable?: boolean;
		compact?: boolean;
		class?: string;
		/** Custom body per widget id */
		render?: Snippet<[DashboardWidgetMeta, GridItem]>;
		onchange?: (layout: GridItem[]) => void;
		onremove?: (id: string) => void;
	}

	let {
		layout = $bindable([] as GridItem[]),
		widgets = [],
		cols = DEFAULT_COLS,
		rowHeight = DEFAULT_ROW_HEIGHT,
		gap = DEFAULT_GAP,
		editable = false,
		compact = true,
		class: className = '',
		render,
		onchange,
		onremove
	}: DashboardGridProps = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let draggingId = $state<string | null>(null);
	let resizingId = $state<string | null>(null);
	let resizeEdge = $state<WidgetResizeEdge>('se');
	let origin = $state({ x: 0, y: 0, itemX: 0, itemY: 0, itemW: 0, itemH: 0 });

	const metaById = $derived.by(() => {
		const map = new Map<string, DashboardWidgetMeta>();
		for (const w of widgets) map.set(w.id, w);
		for (const it of layout) {
			if (!map.has(it.id)) map.set(it.id, { id: it.id, title: it.id });
		}
		return map;
	});

	const rows = $derived(Math.max(layoutBounds(layout).rows, 4));

	function cellSize(): { cw: number; rh: number } {
		const width = containerEl?.clientWidth ?? 0;
		const cw = cols > 0 ? (width - gap * (cols - 1)) / cols : 0;
		return { cw, rh: rowHeight };
	}

	function emit(next: GridItem[]) {
		layout = next;
		onchange?.(next);
	}

	function onDragStart(id: string, e: PointerEvent) {
		if (!editable) return;
		e.preventDefault();
		e.stopPropagation();
		const item = layout.find((it) => it.id === id);
		if (!item || item.static) return;
		draggingId = id;
		origin = {
			x: e.clientX,
			y: e.clientY,
			itemX: item.x,
			itemY: item.y,
			itemW: item.w,
			itemH: item.h
		};
		(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
	}

	function onResizeStart(id: string, e: PointerEvent, edge: WidgetResizeEdge) {
		if (!editable) return;
		e.preventDefault();
		e.stopPropagation();
		const item = layout.find((it) => it.id === id);
		if (!item || item.static) return;
		resizingId = id;
		resizeEdge = edge;
		origin = {
			x: e.clientX,
			y: e.clientY,
			itemX: item.x,
			itemY: item.y,
			itemW: item.w,
			itemH: item.h
		};
		(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		const { cw, rh } = cellSize();
		if (cw <= 0) return;

		if (draggingId) {
			const dx = Math.round((e.clientX - origin.x) / (cw + gap));
			const dy = Math.round((e.clientY - origin.y) / (rh + gap));
			emit(
				updateItem(
					layout,
					draggingId,
					{ x: origin.itemX + dx, y: origin.itemY + dy },
					{ cols, compact }
				)
			);
			return;
		}

		if (resizingId) {
			const dx = Math.round((e.clientX - origin.x) / (cw + gap));
			const dy = Math.round((e.clientY - origin.y) / (rh + gap));
			const patch: Partial<GridItem> = {};
			if (resizeEdge === 'e' || resizeEdge === 'se') patch.w = origin.itemW + dx;
			if (resizeEdge === 's' || resizeEdge === 'se') patch.h = origin.itemH + dy;
			emit(updateItem(layout, resizingId, patch, { cols, compact }));
		}
	}

	function onPointerUp() {
		draggingId = null;
		resizingId = null;
	}

	function styleFor(item: GridItem): string {
		const x = item.x + 1;
		const y = item.y + 1;
		return `grid-column: ${x} / span ${item.w}; grid-row: ${y} / span ${item.h};`;
	}

	const gridStyle = $derived(
		`display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-auto-rows:${rowHeight}px;gap:${gap}px;min-height:${rows * rowHeight + (rows - 1) * gap}px;`
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerEl}
	class={['relative w-full', className]}
	style={gridStyle}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	{#if editable}
		{#each Array.from({ length: cols * Math.max(rows, 6) }, (_, i) => i) as cell (cell)}
			{@const cx = cell % cols}
			{@const cy = Math.floor(cell / cols)}
			{@const cellStyle = `grid-column:${cx + 1};grid-row:${cy + 1};`}
			<div
				class="pointer-events-none rounded-lg border border-dashed border-border/60 bg-surface-overlay/30"
				style={cellStyle}
				aria-hidden="true"
			></div>
		{/each}
	{/if}

	{#each layout as item (item.id)}
		{@const meta = metaById.get(item.id)!}
		{@const clamped = clampItem(item, cols)}
		<div
			class={[
				'relative z-[1] min-h-0 min-w-0',
				(draggingId === item.id || resizingId === item.id) && 'z-10 opacity-95'
			]}
			style={styleFor(clamped)}
		>
			<WidgetFrame
				title={meta.title}
				description={meta.description}
				{editable}
				draggable={editable && !item.static}
				resizable={editable && !item.static}
				class="h-full"
				ondragstart={(e) => onDragStart(item.id, e)}
				onresizestart={(e, edge) => onResizeStart(item.id, e, edge)}
				onremove={editable ? () => onremove?.(item.id) : undefined}
			>
				{#if render}
					{@render render(meta, clamped)}
				{:else}
					<div class="p-3 text-sm text-muted">Widget “{meta.type ?? meta.id}”</div>
				{/if}
			</WidgetFrame>
		</div>
	{/each}
</div>
