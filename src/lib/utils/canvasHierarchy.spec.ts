import { describe, expect, it } from 'vitest';
import {
	createCanvasLayer,
	defaultSlotFromRect,
	emptyCanvasDocument,
	rectFromSlot
} from './canvasDocument.js';
import {
	ANCHOR_PRESETS,
	applyScrollBoxOffsets,
	clipPathForLayer,
	computeAbsoluteRects,
	enclosingGroupId,
	fitGroupsToChildren,
	isEffectivelyVisible,
	isEffectivelyLocked,
	isLayoutPositionLocked,
	isLayoutSizeLocked,
	selectionAncestorIds,
	paintTransformForLayer,
	reparentLayer,
	scaleSubtreeAbsolute,
	scaleSelectionAbsolute,
	scrollBoxOverflow,
	scrollBarMetrics,
	slotFromLocalRect,
	stepAxis,
	syncSlotFromRect,
	translateSelectionAbsolute,
	translateSlot,
	wrapSelection,
	isMarqueePassThroughKind,
	clampDeltaToKeepUnion,
	selectedAncestorId
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

describe('isEffectivelyLocked', () => {
	it('locks descendants when an ancestor is locked', () => {
		const parent = createCanvasLayer('group', {
			name: 'Parent',
			locked: true,
			rect: { x: 0, y: 0, w: 100, h: 100 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			locked: false,
			parentId: parent.id,
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const layers = [parent, child];
		expect(isEffectivelyLocked(layers, parent.id)).toBe(true);
		expect(isEffectivelyLocked(layers, child.id)).toBe(true);
	});

	it('keeps an unlocked child free when the parent is unlocked', () => {
		const parent = createCanvasLayer('group', {
			name: 'Parent',
			locked: false,
			rect: { x: 0, y: 0, w: 100, h: 100 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			locked: false,
			parentId: parent.id,
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		expect(isEffectivelyLocked([parent, child], child.id)).toBe(false);
	});
});

describe('layout lock + selection ancestors', () => {
	it('locks X/Y inside hBox/vBox/grid but not inside a group', () => {
		const group = createCanvasLayer('group', {
			name: 'Group',
			rect: { x: 0, y: 0, w: 200, h: 200 },
			zIndex: 0
		});
		const box = createCanvasLayer('vBox', {
			name: 'Box',
			rect: { x: 0, y: 0, w: 120, h: 180 },
			parentId: group.id,
			zIndex: 0
		});
		const inBox = createCanvasLayer('rect', {
			name: 'In box',
			parentId: box.id,
			rect: { x: 0, y: 0, w: 80, h: 40 },
			zIndex: 0
		});
		const inGroup = createCanvasLayer('rect', {
			name: 'In group',
			parentId: group.id,
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 1
		});
		const layers = [group, box, inBox, inGroup];
		expect(isLayoutPositionLocked(layers, inBox.id)).toBe(true);
		expect(isLayoutSizeLocked(layers, inBox.id)).toBe(false);
		expect(isLayoutPositionLocked(layers, inGroup.id)).toBe(false);
	});

	it('locks size inside a uniform grid', () => {
		const grid = createCanvasLayer('uniformGrid', {
			name: 'Grid',
			rect: { x: 0, y: 0, w: 200, h: 200 },
			zIndex: 0
		});
		const cell = createCanvasLayer('rect', {
			name: 'Cell',
			parentId: grid.id,
			rect: { x: 0, y: 0, w: 40, h: 40 },
			zIndex: 0
		});
		expect(isLayoutPositionLocked([grid, cell], cell.id)).toBe(true);
		expect(isLayoutSizeLocked([grid, cell], cell.id)).toBe(true);
	});

	it('does not outline a hugging group (or the artboard) when a nested child is selected', () => {
		const panel = createCanvasLayer('canvasPanel', {
			name: 'Artboard',
			rect: { x: 0, y: 0, w: 400, h: 400 },
			zIndex: 0
		});
		const group = createCanvasLayer('group', {
			name: 'Group',
			parentId: panel.id,
			rect: { x: 20, y: 20, w: 200, h: 200 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			parentId: group.id,
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const layers = [panel, group, child];
		expect(selectionAncestorIds(layers, [child.id])).toEqual([]);
		expect(selectionAncestorIds(layers, [group.id])).toEqual([]);
	});

	it('outlines a frame parent, not a hugging group', () => {
		const border = createCanvasLayer('border', {
			name: 'Border',
			rect: { x: 0, y: 0, w: 400, h: 400 },
			zIndex: 0
		});
		const child = createCanvasLayer('rect', {
			name: 'Child',
			parentId: border.id,
			rect: { x: 40, y: 40, w: 80, h: 80 },
			zIndex: 0
		});
		expect(selectionAncestorIds([border, child], [child.id])).toEqual([border.id]);
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

	it('keeps clipChildren off when the instance does not clip', () => {
		const child = createCanvasLayer('ellipse', {
			name: 'Dot',
			rect: { x: -20, y: -20, w: 80, h: 80 },
			slot: defaultSlotFromRect({ x: -20, y: -20, w: 80, h: 80 }),
			zIndex: 0
		});
		const def = createWidgetDefinition({
			name: 'W',
			width: 100,
			height: 80,
			layers: [child]
		});
		const instance = createCanvasLayer('widget', {
			name: 'Inst',
			definitionId: def.id,
			clipChildren: false,
			rect: { x: 10, y: 10, w: 100, h: 80 },
			slot: defaultSlotFromRect({ x: 10, y: 10, w: 100, h: 80 }),
			zIndex: 0
		});
		const flat = flattenLayersWithWidgets([instance], [def]);
		const host = flat.find((l) => l.id === instance.id);
		expect(host?.clipChildren).toBe(false);
		const abs = computeAbsoluteRects(flat, { width: 400, height: 300 });
		expect(clipPathForLayer(`${instance.id}::${child.id}`, flat, abs)).toBeUndefined();
	});

	it('scales widget children when the instance size differs from the definition', () => {
		const child = createCanvasLayer('rect', {
			name: 'Box',
			rect: { x: 0, y: 0, w: 100, h: 80 },
			slot: defaultSlotFromRect({ x: 0, y: 0, w: 100, h: 80 }),
			zIndex: 0
		});
		const def = createWidgetDefinition({
			name: 'W',
			width: 100,
			height: 80,
			layers: [child]
		});
		const instance = createCanvasLayer('widget', {
			name: 'Inst',
			definitionId: def.id,
			rect: { x: 10, y: 10, w: 200, h: 160 },
			slot: defaultSlotFromRect({ x: 10, y: 10, w: 200, h: 160 }),
			zIndex: 0
		});
		const flat = flattenLayersWithWidgets([instance], [def]);
		const abs = computeAbsoluteRects(flat, { width: 400, height: 300 });
		expect(abs.get(instance.id)).toEqual({ x: 10, y: 10, w: 200, h: 160 });
		expect(abs.get(`${instance.id}::${child.id}`)).toEqual({ x: 10, y: 10, w: 200, h: 160 });
	});

	it('lets unselected widgets pass marquee and collapses synthetic children to one id', () => {
		expect(isMarqueePassThroughKind('widget')).toBe(true);
		expect(isMarqueePassThroughKind('group')).toBe(false);

		const child = createCanvasLayer('ellipse', {
			name: 'Dot',
			rect: { x: 0, y: 0, w: 40, h: 40 },
			slot: defaultSlotFromRect({ x: 0, y: 0, w: 40, h: 40 }),
			zIndex: 0
		});
		const def = createWidgetDefinition({
			name: 'W',
			width: 40,
			height: 40,
			layers: [child]
		});
		const instance = createCanvasLayer('widget', {
			name: 'Inst',
			definitionId: def.id,
			rect: { x: 8, y: 12, w: 40, h: 40 },
			slot: defaultSlotFromRect({ x: 8, y: 12, w: 40, h: 40 }),
			zIndex: 0
		});
		const flat = flattenLayersWithWidgets([instance], [def]);
		expect(flat.length).toBeGreaterThan(1);
		const selectable = flat.map((l) => (l.id.includes('::') ? l.id.split('::')[0] : l.id));
		expect(new Set(selectable)).toEqual(new Set([instance.id]));
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

describe('wrapSelection', () => {
	it('wraps a single layer in a parent (Add parent)', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 20, y: 30, w: 40, h: 50 },
			zIndex: 0
		});
		const doc = emptyCanvasDocument({ width: 400, height: 300, layers: [a] });
		const result = wrapSelection(doc, [a.id], 'group');
		expect(result).not.toBeNull();
		const wrapped = result!.doc.layers.find((l) => l.id === a.id);
		expect(wrapped?.parentId).toBe(result!.wrapperId);
		expect(enclosingGroupId(result!.doc.layers, a.id)).toBe(result!.wrapperId);
	});

	it('wraps sibling layers in a group covering their bounds', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const doc = emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] });
		const result = wrapSelection(doc, [a.id, b.id], 'group');
		expect(result).not.toBeNull();
		const group = result!.doc.layers.find((l) => l.id === result!.wrapperId);
		expect(group?.kind).toBe('group');
		expect(group?.parentId ?? null).toBeNull();
		const wrappedA = result!.doc.layers.find((l) => l.id === a.id);
		const wrappedB = result!.doc.layers.find((l) => l.id === b.id);
		expect(wrappedA?.parentId).toBe(group?.id);
		expect(wrappedB?.parentId).toBe(group?.id);
		const abs = computeAbsoluteRects(result!.doc.layers, { width: 400, height: 300 });
		expect(abs.get(a.id)).toEqual({ x: 10, y: 10, w: 40, h: 40 });
		expect(abs.get(b.id)).toEqual({ x: 80, y: 10, w: 50, h: 20 });
	});
});

describe('fitGroupsToChildren', () => {
	const root = { width: 400, height: 300 };

	it('is a no-op when the group already wraps its children', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] }),
			[a.id, b.id],
			'group'
		)!;
		const fitted = fitGroupsToChildren(wrapped.doc.layers, root);
		const absBefore = computeAbsoluteRects(wrapped.doc.layers, root);
		const absAfter = computeAbsoluteRects(fitted, root);
		expect(absAfter.get(a.id)).toEqual(absBefore.get(a.id));
		expect(absAfter.get(b.id)).toEqual(absBefore.get(b.id));
		expect(absAfter.get(wrapped.wrapperId)).toEqual(absBefore.get(wrapped.wrapperId));
	});

	it('grows and rebases when a child moves outside the group box', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] }),
			[a.id, b.id],
			'group'
		)!;
		const group = wrapped.doc.layers.find((l) => l.id === wrapped.wrapperId)!;
		const moved = wrapped.doc.layers.map((l) => {
			if (l.id !== b.id) return l;
			const rect = { ...l.rect, x: l.rect.x + 40, y: l.rect.y + 30 };
			return syncSlotFromRect({ ...l, rect }, { width: group.rect.w, height: group.rect.h });
		});
		const fitted = fitGroupsToChildren(moved, root);
		const abs = computeAbsoluteRects(fitted, root);
		expect(abs.get(a.id)).toEqual({ x: 10, y: 10, w: 40, h: 40 });
		expect(abs.get(b.id)).toEqual({ x: 120, y: 40, w: 50, h: 20 });
		expect(abs.get(wrapped.wrapperId)).toEqual({ x: 10, y: 10, w: 160, h: 50 });
		const childB = fitted.find((l) => l.id === b.id);
		expect(childB?.rect.x).toBe(110);
		expect(childB?.rect.y).toBe(30);
	});

	it('fits nested groups innermost first', () => {
		const innerChild = createCanvasLayer('rect', {
			name: 'Inner',
			rect: { x: 20, y: 20, w: 30, h: 30 },
			zIndex: 0
		});
		const innerWrap = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [innerChild] }),
			[innerChild.id],
			'group'
		)!;
		const sibling = createCanvasLayer('ellipse', {
			name: 'Sibling',
			rect: { x: 80, y: 20, w: 20, h: 20 },
			zIndex: 1
		});
		const outerWrap = wrapSelection(
			{ ...innerWrap.doc, layers: [...innerWrap.doc.layers, sibling] },
			[innerWrap.wrapperId, sibling.id],
			'group'
		)!;
		const innerGroup = outerWrap.doc.layers.find((l) => l.id === innerWrap.wrapperId)!;
		const moved = outerWrap.doc.layers.map((l) => {
			if (l.id !== innerChild.id) return l;
			const rect = { ...l.rect, x: l.rect.x + 50 };
			return syncSlotFromRect(
				{ ...l, rect },
				{ width: innerGroup.rect.w, height: innerGroup.rect.h }
			);
		});
		const fitted = fitGroupsToChildren(moved, root);
		const abs = computeAbsoluteRects(fitted, root);
		const innerAbs = abs.get(innerChild.id)!;
		const innerGroupAbs = abs.get(innerWrap.wrapperId)!;
		const outerAbs = abs.get(outerWrap.wrapperId)!;
		expect(innerGroupAbs.x).toBe(innerAbs.x);
		expect(innerGroupAbs.w).toBe(innerAbs.w);
		expect(outerAbs.x).toBeLessThanOrEqual(innerAbs.x);
		expect(outerAbs.x + outerAbs.w).toBeGreaterThanOrEqual(innerAbs.x + innerAbs.w);
		expect(outerAbs.x + outerAbs.w).toBeGreaterThanOrEqual(
			(abs.get(sibling.id)?.x ?? 0) + (abs.get(sibling.id)?.w ?? 0)
		);
	});
});

