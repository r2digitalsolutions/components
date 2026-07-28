export const WIDGET_CANVAS_CONTEXT = Symbol('widget-canvas');

export interface WidgetRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface WidgetCanvasBounds {
	width: number;
	height: number;
}

export interface WidgetCanvasContext {
	readonly showGrid: boolean;
	readonly snap: boolean;
	readonly cellSize: number;
	readonly autoCells: number;
	readonly cellSizeMode: 'fixed' | 'auto';
	/** Visual scale of the board (screen px / board px). Default 1. */
	readonly scale?: number;
	getBounds: () => WidgetCanvasBounds;
	snapValue: (value: number) => number;
	snapRect: (rect: WidgetRect, minW: number, minH: number) => WidgetRect;
	clampRect: (rect: WidgetRect, minW: number, minH: number) => WidgetRect;
}

/** Tamaño de celda cuadrada para que quepan `autoCells` en el eje más corto del viewport */
export function computeAutoCellSize(
	boundsW: number,
	boundsH: number,
	autoCells: number
): number {
	const n = Math.max(1, Math.floor(autoCells));
	if (boundsW <= 0 || boundsH <= 0) return 24;
	const raw = Math.floor(Math.min(boundsW, boundsH) / n);
	return Math.max(8, raw);
}

/** Tablero exacto N×N celdas dentro del viewport (sin cortes) — fit/fullscreen */
export function fitBoardToAutoCells(
	viewportW: number,
	viewportH: number,
	autoCells: number
): { width: number; height: number; cellSize: number } {
	const cellSize = computeAutoCellSize(viewportW, viewportH, autoCells);
	const n = Math.max(1, Math.floor(autoCells));
	return {
		cellSize,
		width: cellSize * n,
		height: cellSize * n
	};
}

/**
 * Scroll + auto: celda según viewport visible; tablero = múltiplos de celda
 * a partir de width/height deseados (sigue habiendo scroll).
 */
export function scrollBoardToAutoCells(
	viewportW: number,
	viewportH: number,
	desiredW: number,
	desiredH: number,
	autoCells: number
): { width: number; height: number; cellSize: number } {
	const cellSize = computeAutoCellSize(viewportW, viewportH, autoCells);
	const width = Math.max(cellSize * autoCells, Math.ceil(desiredW / cellSize) * cellSize);
	const height = Math.max(cellSize * autoCells, Math.ceil(desiredH / cellSize) * cellSize);
	return { cellSize, width, height };
}

export function snapToGrid(value: number, cellSize: number, enabled: boolean): number {
	if (!enabled || cellSize <= 0) return value;
	return Math.round(value / cellSize) * cellSize;
}

export function snapWidgetRect(
	rect: WidgetRect,
	cellSize: number,
	enabled: boolean,
	minW: number,
	minH: number
): WidgetRect {
	if (!enabled || cellSize <= 0) {
		return {
			...rect,
			w: Math.max(minW, rect.w),
			h: Math.max(minH, rect.h)
		};
	}

	const x = snapToGrid(rect.x, cellSize, true);
	const y = snapToGrid(rect.y, cellSize, true);
	const w = Math.max(minW, snapToGrid(rect.w, cellSize, true) || cellSize);
	const h = Math.max(minH, snapToGrid(rect.h, cellSize, true) || cellSize);
	return { x, y, w, h };
}

export function clampWidgetRect(
	rect: WidgetRect,
	bounds: WidgetCanvasBounds,
	minW: number,
	minH: number
): WidgetRect {
	const w = Math.min(Math.max(minW, rect.w), bounds.width);
	const h = Math.min(Math.max(minH, rect.h), bounds.height);
	const x = Math.max(0, Math.min(rect.x, Math.max(0, bounds.width - w)));
	const y = Math.max(0, Math.min(rect.y, Math.max(0, bounds.height - h)));
	return { x, y, w, h };
}
