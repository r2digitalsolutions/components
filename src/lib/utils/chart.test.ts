import { describe, expect, it } from 'vitest';
import { formatTick, scaleDomain } from './chart.js';

describe('scaleDomain', () => {
	it('does not floor below zero for non-negative series', () => {
		const d = scaleDomain([0, 0, 34]);
		expect(d.min).toBe(0);
		expect(d.max).toBeGreaterThan(34);
	});

	it('keeps zero-only series at 0..1', () => {
		expect(scaleDomain([0, 0, 0])).toEqual({ min: 0, max: 1 });
	});

	it('still pads signed series below zero', () => {
		const d = scaleDomain([-10, 10]);
		expect(d.min).toBeLessThan(0);
		expect(d.max).toBeGreaterThan(10);
	});
});

describe('formatTick', () => {
	it('renders integers without decimals', () => {
		expect(formatTick(17)).toBe('17');
		expect(formatTick(34)).toBe('34');
	});
});
