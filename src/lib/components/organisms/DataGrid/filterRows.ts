import type { DataGridColumn, DataGridFilter } from './types.js';
import { resolveAccessor } from '$lib/utils/columnAccessor.js';

export function cellText(row: Record<string, unknown>, column: DataGridColumn): string {
	const value = resolveAccessor(row, column.accessor, column.id);
	if (value == null) return '';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	return String(value);
}

/** Client-side search + equality/contains filters. */
export function filterRows<T extends Record<string, unknown>>(
	rows: T[],
	columns: DataGridColumn<T>[],
	query: string,
	filters: DataGridFilter[]
): T[] {
	const q = query.trim().toLowerCase();
	return rows.filter((row) => {
		const record = row as Record<string, unknown>;
		if (q) {
			const hit = columns.some((col) => cellText(record, col as DataGridColumn).toLowerCase().includes(q));
			if (!hit) return false;
		}
		for (const f of filters) {
			const col = columns.find((c) => c.id === f.columnId);
			if (!col) continue;
			const text = cellText(record, col as DataGridColumn).toLowerCase();
			const needle = f.value.trim().toLowerCase();
			if (!needle) continue;
			if (f.op === 'eq') {
				if (text !== needle) return false;
			} else if (!text.includes(needle)) {
				return false;
			}
		}
		return true;
	});
}

export function uniqueColumnValues<T extends Record<string, unknown>>(
	rows: T[],
	column: DataGridColumn<T>,
	limit = 24
): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const row of rows) {
		const text = cellText(row as Record<string, unknown>, column as DataGridColumn);
		if (!text || seen.has(text)) continue;
		seen.add(text);
		out.push(text);
		if (out.length >= limit) break;
	}
	return out.sort((a, b) => a.localeCompare(b));
}
