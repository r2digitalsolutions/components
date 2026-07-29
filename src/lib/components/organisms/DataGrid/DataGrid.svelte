<script module lang="ts">
	export type {
		DataGridColumn,
		DataGridEditType,
		DataGridEditConfig,
		DataGridEditOption,
		DataGridViewMode,
		DataGridFilter,
		Breakpoint,
		CellRef,
		GridSelection,
		CellNote,
		GridMark,
		MarkColor,
		MarkPreset,
		ConditionalFormatRule,
		ConditionalFormatStyle,
		FormatCondition,
		FormatTarget,
		SortDir
	} from './types.js';
	export {
		EMPTY_SELECTION,
		noteKey,
		markKey,
		selectionCount,
		selectionLabel
	} from './types.js';
	export { evaluateFormatRules, evaluateCondition, styleToCss } from './conditionalFormat.js';
	export {
		inferCellEditor,
		resolveCellEditor,
		coerceEditValue,
		draftFromValue
	} from './cellEditors.js';
	export { MARK_COLORS, MARK_TINT, MARK_SWATCH, markTint, markSwatch, isMarkPreset } from './marks.js';
	export {
		BREAKPOINT_MIN,
		matchesMinBreakpoint,
		isColumnVisibleAtWidth
	} from './breakpoints.js';
	export { filterRows, cellText, uniqueColumnValues } from './filterRows.js';
</script>