describe('scaleSubtreeAbsolute', () => {
	it('scales group children from the new origin', () => {
		const child = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 20 },
			zIndex: 0
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [child] }),
			[child.id],
			'group'
		)!;
		const root = { width: 400, height: 300 };
		const prevAbs = computeAbsoluteRects(wrapped.doc.layers, root).get(wrapped.wrapperId)!;
		const nextAbs = { x: prevAbs.x, y: prevAbs.y, w: prevAbs.w * 2, h: prevAbs.h * 2 };
		const scaled = scaleSubtreeAbsolute(
			wrapped.doc.layers,
			wrapped.wrapperId,
			prevAbs,
			nextAbs,
			root
		);
		const abs = computeAbsoluteRects(scaled, root);
		expect(abs.get(wrapped.wrapperId)).toEqual(nextAbs);
		expect(abs.get(child.id)).toEqual({
			x: 10,
			y: 10,
			w: 80,
			h: 40
		});
	});

	it('keeps children in world space when scaleDescendants is false', () => {
		const child = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 20 },
			zIndex: 0
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [child] }),
			[child.id],
			'group'
		)!;
		const root = { width: 400, height: 300 };
		const prevAbs = computeAbsoluteRects(wrapped.doc.layers, root).get(wrapped.wrapperId)!;
		const nextAbs = { x: prevAbs.x, y: prevAbs.y, w: prevAbs.w * 2, h: prevAbs.h * 2 };
		const scaled = scaleSubtreeAbsolute(
			wrapped.doc.layers,
			wrapped.wrapperId,
			prevAbs,
			nextAbs,
			root,
			{ scaleDescendants: false }
		);
		const abs = computeAbsoluteRects(scaled, root);
		expect(abs.get(wrapped.wrapperId)).toEqual(nextAbs);
		expect(abs.get(child.id)).toEqual({ x: 10, y: 10, w: 40, h: 20 });
	});
});

