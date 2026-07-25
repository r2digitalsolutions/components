/** Shared SVG chart geometry helpers (ported from Atom progreso / check-in). */

export interface ChartXY {
	x: number;
	y: number;
	value: number;
	index: number;
}

export interface ChartPad {
	t: number;
	r: number;
	b: number;
	l: number;
}

export const DEFAULT_PAD: ChartPad = { t: 16, r: 12, b: 28, l: 36 };

export function scaleDomain(values: number[], padRatio = 0.08): { min: number; max: number } {
	if (values.length === 0) return { min: 0, max: 1 };
	let min = Math.min(...values);
	let max = Math.max(...values);
	if (min === max) {
		const bump = min === 0 ? 1 : Math.abs(min) * 0.05 || 1;
		min -= bump;
		max += bump;
	}
	const span = max - min;
	return { min: min - span * padRatio, max: max + span * padRatio };
}

export function mapPoints(
	values: number[],
	width: number,
	height: number,
	pad: ChartPad = DEFAULT_PAD,
	domain?: { min: number; max: number }
): ChartXY[] {
	if (values.length === 0) return [];
	const { min, max } = domain ?? scaleDomain(values);
	const range = max - min || 1;
	const innerW = width - pad.l - pad.r;
	const innerH = height - pad.t - pad.b;
	const span = Math.max(values.length - 1, 1);

	return values.map((value, index) => {
		const x = values.length === 1 ? pad.l + innerW / 2 : pad.l + (index / span) * innerW;
		const y = pad.t + (1 - (value - min) / range) * innerH;
		return { x, y, value, index };
	});
}

/** Smooth cubic path (Atom progreso style). */
export function smoothLinePath(points: ChartXY[]): string {
	if (points.length === 0) return '';
	if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
	return points.reduce((acc, p, idx) => {
		if (idx === 0) return `M ${p.x} ${p.y}`;
		const prev = points[idx - 1];
		const cpX = (prev.x + p.x) / 2;
		return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
	}, '');
}

export function linearLinePath(points: ChartXY[]): string {
	return points
		.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
		.join(' ');
}

export function areaPath(linePath: string, points: ChartXY[], height: number, pad: ChartPad): string {
	if (!linePath || points.length === 0) return '';
	const bottom = height - pad.b;
	const startX = points[0].x;
	const endX = points[points.length - 1].x;
	return `${linePath} L ${endX} ${bottom} L ${startX} ${bottom} Z`;
}

export function tipAlign(leftPct: number): 'start' | 'center' | 'end' {
	if (leftPct < 28) return 'start';
	if (leftPct > 72) return 'end';
	return 'center';
}

export function formatTick(n: number, digits = 1): string {
	if (Math.abs(n) >= 100) return String(Math.round(n));
	return n.toFixed(digits).replace(/\.0$/, '');
}