<script lang="ts" generics="T extends Record<string, unknown> = Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import MarqueeRect from '$lib/components/atoms/MarqueeRect/MarqueeRect.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import type { BulkAction } from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import type {
		ContextMenuItem,
		ContextMenuAnchor
	} from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import DropdownMenu from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import type { DropdownItem } from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import ColorPicker from '$lib/components/molecules/ColorPicker/ColorPicker.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Pencil from '@lucide/svelte/icons/pencil';
	import LayoutList from '@lucide/svelte/icons/layout-list';
	import Table2 from '@lucide/svelte/icons/table-2';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import Rows3 from '@lucide/svelte/icons/rows-3';
	import {
		attachMarqueeSelect,
		collectMarqueeItems,
		defaultMarqueeIgnore,
		resolveMarqueeSelection,
		type MarqueeRect as MarqueeRectBox
	} from '$lib/utils/marqueeSelect.js';
	import {
		type DataGridColumn,
		type DataGridEditConfig,
		type DataGridViewMode,
		type DataGridFilter,
		type GridSelection,
		type CellNote,
		type GridMark,
		type MarkColor,
		type CellRef,
		type ConditionalFormatRule,
		type SortDir,
		EMPTY_SELECTION,
		noteKey,
		markKey,
		selectionCount,
		selectionLabel
	} from './types.js';
	import { evaluateFormatRules, styleToCss } from './conditionalFormat.js';
	import { coerceEditValue, draftFromValue, resolveCellEditor } from './cellEditors.js';
	import { MARK_COLORS, markTint, markSwatch } from './marks.js';
	import { isColumnVisibleAtWidth } from './breakpoints.js';
	import { filterRows, cellText, uniqueColumnValues } from './filterRows.js';
	import { resolveAccessor, accessorPatchKey, resolveRowKey } from '$lib/utils/columnAccessor.js';
	import type { RowKey } from '$lib/utils/columnAccessor.js';

	/**
	 * Portal via attachment + $effect so the node moves after mount/hydration
	 * (same pattern as Checkbox `{@attach setIndeterminate}`).
	 */
	function portalToBody(node: HTMLElement) {
		$effect(() => {
			document.body.appendChild(node);
			return () => node.remove();
		});
	}

	interface DataGridProps {
		columns?: DataGridColumn<T>[];
		rows?: T[];
		rowKey?: RowKey<T>;
		selection?: GridSelection;
		notes?: CellNote[];
		marks?: GridMark[];
		formatRules?: ConditionalFormatRule[];
		/** Client-side search string (FilterBar). */
		filterQuery?: string;
		/** Active column filters (FilterBar chips). */
		columnFilters?: DataGridFilter[];
		/** Expanded row ids when collapsible. */
		expandedRows?: string[];
		viewMode?: DataGridViewMode;
		sortable?: boolean;
		selectable?: boolean;
		selectColumns?: boolean;
		selectCells?: boolean;
		/** When false, row/cell click only fires onrowclick — selection via checkbox/marquee/context menu. */
		selectOnClick?: boolean;
		marqueeSelect?: boolean;
		contextMenu?: boolean;
		editable?: boolean;
		/** Show expand control + detail panel (auto-hidden cols + custom snippet). */
		collapsible?: boolean;
		/** Show FilterBar above the grid. */
		filterable?: boolean;
		/** Show table/list/card/grid toggle. */
		showViewModes?: boolean;
		/** Column id used as title in list/card/grid modes. */
		titleColumnId?: string;
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		stickyHeader?: boolean;
		loading?: boolean;
		empty?: string;
		showDock?: boolean;
		actions?: BulkAction[];
		contextActions?: BulkAction[];
		rowActions?: BulkAction[];
		showRowActions?: boolean;
		class?: string;
		cell?: Snippet<[T, DataGridColumn<T>]>;
		/** Custom expanded-row content. Receives row + auto-hidden columns. */
		expandedRow?: Snippet<[T, DataGridColumn<T>[]]>;
		/** Custom card/list body; falls back to title + fields. */
		itemCard?: Snippet<[T]>;
		dockExtra?: Snippet;
		leading?: Snippet;
		onselectionchange?: (selection: GridSelection) => void;
		onnoteschange?: (notes: CellNote[]) => void;
		onmarkschange?: (marks: GridMark[]) => void;
		onformatruleschange?: (rules: ConditionalFormatRule[]) => void;
		onfilterchange?: (query: string, filters: DataGridFilter[]) => void;
		onviewmodechange?: (mode: DataGridViewMode) => void;
		onexpandedchange?: (ids: string[]) => void;
		oncolumnresize?: (columnId: string, width: number) => void;
		oncelledit?: (rowId: string, columnId: string, value: unknown, row: T) => void;
		onrowpatch?: (rowId: string, patch: Record<string, unknown>, row: T) => void;
		onaction?: (id: string, selection: GridSelection) => void;
		onsort?: (columnId: string, direction: Exclude<SortDir, null>) => void;
		onrowclick?: (row: T) => void;
		onrowdblclick?: (row: T) => void;
	}

	let {
		columns = [] as DataGridColumn<T>[],
		rows = [] as T[],
		rowKey,
		selection = $bindable<GridSelection>(EMPTY_SELECTION),
		notes = $bindable<CellNote[]>([]),
		marks = $bindable<GridMark[]>([]),
		formatRules = $bindable<ConditionalFormatRule[]>([]),
		filterQuery = $bindable(''),
		columnFilters = $bindable<DataGridFilter[]>([]),
		expandedRows = $bindable<string[]>([]),
		viewMode = $bindable<DataGridViewMode>('table'),
		sortable = true,
		selectable = true,
		selectColumns = true,
		selectCells = true,
		selectOnClick = true,
		marqueeSelect = true,
		contextMenu = true,
		editable = false,
		collapsible = false,
		filterable = false,
		showViewModes = false,
		titleColumnId,
		striped = false,
		hoverable = true,
		compact = false,
		stickyHeader = true,
		loading = false,
		empty = 'No results',
		showDock = true,
		actions,
		contextActions,
		rowActions,
		showRowActions,
		class: className = '',
		cell,
		expandedRow,
		itemCard,
		dockExtra,
		leading,
		onselectionchange,
		onnoteschange,
		onmarkschange,
		onformatruleschange,
		onfilterchange,
		onviewmodechange,
		onexpandedchange,
		oncolumnresize,
		oncelledit,
		onrowpatch,
		onaction,
		onsort,
		onrowclick,
		onrowdblclick
	}: DataGridProps = $props();

	let sortId = $state<string | null>(null);
	let sortDir = $state<SortDir>(null);
	let columnWidths = $state<Record<string, number>>({});
	let resizing = $state<{ id: string; startX: number; startW: number } | null>(null);
	let editing = $state<CellRef | null>(null);
	let editValue = $state('');
	let editBool = $state(false);
	let activeEditor = $state<DataGridEditConfig | null>(null);
	let noteTargets = $state<CellRef[] | null>(null);
	let noteDraft = $state('');
	let markPickerOpen = $state(false);
	let markTargets = $state<GridMark[] | null>(null);
	let markCustomColor = $state('#f59e0b');
	let anchorCell = $state<CellRef | null>(null);
	let lastClickedRow = $state<string | null>(null);
	let gridScrollEl = $state<HTMLElement | null>(null);
	let marqueeRect = $state<MarqueeRectBox | null>(null);
	let contextTarget = $state<CellRef | null>(null);
	let contextOpen = $state(false);
	let contextAnchor = $state<ContextMenuAnchor | null>(null);
	/**
	 * SSR + first client paint: do not apply `hideBelow` yet (show full table).
	 * After mount, measure window and refine columns — no hydration mismatch.
	 */
	let viewportMeasured = $state(false);
	let viewportWidth = $state(Number.POSITIVE_INFINITY);
	let filterColumnDraft = $state('');
	let filterValueDraft = $state('');

	$effect(() => {
		const onResize = () => {
			viewportWidth = window.innerWidth;
			viewportMeasured = true;
		};
		window.addEventListener('resize', onResize);
		onResize();
		return () => window.removeEventListener('resize', onResize);
	});

	const autoHiddenColumns = $derived(
		viewportMeasured
			? columns.filter(
					(c) =>
						!c.hidden &&
						c.hideBelow &&
						!isColumnVisibleAtWidth(c.hideBelow, viewportWidth)
				)
			: []
	);

	/** Expand controls only when there is content to reveal. */
	const collapsibleEnabled = $derived(
		autoHiddenColumns.length > 0 || (collapsible && Boolean(expandedRow))
	);

	$effect(() => {
		if (collapsibleEnabled || expandedRows.length === 0) return;
		expandedRows = [];
		onexpandedchange?.([]);
	});

	const visibleColumns = $derived(
		columns.filter((c) => {
			if (c.hidden) return false;
			if (
				viewportMeasured &&
				c.hideBelow &&
				!isColumnVisibleAtWidth(c.hideBelow, viewportWidth)
			) {
				return false;
			}
			return true;
		})
	);
	const pinnedColumns = $derived(visibleColumns.filter((c) => c.pinned));
	const scrollColumns = $derived(visibleColumns.filter((c) => !c.pinned));
	const orderedColumns = $derived([...pinnedColumns, ...scrollColumns]);

	const filterableColumns = $derived(columns.filter((c) => c.filterable !== false && !c.hidden));
	const titleCol = $derived(
		columns.find((c) => c.id === titleColumnId) ??
			orderedColumns[0] ??
			columns.find((c) => !c.hidden) ??
			null
	);

	const filterBarChips = $derived.by((): FilterChip[] =>
		columnFilters.map((f) => ({
			id: f.id,
			label: f.label ?? `${columns.find((c) => c.id === f.columnId)?.header ?? f.columnId}: ${f.value}`
		}))
	);

	const notesMap = $derived.by(() => {
		const map = new Map<string, CellNote>();
		for (const n of notes) map.set(noteKey(n.rowId, n.columnId), n);
		return map;
	});

	const marksMap = $derived.by(() => {
		const map = new Map<string, GridMark>();
		for (const m of marks) map.set(markKey(m.rowId, m.columnId), m);
		return map;
	});

	const defaultActions = $derived.by((): BulkAction[] => {
		if (actions) return actions;
		const list: BulkAction[] = [
			{ id: 'note', label: 'Note', variant: 'secondary' },
			{ id: 'mark', label: 'Mark', variant: 'secondary' },
			{ id: 'copy', label: 'Copy', variant: 'secondary' }
		];
		if (formatRules.length > 0) {
			list.push({ id: 'format', label: 'Format', variant: 'secondary' });
		}
		return list;
	});

	const resolvedContextActions = $derived(contextActions ?? actions ?? []);
	const resolvedRowActions = $derived(rowActions ?? contextActions ?? actions ?? []);
	const rowActionsEnabled = $derived(showRowActions ?? selectable);
	const contextMenuEnabled = $derived(contextMenu && (selectable || editable) && !loading);
	const dockCount = $derived(selectionCount(selection));
	const dockLabels = $derived(selectionLabel(selection));
	const colCount = $derived(
		orderedColumns.length +
			(selectable ? 1 : 0) +
			(rowActionsEnabled ? 1 : 0) +
			(collapsibleEnabled && viewMode === 'table' ? 1 : 0)
	);

	const isTableMode = $derived(viewMode === 'table');
	const marqueeSelectActive = $derived(marqueeSelect && isTableMode);

	function actionToContextItem(action: BulkAction): ContextMenuItem {
		return {
			id: action.id,
			label: action.label,
			disabled: action.disabled || action.loading,
			destructive: action.variant === 'destructive'
		};
	}

	function actionToDropdownItem(action: BulkAction): DropdownItem {
		return {
			id: action.id,
			label: action.label,
			disabled: action.disabled || action.loading,
			destructive: action.variant === 'destructive',
			icon: action.icon
		};
	}

	const rowActionMenuItems = $derived(
		resolvedRowActions.length > 0
			? resolvedRowActions.map(actionToDropdownItem)
			: [
					{ id: 'copy', label: 'Copy' },
					{ id: 'note', label: 'Add note' },
					{ id: 'mark', label: 'Mark…' },
					...(editable ? [{ id: 'edit', label: 'Edit cell' }] : [])
				]
	);

	function getKey(row: T, index: number): string {
		try {
			return resolveRowKey(row, rowKey, index);
		} catch {
			// Bad accessor/rowKey must not take down SSR (e.g. null profile).
			return String(index);
		}
	}

	function getValue(row: T, column: DataGridColumn<T>): unknown {
		try {
			return resolveAccessor(row, column.accessor, column.id);
		} catch {
			return undefined;
		}
	}

	function formatCell(value: unknown): string {
		if (value == null) return '';
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		return String(value);
	}

	function setSelection(next: GridSelection) {
		selection = next;
		onselectionchange?.(next);
	}

	function clearSelection() {
		setSelection(EMPTY_SELECTION);
		anchorCell = null;
		lastClickedRow = null;
	}

	const filteredRows = $derived(
		filterable || filterQuery || columnFilters.length
			? filterRows(
					rows as Record<string, unknown>[],
					columns as DataGridColumn[],
					filterQuery,
					columnFilters
				)
			: rows
	);

	const sortedRows = $derived.by(() => {
		const base = filteredRows as T[];
		if (!sortId || !sortDir) return base;
		const col = columns.find((c) => c.id === sortId);
		if (!col) return base;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...base].sort((a, b) => {
			const av = getValue(a, col);
			const bv = getValue(b, col);
			if (av == null && bv == null) return 0;
			if (av == null) return 1;
			if (bv == null) return -1;
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
		});
	});

	const rowIds = $derived(sortedRows.map((r, i) => getKey(r, i)));

	const contextMenuItems = $derived.by((): ContextMenuItem[] => {
		const target = contextTarget;
		const targetCol = target ? columns.find((c) => c.id === target.columnId) : undefined;
		const canEditTarget = Boolean(target && targetCol && canEditColumn(targetCol));
		const items: ContextMenuItem[] = [];
		if (canEditTarget) {
			items.push({ id: 'edit', label: 'Edit cell', shortcut: 'F2' });
		}
		items.push({ id: 'copy', label: 'Copy', shortcut: '⌘C' });
		if (target) {
			const hasNote = notesMap.has(noteKey(target.rowId, target.columnId));
			items.push({ id: 'note', label: hasNote ? 'Edit note' : 'Add note' });
		} else {
			items.push({ id: 'note', label: 'Add note', disabled: true });
		}
		const markable = Boolean(target) || selection.type !== 'none';
		items.push({ id: 'mark', label: 'Mark…', disabled: !markable });
		items.push({
			id: 'clear-mark',
			label: 'Clear mark',
			disabled: !markable || !targetsHaveMarks(markTargetsFromSelection(selectionOrContext()))
		});
		items.push({ id: 'sep-select', label: '', separator: true });
		items.push({ id: 'select-row', label: 'Select row', disabled: !target || !selectable });
		items.push({
			id: 'select-all',
			label: 'Select all',
			disabled: !selectable || rowIds.length === 0
		});
		items.push({
			id: 'clear',
			label: 'Clear selection',
			disabled: !selectable || dockCount === 0
		});
		if (resolvedContextActions.length > 0) {
			const used = new Set(items.map((i) => i.id));
			const extras = resolvedContextActions.filter((a) => !used.has(a.id));
			if (extras.length > 0) {
				items.push({ id: 'sep-actions', label: '', separator: true });
				for (const action of extras) items.push(actionToContextItem(action));
			}
		}
		return items;
	});

	function rowSelectionIds(sel: GridSelection): string[] {
		return sel.type === 'rows' ? sel.ids : [];
	}
	function columnSelectionIds(sel: GridSelection): string[] {
		return sel.type === 'columns' ? sel.ids : [];
	}
	function cellSelection(sel: GridSelection): CellRef[] {
		return sel.type === 'cells' ? sel.cells : [];
	}

	const allRowsSelected = $derived.by(() => {
		const ids = rowSelectionIds(selection);
		return rowIds.length > 0 && ids.length === rowIds.length && rowIds.every((id) => ids.includes(id));
	});
	const someRowsSelected = $derived(rowSelectionIds(selection).length > 0 && !allRowsSelected);

	const rowFormats = $derived.by(() => {
		const map = new Map<string, ReturnType<typeof evaluateFormatRules>>();
		if (!formatRules.length) return map;
		for (let i = 0; i < sortedRows.length; i++) {
			const row = sortedRows[i];
			map.set(getKey(row, i), evaluateFormatRules(row as Record<string, unknown>, formatRules));
		}
		return map;
	});

	function canSort(column: DataGridColumn<T>) {
		if (column.sortable === false) return false;
		return sortable || column.sortable === true;
	}

	function toggleSort(column: DataGridColumn<T>) {
		if (!canSort(column)) return;
		if (sortId !== column.id) {
			sortId = column.id;
			sortDir = 'asc';
		} else if (sortDir === 'asc') {
			sortDir = 'desc';
		} else {
			sortId = null;
			sortDir = null;
			return;
		}
		if (sortDir) onsort?.(column.id, sortDir);
	}

	function toggleAllRows() {
		if (allRowsSelected) {
			clearSelection();
			return;
		}
		setSelection({ type: 'rows', ids: [...rowIds] });
	}

	function isRowExpanded(rowId: string) {
		return expandedRows.includes(rowId);
	}

	function toggleExpand(rowId: string) {
		const next = isRowExpanded(rowId)
			? expandedRows.filter((id) => id !== rowId)
			: [...expandedRows, rowId];
		expandedRows = next;
		onexpandedchange?.(next);
	}

	function setViewMode(mode: DataGridViewMode) {
		viewMode = mode;
		onviewmodechange?.(mode);
	}

	function syncFilterQuery(q: string) {
		filterQuery = q;
		onfilterchange?.(q, columnFilters);
	}

	function removeFilterChip(id: string) {
		columnFilters = columnFilters.filter((f) => f.id !== id);
		onfilterchange?.(filterQuery, columnFilters);
	}

	function clearAllFilters() {
		columnFilters = [];
		filterQuery = '';
		onfilterchange?.('', []);
	}

	function addColumnFilter(columnId: string, value: string) {
		const col = columns.find((c) => c.id === columnId);
		if (!col || !value) return;
		const id = `${columnId}::${value}`;
		if (columnFilters.some((f) => f.id === id)) return;
		columnFilters = [
			...columnFilters,
			{
				id,
				columnId,
				value,
				op: 'eq',
				label: `${col.header}: ${value}`
			}
		];
		onfilterchange?.(filterQuery, columnFilters);
	}

	function secondaryFields(row: T): Array<{ column: DataGridColumn<T>; text: string }> {
		const skip = new Set([titleCol?.id, ...orderedColumns.slice(0, 2).map((c) => c.id)]);
		const pool = [
			...autoHiddenColumns,
			...columns.filter((c) => !c.hidden && !orderedColumns.some((o) => o.id === c.id))
		];
		const seen = new Set<string>();
		const out: Array<{ column: DataGridColumn<T>; text: string }> = [];
		for (const column of [...orderedColumns.slice(1), ...pool]) {
			if (skip.has(column.id) || seen.has(column.id)) continue;
			seen.add(column.id);
			out.push({
				column,
				text: cellText(row as Record<string, unknown>, column as DataGridColumn)
			});
			if (out.length >= 6) break;
		}
		return out;
	}

	function toggleRow(rowId: string, event: MouseEvent) {
		event.stopPropagation();
		clearNativeTextSelection();
		if (event.shiftKey && lastClickedRow) {
			const a = rowIds.indexOf(lastClickedRow);
			const b = rowIds.indexOf(rowId);
			if (a >= 0 && b >= 0) {
				const [lo, hi] = a < b ? [a, b] : [b, a];
				const range = rowIds.slice(lo, hi + 1);
				const existing = selection.type === 'rows' ? selection.ids : [];
				setSelection({ type: 'rows', ids: [...new Set([...existing, ...range])] });
				lastClickedRow = rowId;
				return;
			}
		}
		lastClickedRow = rowId;
		if (selection.type === 'rows') {
			const has = selection.ids.includes(rowId);
			const ids = has ? selection.ids.filter((id) => id !== rowId) : [...selection.ids, rowId];
			setSelection(ids.length ? { type: 'rows', ids } : EMPTY_SELECTION);
			return;
		}
		setSelection({ type: 'rows', ids: [rowId] });
	}

	function toggleColumn(columnId: string, event: MouseEvent) {
		if (!selectColumns) return;
		event.stopPropagation();
		if (selection.type === 'columns') {
			const has = selection.ids.includes(columnId);
			const ids = has
				? selection.ids.filter((id) => id !== columnId)
				: [...selection.ids, columnId];
			setSelection(ids.length ? { type: 'columns', ids } : EMPTY_SELECTION);
			return;
		}
		setSelection({ type: 'columns', ids: [columnId] });
	}

	function cellsEqual(a: CellRef, b: CellRef) {
		return a.rowId === b.rowId && a.columnId === b.columnId;
	}

	function expandRange(a: CellRef, b: CellRef): CellRef[] {
		const rowA = rowIds.indexOf(a.rowId);
		const rowB = rowIds.indexOf(b.rowId);
		const colIds = orderedColumns.map((c) => c.id);
		const colA = colIds.indexOf(a.columnId);
		const colB = colIds.indexOf(b.columnId);
		if (rowA < 0 || rowB < 0 || colA < 0 || colB < 0) return [b];
		const [r0, r1] = rowA < rowB ? [rowA, rowB] : [rowB, rowA];
		const [c0, c1] = colA < colB ? [colA, colB] : [colB, colA];
		const cells: CellRef[] = [];
		for (let r = r0; r <= r1; r++) {
			for (let c = c0; c <= c1; c++) {
				cells.push({ rowId: rowIds[r], columnId: colIds[c] });
			}
		}
		return cells;
	}

	function clearNativeTextSelection() {
		const sel = typeof window !== 'undefined' ? window.getSelection?.() : null;
		if (sel && sel.rangeCount > 0) sel.removeAllRanges();
	}

	function selectCell(rowId: string, columnId: string, event: MouseEvent) {
		if (!selectCells) return;
		clearNativeTextSelection();
		const ref = { rowId, columnId };
		if (event.shiftKey && anchorCell) {
			setSelection({ type: 'cells', cells: expandRange(anchorCell, ref) });
			return;
		}
		if (event.metaKey || event.ctrlKey) {
			if (selection.type === 'cells') {
				const has = selection.cells.some((c) => cellsEqual(c, ref));
				const cells = has
					? selection.cells.filter((c) => !cellsEqual(c, ref))
					: [...selection.cells, ref];
				setSelection(cells.length ? { type: 'cells', cells } : EMPTY_SELECTION);
			} else {
				setSelection({ type: 'cells', cells: [ref] });
			}
			anchorCell = ref;
			return;
		}
		anchorCell = ref;
		setSelection({ type: 'cells', cells: [ref] });
	}

	function isRowSelected(rowId: string) {
		return rowSelectionIds(selection).includes(rowId);
	}
	function isColumnSelected(columnId: string) {
		return columnSelectionIds(selection).includes(columnId);
	}
	function isCellSelected(rowId: string, columnId: string) {
		if (rowSelectionIds(selection).includes(rowId)) return true;
		if (columnSelectionIds(selection).includes(columnId)) return true;
		return cellSelection(selection).some((c) => c.rowId === rowId && c.columnId === columnId);
	}

	function canEditColumn(column: DataGridColumn<T>): boolean {
		return editable && column.editable !== false;
	}

	function startEdit(row: T, column: DataGridColumn<T>, index: number) {
		if (!canEditColumn(column)) return;
		const rowId = getKey(row, index);
		const value = getValue(row, column);
		const editor = resolveCellEditor(column, value);
		activeEditor = editor;
		editing = { rowId, columnId: column.id };
		if (editor.type === 'boolean') {
			editBool = Boolean(value);
			editValue = '';
		} else {
			editBool = false;
			editValue = String(draftFromValue(value, editor));
		}
	}

	function commitEdit(row: T) {
		if (!editing || !activeEditor) return;
		const { rowId, columnId } = editing;
		const col = columns.find((c) => c.id === columnId);
		const accessor = accessorPatchKey(col?.accessor, columnId);
		const draft = activeEditor.type === 'boolean' ? editBool : editValue;
		const nextValue = coerceEditValue(activeEditor, draft);
		editing = null;
		activeEditor = null;
		oncelledit?.(rowId, columnId, nextValue, row);
		onrowpatch?.(rowId, { [accessor]: nextValue }, row);
	}

	function cancelEdit() {
		editing = null;
		activeEditor = null;
	}

	function onEditKeydown(e: KeyboardEvent, row: T) {
		if (e.key === 'Enter' && activeEditor?.type !== 'textarea') {
			e.preventDefault();
			commitEdit(row);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancelEdit();
		}
	}

	function cellsForNotes(sel: GridSelection = selectionOrContext()): CellRef[] {
		if (sel.type === 'cells') {
			const seen = new Set<string>();
			const out: CellRef[] = [];
			for (const c of sel.cells) {
				const k = noteKey(c.rowId, c.columnId);
				if (seen.has(k)) continue;
				seen.add(k);
				out.push(c);
			}
			return out;
		}
		if (sel.type === 'rows') {
			const out: CellRef[] = [];
			for (const rowId of sel.ids) {
				for (const col of orderedColumns) {
					out.push({ rowId, columnId: col.id });
				}
			}
			return out;
		}
		if (sel.type === 'columns') {
			const out: CellRef[] = [];
			for (let i = 0; i < sortedRows.length; i++) {
				const rowId = getKey(sortedRows[i], i);
				for (const columnId of sel.ids) {
					out.push({ rowId, columnId });
				}
			}
			return out;
		}
		if (contextTarget) return [contextTarget];
		return [];
	}

	function openNoteEditor(targets: CellRef[]) {
		if (!targets.length) return;
		noteTargets = targets;
		markPickerOpen = false;
		markTargets = null;
		const texts = targets
			.map((t) => notesMap.get(noteKey(t.rowId, t.columnId))?.text?.trim())
			.filter((t): t is string => Boolean(t));
		const unique = [...new Set(texts)];
		noteDraft = unique.length === 1 ? unique[0] : '';
	}

	function openNoteForSelection() {
		openNoteEditor(cellsForNotes(selectionOrContext()));
	}

	function saveNotes() {
		if (!noteTargets?.length) return;
		const text = noteDraft.trim();
		const keys = new Set(noteTargets.map((t) => noteKey(t.rowId, t.columnId)));
		let next = notes.filter((n) => !keys.has(noteKey(n.rowId, n.columnId)));
		if (text) {
			const updatedAt = new Date().toISOString();
			for (const t of noteTargets) {
				next.push({
					rowId: t.rowId,
					columnId: t.columnId,
					text,
					updatedAt
				});
			}
		}
		notes = next;
		onnoteschange?.(next);
		noteTargets = null;
	}

	function closeNoteEditor() {
		noteTargets = null;
	}

	/** Resolve mark targets from selection: rows → row marks; cells → cell marks. */
	function markTargetsFromSelection(sel: GridSelection): Array<{ rowId: string; columnId?: string }> {
		if (sel.type === 'rows') {
			return sel.ids.map((rowId) => ({ rowId }));
		}
		if (sel.type === 'cells') {
			const seen = new Set<string>();
			const out: Array<{ rowId: string; columnId?: string }> = [];
			for (const c of sel.cells) {
				const k = markKey(c.rowId, c.columnId);
				if (seen.has(k)) continue;
				seen.add(k);
				out.push({ rowId: c.rowId, columnId: c.columnId });
			}
			return out;
		}
		if (sel.type === 'columns') {
			// Plan: column marks out of scope — fall back to cells in those columns.
			const out: Array<{ rowId: string; columnId?: string }> = [];
			for (let i = 0; i < sortedRows.length; i++) {
				const rowId = getKey(sortedRows[i], i);
				for (const columnId of sel.ids) {
					out.push({ rowId, columnId });
				}
			}
			return out;
		}
		if (contextTarget) {
			if (selectCells) return [{ rowId: contextTarget.rowId, columnId: contextTarget.columnId }];
			return [{ rowId: contextTarget.rowId }];
		}
		return [];
	}

	function targetsHaveMarks(targets: Array<{ rowId: string; columnId?: string }>): boolean {
		return targets.some((t) => marksMap.has(markKey(t.rowId, t.columnId)));
	}

	function openMarkPicker(targets?: Array<{ rowId: string; columnId?: string }>) {
		const next = targets ?? markTargetsFromSelection(selectionOrContext());
		if (!next.length) return;
		const firstColor =
			marksMap.get(markKey(next[0].rowId, next[0].columnId))?.color ?? 'amber';
		markTargets = next.map((t) => ({
			rowId: t.rowId,
			columnId: t.columnId,
			color: (marksMap.get(markKey(t.rowId, t.columnId))?.color ?? firstColor) as MarkColor
		}));
		markCustomColor = markSwatch(firstColor);
		markPickerOpen = true;
		noteTargets = null;
	}

	function closeMarkPicker() {
		markPickerOpen = false;
		markTargets = null;
	}

	function applyMarkColor(color: MarkColor) {
		if (!markTargets?.length) return;
		const keys = new Set(markTargets.map((t) => markKey(t.rowId, t.columnId)));
		const next = marks.filter((m) => !keys.has(markKey(m.rowId, m.columnId)));
		for (const t of markTargets) {
			next.push({
				rowId: t.rowId,
				...(t.columnId ? { columnId: t.columnId } : {}),
				color
			});
		}
		marks = next;
		onmarkschange?.(next);
		closeMarkPicker();
	}

	function applyCustomMarkColor() {
		const value = markCustomColor.trim();
		if (!value) return;
		applyMarkColor(value);
	}

	function clearMarksForTargets(targets?: Array<{ rowId: string; columnId?: string }>) {
		const list = targets ?? markTargetsFromSelection(selectionOrContext());
		if (!list.length) return;
		const keys = new Set(list.map((t) => markKey(t.rowId, t.columnId)));
		const next = marks.filter((m) => !keys.has(markKey(m.rowId, m.columnId)));
		marks = next;
		onmarkschange?.(next);
		closeMarkPicker();
	}

	function rowMarkColor(rowId: string): MarkColor | null {
		return marksMap.get(markKey(rowId))?.color ?? null;
	}

	function cellMarkColor(rowId: string, columnId: string): MarkColor | null {
		return marksMap.get(markKey(rowId, columnId))?.color ?? null;
	}

	function handleDockAction(id: string) {
		if (id === 'note') {
			openNoteForSelection();
			return;
		}
		if (id === 'mark') {
			openMarkPicker();
			return;
		}
		if (id === 'copy') {
			copySelection();
			return;
		}
		onaction?.(id, selection);
	}

	/** Right-click only pins the menu target — it does not change selection. */
	function prepareContextTarget(rowId: string, columnId: string) {
		contextTarget = { rowId, columnId };
	}

	function openContextMenuAt(e: MouseEvent, rowId: string, columnId: string) {
		if (!contextMenuEnabled) return;
		e.preventDefault();
		e.stopPropagation();
		prepareContextTarget(rowId, columnId);
		contextAnchor = { x: e.clientX, y: e.clientY };
		contextOpen = true;
	}

	function closeContextMenu() {
		contextOpen = false;
		contextAnchor = null;
	}

	function onContextMenuPick(id: string) {
		runGridAction(id, contextTarget);
		closeContextMenu();
	}

	function selectRowFromCell(rowId: string, event: MouseEvent) {
		if (event.shiftKey || event.metaKey || event.ctrlKey) {
			toggleRow(rowId, event);
			return;
		}
		lastClickedRow = rowId;
		setSelection({ type: 'rows', ids: [rowId] });
	}

	function rowIdFromEvent(e: Event): string | null {
		const t = e.target;
		if (!(t instanceof Element)) return null;
		return t.closest('[data-row-id]')?.getAttribute('data-row-id') ?? null;
	}

	function columnIdFromEvent(e: Event): string | null {
		const t = e.target;
		if (!(t instanceof Element)) return null;
		return t.closest('[data-column-id]')?.getAttribute('data-column-id') ?? null;
	}

	function rowById(rowId: string): T | undefined {
		const idx = rowIds.indexOf(rowId);
		return idx >= 0 ? sortedRows[idx] : undefined;
	}

	function emitRowClick(rowId: string) {
		const row = rowById(rowId);
		if (row) onrowclick?.(row);
	}

	function emitRowDblClick(rowId: string) {
		const row = rowById(rowId);
		if (row) onrowdblclick?.(row);
	}

	/** Single delegated handlers — avoids broken per-row listeners inside {#each}. */
	function onGridClick(e: MouseEvent) {
		// Ignore the synthetic click that precedes dblclick (detail === 2).
		if (e.detail > 1) return;
		const t = e.target;
		if (!(t instanceof Element)) return;
		if (t.closest('thead, button, input, textarea, select, a, label, [data-marquee-ignore]')) return;
		const cell = t.closest('[role="gridcell"][data-row-id]');
		if (!(cell instanceof HTMLElement)) return;
		const id = cell.getAttribute('data-row-id');
		const colId = cell.getAttribute('data-column-id') ?? '';
		if (!id) return;
		if (selectCells) {
			selectCell(id, colId, e);
		} else if (selectable && selectOnClick) {
			selectRowFromCell(id, e);
		}
		emitRowClick(id);
	}

	function onGridDblClick(e: MouseEvent) {
		const t = e.target;
		if (!(t instanceof Element)) return;
		if (t.closest('thead, button, input, textarea, select, a, label, [data-marquee-ignore]')) return;
		const cell = t.closest('[role="gridcell"][data-row-id]');
		if (!(cell instanceof HTMLElement)) return;
		const id = cell.getAttribute('data-row-id');
		const colId = cell.getAttribute('data-column-id') ?? '';
		if (!id) return;
		// Prefer consumer dblclick; otherwise fall through to edit.
		if (onrowdblclick) {
			emitRowClick(id);
			emitRowDblClick(id);
			return;
		}
		if (editable) {
			const col = columns.find((c) => c.id === colId);
			const current = rowById(id);
			const idx = rowIds.indexOf(id);
			if (col && current && canEditColumn(col)) startEdit(current, col, idx);
		}
	}

	function selectionOrContext(): GridSelection {
		if (selection.type !== 'none') return selection;
		if (!contextTarget) return EMPTY_SELECTION;
		if (selectCells) {
			return { type: 'cells', cells: [contextTarget] };
		}
		return { type: 'rows', ids: [contextTarget.rowId] };
	}

	function copySelection(sel: GridSelection = selection) {
		const active = sel.type === 'none' ? selectionOrContext() : sel;
		const lines: string[] = [];
		if (active.type === 'rows') {
			for (const id of active.ids) {
				const idx = rowIds.indexOf(id);
				if (idx < 0) continue;
				const row = rows[idx];
				lines.push(orderedColumns.map((c) => formatCell(getValue(row, c))).join('\t'));
			}
		} else if (active.type === 'columns') {
			for (const row of rows) {
				lines.push(
					active.ids
						.map((id) => {
							const col = columns.find((c) => c.id === id);
							return col ? formatCell(getValue(row, col)) : '';
						})
						.join('\t')
				);
			}
		} else if (active.type === 'cells') {
			const byRow = new Map<string, Map<string, string>>();
			for (const cellRef of active.cells) {
				const idx = rowIds.indexOf(cellRef.rowId);
				if (idx < 0) continue;
				const col = columns.find((c) => c.id === cellRef.columnId);
				if (!col) continue;
				if (!byRow.has(cellRef.rowId)) byRow.set(cellRef.rowId, new Map());
				byRow
					.get(cellRef.rowId)!
					.set(cellRef.columnId, formatCell(getValue(rows[idx], col)));
			}
			for (const cols of byRow.values()) {
				lines.push([...cols.values()].join('\t'));
			}
		}
		const text = lines.join('\n');
		if (text) navigator.clipboard?.writeText(text).catch(() => {});
	}

	function runGridAction(id: string, focus?: CellRef | null) {
		const target = focus ?? contextTarget;
		if (id === 'copy') {
			copySelection(selectionOrContext());
			return;
		}
		if (id === 'note') {
			const sel = selectionOrContext();
			const targets = cellsForNotes(sel);
			if (targets.length) {
				openNoteEditor(targets);
				return;
			}
			if (target) {
				openNoteEditor([target]);
				return;
			}
			openNoteForSelection();
			return;
		}
		if (id === 'mark') {
			openMarkPicker();
			return;
		}
		if (id === 'clear-mark') {
			clearMarksForTargets();
			return;
		}
		if (id === 'edit' && target && editable) {
			const col = columns.find((c) => c.id === target.columnId);
			if (!col || !canEditColumn(col)) return;
			for (let i = 0; i < sortedRows.length; i++) {
				const row = sortedRows[i];
				if (getKey(row, i) === target.rowId) {
					startEdit(row, col, i);
					return;
				}
			}
			return;
		}
		if (id === 'select-row' && target) {
			setSelection({ type: 'rows', ids: [target.rowId] });
			return;
		}
		if (id === 'select-all') {
			setSelection({ type: 'rows', ids: [...rowIds] });
			return;
		}
		if (id === 'clear') {
			clearSelection();
			return;
		}
		onaction?.(id, selectionOrContext());
	}

	function onContextSelect(id: string) {
		const target = contextTarget;
		runGridAction(id, target);
	}

	function onRowMenuAction(id: string, rowId: string) {
		const columnId = orderedColumns[0]?.id ?? 'id';
		prepareContextTarget(rowId, columnId);
		runGridAction(id, { rowId, columnId });
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'F2' && editable && !editing) {
			const target =
				contextTarget ??
				(selection.type === 'cells' && selection.cells[0]
					? selection.cells[0]
					: selection.type === 'rows' && selection.ids[0] && orderedColumns[0]
						? { rowId: selection.ids[0], columnId: orderedColumns[0].id }
						: null);
			if (target) {
				e.preventDefault();
				runGridAction('edit', target);
				return;
			}
		}
		if (e.key === 'Escape') {
			if (editing) {
				cancelEdit();
				return;
			}
			if (noteTargets) {
				closeNoteEditor();
				return;
			}
			if (markPickerOpen) {
				closeMarkPicker();
				return;
			}
			if (contextOpen) {
				closeContextMenu();
				return;
			}
			if (dockCount > 0) clearSelection();
		}
	}

	function startResize(columnId: string, e: PointerEvent) {
		e.preventDefault();
		e.stopPropagation();
		const el = (e.currentTarget as HTMLElement).parentElement;
		const startW = columnWidths[columnId] ?? el?.getBoundingClientRect().width ?? 120;
		resizing = { id: columnId, startX: e.clientX, startW };
		const onMove = (ev: PointerEvent) => {
			if (!resizing) return;
			const delta = ev.clientX - resizing.startX;
			columnWidths = {
				...columnWidths,
				[resizing.id]: Math.max(72, resizing.startW + delta)
			};
		};
		const onUp = () => {
			if (resizing) oncolumnresize?.(resizing.id, columnWidths[resizing.id] ?? resizing.startW);
			resizing = null;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

	function colWidth(column: DataGridColumn<T>): string | undefined {
		if (columnWidths[column.id]) return `${columnWidths[column.id]}px`;
		return column.width;
	}

	function pinnedOffset(columnId: string): string | undefined {
		const idx = pinnedColumns.findIndex((c) => c.id === columnId);
		if (idx < 0) return undefined;
		let left = selectable ? 40 : 0;
		for (let i = 0; i < idx; i++) {
			const c = pinnedColumns[i];
			left += columnWidths[c.id] ?? (c.width ? parseInt(c.width, 10) || 120 : 120);
		}
		return `${left}px`;
	}

	function marqueeIdForRow(rowId: string) {
		return `row:${rowId}`;
	}
	function marqueeIdForCell(rowId: string, columnId: string) {
		return `cell:${noteKey(rowId, columnId)}`;
	}

	function snapshotMarqueeIds(): string[] {
		if (selection.type === 'rows') return selection.ids.map(marqueeIdForRow);
		if (selection.type === 'cells') {
			return selection.cells.map((c) => marqueeIdForCell(c.rowId, c.columnId));
		}
		return [];
	}

	function applyMarqueeIds(ids: string[]) {
		if (selectCells) {
			const cells: CellRef[] = [];
			for (const id of ids) {
				if (!id.startsWith('cell:')) continue;
				const rest = id.slice(5);
				const sep = rest.indexOf('::');
				if (sep < 0) continue;
				cells.push({ rowId: rest.slice(0, sep), columnId: rest.slice(sep + 2) });
			}
			setSelection(cells.length ? { type: 'cells', cells } : EMPTY_SELECTION);
			return;
		}
		const idsOnly = ids.filter((id) => id.startsWith('row:')).map((id) => id.slice(4));
		setSelection(idsOnly.length ? { type: 'rows', ids: idsOnly } : EMPTY_SELECTION);
	}

	const marqueeEnabled = $derived(selectable && marqueeSelectActive && !loading);

	$effect(() => {
		const el = gridScrollEl;
		if (!el || !marqueeEnabled) return;

		let baseline: string[] = [];
		let dragStarted = false;

		const dispose = attachMarqueeSelect(el, {
			getItems: () =>
				collectMarqueeItems(
					el,
					selectCells ? '[data-marquee-id^="cell:"]' : '[data-marquee-id^="row:"]'
				),
			shouldIgnore: (target) => {
				if (editing || noteTargets || markPickerOpen) return true;
				if (defaultMarqueeIgnore(target)) return true;
				if (target instanceof Element && target.closest('thead')) return true;
				return false;
			},
			onRect: (rect) => {
				marqueeRect = rect;
				if (!rect) dragStarted = false;
			},
			onDrag: ({ ids, modifier }) => {
				if (!dragStarted) {
					dragStarted = true;
					baseline = snapshotMarqueeIds();
				}
				clearNativeTextSelection();
				applyMarqueeIds(resolveMarqueeSelection(ids, baseline, modifier));
			},
			onSelect: ({ ids, modifier }) => {
				clearNativeTextSelection();
				applyMarqueeIds(resolveMarqueeSelection(ids, baseline, modifier));
				dragStarted = false;
				baseline = [];
			}
		});

		return dispose;
	});

	const alignClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	} as const;

</script>

<svelte:window
	onkeydown={onKeydown}
	onpointerdown={(e) => {
		if (!contextOpen || e.button === 2) return;
		const t = e.target as Node | null;
		if (t && typeof (t as Element).closest === 'function' && (t as Element).closest('[aria-label="Context menu"]')) {
			return;
		}
		closeContextMenu();
	}}
/>

{#snippet gridBody()}
	<div class={['relative flex h-full min-h-0 w-full flex-col gap-3', className]}>
		{#if filterable || showViewModes}
			<div class="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
				{#if filterable}
					<div class="min-w-0 flex-1">
						<FilterBar
							bind:query={filterQuery}
							filters={filterBarChips}
							placeholder="Search rows…"
							onquerychange={syncFilterQuery}
							onremovefilter={removeFilterChip}
							onclear={clearAllFilters}
						>
							{#snippet actions()}
								{#if filterableColumns.length}
									{@const columnOptions = filterableColumns.map((c) => ({
										value: c.id,
										label: c.header
									}))}
									{@const valueOptions = filterColumnDraft
										? uniqueColumnValues(
												rows as Record<string, unknown>[],
												columns.find((c) => c.id === filterColumnDraft)! as DataGridColumn
											).map((v) => ({ value: v, label: v }))
										: []}
									<div class="flex items-center gap-1.5">
										<Select
											size="sm"
											class="w-[9.5rem] shrink-0"
											placeholder="Filter column…"
											options={columnOptions}
											bind:value={filterColumnDraft}
											onchange={() => {
												filterValueDraft = '';
											}}
										/>
										{#if filterColumnDraft}
											<Select
												size="sm"
												class="w-[9.5rem] shrink-0"
												placeholder="Value…"
												options={valueOptions}
												bind:value={filterValueDraft}
												onchange={(v) => {
													if (!v) return;
													addColumnFilter(filterColumnDraft, v);
													filterValueDraft = '';
												}}
											/>
										{/if}
									</div>
								{/if}
							{/snippet}
						</FilterBar>
					</div>
				{/if}
				{#if showViewModes}
					<div
						class="inline-flex h-12 shrink-0 items-center gap-0.5 rounded-2xl border border-border bg-surface-elevated p-2 shadow-sm"
						role="group"
						aria-label="View mode"
					>
						{#each [
							{ id: 'table' as const, label: 'Table', Icon: Table2 },
							{ id: 'list' as const, label: 'List', Icon: LayoutList },
							{ id: 'card' as const, label: 'Cards', Icon: Rows3 },
							{ id: 'grid' as const, label: 'Grid', Icon: LayoutGrid }
						] as mode (mode.id)}
							<button
								type="button"
								class={[
									'inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition',
									viewMode === mode.id && 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
								]}
								aria-label={mode.label}
								aria-pressed={viewMode === mode.id}
								onclick={() => setViewMode(mode.id)}
							>
								<mode.Icon class="h-4 w-4" strokeWidth={2} />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if isTableMode}
		<div
			bind:this={gridScrollEl}
			class={[
				'relative min-h-0 w-full flex-1 overflow-auto rounded-xl border border-border bg-surface-elevated',
				selectable && 'select-none'
			]}
			role="grid"
			aria-rowcount={sortedRows.length}
			aria-colcount={colCount}
			onclick={onGridClick}
			ondblclick={onGridDblClick}
		>
			<table class="w-full border-collapse text-sm">
				<thead
					class={[
						'border-b border-border bg-surface-overlay/80 text-xs font-semibold tracking-wide text-secondary uppercase',
						stickyHeader && 'sticky top-0 z-20'
					]}
					oncontextmenu={(e) => e.stopPropagation()}
				>
					<tr role="row">
						{#if selectable}
							<th
								scope="col"
								class={['w-10 px-2', compact ? 'py-2' : 'py-2.5', stickyHeader && 'sticky left-0 z-30 bg-surface-overlay']}
								style={stickyHeader ? 'left:0' : undefined}
								data-marquee-ignore
							>
								<Checkbox
									size="sm"
									class="gap-0"
									checked={allRowsSelected}
									indeterminate={someRowsSelected}
									aria-label="Select all rows"
									onclick={(e) => e.stopPropagation()}
									onchange={(checked) => {
										if (checked) setSelection({ type: 'rows', ids: [...rowIds] });
										else clearSelection();
									}}
								/>
							</th>
						{/if}
						{#if collapsibleEnabled}
							<th
								scope="col"
								class={['w-8 px-1', compact ? 'py-2' : 'py-2.5']}
								data-marquee-ignore
								aria-label="Expand"
							></th>
						{/if}
						{#each orderedColumns as column (column.id)}
							{@const selected = isColumnSelected(column.id)}
							<th
								scope="col"
								class={[
									'relative px-3 font-semibold',
									compact ? 'py-2' : 'py-2.5',
									alignClass[column.align ?? 'left'],
									canSort(column) && 'cursor-pointer select-none hover:text-primary',
									selected && 'bg-brand-500/10 text-brand-700 dark:text-brand-300',
									column.pinned && stickyHeader && 'sticky z-30 bg-surface-overlay',
									column.class
								]}
								style={[
									colWidth(column) ? `width:${colWidth(column)};min-width:${colWidth(column)}` : column.minWidth ? `min-width:${column.minWidth}` : '',
									column.pinned ? `left:${pinnedOffset(column.id)}` : ''
								]
									.filter(Boolean)
									.join(';')}
								aria-sort={
									sortId === column.id
										? sortDir === 'asc'
											? 'ascending'
											: 'descending'
										: canSort(column)
											? 'none'
											: undefined
								}
								onclick={(e) => {
									if (e.altKey && selectColumns) {
										toggleColumn(column.id, e);
										return;
									}
									if (canSort(column)) toggleSort(column);
								}}
								oncontextmenu={(e) => {
									if (!selectColumns) return;
									e.preventDefault();
									e.stopPropagation();
									toggleColumn(column.id, e as unknown as MouseEvent);
								}}
							>
								<span class="inline-flex items-center gap-1">
									{column.header}
									{#if canSort(column)}
										<span class="text-muted" aria-hidden="true">
											{#if sortId === column.id && sortDir === 'asc'}↑
											{:else if sortId === column.id && sortDir === 'desc'}↓
											{:else}↕{/if}
										</span>
									{/if}
								</span>
								<span
									class="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-brand-500/40"
									role="separator"
									aria-orientation="vertical"
									aria-label={`Resize ${column.header}`}
									data-marquee-ignore
									onpointerdown={(e) => startResize(column.id, e)}
								></span>
							</th>
						{/each}
						{#if rowActionsEnabled}
							<th
								scope="col"
								class={['w-12 px-2', compact ? 'py-2' : 'py-2.5']}
								data-marquee-ignore
							>
								<span class="sr-only">Actions</span>
							</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#if loading}
						{#each Array.from({ length: 5 }) as _, i (i)}
							<tr>
								{#if selectable}<td class="px-2 py-2"><Skeleton class="h-4 w-4" /></td>{/if}
								{#if collapsibleEnabled}<td class="px-1 py-2"><Skeleton class="h-4 w-4" /></td>{/if}
								{#each orderedColumns as column (column.id)}
									<td class="px-3 py-2"><Skeleton class="h-4 w-full" /></td>
								{/each}
								{#if rowActionsEnabled}<td class="px-2 py-2"><Skeleton class="h-4 w-6" /></td>{/if}
							</tr>
						{/each}
					{:else if sortedRows.length === 0}
						<tr>
							<td
								class="px-3 py-10 text-center text-sm text-muted"
								colspan={Math.max(colCount, 1)}
							>
								{empty}
							</td>
						</tr>
					{:else}
						{#each sortedRows as row, index (getKey(row, index))}
							{@const rid = getKey(row, index)}
							{@const rowSelected = isRowSelected(rid)}
							{@const rowExpanded = isRowExpanded(rid)}
							{@const formats = rowFormats.get(rid) ?? { rowStyle: {}, cellStyles: {} }}
							{@const rowMark = rowMarkColor(rid)}
							<tr
								role="row"
								class={[
									'border-b border-border',
									!rowExpanded && 'last:border-b-0',
									striped && index % 2 === 1 && !formats.rowStyle.background && !rowMark && 'bg-surface-overlay/40',
									hoverable && 'hover:bg-surface-overlay/70',
									rowSelected && 'bg-brand-500/12 ring-1 ring-inset ring-brand-500/30',
									onrowclick && 'cursor-pointer'
								]}
								style={[
									rowMark && !rowSelected && !formats.rowStyle.background
										? `background:${markTint(rowMark)}`
										: '',
									styleToCss(formats.rowStyle)
								]
									.filter(Boolean)
									.join(';')}
								data-row-id={rid}
								data-marquee-id={!selectCells && marqueeEnabled ? marqueeIdForRow(rid) : undefined}
								oncontextmenu={(e) => {
									const el = e.target as HTMLElement | null;
									if (el?.closest?.('[role="gridcell"]')) return;
									const id = rowIdFromEvent(e) ?? rid;
									const colId = orderedColumns[0]?.id;
									if (colId) openContextMenuAt(e, id, colId);
								}}
							>
								{#if selectable}
									<td
										class={['px-2', compact ? 'py-1.5' : 'py-2.5', stickyHeader && 'sticky left-0 z-10 bg-inherit']}
										data-marquee-ignore
										onclick={(e) => e.stopPropagation()}
									>
										<Checkbox
											size="sm"
											class="gap-0"
											checked={rowSelected}
											aria-label={`Select row ${rid}`}
											onclick={(e) => {
												e.stopPropagation();
												toggleRow(rid, e);
											}}
										/>
									</td>
								{/if}
								{#if collapsibleEnabled}
									<td
										class={['px-1', compact ? 'py-1.5' : 'py-2.5']}
										data-marquee-ignore
										onclick={(e) => e.stopPropagation()}
									>
										<button
											type="button"
											class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-secondary hover:bg-surface-overlay hover:text-primary"
											aria-expanded={rowExpanded}
											aria-label={rowExpanded ? 'Collapse row' : 'Expand row'}
											onclick={() => toggleExpand(rid)}
										>
											<ChevronRight
												class={['h-4 w-4 transition-transform', rowExpanded && 'rotate-90']}
												strokeWidth={2}
											/>
										</button>
									</td>
								{/if}
								{#each orderedColumns as column (column.id)}
									{@const selected = isCellSelected(rid, column.id)}
									{@const cellMark = cellMarkColor(rid, column.id)}
									{@const cellStyle = {
										...formats.rowStyle,
										...(formats.cellStyles[column.id] ?? {}),
										...(cellMark &&
										!selected &&
										!formats.cellStyles[column.id]?.background
											? { background: markTint(cellMark) }
											: {})
									}}
									{@const note = notesMap.get(noteKey(rid, column.id))}
									{@const isEditing =
										editing?.rowId === rid && editing?.columnId === column.id}
									<td
										role="gridcell"
										class={[
											'group relative px-3 text-primary',
											compact ? 'py-1.5' : 'py-2.5',
											alignClass[column.align ?? 'left'],
											selected && 'ring-1 ring-inset ring-brand-500/70 bg-brand-500/15',
											column.pinned && 'sticky z-10 bg-inherit',
											column.class
										]}
										style={[
											styleToCss(cellStyle),
											colWidth(column) ? `width:${colWidth(column)};min-width:${colWidth(column)}` : '',
											column.pinned ? `left:${pinnedOffset(column.id)}` : ''
										]
											.filter(Boolean)
											.join(';')}
										data-row-id={rid}
										data-column-id={column.id}
										data-marquee-id={selectCells && marqueeEnabled
											? marqueeIdForCell(rid, column.id)
											: undefined}
										onmousedown={(e) => {
											// Avoid native text highlight while selecting cells.
											if (selectCells && e.button === 0 && !isEditing) {
												e.preventDefault();
											}
										}}
										oncontextmenu={(e) => {
											const id = rowIdFromEvent(e) ?? rid;
											const colId = columnIdFromEvent(e) ?? column.id;
											openContextMenuAt(e, id, colId);
										}}
									>
										{#if isEditing && activeEditor}
											<div
												data-marquee-ignore
												class="select-text min-w-[7rem]"
												onclick={(e) => e.stopPropagation()}
												onmousedown={(e) => e.stopPropagation()}
											>
												{#if activeEditor.type === 'boolean'}
													<Toggle
														size="sm"
														checked={editBool}
														onchange={(v) => {
															editBool = v;
															commitEdit(row);
														}}
													/>
												{:else if activeEditor.type === 'select'}
													<Select
														size="sm"
														class="w-full"
														placeholder={activeEditor.placeholder ?? 'Select…'}
														options={activeEditor.options ?? []}
														bind:value={editValue}
														onchange={() => commitEdit(row)}
													/>
												{:else if activeEditor.type === 'textarea'}
													<Textarea
														rows={2}
														class="w-full"
														placeholder={activeEditor.placeholder}
														bind:value={editValue}
														onkeydown={(e) => {
															if (e.key === 'Escape') {
																e.preventDefault();
																cancelEdit();
															} else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
																e.preventDefault();
																commitEdit(row);
															}
														}}
														onblur={() => commitEdit(row)}
													/>
												{:else if activeEditor.type === 'number'}
													<Input
														type="number"
														size="sm"
														class="gap-0! [&>div]:h-7! [&>div]:rounded-md! [&>div]:px-1.5!"
														placeholder={activeEditor.placeholder}
														min={activeEditor.min}
														max={activeEditor.max}
														step={activeEditor.step}
														bind:value={editValue}
														autofocus
														onkeydown={(e) => onEditKeydown(e, row)}
														onblur={() => commitEdit(row)}
													/>
												{:else if activeEditor.type === 'date'}
													<Input
														type="date"
														size="sm"
														class="gap-0! [&>div]:h-7! [&>div]:rounded-md! [&>div]:px-1.5!"
														bind:value={editValue}
														autofocus
														onkeydown={(e) => onEditKeydown(e, row)}
														onblur={() => commitEdit(row)}
													/>
												{:else}
													<Input
														type="text"
														size="sm"
														class="gap-0! [&>div]:h-7! [&>div]:rounded-md! [&>div]:px-1.5!"
														placeholder={activeEditor.placeholder}
														bind:value={editValue}
														autofocus
														onkeydown={(e) => onEditKeydown(e, row)}
														onblur={() => commitEdit(row)}
													/>
												{/if}
											</div>
										{:else if cell}
											{@render cell(row, column)}
										{:else}
											{formatCell(getValue(row, column))}
										{/if}

										{#if canEditColumn(column) && !isEditing}
											<button
												type="button"
												class="absolute right-1 bottom-1 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md bg-surface-elevated/95 text-secondary opacity-0 shadow-sm ring-1 ring-border/60 transition hover:bg-surface-overlay hover:text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 group-hover:opacity-100"
												aria-label={`Edit ${column.header}`}
												data-marquee-ignore
												onclick={(e) => {
													e.stopPropagation();
													startEdit(row, column, index);
												}}
											>
												<Pencil class="h-3.5 w-3.5" strokeWidth={2} />
											</button>
										{/if}

										{#if note}
											<Tooltip
												content={note.text}
												side="top"
												delay={180}
												class="absolute top-0 right-0 z-10"
											>
												<button
													type="button"
													class="relative block h-3.5 w-3.5"
													aria-label="View note"
													data-marquee-ignore
													onclick={(e) => {
														e.stopPropagation();
														openNoteEditor([{ rowId: rid, columnId: column.id }]);
													}}
												>
													<span
														class="absolute top-0 right-0 h-0 w-0 border-t-8 border-l-8 border-t-amber-500 border-l-transparent"
														aria-hidden="true"
													></span>
												</button>
											</Tooltip>
										{/if}
									</td>
								{/each}
								{#if rowActionsEnabled}
									<td
										class={['px-1', compact ? 'py-1' : 'py-1.5']}
										data-marquee-ignore
										onclick={(e) => e.stopPropagation()}
										oncontextmenu={(e) => e.stopPropagation()}
									>
										<DropdownMenu
											size="sm"
											align="end"
											label="Row actions"
											items={rowActionMenuItems}
											onselect={(id) => onRowMenuAction(id, rid)}
										>
											{#snippet trigger()}
												<!-- Content only: DropdownMenu already renders the outer <button> -->
												<span
													class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-secondary hover:bg-surface-overlay hover:text-primary"
													aria-hidden="true"
												>
													<MoreHorizontal class="h-4 w-4" strokeWidth={2} />
												</span>
											{/snippet}
										</DropdownMenu>
									</td>
								{/if}
							</tr>
							{#if collapsibleEnabled && rowExpanded}
								<tr class="border-b border-border bg-surface-overlay/40">
									<td colspan={Math.max(colCount, 1)} class="px-4 py-3">
										{#if expandedRow}
											{@render expandedRow(row, autoHiddenColumns)}
										{:else}
											<dl class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
												{#each autoHiddenColumns.length ? autoHiddenColumns : columns.filter((c) => !orderedColumns.some((o) => o.id === c.id) && !c.hidden) as col (col.id)}
													<div class="min-w-0">
														<dt class="text-[11px] font-semibold tracking-wide text-muted uppercase">
															{col.header}
														</dt>
														<dd class="mt-0.5 text-sm text-primary">
															{#if cell}
																{@render cell(row, col)}
															{:else}
																{formatCell(getValue(row, col))}
															{/if}
														</dd>
													</div>
												{:else}
													<p class="text-xs text-muted">No extra fields for this row.</p>
												{/each}
											</dl>
										{/if}
									</td>
								</tr>
							{/if}
						{/each}
					{/if}
				</tbody>
			</table>
			<MarqueeRect
				rect={marqueeRect && gridScrollEl
					? {
							x: marqueeRect.x - gridScrollEl.scrollLeft,
							y: marqueeRect.y - gridScrollEl.scrollTop,
							width: marqueeRect.width,
							height: marqueeRect.height
						}
					: null}
			/>
		</div>
		{:else}
			<!-- list / card / grid modes -->
			<div
				class={[
					'min-h-0 w-full flex-1 overflow-auto rounded-xl border border-border bg-surface-elevated p-3',
					viewMode === 'list' && 'flex flex-col gap-2',
					viewMode === 'card' && 'flex flex-col gap-3',
					viewMode === 'grid' &&
						'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
				]}
			>
				{#if loading}
					{#each Array.from({ length: 4 }) as _, i (i)}
						<Skeleton class="h-24 w-full rounded-xl" />
					{/each}
				{:else if sortedRows.length === 0}
					<p class="px-2 py-8 text-center text-sm text-muted">{empty}</p>
				{:else}
					{#each sortedRows as row, index (getKey(row, index))}
						{@const rid = getKey(row, index)}
						{@const rowSelected = isRowSelected(rid)}
						{@const rowExpanded = isRowExpanded(rid)}
						{@const title =
							titleCol
								? cellText(row as Record<string, unknown>, titleCol as DataGridColumn)
								: rid}
						{#if itemCard}
							<div
								class={rowSelected ? 'rounded-xl ring-2 ring-brand-500/50' : undefined}
								onclick={() => {
									if (selectable && selectOnClick) setSelection({ type: 'rows', ids: [rid] });
									emitRowClick(rid);
								}}
							>
								{@render itemCard(row)}
							</div>
						{:else if viewMode === 'list'}
							<div
								class={[
									'flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 transition',
									rowSelected && 'border-brand-500/40 bg-brand-500/10',
									hoverable && 'hover:bg-surface-overlay/70'
								]}
							>
								{#if selectable}
									<Checkbox
										size="sm"
										class="mt-0.5 gap-0"
										checked={rowSelected}
										aria-label={`Select ${title}`}
										onchange={(checked) => {
											if (checked) {
												const ids =
													selection.type === 'rows'
														? [...new Set([...selection.ids, rid])]
														: [rid];
												setSelection({ type: 'rows', ids });
											} else if (selection.type === 'rows') {
												const ids = selection.ids.filter((id) => id !== rid);
												setSelection(ids.length ? { type: 'rows', ids } : EMPTY_SELECTION);
											}
										}}
									/>
								{/if}
								{#if collapsibleEnabled}
									<button
										type="button"
										class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-secondary hover:bg-surface-overlay"
										aria-expanded={rowExpanded}
										onclick={() => toggleExpand(rid)}
									>
										<ChevronRight
											class={['h-4 w-4 transition-transform', rowExpanded && 'rotate-90']}
											strokeWidth={2}
										/>
									</button>
								{/if}
								<button
									type="button"
									class="min-w-0 flex-1 text-left"
									onclick={() => {
										emitRowClick(rid);
										if (selectable && selectOnClick && !rowSelected) {
											setSelection({ type: 'rows', ids: [rid] });
										}
									}}
								>
									<p class="truncate text-sm font-semibold text-primary">{title}</p>
									<p class="mt-0.5 truncate text-xs text-muted">
										{secondaryFields(row)
											.slice(0, 3)
											.map((f) => f.text)
											.filter(Boolean)
											.join(' · ')}
									</p>
									{#if rowExpanded}
										<div class="mt-2 grid gap-2 border-t border-border pt-2 sm:grid-cols-2">
											{#if expandedRow}
												{@render expandedRow(row, autoHiddenColumns)}
											{:else}
												{#each secondaryFields(row) as field (field.column.id)}
													<div>
														<p class="text-[11px] font-semibold text-muted uppercase">
															{field.column.header}
														</p>
														<p class="text-sm text-primary">{field.text}</p>
													</div>
												{/each}
											{/if}
										</div>
									{/if}
								</button>
							</div>
						{:else}
							<Card
								variant="bordered"
								padding="sm"
								hoverable
								class={rowSelected ? 'ring-2 ring-brand-500/50' : ''}
								onclick={() => {
									if (selectable && selectOnClick) setSelection({ type: 'rows', ids: [rid] });
									emitRowClick(rid);
								}}
							>
								{#snippet header()}
									<div class="flex items-start justify-between gap-2">
										<p class="truncate text-sm font-semibold text-primary">{title}</p>
										{#if collapsibleEnabled}
											<button
												type="button"
												class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-secondary hover:bg-surface-overlay"
												aria-expanded={rowExpanded}
												onclick={(e) => {
													e.stopPropagation();
													toggleExpand(rid);
												}}
											>
												<ChevronRight
													class={['h-4 w-4 transition-transform', rowExpanded && 'rotate-90']}
													strokeWidth={2}
												/>
											</button>
										{/if}
									</div>
								{/snippet}
								<div class="space-y-1.5">
									{#each secondaryFields(row).slice(0, viewMode === 'grid' ? 3 : 5) as field (field.column.id)}
										<div class="flex items-baseline justify-between gap-2 text-xs">
											<span class="text-muted">{field.column.header}</span>
											<span class="truncate font-medium text-primary">{field.text}</span>
										</div>
									{/each}
									{#if rowExpanded}
										<div class="border-t border-border pt-2">
											{#if expandedRow}
												{@render expandedRow(row, autoHiddenColumns)}
											{:else}
												{#each autoHiddenColumns as col (col.id)}
													<div class="flex justify-between gap-2 py-0.5 text-xs">
														<span class="text-muted">{col.header}</span>
														<span class="text-primary">{formatCell(getValue(row, col))}</span>
													</div>
												{/each}
											{/if}
										</div>
									{/if}
								</div>
							</Card>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}

		{#if noteTargets || markPickerOpen || (showDock && dockCount > 0)}
			<!-- Fixed to the viewport (portaled) so parent relative/overflow don't shift the dock. -->
			<div
				{@attach portalToBody}
				class="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-3"
			>
				<div class="relative w-full max-w-2xl">
					{#if noteTargets}
						{@const count = noteTargets.length}
						{@const existingCount = noteTargets.filter((t) =>
							notesMap.has(noteKey(t.rowId, t.columnId))
						).length}
						<div
							class="pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-surface-elevated p-3 shadow-xl"
							role="dialog"
							aria-label={existingCount ? 'Edit note' : 'Add note'}
						>
							<p class="text-xs font-semibold text-primary">
								{existingCount ? 'Edit note' : 'Add note'}
							</p>
							<p class="mt-0.5 text-[11px] text-muted">
								{#if count === 1}
									{noteTargets[0].rowId} / {noteTargets[0].columnId}
								{:else}
									{count} cells
								{/if}
							</p>
							<textarea
								class="mt-2 h-24 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs"
								bind:value={noteDraft}
								placeholder="Write a note…"
							></textarea>
							<div class="mt-2 flex justify-end gap-1.5">
								<Button size="xs" variant="ghost" onclick={closeNoteEditor}>Cancel</Button>
								{#if existingCount}
									<Button
										size="xs"
										variant="ghost"
										onclick={() => {
											noteDraft = '';
											saveNotes();
										}}>Delete</Button
									>
								{/if}
								<Button size="xs" variant="primary" onclick={saveNotes}>Save</Button>
							</div>
						</div>
					{:else if markPickerOpen && markTargets}
						{@const count = markTargets.length}
						{@const existingCount = markTargets.filter((t) =>
							marksMap.has(markKey(t.rowId, t.columnId))
						).length}
						<div
							class="pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-surface-elevated p-3 shadow-xl"
							role="dialog"
							aria-label="Mark color"
						>
							<p class="text-xs font-semibold text-primary">Mark</p>
							<p class="mt-0.5 text-[11px] text-muted">
								{#if count === 1}
									{#if markTargets[0].columnId}
										{markTargets[0].rowId} / {markTargets[0].columnId}
									{:else}
										Row {markTargets[0].rowId}
									{/if}
								{:else}
									{count} targets
								{/if}
							</p>
							<div class="mt-3 flex flex-wrap items-center justify-center gap-2">
								{#each MARK_COLORS as color (color)}
									<button
										type="button"
										class="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-black/10 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
										style="background:{markSwatch(color)}"
										aria-label={`Mark ${color}`}
										onclick={() => applyMarkColor(color)}
									></button>
								{/each}
							</div>
							<div class="mt-3 flex items-end gap-2">
								<div class="min-w-0 flex-1">
									<ColorPicker
										label="Custom"
										bind:value={markCustomColor}
										format="hex"
										showSwatches={false}
									/>
								</div>
								<Button size="xs" variant="secondary" onclick={applyCustomMarkColor}
									>Apply</Button
								>
							</div>
							<div class="mt-3 flex justify-end gap-1.5">
								<Button size="xs" variant="ghost" onclick={closeMarkPicker}>Cancel</Button>
								{#if existingCount}
									<Button size="xs" variant="ghost" onclick={() => clearMarksForTargets(markTargets ?? undefined)}
										>Clear</Button
									>
								{/if}
							</div>
						</div>
					{/if}

					{#if showDock && dockCount > 0}
						<div class="pointer-events-auto">
							<BulkActionBar
								count={dockCount}
								total={selection.type === 'rows' ? rowIds.length : undefined}
								itemLabel={dockLabels.itemLabel}
								itemLabelPlural={dockLabels.itemLabelPlural}
								placement="dock"
								sticky={false}
								actions={defaultActions}
								{leading}
								extra={dockExtra}
								onaction={handleDockAction}
								onclear={clearSelection}
								onselectall={selection.type === 'rows'
									? () => setSelection({ type: 'rows', ids: [...rowIds] })
									: undefined}
							/>
						</div>
					{:else}
						<!-- Anchor so the note/mark popover sits above the dock baseline. -->
						<div class="h-0 w-full" aria-hidden="true"></div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/snippet}

{#if contextMenuEnabled}
	{@render gridBody()}
	{#if contextOpen && contextAnchor}
		{@const ax = contextAnchor.x}
		{@const ay = contextAnchor.y}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			{@attach portalToBody}
			role="menu"
			tabindex={-1}
			aria-label="Context menu"
			style={`position:fixed;top:${ay}px;left:${ax}px;z-index:9999;`}
			class="min-w-44 rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
			onpointerdown={(e) => e.stopPropagation()}
		>
			{#each contextMenuItems as item (item.id)}
				{#if item.separator}
					<div class="my-1 h-px bg-border" role="separator"></div>
				{:else}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						role="menuitem"
						tabindex={-1}
						aria-disabled={item.disabled || undefined}
						onclick={() => {
							if (item.disabled) return;
							onContextMenuPick(item.id);
						}}
						class={[
							'flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface-overlay',
							item.disabled && 'cursor-not-allowed opacity-40',
							item.destructive ? 'text-red-600 dark:text-red-400' : 'text-primary'
						]}
					>
						<span class="truncate">{item.label}</span>
						{#if item.shortcut}
							<kbd
								class="shrink-0 rounded border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] text-secondary"
							>
								{item.shortcut}
							</kbd>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
{:else}
	{@render gridBody()}
{/if}
