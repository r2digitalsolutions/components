import { describe, expect, it } from 'vitest';
import {
	createCanvasLayer,
	defaultSlotFromRect,
	emptyCanvasDocument
} from './canvasDocument.js';
import {
	ANCHOR_PRESETS,
	applyScrollBoxOffsets,
	computeAbsoluteRects,
	isEffectivelyVisible,
	paintTransformForLayer,
	reparentLayer,
	scrollBoxOverflow,
	scrollBarMetrics,
	slotFromLocalRect
} from './canvasHierarchy.js';
import {
	createWidgetDefinition,
	createWidgetFromSelection,
	flattenLayersWithWidgets,
	placeWidgetInstance
} from './canvasWidget.js';
import {
	createCanvasHistory,
	pushCanvasHistory,
	redoCanvasHistory,
	undoCanvasHistory
} from './canvasHistory.js';

describe('isEffectivelyVisible', () => {
	it('hides descendants when an ancestor is invisible', () => {
		const parent = createCanvasLayer('group', {
			name: 'Parent',
			visible: false,
			rect: { x: 0, y: 0, w: 100, h: 100 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			visible: true,
			parentId: parent.id,
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const layers = [parent, child];
		expect(isEffectivelyVisible(layers, parent.id)).toBe(false);
		expect(isEffectivelyVisible(layers, child.id)).toBe(false);
	});
});

describe('paintTransformForLayer', () => {
	it('orbits children around a rotated parent center', () => {
		const parent = createCanvasLayer('group', {
			name: 'Parent',
			rotation: 90,
			rect: { x: 0, y: 0, w: 100, h: 100 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			parentId: parent.id,
			rect: { x: 60, y: 10, w: 20, h: 20 },
			zIndex: 0
		});
		const layers = [parent, child];
		const abs = new Map([
			[parent.id, parent.rect],
			[child.id, child.rect]
		]);
		const xf = paintTransformForLayer(layers, child.id, abs);
		expect(xf).toContain('rotate(90deg)');
		// Parent center (50,50) relative to child top-left (60,10) → (-10, 40)
		expect(xf).toContain('translate(-10px, 40px)');
	});
});

describe('computeAbsoluteRects', () => {
	it('resolves stretch anchors to fill parent', () => {
		const child = createCanvasLayer('rect', {
			name: 'Fill',
			parentId: null,
			rect: { x: 0, y: 0, w: 10, h: 10 },
			slot: {
				anchors: ANCHOR_PRESETS.stretch,
				offsets: { left: 8, top: 8, right: 8, bottom: 8 }
			},
			zIndex: 0
		});
		const map = computeAbsoluteRects([child], { width: 200, height: 100 });
		expect(map.get(child.id)).toEqual({ x: 8, y: 8, w: 184, h: 84 });
	});

	it('lays out hBox children with fill', () => {
		const box = createCanvasLayer('hBox', {
			name: 'Row',
			rect: { x: 0, y: 0, w: 300, h: 40 },
			slot: defaultSlotFromRect({ x: 0, y: 0, w: 300, h: 40 }),
			gap: 10,
			zIndex: 0
		});
		const a = createCanvasLayer('rect', {
			name: 'A',
			parentId: box.id,
			rect: { x: 0, y: 0, w: 50, h: 40 },
			slot: { ...defaultSlotFromRect({ x: 0, y: 0, w: 50, h: 40 }), sizeRule: 'fixed' },
			zIndex: 0
		});
		const b = createCanvasLayer('rect', {
			name: 'B',
			parentId: box.id,
			rect: { x: 0, y: 0, w: 10, h: 40 },
			slot: {
				...defaultSlotFromRect({ x: 0, y: 0, w: 10, h: 40 }),
				sizeRule: 'fill'
			},
			zIndex: 1
		});
		const map = computeAbsoluteRects([box, a, b], { width: 300, height: 40 });
		expect(map.get(a.id)?.w).toBe(50);
		expect(map.get(b.id)?.x).toBe(60);
		expect(map.get(b.id)?.w).toBe(240);
	});

	it('reparents abs → local with padding', () => {
		const parent = createCanvasLayer('border', {
			name: 'P',
			rect: { x: 100, y: 50, w: 200, h: 100 },
			slot: {
				...defaultSlotFromRect({ x: 100, y: 50, w: 200, h: 100 }),
				padding: { left: 10, top: 5, right: 0, bottom: 0 }
			},
			zIndex: 0
		});
		const child = createCanvasLayer('text', {
			name: 'T',
			rect: { x: 130, y: 70, w: 40, h: 20 },
			slot: defaultSlotFromRect({ x: 130, y: 70, w: 40, h: 20 }),
			zIndex: 1
		});
		const next = reparentLayer([parent, child], child.id, parent.id, {
			width: 400,
			height: 300
		});
		const moved = next.find((l) => l.id === child.id)!;
		expect(moved.parentId).toBe(parent.id);
		expect(moved.rect.x).toBe(20);
		expect(moved.rect.y).toBe(15);
	});
});

describe('flattenLayersWithWidgets / named slots', () => {
	it('expands widget instance and injects fillSlot children', () => {
		const slot = createCanvasLayer('namedSlot', {
			name: 'Footer',
			slotName: 'Footer',
			rect: { x: 0, y: 100, w: 200, h: 40 },
			slot: defaultSlotFromRect({ x: 0, y: 100, w: 200, h: 40 }),
			zIndex: 1
		});
		const def = createWidgetDefinition({
			name: 'Card',
			width: 200,
			height: 140,
			layers: [
				createCanvasLayer('rect', {
					name: 'Bg',
					rect: { x: 0, y: 0, w: 200, h: 140 },
					slot: defaultSlotFromRect({ x: 0, y: 0, w: 200, h: 140 }),
					zIndex: 0
				}),
				slot
			]
		});
		const instance = createCanvasLayer('widget', {
			name: 'Card A',
			definitionId: def.id,
			rect: { x: 40, y: 40, w: 200, h: 140 },
			slot: defaultSlotFromRect({ x: 40, y: 40, w: 200, h: 140 }),
			zIndex: 0
		});
		const injected = createCanvasLayer('text', {
			name: 'Inject',
			text: 'Hi',
			parentId: instance.id,
			fillSlot: 'Footer',
			// Widget-local coords (slot is at 0,100 in the definition)
			rect: { x: 8, y: 104, w: 120, h: 24 },
			slot: defaultSlotFromRect({ x: 8, y: 104, w: 120, h: 24 }),
			zIndex: 0
		});
		const flat = flattenLayersWithWidgets([instance, injected], [def]);
		const host = flat.find((l) => l.id === instance.id);
		expect(host?.kind).toBe('group');
		const footerChild = flat.find((l) => l.id === injected.id);
		expect(footerChild?.parentId).toBe(`${instance.id}::${slot.id}`);
		expect(footerChild?.rect).toEqual({ x: 8, y: 4, w: 120, h: 24 });

		const abs = computeAbsoluteRects(flat, { width: 400, height: 300 });
		// Instance (40,40) + slot (0,100) + local (8,4) → (48,144)
		expect(abs.get(injected.id)).toEqual({ x: 48, y: 144, w: 120, h: 24 });
	});
});

describe('widgets place / create', () => {
	it('createWidgetFromSelection requires shared parent', () => {
		const a = createCanvasLayer('rect', { name: 'A', parentId: null, zIndex: 0 });
		const b = createCanvasLayer('rect', {
			name: 'B',
			parentId: a.id,
			zIndex: 0
		});
		const doc = emptyCanvasDocument({
			width: 400,
			height: 300,
			layers: [a, b]
		});
		expect(createWidgetFromSelection(doc, [a.id, b.id])).toBeNull();
	});

	it('placeWidgetInstance uses parent content size for slot', () => {
		const panel = createCanvasLayer('canvasPanel', {
			name: 'Root',
			rect: { x: 0, y: 0, w: 400, h: 300 },
			slot: defaultSlotFromRect({ x: 0, y: 0, w: 400, h: 300 }),
			zIndex: 0
		});
		const def = createWidgetDefinition({ name: 'W', width: 100, height: 80, layers: [] });
		const doc = emptyCanvasDocument({
			width: 400,
			height: 300,
			widgets: [def],
			layers: [panel]
		});
		const next = placeWidgetInstance(doc, def.id, { parentId: panel.id });
		expect(next).not.toBeNull();
		const inst = next!.layers[next!.layers.length - 1];
		expect(inst.parentId).toBe(panel.id);
		expect(inst.rect.w).toBe(100);
		expect(inst.slot?.offsets).toBeTruthy();
	});
});

describe('canvasHistory', () => {
	it('undo / redo round-trips', () => {
		const a = emptyCanvasDocument({ width: 100, height: 100 });
		let hist = createCanvasHistory(a);
		const b = { ...a, width: 200 };
		hist = pushCanvasHistory(hist, b);
		expect(hist.past).toHaveLength(1);
		const undone = undoCanvasHistory(hist)!;
		expect(undone.doc.width).toBe(100);
		const redone = redoCanvasHistory(undone.state)!;
		expect(redone.doc.width).toBe(200);
	});
});

describe('slotFromLocalRect', () => {
	it('keeps topLeft offsets equal to rect', () => {
		const slot = slotFromLocalRect(
			{ width: 100, height: 80 },
			{ x: 12, y: 8, w: 40, h: 20 },
			ANCHOR_PRESETS.topLeft
		);
		expect(slot.offsets.left).toBe(12);
		expect(slot.offsets.top).toBe(8);
	});
});

describe('scrollBox preview offsets', () => {
	it('reports overflow and shifts children only', () => {
		const box = createCanvasLayer('scrollBox', {
			name: 'Scroll',
			rect: { x: 0, y: 0, w: 100, h: 80 },
			slot: defaultSlotFromRect({ x: 0, y: 0, w: 100, h: 80 }),
			clipChildren: true,
			zIndex: 0
		});
		const child = createCanvasLayer('text', {
			name: 'Tall',
			parentId: box.id,
			rect: { x: 0, y: 0, w: 80, h: 40 },
			slot: defaultSlotFromRect({ x: 10, y: 120, w: 80, h: 40 }),
			zIndex: 0
		});
		// Force local via slot offsets after create
		child.slot = defaultSlotFromRect({ x: 10, y: 120, w: 80, h: 40 });
		child.rect = { x: 10, y: 120, w: 80, h: 40 };
		const layers = [box, child];
		const abs = computeAbsoluteRects(layers, { width: 200, height: 200 });
		expect(scrollBoxOverflow(box.id, layers, abs).maxY).toBeGreaterThan(0);
		const painted = applyScrollBoxOffsets(
			layers,
			abs,
			new Map([[box.id, { x: 0, y: 40 }]])
		);
		expect(painted.get(box.id)).toEqual(abs.get(box.id));
		expect(painted.get(child.id)?.y).toBe((abs.get(child.id)?.y ?? 0) - 40);
	});

	it('scrollBarMetrics sizes thumb from viewport and overflow', () => {
		const m = scrollBarMetrics(100, 200, 50)!;
		expect(m.thumb).toBeGreaterThan(0);
		expect(m.thumb).toBeLessThan(100);
		expect(m.offset).toBeGreaterThan(0);
		expect(m.offset).toBeLessThan(100 - m.thumb);
	});
});