describe('scaleSelectionAbsolute', () => {
	it('scales several siblings from the selection AABB', () => {
		const a = createCanvasLayer('rect', { name: 'A', rect: { x: 10, y: 10, w: 40, h: 20 } });
		const b = createCanvasLayer('rect', { name: 'B', rect: { x: 60, y: 10, w: 40, h: 20 } });
		const layers = [a, b];
		const root = { width: 400, height: 300 };
		const prev = { x: 10, y: 10, w: 90, h: 20 };
		const next = { x: 10, y: 10, w: 180, h: 40 };
		const scaled = scaleSelectionAbsolute(layers, [a.id, b.id], prev, next, root);
		const abs = computeAbsoluteRects(scaled, root);
		expect(abs.get(a.id)).toEqual({ x: 10, y: 10, w: 80, h: 40 });
		expect(abs.get(b.id)).toEqual({ x: 110, y: 10, w: 80, h: 40 });
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

describe('translateSlot', () => {
	it('moves the rect without changing size', () => {
		const parent = { width: 200, height: 200 };
		const slot = defaultSlotFromRect({ x: 10, y: 20, w: 40, h: 30 });
		const moved = translateSlot(slot, 8, -4);
		expect(rectFromSlot(moved, parent)).toEqual({ x: 18, y: 16, w: 40, h: 30 });
	});
});

describe('stepAxis', () => {
	it('steps 1px without snap (10px with Shift)', () => {
		expect(stepAxis(13, 1, { snap: false, cell: 8 })).toBe(14);
		expect(stepAxis(13, -1, { snap: false, cell: 8, coarse: true })).toBe(3);
	});

	it('snaps to the next grid line, then one cell when already on-grid', () => {
		expect(stepAxis(13, 1, { snap: true, cell: 8 })).toBe(16);
		expect(stepAxis(16, 1, { snap: true, cell: 8 })).toBe(24);
		expect(stepAxis(13, -1, { snap: true, cell: 8 })).toBe(8);
		expect(stepAxis(16, -1, { snap: true, cell: 8 })).toBe(8);
		expect(stepAxis(16, 1, { snap: true, cell: 8, coarse: true })).toBe(32);
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
		const painted = applyScrollBoxOffsets(layers, abs, new Map([[box.id, { x: 0, y: 40 }]]));
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

describe('translateSelectionAbsolute', () => {
	const root = { width: 400, height: 300 };

	it('moves a group and a sibling without double-moving group children', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const path = createCanvasLayer('path', {
			name: 'P',
			rect: { x: 10, y: 100, w: 80, h: 40 },
			zIndex: 2
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b, path] }),
			[a.id, b.id],
			'group'
		);
		expect(wrapped).not.toBeNull();
		const groupId = wrapped!.wrapperId;
		const next = translateSelectionAbsolute(wrapped!.doc.layers, [groupId, path.id], 15, 20, root);
		const abs = computeAbsoluteRects(next, root);
		expect(abs.get(a.id)).toEqual({ x: 25, y: 30, w: 40, h: 40 });
		expect(abs.get(b.id)).toEqual({ x: 95, y: 30, w: 50, h: 20 });
		expect(abs.get(path.id)).toEqual({ x: 25, y: 120, w: 80, h: 40 });
		expect((abs.get(b.id)?.x ?? 0) - (abs.get(a.id)?.x ?? 0)).toBe(70);
	});

	it('does not independently move a child when its group is also selected', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] }),
			[a.id, b.id],
			'group'
		);
		expect(wrapped).not.toBeNull();
		const groupId = wrapped!.wrapperId;
		const next = translateSelectionAbsolute(wrapped!.doc.layers, [groupId, a.id], 10, 0, root);
		const abs = computeAbsoluteRects(next, root);
		expect(abs.get(a.id)?.x).toBe(20);
		expect(abs.get(b.id)?.x).toBe(90);
	});

	it('keeps children glued when only the enclosing group is translated', () => {
		const a = createCanvasLayer('rect', {
			name: 'A',
			rect: { x: 10, y: 10, w: 40, h: 40 },
			zIndex: 0
		});
		const b = createCanvasLayer('text', {
			name: 'B',
			rect: { x: 80, y: 10, w: 50, h: 20 },
			zIndex: 1
		});
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] }),
			[a.id, b.id],
			'group'
		);
		expect(wrapped).not.toBeNull();
		const groupId = wrapped!.wrapperId;
		const before = computeAbsoluteRects(wrapped!.doc.layers, root);
		const gap = (before.get(b.id)?.x ?? 0) - (before.get(a.id)?.x ?? 0);
		const next = translateSelectionAbsolute(wrapped!.doc.layers, [groupId], 40, 25, root);
		const abs = computeAbsoluteRects(next, root);
		expect((abs.get(b.id)?.x ?? 0) - (abs.get(a.id)?.x ?? 0)).toBe(gap);
		expect(abs.get(a.id)?.y).toBe((before.get(a.id)?.y ?? 0) + 25);
		expect(abs.get(b.id)?.y).toBe((before.get(b.id)?.y ?? 0) + 25);
	});
});

