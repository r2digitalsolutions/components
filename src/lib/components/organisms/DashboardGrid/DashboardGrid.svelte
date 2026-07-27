<script lang="ts">
	import type { Snippet } from 'svelte';
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import type { WidgetResizeEdge } from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import DashboardGridToolbar from '$lib/components/molecules/DashboardGridToolbar/DashboardGridToolbar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import {
		type GridItem,
		type GridDensity,
		DEFAULT_COLS,
		DEFAULT_ROW_HEIGHT,
		DEFAULT_GAP,
		updateItem,
		layoutBounds,
		clampItem,
		compactLayout,
		rescaleLayout,
		removeItem
	} from '$lib/utils/layoutGrid.js';

	export type { GridItem };
	export type DashboardGridDensity = GridDensity;

	export interface DashboardWidgetMeta {
		id: string;
		title?: string;
		description?: string;
		type?: string;
		loading?: boolean;
		empty?: boolean;
	}

	export interface DashboardGridSettings {
		cols: number;
		rowHeight: number;
		gap: number;
		compact: boolean;
		editable: boolean;
		showGrid: boolean;
		density: GridDensity | 'custom';
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
		/** Draw dashed cell guides */
		showGrid?: boolean;
		/** Built-in density / cols / gap controls */
		showToolbar?: boolean;
		density?: GridDensity | 'custom';
		minRows?: number;
		/** Extra empty rows below content while editing */
		padRows?: number;
		showSizeBadge?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		/** Custom body per widget id */
		render?: Snippet<[DashboardWidgetMeta, GridItem]>;
		onchange?: (layout: GridItem[]) => void;
		onsettingschange?: (settings: DashboardGridSettings) => void;
		onremove?: (id: string) => void;
		onadd?: () => void;
		onreset?: () => void;
	}

	let {
		layout = $bindable([] as GridItem[]),
		widgets = [],
		cols = $bindable(DEFAULT_COLS),
		rowHeight = $bindable(DEFAULT_ROW_HEIGHT),
		gap = $bindable(DEFAULT_GAP),
		editable = $bindable(false),
		compact = $bindable(true),
		showGrid = $bindable(true),
		showToolbar = false,
		density = $bindable<GridDensity | 'custom'>('default'),
		minRows = 4,
		padRows = 2,
		showSizeBadge = true,
		emptyTitle = 'No widgets yet',
		emptyDescription = 'Add widgets or switch to edit mode to build your dashboard.',
		class: className = '',
		render,
		onchange,
		onsettingschange,
		onremove,
		onadd,
		onreset
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

	const contentRows = $derived(layoutBounds(layout).rows);
	const rows = $derived(
		Math.max(contentRows + (editable ? padRows : 0), minRows)
	);

	function cellSize(): { cw: number; rh: number } {
		const width = containerEl?.clientWidth ?? 0;
		const cw = cols > 0 ? (width - gap * (cols - 1)) / cols : 0;
		return { cw, rh: rowHeight };
	}

	function emit(next: GridItem[]) {
		layout = next;
		onchange?.(next);
	}

	function emitSettings() {
		onsettingschange?.({
			cols,
			rowHeight,
			gap,
			compact,
			editable,
			showGrid,
			density
		});
	}

	function applySettings(next: DashboardGridSettings) {
		if (next.cols !== cols) {
			const scaled = rescaleLayout(layout, cols, next.cols, {
				cols: next.cols,
				compact: next.compact
			});
			layout = scaled;
			onchange?.(scaled);
		}
		cols = next.cols;
		rowHeight = next.rowHeight;
		gap = next.gap;
		compact = next.compact;
		editable = next.editable;
		showGrid = next.showGrid;
		density = next.density;
		emitSettings();
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

	function handleRemove(id: string) {
		if (onremove) {
			onremove(id);
			return;
		}
		emit(removeItem(layout, id, { cols, compact }));
	}

	function handleCompactNow() {
		emit(compactLayout(layout, cols));
	}

	const gridStyle = $derived(
		`display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-auto-rows:${rowHeight}px;gap:${gap}px;min-height:${rows * rowHeight + Math.max(0, rows - 1) * gap}px;`
	);

	const guideRows = $derived(Math.max(rows, minRows));
</script>

<div class={['w-full space-y-4', className]}>
	{#if showToolbar}
		<DashboardGridToolbar
			{cols}
			{rowHeight}
			{gap}
			{compact}
			{editable}
			{showGrid}
			{density}
			oncompact={handleCompactNow}
			onreset={onreset}
			onchange={applySettings}
		/>
	{/if}

	{#if !layout.length && !editable}
		{#if onadd}
			<EmptyState title={emptyTitle} description={emptyDescription}>
				{#snippet action()}
					<Button size="sm" onclick={() => onadd?.()}>Add widget</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<EmptyState title={emptyTitle} description={emptyDescription} />
		{/if}
	{:else}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={containerEl}
			class={[
				'relative w-full overflow-hidden rounded-xl',
				editable && showGrid && 'ring-1 ring-border'
			]}
			style={gridStyle}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			{#if editable && showGrid}
				{#each Array.from({ length: cols * guideRows }, (_, i) => i) as cell (cell)}
					{@const cx = cell % cols}
					{@const cy = Math.floor(cell / cols)}
					{@const cellStyle = `grid-column:${cx + 1};grid-row:${cy + 1};`}
					<div
						class="pointer-events-none rounded-lg border border-dashed border-border/50 bg-surface-overlay/25"
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
					{#if editable && showSizeBadge}
						<span class="pointer-events-none absolute right-2 top-2 z-20">
							<Badge size="sm" variant="secondary" class="tabular-nums">
								{clamped.w}×{clamped.h}
								{#if item.static}
									· locked
								{/if}
							</Badge>
						</span>
					{/if}
					<WidgetFrame
						title={meta.title}
						description={meta.description}
						{editable}
						draggable={editable && !item.static}
						resizable={editable && !item.static}
						loading={meta.loading}
						empty={meta.empty}
						class="h-full"
						ondragstart={(e) => onDragStart(item.id, e)}
						onresizestart={(e, edge) => onResizeStart(item.id, e, edge)}
						onremove={editable && !item.static ? () => handleRemove(item.id) : undefined}
					>
						{#if render}
							{@render render(meta, clamped)}
						{:else}
							<div class="flex h-full flex-col justify-between gap-2 p-3">
								<p class="text-sm text-muted">
									Widget “{meta.type ?? meta.id}”
								</p>
								{#if editable}
									<p class="text-[11px] tabular-nums text-muted">
										col {clamped.x + 1} · row {clamped.y + 1}
									</p>
								{/if}
							</div>
						{/if}
					</WidgetFrame>
				</div>
			{/each}
		</div>

		{#if editable && onadd}
			<div class="flex justify-end">
				<Button size="sm" variant="secondary" onclick={() => onadd?.()}>Add widget</Button>
			</div>
		{/if}
	{/if}
</div>
