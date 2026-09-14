import type { CanvasLayerKind } from './canvasDocument.js';

export interface CanvasSvgShape {
	viewBox: { w: number; h: number };
	d: string;
	/** SVG preserveAspectRatio meet (uniform) vs none (stretch). */
	meet: boolean;
	fill: string;
}

function polygonPath(points: string): string {
	const nums = points
		.trim()
		.split(/[\s,]+/)
		.map(Number)
		.filter((n) => Number.isFinite(n));
	const cmds: string[] = [];
	for (let i = 0; i + 1 < nums.length; i += 2) {
		cmds.push(`${i === 0 ? 'M' : 'L'}${nums[i]} ${nums[i + 1]}`);
	}
	return `${cmds.join(' ')} Z`;
}

/** Stage + export share the same SVG paths so PNG matches the canvas. */
export const CANVAS_SVG_SHAPES: Partial<Record<CanvasLayerKind, CanvasSvgShape>> = {
	triangle: {
		viewBox: { w: 100, h: 100 },
		d: polygonPath('50,4 96,96 4,96'),
		meet: false,
		fill: '#f59e0b'
	},
	star: {
		viewBox: { w: 100, h: 100 },
		d: polygonPath('50,5 61,38 96,38 68,59 79,92 50,72 21,92 32,59 4,38 39,38'),
		meet: true,
		fill: '#ef4444'
	},
	hexagon: {
		viewBox: { w: 100, h: 100 },
		d: polygonPath('25,5 75,5 95,50 75,95 25,95 5,50'),
		meet: false,
		fill: '#06b6d4'
	},
	pentagon: {
		viewBox: { w: 100, h: 100 },
		d: polygonPath('50,5 95,38 78,95 22,95 5,38'),
		meet: true,
		fill: '#a855f7'
	},
	diamond: {
		viewBox: { w: 100, h: 100 },
		d: polygonPath('50,4 96,50 50,96 4,50'),
		meet: false,
		fill: '#f43f5e'
	},
	heart: {
		viewBox: { w: 24, h: 24 },
		d: 'M12 21s-6.7-4.35-9.33-7.6C.5 10.8 1.1 7.1 3.9 5.5 6.1 4.25 8.55 5 12 8.1c3.45-3.1 5.9-3.85 8.1-2.6 2.8 1.6 3.4 5.3 1.23 7.9C18.7 16.65 12 21 12 21z',
		meet: true,
		fill: '#ec4899'
	}
};

export function svgShapeFit(
	box: { w: number; h: number },
	viewBox: { w: number; h: number },
	meet: boolean
): { tx: number; ty: number; sx: number; sy: number } {
	const sx = box.w / Math.max(1, viewBox.w);
	const sy = box.h / Math.max(1, viewBox.h);
	if (!meet) return { tx: 0, ty: 0, sx, sy };
	const s = Math.min(sx, sy);
	return {
		tx: (box.w - viewBox.w * s) / 2,
		ty: (box.h - viewBox.h * s) / 2,
		sx: s,
		sy: s
	};
}

export function drawCanvasSvgShape(
	ctx: CanvasRenderingContext2D,
	rect: { x: number; y: number; w: number; h: number },
	shape: CanvasSvgShape,
	fill: string | undefined,
	stroke: string | undefined,
	strokeWidth: number | undefined
) {
	const fit = svgShapeFit(rect, shape.viewBox, shape.meet);
	const path = new Path2D(shape.d);
	ctx.save();
	ctx.translate(rect.x + fit.tx, rect.y + fit.ty);
	ctx.scale(fit.sx, fit.sy);
	const paint = fill ?? shape.fill;
	if (paint) {
		ctx.fillStyle = paint;
		ctx.fill(path);
	}
	if (stroke && (strokeWidth ?? 0) > 0) {
		ctx.strokeStyle = stroke;
		ctx.lineWidth = strokeWidth ?? 0;
		ctx.stroke(path);
	}
	ctx.restore();
}
