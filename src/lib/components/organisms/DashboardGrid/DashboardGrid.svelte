<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import type { WidgetResizeEdge } from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import DashboardGridToolbar from '$lib/components/molecules/DashboardGridToolbar/DashboardGridToolbar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
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
		removeItem,
		resizeItemByEdge
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
		/** When false, no card border/header (frameless body). Default true. */
		showChrome?: boolean;
		/** Remove body padding (often with frameless). */
		flush?: boolean;
		/** Show collapse control in header. Ignored when showChrome is false. */
		collapsible?: boolean;
		/** Called when the user clicks reload in the header. */
		onReload?: () => void | Promise<void>;
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
		/** Allow drag-to-move (off = use config panel / toolbar instead) */
		draggable?: boolean;
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
		onselect?: (id: string) => void;
		onedit?: (id: string) => void;
		selectedId?: string | null;
		onremove?: (id: string) => void;
		onadd?: () => void;
		onreset?: () => void;
		/** Label shown in the drop placeholder while dragging */
		dropLabel?: string;
	}

	let {
		layout = $bindable([] as GridItem[]),
		widgets = [],
		cols = $bindable(DEFAULT_COLS),
		rowHeight = $bindable(DEFAULT_ROW_HEIGHT),
		gap = $bindable(DEFAULT_GAP),
		editable = $bindable(false),
		draggable = true,
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
		onselect,
		onedit,
		selectedId = null,
		onremove,
		onadd,
		onreset,
		dropLabel = 'Drop here'
	}: DashboardGridProps = $props();

	const DRAG_THRESHOLD = 6;

	let containerEl: HTMLDivElement | null = null;
	let ghostEl: HTMLDivElement | null = null;
	let draggingId = $state<string | null>(null);
	let resizingId = $state<string | null>(null);
	let resizeEdge = $state<WidgetResizeEdge>('se');
	let origin = $state({ x: 0, y: 0, itemX: 0, itemY: 0, itemW: 0, itemH: 0 });
	let dragMoved = $state(false);
	let listening = $state(false);
	let snapX = $state(0);
	let snapY = $state(0);
	let ghostBox = $state<{
		left: number;
		top: number;
		width: number;
		height: number;
		title: string;
	} | null>(null);
	let lastDx = 0;
	let lastDy = 0;

	const metaById = $derived.by((): Record<string, DashboardWidgetMeta> => {
		const map: Record<string, DashboardWidgetMeta> = {};
		for (const w of widgets) map[w.id] = w;
		for (const it of layout) {
			if (!map[it.id]) map[it.id] = { id: it.id, title: it.id };
		}
		return map;
	});

	function widgetMeta(item: GridItem): DashboardWidgetMeta {
		return metaById[item.id] ?? { id: item.id, title: item.id };
	}

	const contentRows = $derived(layoutBounds(layout).rows);
	const rows = $derived(Math.max(contentRows + (editable ? padRows : 0), minRows));
	const draggingItem = $derived(layout.find((it) => it.id === draggingId) ?? null);
	const snapPreview = $derived.by((): GridItem | null => {
		if (!draggingItem || !dragMoved) return null;
		return clampItem({ ...draggingItem, x: snapX, y: snapY }, cols);
	});
	const originPreview = $derived.by((): GridItem | null => {
		if (!draggingItem || !dragMoved) return null;
		if (snapX === origin.itemX && snapY === origin.itemY) return null;
		return clampItem(
			{ ...draggingItem, x: origin.itemX, y: origin.itemY },
			cols
		);
	});

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

	function attachWindowListeners() {
		if (listening || typeof window === 'undefined') return;
		listening = true;
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);
		window.addEventListener('keydown', onKeyDown);
	}

	function detachWindowListeners() {
		if (!listening || typeof window === 'undefined') return;
		listening = false;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerUp);
		window.removeEventListener('keydown', onKeyDown);
	}

	function unlockPointerChrome() {
		if (typeof document === 'undefined') return;
		document.body.style.userSelect = '';
		document.body.style.cursor = '';
	}

	function lockPointerChrome() {
		if (typeof document === 'undefined') return;
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'grabbing';
	}

	function mountGhostClone(node: HTMLDivElement) {
		node.replaceChildren();
		const cell = draggingId
			? containerEl?.querySelector(`[data-grid-id="${CSS.escape(draggingId)}"]`)
			: null;
		if (cell instanceof HTMLElement) {
			const clone = cell.cloneNode(true) as HTMLElement;
			clone.querySelector('[data-widget-toolbar]')?.remove();
			clone.style.pointerEvents = 'none';
			clone.classList.add('shadow-none', 'ring-0');
			node.appendChild(clone);
		}
		return () => {
			node.replaceChildren();
		};
	}

	function applyGhostTransform(dx: number, dy: number) {
		lastDx = dx;
		lastDy = dy;
		if (!ghostEl) return;
		ghostEl.style.transform = `translate(${dx}px, ${dy}px) rotate(-1deg) scale(1.02)`;
	}

	function attachGhost(node: HTMLElement) {
		ghostEl = node as HTMLDivElement;
		applyGhostTransform(lastDx, lastDy);
		return () => {
			if (ghostEl === node) ghostEl = null;
		};
	}

	function attachContainer(node: HTMLElement) {
		containerEl = node as HTMLDivElement;
		return () => {
			if (containerEl === node) containerEl = null;
		};
	}

	function resetInteraction() {
		draggingId = null;
		resizingId = null;
		dragMoved = false;
		ghostBox = null;
		lastDx = 0;
		lastDy = 0;
		unlockPointerChrome();
		detachWindowListeners();
	}

	function onCellPointerDown(id: string, e: PointerEvent) {
		if (!editable) return;
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		const target = e.target as HTMLElement | null;
		if (target?.closest('button, a, [data-resize-handle], [data-widget-toolbar]')) return;
		onselect?.(id);
		if (draggable) onDragStart(id, e);
	}

	function onDragStart(id: string, e: PointerEvent) {
		if (!editable || !draggable) return;
		e.preventDefault();
		e.stopPropagation();
		const item = layout.find((it) => it.id === id);
		if (!item || item.static) return;
		onselect?.(id);
		draggingId = id;
		dragMoved = false;
		ghostBox = null;
		snapX = item.x;
		snapY = item.y;
		origin = {
			x: e.clientX,
			y: e.clientY,
			itemX: item.x,
			itemY: item.y,
			itemW: item.w,
			itemH: item.h
		};
		attachWindowListeners();
	}

	function beginLift(id: string) {
		const cell = containerEl?.querySelector(`[data-grid-id="${CSS.escape(id)}"]`);
		if (!(cell instanceof HTMLElement)) return;
		const r = cell.getBoundingClientRect();
		ghostBox = {
			left: r.left,
			top: r.top,
			width: r.width,
			height: r.height,
			title: metaById[id]?.title ?? id
		};
		lockPointerChrome();
	}

	function onResizeStart(id: string, e: PointerEvent, edge: WidgetResizeEdge) {
		if (!editable) return;
		e.preventDefault();
		e.stopPropagation();
		const item = layout.find((it) => it.id === id);
		if (!item || item.static) return;
		onselect?.(id);
		resizingId = id;
		resizeEdge = edge;
		dragMoved = false;
		origin = {
			x: e.clientX,
			y: e.clientY,
			itemX: item.x,
			itemY: item.y,
			itemW: item.w,
			itemH: item.h
		};
		(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
		attachWindowListeners();
	}

	function onPointerMove(e: PointerEvent) {
		if (draggingId) {
			const dx = e.clientX - origin.x;
			const dy = e.clientY - origin.y;
			if (!dragMoved) {
				if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
				dragMoved = true;
				beginLift(draggingId);
			}
			applyGhostTransform(dx, dy);
			const { cw, rh } = cellSize();
			if (cw <= 0) return;
			const colDx = Math.round(dx / (cw + gap));
			const rowDy = Math.round(dy / (rh + gap));
			const item = layout.find((it) => it.id === draggingId);
			if (!item) return;
			const snapped = clampItem(
				{ ...item, x: origin.itemX + colDx, y: origin.itemY + rowDy },
				cols
			);
			if (snapped.x !== snapX || snapped.y !== snapY) {
				snapX = snapped.x;
				snapY = snapped.y;
			}
			return;
		}

		const { cw, rh } = cellSize();
		if (cw <= 0) return;

		if (resizingId) {
			const dx = Math.round((e.clientX - origin.x) / (cw + gap));
			const dy = Math.round((e.clientY - origin.y) / (rh + gap));
			if (dx !== 0 || dy !== 0) dragMoved = true;
			const current = layout.find((it) => it.id === resizingId);
			if (!current) return;
			const next = resizeItemByEdge(
				{
					x: origin.itemX,
					y: origin.itemY,
					w: origin.itemW,
					h: origin.itemH,
					minW: current.minW,
					minH: current.minH,
					maxW: current.maxW,
					maxH: current.maxH
				},
				resizeEdge,
				dx,
				dy,
				cols
			);
			emit(updateItem(layout, resizingId, next, { cols, compact: false }));
		}
	}

	function onPointerUp() {
		const id = draggingId;
		const moved = dragMoved;
		const wasResizing = !!resizingId;
		if (id && moved) {
			emit(updateItem(layout, id, { x: snapX, y: snapY }, { cols, compact }));
		}
		if (wasResizing && compact) {
			emit(compactLayout(layout, cols));
		}
		resetInteraction();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (draggingId || resizingId) {
			e.preventDefault();
			resetInteraction();
		}
	}

	function styleFor(item: GridItem): string {
		const x = item.x + 1;
		const y = item.y + 1;
		return `grid-column: ${x} / span ${item.w}; grid-row: ${y} / span ${item.h};`;
	}

	function handleRemove(id: string) {
		emit(removeItem(layout, id, { cols, compact }));
		onremove?.(id);
	}

	function handleCompactNow() {
		emit(compactLayout(layout, cols));
	}

	const gridStyle = $derived(
		`display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-auto-rows:${rowHeight}px;gap:${gap}px;min-height:${rows * rowHeight + Math.max(0, rows - 1) * gap}px;`
	);

	const guideRows = $derived(Math.max(rows, minRows));

	onDestroy(() => {
		resetInteraction();
	});
</script>

<div class={['space-y-4 w-full', className]}>
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
			{onreset}
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
			{@attach attachContainer}
			class={[
				'rounded-xl relative w-full',
				editable ? 'pt-3 overflow-visible' : 'overflow-hidden',
				editable && showGrid && 'ring-border ring-1',
				editable && 'select-none'
			]}
			style={gridStyle}
		>
			{#if editable && showGrid}
				{#each Array.from({ length: cols * guideRows }, (_, i) => i) as cell (cell)}
					{@const cx = cell % cols}
					{@const cy = Math.floor(cell / cols)}
					{@const cellStyle = `grid-column:${cx + 1};grid-row:${cy + 1};`}
					<div
						class="rounded-lg border-border/50 bg-surface-overlay/25 pointer-events-none border border-dashed"
						style={cellStyle}
						aria-hidden="true"
					></div>
				{/each}
			{/if}

			{#if draggable && originPreview}
				<div
					class="pointer-events-none z-[2] rounded-xl border-2 border-dashed border-muted/60 bg-muted/10"
					style={styleFor(originPreview)}
					aria-hidden="true"
				></div>
			{/if}

			{#if draggable && snapPreview}
				<div
					class="pointer-events-none z-[3] rounded-xl border-2 border-dashed border-brand-500 bg-brand-500/20 shadow-[inset_0_0_0_1px_rgba(var(--color-brand-500),0.25)]"
					style={styleFor(snapPreview)}
					aria-hidden="true"
				>
					<div
						class="flex h-full items-center justify-center rounded-[inherit] bg-brand-500/10 text-xs font-semibold tracking-wide text-brand-600 uppercase"
					>
						{dropLabel}
					</div>
				</div>
			{/if}

			{#each layout as item (item.id)}
				{@const meta = widgetMeta(item)}
				{@const clamped = clampItem(item, cols)}
				{@const selected = selectedId === item.id}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					data-grid-id={item.id}
					class={[
						'min-h-0 min-w-0 relative z-[1]',
						editable && draggable && !item.static && 'cursor-grab',
						(draggingId === item.id || resizingId === item.id) && 'z-20',
						draggingId === item.id && dragMoved && 'pointer-events-none opacity-30',
						selected && !dragMoved && 'ring-brand-500 ring-offset-surface ring-2 ring-offset-2'
					]}
					style={styleFor(clamped)}
					onpointerdown={(e) => onCellPointerDown(item.id, e)}
				>
					{#if editable && !item.static}
						<div
							data-widget-toolbar
							class="-top-3 right-2 gap-0.5 absolute z-30 flex items-center"
							onpointerdown={(e) => e.stopPropagation()}
						>
							{#if showSizeBadge}
								<Badge size="sm" variant="secondary" class="shadow-sm tabular-nums">
									{clamped.w}×{clamped.h}
								</Badge>
							{/if}
							<IconButton
								size="xs"
								variant={selected ? 'primary' : 'secondary'}
								label={`Edit ${meta.title ?? 'widget'}`}
								class="shadow-sm"
								onclick={() => {
									onselect?.(item.id);
									onedit?.(item.id);
								}}
							>
								<Pencil />
							</IconButton>
							<IconButton
								size="xs"
								variant="destructive"
								label={`Remove ${meta.title ?? 'widget'}`}
								class="shadow-sm"
								onclick={() => handleRemove(item.id)}
							>
								<Trash2 />
							</IconButton>
						</div>
					{/if}
					<WidgetFrame
						title={meta.title}
						description={meta.description}
						showChrome={meta.showChrome ?? true}
						flush={meta.flush ?? false}
						collapsible={meta.collapsible ?? false}
						{editable}
						draggable={editable && draggable && !item.static}
						resizable={editable && !item.static}
						resizeEdges={editable ? (['s', 'e', 'se'] as const) : undefined}
						loading={meta.loading}
						empty={meta.empty}
						onreload={meta.onReload}
						class="h-full"
						ondragstart={(e) => onDragStart(item.id, e)}
						onresizestart={(e, edge) => onResizeStart(item.id, e, edge)}
					>
						{#if render}
							{@render render(meta, clamped)}
						{:else}
							<div class="gap-2 p-3 flex h-full flex-col justify-between">
								<p class="text-sm text-muted">
									Widget “{meta.type ?? meta.id}”
								</p>
								{#if editable}
									<p class="text-muted text-[11px] tabular-nums">
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

{#if draggable && ghostBox}
	<div
		{@attach attachGhost}
		class="pointer-events-none fixed z-[500]"
		style={`left:${ghostBox.left}px;top:${ghostBox.top}px;width:${ghostBox.width}px;height:${ghostBox.height}px;transform-origin:center;`}
		aria-hidden="true"
	>
		<div
			{@attach mountGhostClone}
			class="h-full w-full overflow-hidden rounded-xl border-2 border-brand-500 bg-surface-elevated shadow-2xl"
		></div>
	</div>
{/if}
