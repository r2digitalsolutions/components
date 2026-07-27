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

export type GridResizeEdge = 'se' | 'e' | 's' | 'sw' | 'w' | 'ne' | 'n' | 'nw';

/**
 * Compute next x/y/w/h when dragging a resize edge/corner.
 * Anchors the opposite side for west/north edges.
 */
export function resizeItemByEdge(
	item: Pick<GridItem, 'x' | 'y' | 'w' | 'h' | 'minW' | 'minH' | 'maxW' | 'maxH'>,
	edge: GridResizeEdge,
	dx: number,
	dy: number,
	cols: number = DEFAULT_COLS
): Pick<GridItem, 'x' | 'y' | 'w' | 'h'> {
	const minW = item.minW ?? 1;
	const minH = item.minH ?? 1;
	const maxW = item.maxW ?? cols;
	const maxH = item.maxH ?? 50;

	let x = item.x;
	let y = item.y;
	let w = item.w;
	let h = item.h;

	const fromEast = edge === 'e' || edge === 'ne' || edge === 'se';
	const fromWest = edge === 'w' || edge === 'nw' || edge === 'sw';
	const fromSouth = edge === 's' || edge === 'se' || edge === 'sw';
	const fromNorth = edge === 'n' || edge === 'ne' || edge === 'nw';

	if (fromEast) w = item.w + dx;
	if (fromWest) {
		w = item.w - dx;
		x = item.x + dx;
	}
	if (fromSouth) h = item.h + dy;
	if (fromNorth) {
		h = item.h - dy;
		y = item.y + dy;
	}

	// Keep min size by pinning the opposite edge
	if (w < minW) {
		if (fromWest) x = item.x + item.w - minW;
		w = minW;
	}
	if (h < minH) {
		if (fromNorth) y = item.y + item.h - minH;
		h = minH;
	}

	if (w > maxW) {
		if (fromWest) x = item.x + item.w - maxW;
		w = maxW;
	}
	if (h > maxH) {
		if (fromNorth) y = item.y + item.h - maxH;
		h = maxH;
	}

	// Clamp to grid bounds while preserving the anchored edge
	if (x < 0) {
		if (fromWest) w += x;
		x = 0;
	}
	if (y < 0) {
		if (fromNorth) h += y;
		y = 0;
	}
	if (x + w > cols) {
		if (fromEast) w = cols - x;
		else if (fromWest) {
			x = cols - w;
			if (x < 0) {
				w += x;
				x = 0;
			}
		} else {
			w = cols - x;
		}
	}

	w = Math.max(minW, Math.min(maxW, w, cols));
	h = Math.max(minH, Math.min(maxH, h));
	x = Math.max(0, Math.min(x, cols - w));
	y = Math.max(0, y);

	return { x, y, w, h };
}

/**
 * Scale X/W when the column count changes so widgets keep relative proportions.
 */
export function rescaleLayout(
	layout: GridItem[],
	fromCols: number,
	toCols: number,
	options: LayoutGridOptions = {}
): GridItem[] {
	if (toCols <= 0) return layout;
	if (fromCols <= 0 || fromCols === toCols) {
		const clamped = layout.map((it) => clampItem(it, toCols));
		return options.compact === false ? clamped : compactLayout(clamped, toCols);
	}

	const scale = toCols / fromCols;
	const next = layout.map((it) => {
		const w = Math.max(it.minW ?? 1, Math.round(it.w * scale));
		const x = Math.round(it.x * scale);
		return clampItem({ ...it, x, w }, toCols);
	});

	return options.compact === false ? next : compactLayout(next, toCols);
}

export type GridDensity = 'comfortable' | 'default' | 'compact' | 'dense';

export const GRID_DENSITY: Record<
	GridDensity,
	{ cols: number; rowHeight: number; gap: number }
> = {
	comfortable: { cols: 12, rowHeight: 96, gap: 16 },
	default: { cols: 12, rowHeight: 80, gap: 12 },
	compact: { cols: 12, rowHeight: 64, gap: 8 },
	dense: { cols: 12, rowHeight: 52, gap: 6 }
};
