export type ColumnAccessor<Row> =
	| keyof Row
	| string
	| ((row: Row) => unknown);

export type RowKey<Row> = keyof Row | string | ((row: Row, index: number) => string);

function getByPath(row: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce<unknown>((acc, part) => {
		if (acc && typeof acc === 'object' && part in (acc as object)) {
			return (acc as Record<string, unknown>)[part];
		}
		return undefined;
	}, row);
}

/** Resolve a column value from a function, keyof, or dot-path accessor. */
export function resolveAccessor<Row>(
	row: Row,
	accessor: ColumnAccessor<Row> | undefined,
	fallbackId: string
): unknown {
	if (typeof accessor === 'function') return accessor(row);
	const key = String(accessor ?? fallbackId);
	return getByPath(row as Record<string, unknown>, key);
}

/** Resolve a stable row id (supports function, keyof, and dotted paths like `profile.id`). */
export function resolveRowKey<Row>(
	row: Row,
	rowKey: RowKey<Row> | undefined,
	index: number
): string {
	if (typeof rowKey === 'function') return rowKey(row, index);
	if (rowKey != null && rowKey !== '') {
		const val = getByPath(row as Record<string, unknown>, String(rowKey));
		if (val != null) return String(val);
	}
	if (row && typeof row === 'object' && 'id' in row && (row as { id: unknown }).id != null) {
		return String((row as { id: unknown }).id);
	}
	return String(index);
}

/** Field key for patches — functions can't be keys, so fall back to column id. */
export function accessorPatchKey(accessor: unknown, fallbackId: string): string {
	if (typeof accessor === 'function' || accessor == null) return fallbackId;
	return String(accessor);
}
