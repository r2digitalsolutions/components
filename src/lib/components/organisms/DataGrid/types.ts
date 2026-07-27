export interface DataGridColumn<Row = Record<string, unknown>> {
	id: string;
	header: string;
	/** Dot-path key on the row, or custom render via `cell` snippet. */
	accessor?: keyof Row | string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	width?: string;
	minWidth?: string;
	pinned?: boolean;
	hidden?: boolean;
	/**
	 * Auto-hide this column below the breakpoint (still available in row collapse
	 * and non-table view modes as secondary fields).
	 */
	hideBelow?: Breakpoint;
	/** Include in FilterBar quick-filter dropdown. */
	filterable?: boolean;
	editable?: boolean;
	/** Typed inline editor. When omitted, inferred from the cell value. */
	edit?: DataGridEditConfig;
	class?: string;
	/** Free-form metadata for consumers / ResourceStudio */
	meta?: Record<string, unknown>;
}

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

export type DataGridViewMode = 'table' | 'list' | 'card' | 'grid';

export interface DataGridFilter {
	id: string;
	columnId: string;
	value: string;
	/** Default `contains`. */
	op?: 'contains' | 'eq';
	label?: string;
}

export type DataGridEditType =
	| 'text'
	| 'number'
	| 'textarea'
	| 'boolean'
	| 'select'
	| 'date';

export interface DataGridEditOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface DataGridEditConfig {
	type: DataGridEditType;
	/** For `select` */
	options?: DataGridEditOption[];
	placeholder?: string;
	min?: number;
	max?: number;
	step?: number;
}

export interface CellRef {
	rowId: string;
	columnId: string;
}

export type GridSelection =
	| { type: 'none' }
	| { type: 'rows'; ids: string[] }
	| { type: 'columns'; ids: string[] }
	| { type: 'cells'; cells: CellRef[] };

export interface CellNote {
	rowId: string;
	columnId: string;
	text: string;
	author?: string;
	updatedAt?: string;
}

export type MarkPreset =
	| 'amber'
	| 'rose'
	| 'sky'
	| 'emerald'
	| 'violet'
	| 'orange'
	| 'lime'
	| 'cyan'
	| 'fuchsia'
	| 'slate'
	| 'pink'
	| 'indigo';

/** Named preset or any CSS color string (e.g. `#ff5500`). */
export type MarkColor = MarkPreset | (string & {});

export interface GridMark {
	rowId: string;
	/** Present = cell mark; absent = whole-row mark */
	columnId?: string;
	color: MarkColor;
}

export type FormatTarget = 'row' | 'cell';

export type FormatCondition =
	| { op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; columnId: string; value: string | number | boolean }
	| { op: 'contains' | 'startsWith'; columnId: string; value: string }
	| { op: 'empty' | 'notEmpty'; columnId: string }
	| { op: 'between'; columnId: string; min: number; max: number };

export interface ConditionalFormatStyle {
	background?: string;
	color?: string;
	fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
	border?: string;
}

export interface ConditionalFormatRule {
	id: string;
	name?: string;
	enabled: boolean;
	target: FormatTarget;
	/** Required when target === 'cell' */
	columnId?: string;
	when: FormatCondition;
	style: ConditionalFormatStyle;
	priority: number;
}

export type SortDir = 'asc' | 'desc' | null;

export const EMPTY_SELECTION: GridSelection = { type: 'none' };

export function noteKey(rowId: string, columnId: string): string {
	return `${rowId}::${columnId}`;
}

export function markKey(rowId: string, columnId?: string): string {
	return columnId ? `${rowId}::${columnId}` : `${rowId}::*`;
}

export function selectionCount(selection: GridSelection): number {
	if (selection.type === 'none') return 0;
	if (selection.type === 'rows' || selection.type === 'columns') return selection.ids.length;
	return selection.cells.length;
}

export function selectionLabel(selection: GridSelection): { itemLabel: string; itemLabelPlural: string } {
	if (selection.type === 'columns') return { itemLabel: 'column', itemLabelPlural: 'columns' };
	if (selection.type === 'cells') return { itemLabel: 'cell', itemLabelPlural: 'cells' };
	return { itemLabel: 'row', itemLabelPlural: 'rows' };
}
