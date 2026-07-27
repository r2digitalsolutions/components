import type { DataGridColumn, DataGridEditConfig } from './types.js';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T|\s|$)/;

/** Infer a compact editor from the current cell value. */
export function inferCellEditor(value: unknown): DataGridEditConfig {
	if (typeof value === 'boolean') return { type: 'boolean' };
	if (typeof value === 'number' && !Number.isNaN(value)) return { type: 'number' };
	if (value instanceof Date && !Number.isNaN(value.getTime())) return { type: 'date' };
	if (typeof value === 'string') {
		if (ISO_DATE_RE.test(value)) return { type: 'date' };
		if (value.length > 80 || value.includes('\n')) return { type: 'textarea' };
	}
	return { type: 'text' };
}

/** Prefer explicit `column.edit`, otherwise infer from value. */
export function resolveCellEditor<T>(
	column: DataGridColumn<T>,
	value: unknown
): DataGridEditConfig {
	if (column.edit?.type) {
		return {
			...column.edit,
			options: column.edit.options ?? []
		};
	}
	return inferCellEditor(value);
}

/** Coerce editor draft → value typed for `oncelledit`. */
export function coerceEditValue(
	editor: DataGridEditConfig,
	draft: string | number | boolean
): string | number | boolean | null {
	switch (editor.type) {
		case 'boolean':
			return Boolean(draft);
		case 'number': {
			if (draft === '' || draft == null) return null;
			const n = typeof draft === 'number' ? draft : Number(draft);
			return Number.isFinite(n) ? n : null;
		}
		case 'date':
		case 'select':
		case 'textarea':
		case 'text':
		default:
			return draft == null ? '' : String(draft);
	}
}

export function draftFromValue(value: unknown, editor: DataGridEditConfig): string | boolean {
	if (editor.type === 'boolean') return Boolean(value);
	if (value == null) return '';
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}
	if (editor.type === 'date' && typeof value === 'string') {
		return value.slice(0, 10);
	}
	return String(value);
}
