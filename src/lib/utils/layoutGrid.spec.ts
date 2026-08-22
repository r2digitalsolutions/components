import { describe, expect, it } from 'vitest';
import { updateItem, type GridItem } from './layoutGrid.js';

const base: GridItem[] = [
	{ id: 'kpi_cards', x: 0, y: 0, w: 12, h: 3 },
	{ id: 'commercial_stats', x: 0, y: 3, w: 12, h: 6 },
	{ id: 'insights', x: 0, y: 9, w: 8, h: 5 },
	{ id: 'recent_activity', x: 8, y: 9, w: 4, h: 5 }
];

describe('updateItem', () => {
	it('lets a lower widget move above the first row', () => {
		const next = updateItem(base, 'commercial_stats', { x: 0, y: 0 }, { cols: 12, compact: true });
		const commercial = next.find((it) => it.id === 'commercial_stats');
		const kpi = next.find((it) => it.id === 'kpi_cards');

		expect(commercial?.y).toBe(0);
		expect(kpi?.y).toBeGreaterThanOrEqual(commercial?.h ?? 0);
	});

	it('keeps an explicit drop position before compaction', () => {
		const next = updateItem(base, 'kpi_cards', { x: 0, y: 3 }, { cols: 12, compact: false });
		const kpi = next.find((it) => it.id === 'kpi_cards');

		expect(kpi?.y).toBe(3);
	});
});
