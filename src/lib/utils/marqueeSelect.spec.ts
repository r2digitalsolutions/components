import { describe, expect, it } from 'vitest';
import { hitTestIds, mergeMarqueeItemsById, resolveMarqueeSelection } from './marqueeSelect.js';

describe('mergeMarqueeItemsById', () => {
	it('unions duplicate ids into one box', () => {
		const merged = mergeMarqueeItemsById([
			{ id: 'w', x: 10, y: 10, width: 40, height: 40 },
			{ id: 'w', x: 20, y: 5, width: 50, height: 20 },
			{ id: 'path', x: 0, y: 0, width: 8, height: 8 }
		]);
		expect(merged).toHaveLength(2);
		expect(merged.find((i) => i.id === 'w')).toEqual({
			id: 'w',
			x: 10,
			y: 5,
			width: 60,
			height: 45
		});
	});
});

describe('hitTestIds', () => {
	it('returns each id once when host and children overlap the marquee', () => {
		const ids = hitTestIds({ x: 0, y: 0, width: 100, height: 100 }, [
			{ id: 'heart', x: 10, y: 10, width: 40, height: 40 },
			{ id: 'heart', x: 12, y: 12, width: 36, height: 36 },
			{ id: 'heart', x: 14, y: 14, width: 20, height: 20 }
		]);
		expect(ids).toEqual(['heart']);
	});
});

describe('resolveMarqueeSelection', () => {
	it('dedupes replace hits so a widget is not treated as multi-select', () => {
		expect(resolveMarqueeSelection(['w', 'w', 'w'], [], 'replace')).toEqual(['w']);
	});
});
