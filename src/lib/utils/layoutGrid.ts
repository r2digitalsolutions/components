/**
 * Pure helpers for editable dashboard grid layouts (react-grid-layout style).
 */

export interface GridItem {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
	maxW?: number;
	maxH?: number;
	static?: boolean;
}

export interface LayoutGridOptions {
	cols?: number;
	/** Vertical compaction after move/resize */
	compact?: boolean;
}

export const DEFAULT_COLS = 12;
export const DEFAULT_ROW_HEIGHT = 80;
export const DEFAULT_GAP = 12;

export function clampItem(item: GridItem, cols: number = DEFAULT_COLS): GridItem {
	const minW = item.minW ?? 1;
	const minH = item.minH ?? 1;
	const maxW = item.maxW ?? cols;
	const maxH = item.maxH ?? 50;
	const w = Math.max(minW, Math.min(maxW, item.w, cols));
	const h = Math.max(minH, Math.min(maxH, item.h));
	const x = Math.max(0, Math.min(item.x, cols - w));
	const y = Math.max(0, item.y);
	return { ...item, x, y, w, h, minW, minH, maxW, maxH };
}

export function rectsOverlap(a: GridItem, b: GridItem): boolean {
	return !(
		a.x + a.w <= b.x ||
		b.x + b.w <= a.x ||
		a.y + a.h <= b.y ||
		b.y + b.h <= a.y
	);
}

export function findCollisions(layout: GridItem[], item: GridItem): GridItem[] {
	return layout.filter((other) => other.id !== item.id && rectsOverlap(item, other));
}

/** Push colliding items down (simple collision resolution). */
export function resolveCollisions(
	layout: GridItem[],
	moved: GridItem,
	cols: number = DEFAULT_COLS
): GridItem[] {
	const next = layout.map((it) => (it.id === moved.id ? clampItem(moved, cols) : { ...it }));
	const idx = next.findIndex((it) => it.id === moved.id);
	if (idx < 0) return next;

	const sorted = [...next].sort((a, b) => a.y - b.y || a.x - b.x);
	const result: GridItem[] = [];

	for (const item of sorted) {
		let current = clampItem(item, cols);
		if (current.static) {
			result.push(current);
			continue;
		}
		let safety = 0;
		while (result.some((other) => rectsOverlap(current, other)) && safety < 200) {
			const blocker = result.find((other) => rectsOverlap(current, other))!;
			current = { ...current, y: blocker.y + blocker.h };
			safety++;
		}
		result.push(current);
	}

	return result;
}

/** Compact items upward to remove vertical gaps. */
export function compactLayout(layout: GridItem[], cols: number = DEFAULT_COLS): GridItem[] {
	const sorted = [...layout]
		.map((it) => clampItem(it, cols))
		.sort((a, b) => a.y - b.y || a.x - b.x);
	const placed: GridItem[] = [];

	for (const item of sorted) {
		if (item.static) {
			placed.push(item);
			continue;
		}
		let y = 0;
		let candidate = { ...item, y };
		while (placed.some((other) => rectsOverlap(candidate, other))) {
			y++;
			candidate = { ...item, y };
		}
		placed.push(candidate);
	}

	return placed;
}

export function updateItem(
	layout: GridItem[],
	id: string,
	patch: Partial<GridItem>,
	options: LayoutGridOptions = {}
): GridItem[] {
	const cols = options.cols ?? DEFAULT_COLS;
	const current = layout.find((it) => it.id === id);
	if (!current) return layout;
	const moved = clampItem({ ...current, ...patch, id }, cols);
	let next = resolveCollisions(layout, moved, cols);
	if (options.compact !== false) next = compactLayout(next, cols);
	return next;
}

export function addItem(
	layout: GridItem[],
	item: GridItem,
	options: LayoutGridOptions = {}
): GridItem[] {
	const cols = options.cols ?? DEFAULT_COLS;
	const next = [...layout, clampItem(item, cols)];
	return options.compact === false ? next : compactLayout(next, cols);
}

export function removeItem(layout: GridItem[], id: string, options: LayoutGridOptions = {}): GridItem[] {
	const cols = options.cols ?? DEFAULT_COLS;
	const next = layout.filter((it) => it.id !== id);
	return options.compact === false ? next : compactLayout(next, cols);
}

export function serializeLayout(layout: GridItem[]): string {
	return JSON.stringify(layout);
}

export function parseLayout(json: string): GridItem[] {
	try {
		const data = JSON.parse(json) as unknown;
		if (!Array.isArray(data)) return [];
		return data
			.filter(
				(it): it is GridItem =>
					typeof it === 'object' &&
					it !== null &&
					typeof (it as GridItem).id === 'string' &&
					typeof (it as GridItem).x === 'number' &&
					typeof (it as GridItem).y === 'number' &&
					typeof (it as GridItem).w === 'number' &&
					typeof (it as GridItem).h === 'number'
			)
			.map((it) => clampItem(it));
	} catch {
		return [];
	}
}

export function layoutBounds(layout: GridItem[]): { cols: number; rows: number } {
	let cols = 0;
	let rows = 0;
	for (const it of layout) {
		cols = Math.max(cols, it.x + it.w);
		rows = Math.max(rows, it.y + it.h);
	}
	return { cols, rows };
}
