import { describe, expect, it } from 'vitest';
import { CANVAS_SVG_SHAPES, svgShapeFit } from './canvasShapes.js';

describe('svgShapeFit', () => {
	it('stretches when meet is off', () => {
		expect(svgShapeFit({ w: 200, h: 100 }, { w: 100, h: 100 }, false)).toEqual({
			tx: 0,
			ty: 0,
			sx: 2,
			sy: 1
		});
	});

	it('letterboxes a heart in a wide box like SVG meet', () => {
		const fit = svgShapeFit({ w: 200, h: 180 }, { w: 24, h: 24 }, true);
		expect(fit.sx).toBe(fit.sy);
		expect(fit.sx).toBe(180 / 24);
		expect(fit.ty).toBe(0);
		expect(fit.tx).toBe((200 - 180) / 2);
	});
});

describe('CANVAS_SVG_SHAPES', () => {
	it('keeps the stage heart path', () => {
		expect(CANVAS_SVG_SHAPES.heart?.d).toContain('M12 21');
		expect(CANVAS_SVG_SHAPES.heart?.meet).toBe(true);
	});
});
