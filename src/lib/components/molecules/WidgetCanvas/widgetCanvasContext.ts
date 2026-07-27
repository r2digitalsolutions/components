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
	getBounds: () => WidgetCanvasBounds;
	snapValue: (value: number) => number;
	snapRect: (rect: WidgetRect, minW: number, minH: number) => WidgetRect;
	clampRect: (rect: WidgetRect, minW: number, minH: number) => WidgetRect;
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