describe('clampDeltaToKeepUnion', () => {
	const bounds = { width: 200, height: 100 };

	it('stops the union at a corner instead of letting one item slide further', () => {
		const union = { x: 150, y: 60, w: 80, h: 50 };
		const next = clampDeltaToKeepUnion(union, 100, 80, bounds);
		expect(union.x + next.dx).toBe(120);
		expect(union.y + next.dy).toBe(50);
		expect(union.x + next.dx + union.w).toBe(200);
		expect(union.y + next.dy + union.h).toBe(100);
	});

	it('does not clamp an axis when the union is larger than the artboard', () => {
		const union = { x: -10, y: 0, w: 250, h: 40 };
		const next = clampDeltaToKeepUnion(union, 5, 20, bounds);
		expect(next.dx).toBe(5);
		expect(union.y + next.dy).toBe(20);
	});
});

describe('selectedAncestorId', () => {
	it('returns the selected group that contains the grabbed child', () => {
		const a = createCanvasLayer('rect', { name: 'A', rect: { x: 10, y: 10, w: 40, h: 40 } });
		const b = createCanvasLayer('text', { name: 'B', rect: { x: 80, y: 10, w: 50, h: 20 } });
		const wrapped = wrapSelection(
			emptyCanvasDocument({ width: 400, height: 300, layers: [a, b] }),
			[a.id, b.id],
			'group'
		);
		expect(wrapped).not.toBeNull();
		const groupId = wrapped!.wrapperId;
		expect(selectedAncestorId(wrapped!.doc.layers, a.id, [groupId])).toBe(groupId);
		expect(selectedAncestorId(wrapped!.doc.layers, a.id, [a.id])).toBeNull();
	});
});
