import type {
	CanvasAnchors,
	CanvasDocument,
	CanvasLayer,
	CanvasLayerKind,
	CanvasLayerRect,
	CanvasSlot
} from './canvasDocument.js';
import {
	applyTextAutoSize,
	createCanvasLayer,
	defaultSlotFromRect,
	rectFromSlot
} from './canvasDocument.js';
import { uid } from './mediaTracks.js';

export const CONTAINER_KINDS: ReadonlySet<CanvasLayerKind> = new Set([
	'canvasPanel',
	'overlay',
	'border',
	'hBox',
	'vBox',
	'sizeBox',
	'scaleBox',
	'group',
	'image',
	'rect',
	'roundRect',
	'ellipse',
	'namedSlot',
	'scrollBox',
	'wrapBox',
	'uniformGrid'
]);

export const LAYOUT_BOX_KINDS: ReadonlySet<CanvasLayerKind> = new Set([
	'hBox',
	'vBox',
	'sizeBox',
	'scaleBox',
	'wrapBox',
	'uniformGrid',
	'scrollBox'
]);

/** Parents that own child X/Y (UMG slot layout). Group / panel / overlay stay freeform. */
export const LAYOUT_POSITION_KINDS: ReadonlySet<CanvasLayerKind> = new Set([
	'hBox',
	'vBox',
	'wrapBox',
	'uniformGrid'
]);

/** Parents that own child W/H (cell / uniform scale). */
export const LAYOUT_SIZE_KINDS: ReadonlySet<CanvasLayerKind> = new Set(['uniformGrid', 'scaleBox']);

/**
 * Structural shells whose empty area should start a marquee (not a layer drag),
 * matching Figma-style select-drag on the canvas / inside frames.
 * Groups are omitted: they behave like a single object (click/drag the group).
 */
export const MARQUEE_PASS_KINDS: ReadonlySet<CanvasLayerKind> = new Set([
	'canvasPanel',
	'overlay',
	...LAYOUT_BOX_KINDS
]);

export function isContainerKind(kind: CanvasLayerKind): boolean {
	return CONTAINER_KINDS.has(kind);
}

export function isMarqueePassThroughKind(kind: CanvasLayerKind): boolean {
	return MARQUEE_PASS_KINDS.has(kind);
}

export function canHaveChildren(layer: CanvasLayer): boolean {
	return isContainerKind(layer.kind);
}

export function getChildren(layers: CanvasLayer[], parentId: string | null): CanvasLayer[] {
	return layers
		.filter((l) => (l.parentId ?? null) === parentId)
		.sort((a, b) => a.zIndex - b.zIndex || (a.slot?.order ?? 0) - (b.slot?.order ?? 0));
}

export function getDescendantIds(layers: CanvasLayer[], rootId: string): string[] {
	const out: string[] = [];
	const walk = (pid: string) => {
		for (const c of getChildren(layers, pid)) {
			out.push(c.id);
			walk(c.id);
		}
	};
	walk(rootId);
	return out;
}

export function getSubtreeIds(layers: CanvasLayer[], rootId: string): string[] {
	return [rootId, ...getDescendantIds(layers, rootId)];
}

export function getAncestors(layers: CanvasLayer[], layerId: string): CanvasLayer[] {
	const map = new Map(layers.map((l) => [l.id, l]));
	const out: CanvasLayer[] = [];
	let cur = map.get(layerId);
	while (cur?.parentId) {
		const parent = map.get(cur.parentId);
		if (!parent) break;
		out.push(parent);
		cur = parent;
	}
	return out;
}

/** Outermost `group` ancestor, or null if the layer is not inside a group. */
export function enclosingGroupId(layers: CanvasLayer[], layerId: string): string | null {
	const groups = getAncestors(layers, layerId).filter((a) => a.kind === 'group');
	return groups.length ? groups[groups.length - 1].id : null;
}

/** True when the layer and every ancestor is visible (flat stage paint must check this). */
export function isEffectivelyVisible(
	layers: CanvasLayer[],
	layerId: string,
	map?: Map<string, CanvasLayer>
): boolean {
	const byId = map ?? new Map(layers.map((l) => [l.id, l]));
	let cur = byId.get(layerId);
	while (cur) {
		if (!cur.visible) return false;
		cur = cur.parentId ? byId.get(cur.parentId) : undefined;
	}
	return true;
}

/** True when the layer or any ancestor is locked (parent lock freezes the whole subtree). */
export function isEffectivelyLocked(
	layers: CanvasLayer[],
	layerId: string,
	map?: Map<string, CanvasLayer>
): boolean {
	const byId = map ?? new Map(layers.map((l) => [l.id, l]));
	let cur = byId.get(layerId);
	while (cur) {
		if (cur.locked) return true;
		cur = cur.parentId ? byId.get(cur.parentId) : undefined;
	}
	return false;
}

function parentOf(
	layers: CanvasLayer[],
	layerId: string,
	map?: Map<string, CanvasLayer>
): CanvasLayer | undefined {
	const byId = map ?? new Map(layers.map((l) => [l.id, l]));
	const layer = byId.get(layerId);
	return layer?.parentId ? byId.get(layer.parentId) : undefined;
}

/** Child X/Y is owned by an hBox / vBox / wrap / grid parent. */
export function isLayoutPositionLocked(
	layers: CanvasLayer[],
	layerId: string,
	map?: Map<string, CanvasLayer>
): boolean {
	const parent = parentOf(layers, layerId, map);
	return !!parent && LAYOUT_POSITION_KINDS.has(parent.kind);
}

/** Child W/H is owned by a grid / scaleBox parent. */
export function isLayoutSizeLocked(
	layers: CanvasLayer[],
	layerId: string,
	map?: Map<string, CanvasLayer>
): boolean {
	const parent = parentOf(layers, layerId, map);
	return !!parent && LAYOUT_SIZE_KINDS.has(parent.kind);
}

/**
 * Ancestors to draw while a nested layer is selected (UMG / Canva parent chrome).
 * Skips `canvasPanel` (full-bleed artboard) and layers already in the selection.
 */
export function selectionAncestorIds(layers: CanvasLayer[], selectedIds: string[]): string[] {
	const selected = new Set(selectedIds);
	const out: string[] = [];
	const seen = new Set<string>();
	for (const id of selectedIds) {
		for (const anc of getAncestors(layers, id)) {
			if (selected.has(anc.id) || seen.has(anc.id) || anc.kind === 'canvasPanel') continue;
			seen.add(anc.id);
			out.push(anc.id);
		}
	}
	return out;
}

/**
 * CSS transform for a flat-stage layer so ancestor rotations orbit children
 * around each ancestor's center (DOM is not nested).
 * Uses transform-origin top-left (0 0) of the layer box.
 */
export function paintTransformForLayer(
	layers: CanvasLayer[],
	layerId: string,
	absMap: Map<string, CanvasLayerRect>,
	map?: Map<string, CanvasLayer>
): string | undefined {
	const byId = map ?? new Map(layers.map((l) => [l.id, l]));
	const layer = byId.get(layerId);
	if (!layer) return undefined;
	const selfAbs = absMap.get(layerId) ?? layer.rect;

	const ancestors: CanvasLayer[] = [];
	let cur = layer.parentId ? byId.get(layer.parentId) : undefined;
	while (cur) {
		ancestors.unshift(cur);
		cur = cur.parentId ? byId.get(cur.parentId) : undefined;
	}

	const parts: string[] = [];
	for (const anc of ancestors) {
		const deg = anc.rotation ?? 0;
		if (!deg) continue;
		const a = absMap.get(anc.id) ?? anc.rect;
		const ox = a.x + a.w / 2 - selfAbs.x;
		const oy = a.y + a.h / 2 - selfAbs.y;
		parts.push(`translate(${ox}px, ${oy}px) rotate(${deg}deg) translate(${-ox}px, ${-oy}px)`);
	}

	const own = layer.rotation ?? 0;
	if (own) {
		const ox = selfAbs.w / 2;
		const oy = selfAbs.h / 2;
		parts.push(`translate(${ox}px, ${oy}px) rotate(${own}deg) translate(${-ox}px, ${-oy}px)`);
	}

	return parts.length ? parts.join(' ') : undefined;
}

export function isDescendant(
	layers: CanvasLayer[],
	maybeChildId: string,
	ancestorId: string
): boolean {
	return getAncestors(layers, maybeChildId).some((a) => a.id === ancestorId);
}

export function canReparent(
	layers: CanvasLayer[],
	layerId: string,
	newParentId: string | null
): boolean {
	if (newParentId === null) return true;
	if (layerId === newParentId) return false;
	const parent = layers.find((l) => l.id === newParentId);
	if (!parent || !canHaveChildren(parent)) return false;
	if (isDescendant(layers, newParentId, layerId)) return false;
	return true;
}

export const ANCHOR_PRESETS = {
	topLeft: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
	topCenter: { minX: 0.5, minY: 0, maxX: 0.5, maxY: 0 },
	topRight: { minX: 1, minY: 0, maxX: 1, maxY: 0 },
	centerLeft: { minX: 0, minY: 0.5, maxX: 0, maxY: 0.5 },
	center: { minX: 0.5, minY: 0.5, maxX: 0.5, maxY: 0.5 },
	centerRight: { minX: 1, minY: 0.5, maxX: 1, maxY: 0.5 },
	bottomLeft: { minX: 0, minY: 1, maxX: 0, maxY: 1 },
	bottomCenter: { minX: 0.5, minY: 1, maxX: 0.5, maxY: 1 },
	bottomRight: { minX: 1, minY: 1, maxX: 1, maxY: 1 },
	stretch: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
	stretchHorizontal: { minX: 0, minY: 0, maxX: 1, maxY: 0 },
	stretchVertical: { minX: 0, minY: 0, maxX: 0, maxY: 1 }
} as const satisfies Record<string, CanvasAnchors>;

/** Resolve UMG slot against parent content size → local rect. */
export function resolveSlotRect(
	parentSize: { width: number; height: number },
	slot: CanvasSlot
): CanvasLayerRect {
	const { anchors, offsets } = slot;
	const left = anchors.minX * parentSize.width + offsets.left;
	const top = anchors.minY * parentSize.height + offsets.top;
	const right = anchors.maxX * parentSize.width - offsets.right;
	const bottom = anchors.maxY * parentSize.height - offsets.bottom;
	return {
		x: left,
		y: top,
		w: Math.max(1, right - left),
		h: Math.max(1, bottom - top)
	};
}

/** Build slot offsets from a local rect + anchors (keeps anchors, recomputes offsets). */
export function slotFromLocalRect(
	parentSize: { width: number; height: number },
	rect: CanvasLayerRect,
	anchors: CanvasAnchors = ANCHOR_PRESETS.topLeft
): CanvasSlot {
	return {
		anchors: { ...anchors },
		offsets: {
			left: rect.x - anchors.minX * parentSize.width,
			top: rect.y - anchors.minY * parentSize.height,
			right: anchors.maxX * parentSize.width - (rect.x + rect.w),
			bottom: anchors.maxY * parentSize.height - (rect.y + rect.h)
		}
	};
}

/**
 * Translate a UMG slot without changing size.
 * `right` / `bottom` are inverted (distance from the opposite anchored edge).
 */
export function translateSlot(slot: CanvasSlot, dx: number, dy: number): CanvasSlot {
	if (!dx && !dy) return slot;
	return {
		...slot,
		offsets: {
			left: slot.offsets.left + dx,
			right: slot.offsets.right - dx,
			top: slot.offsets.top + dy,
			bottom: slot.offsets.bottom - dy
		}
	};
}

/**
 * Keyboard nudge along one axis.
 * With snap: land on the next/previous grid line (if already on-grid, move one cell; Shift = two).
 */
export function stepAxis(
	value: number,
	dir: 1 | -1,
	opts: { snap: boolean; cell: number; coarse?: boolean }
): number {
	const cell = opts.cell;
	if (!opts.snap || cell <= 0) return value + dir * (opts.coarse ? 10 : 1);
	const step = opts.coarse ? cell * 2 : cell;
	const eps = 1e-6;
	const onGrid = Math.abs(value - Math.round(value / cell) * cell) < eps;
	if (dir > 0) {
		if (onGrid) return value + step;
		return Math.ceil((value + eps) / cell) * cell;
	}
	if (onGrid) return value - step;
	return Math.floor((value - eps) / cell) * cell;
}

export function contentPadding(layer: CanvasLayer): {
	left: number;
	top: number;
	right: number;
	bottom: number;
} {
	const p = layer.slot?.padding;
	return {
		left: p?.left ?? 0,
		top: p?.top ?? 0,
		right: p?.right ?? 0,
		bottom: p?.bottom ?? 0
	};
}

export function contentSize(
	layerRect: CanvasLayerRect,
	layer: CanvasLayer
): { width: number; height: number } {
	const pad = contentPadding(layer);
	return {
		width: Math.max(0, layerRect.w - pad.left - pad.right),
		height: Math.max(0, layerRect.h - pad.top - pad.bottom)
	};
}

/**
 * Compute absolute (document) rect for every layer via parent walk + layout boxes.
 * Returns map layerId → absolute rect.
 */
export function computeAbsoluteRects(
	layers: CanvasLayer[],
	rootSize: { width: number; height: number }
): Map<string, CanvasLayerRect> {
	const abs = new Map<string, CanvasLayerRect>();
	const byParent = new Map<string | null, CanvasLayer[]>();
	for (const l of layers) {
		const pid = l.parentId ?? null;
		const list = byParent.get(pid) ?? [];
		list.push(l);
		byParent.set(pid, list);
	}
	for (const [, list] of byParent) {
		list.sort((a, b) => a.zIndex - b.zIndex || (a.slot?.order ?? 0) - (b.slot?.order ?? 0));
	}

	const layoutUnder = (
		parentId: string | null,
		parentAbs: CanvasLayerRect | null,
		parentLayer: CanvasLayer | null
	) => {
		const children = byParent.get(parentId) ?? [];
		if (!children.length) return;

		const parentW = parentAbs?.w ?? rootSize.width;
		const parentH = parentAbs?.h ?? rootSize.height;
		const pad = parentLayer
			? contentPadding(parentLayer)
			: { left: 0, top: 0, right: 0, bottom: 0 };
		const originX = (parentAbs?.x ?? 0) + pad.left;
		const originY = (parentAbs?.y ?? 0) + pad.top;
		const contentW = Math.max(0, parentW - pad.left - pad.right);
		const contentH = Math.max(0, parentH - pad.top - pad.bottom);
		const kind = parentLayer?.kind;

		let placed: { layer: CanvasLayer; local: CanvasLayerRect }[] = [];

		if (kind === 'hBox' || kind === 'vBox') {
			const gap = parentLayer?.gap ?? 0;
			const horizontal = kind === 'hBox';
			let cursor = 0;
			const flexKids = children.filter((c) => (c.slot?.sizeRule ?? 'fixed') === 'fill');
			const fixedKids = children.filter((c) => (c.slot?.sizeRule ?? 'fixed') !== 'fill');
			let fixedTotal = 0;
			for (const c of fixedKids) {
				const r = c.rect;
				fixedTotal += horizontal ? r.w : r.h;
			}
			fixedTotal += gap * Math.max(0, children.length - 1);
			const remaining = Math.max(0, (horizontal ? contentW : contentH) - fixedTotal);
			const fillEach = flexKids.length ? remaining / flexKids.length : 0;

			for (const c of children) {
				const rule = c.slot?.sizeRule ?? 'fixed';
				const align = c.slot?.alignment ?? { x: 0, y: 0 };
				if (horizontal) {
					const w = rule === 'fill' ? fillEach : c.rect.w;
					const h = rule === 'fill' ? contentH : c.rect.h;
					const y = (contentH - h) * align.y;
					placed.push({ layer: c, local: { x: cursor, y, w, h } });
					cursor += w + gap;
				} else {
					const h = rule === 'fill' ? fillEach : c.rect.h;
					const w = rule === 'fill' ? contentW : c.rect.w;
					const x = (contentW - w) * align.x;
					placed.push({ layer: c, local: { x, y: cursor, w, h } });
					cursor += h + gap;
				}
			}
		} else if (kind === 'wrapBox') {
			const gap = parentLayer?.gap ?? 0;
			let x = 0;
			let y = 0;
			let rowH = 0;
			for (const c of children) {
				const w = Math.min(c.rect.w, contentW);
				const h = c.rect.h;
				if (x > 0 && x + w > contentW) {
					x = 0;
					y += rowH + gap;
					rowH = 0;
				}
				placed.push({ layer: c, local: { x, y, w, h } });
				x += w + gap;
				rowH = Math.max(rowH, h);
			}
		} else if (kind === 'uniformGrid') {
			const gap = parentLayer?.gap ?? 0;
			const cols = Math.max(1, parentLayer?.columns ?? 2);
			const cellW = Math.max(1, (contentW - gap * Math.max(0, cols - 1)) / cols);
			const rows = Math.max(1, Math.ceil(children.length / cols));
			const cellH = Math.max(1, (contentH - gap * Math.max(0, rows - 1)) / rows);
			children.forEach((c, i) => {
				const col = i % cols;
				const row = Math.floor(i / cols);
				placed.push({
					layer: c,
					local: {
						x: col * (cellW + gap),
						y: row * (cellH + gap),
						w: cellW,
						h: cellH
					}
				});
			});
		} else if (kind === 'sizeBox' || kind === 'scaleBox') {
			for (const c of children) {
				const slot = c.slot ?? defaultSlotFromRect(c.rect);
				let local = resolveSlotRect({ width: contentW, height: contentH }, slot);
				if (kind === 'scaleBox' && c.rect.w > 0 && c.rect.h > 0) {
					const sx = contentW / c.rect.w;
					const sy = contentH / c.rect.h;
					const s = Math.min(sx, sy);
					const w = c.rect.w * s;
					const h = c.rect.h * s;
					local = {
						x: (contentW - w) / 2,
						y: (contentH - h) / 2,
						w,
						h
					};
				} else if (kind === 'sizeBox') {
					local = {
						x: Math.max(0, Math.min(local.x, contentW - 1)),
						y: Math.max(0, Math.min(local.y, contentH - 1)),
						w: Math.min(local.w, contentW),
						h: Math.min(local.h, contentH)
					};
				}
				placed.push({ layer: c, local });
			}
		} else {
			// canvasPanel / border / group / overlay / namedSlot / image / shapes / root — freeform slots
			for (const c of children) {
				const slot = c.slot ?? defaultSlotFromRect(c.rect);
				const local = resolveSlotRect({ width: contentW, height: contentH }, slot);
				placed.push({ layer: c, local });
			}
		}

		for (const { layer, local } of placed) {
			const absolute: CanvasLayerRect = {
				x: originX + local.x,
				y: originY + local.y,
				w: local.w,
				h: local.h
			};
			abs.set(layer.id, absolute);
			layoutUnder(layer.id, absolute, layer);
		}
	};

	layoutUnder(null, null, null);
	return abs;
}

export function absoluteRectFor(
	layerId: string,
	layers: CanvasLayer[],
	rootSize: { width: number; height: number }
): CanvasLayerRect | null {
	return computeAbsoluteRects(layers, rootSize).get(layerId) ?? null;
}

/**
 * CSS clip-path inset for a child absolute rect clipped by ancestors with clipChildren.
 * Values are relative to the child's own box.
 * `scrollBox` always clips (UMG-style viewport).
 */
export function clipPathForLayer(
	layerId: string,
	layers: CanvasLayer[],
	absMap: Map<string, CanvasLayerRect>
): string | undefined {
	const child = absMap.get(layerId);
	if (!child) return undefined;
	const map = new Map(layers.map((l) => [l.id, l]));
	let cur = map.get(layerId);
	let clip: CanvasLayerRect | null = null;
	while (cur?.parentId) {
		const parent = map.get(cur.parentId);
		if (!parent) break;
		if (parent.clipChildren || parent.kind === 'scrollBox') {
			const pa = absMap.get(parent.id);
			if (pa) {
				clip = clip
					? {
							x: Math.max(clip.x, pa.x),
							y: Math.max(clip.y, pa.y),
							w: Math.min(clip.x + clip.w, pa.x + pa.w) - Math.max(clip.x, pa.x),
							h: Math.min(clip.y + clip.h, pa.y + pa.h) - Math.max(clip.y, pa.y)
						}
					: { ...pa };
				if (clip.w <= 0 || clip.h <= 0) return 'inset(100%)';
			}
		}
		cur = parent;
	}
	if (!clip) return undefined;
	const top = Math.max(0, clip.y - child.y);
	const left = Math.max(0, clip.x - child.x);
	const right = Math.max(0, child.x + child.w - (clip.x + clip.w));
	const bottom = Math.max(0, child.y + child.h - (clip.y + clip.h));
	if (top === 0 && left === 0 && right === 0 && bottom === 0) return undefined;
	return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}

/** Scrollbar thumb size/position for a scrollBox viewport (preview chrome). */
export function scrollBarMetrics(
	viewport: number,
	maxScroll: number,
	offset: number
): { thumb: number; offset: number; track: number } | null {
	if (maxScroll <= 0 || viewport <= 0) return null;
	const content = viewport + maxScroll;
	const thumb = Math.max(18, Math.min(viewport, (viewport / content) * viewport));
	const travel = Math.max(0, viewport - thumb);
	const thumbOffset = maxScroll > 0 ? (offset / maxScroll) * travel : 0;
	return { thumb, offset: thumbOffset, track: viewport };
}

/** Max scrollable overflow of a scrollBox (content extent beyond the viewport). */
export function scrollBoxOverflow(
	scrollBoxId: string,
	layers: CanvasLayer[],
	absMap: Map<string, CanvasLayerRect>
): { maxX: number; maxY: number } {
	const box = absMap.get(scrollBoxId);
	if (!box) return { maxX: 0, maxY: 0 };
	let maxR = box.w;
	let maxB = box.h;
	for (const l of layers) {
		if ((l.parentId ?? null) !== scrollBoxId) continue;
		const r = absMap.get(l.id);
		if (!r) continue;
		maxR = Math.max(maxR, r.x + r.w - box.x);
		maxB = Math.max(maxB, r.y + r.h - box.y);
	}
	return {
		maxX: Math.max(0, maxR - box.w),
		maxY: Math.max(0, maxB - box.h)
	};
}

/**
 * Shift descendants of scrollBoxes by ephemeral scroll offsets (preview only).
 * ScrollBox frames themselves stay put.
 */
export function applyScrollBoxOffsets(
	layers: CanvasLayer[],
	absMap: Map<string, CanvasLayerRect>,
	offsets: ReadonlyMap<string, { x: number; y: number }>
): Map<string, CanvasLayerRect> {
	if (!offsets.size) return absMap;
	const byId = new Map(layers.map((l) => [l.id, l]));
	const out = new Map<string, CanvasLayerRect>();
	for (const [id, rect] of absMap) {
		let dx = 0;
		let dy = 0;
		let cur = byId.get(id);
		while (cur?.parentId) {
			const parent = byId.get(cur.parentId);
			if (!parent) break;
			if (parent.kind === 'scrollBox') {
				const o = offsets.get(parent.id);
				if (o) {
					dx -= o.x;
					dy -= o.y;
				}
			}
			cur = parent;
		}
		out.set(id, dx || dy ? { ...rect, x: rect.x + dx, y: rect.y + dy } : rect);
	}
	return out;
}

export function reparentLayer(
	layers: CanvasLayer[],
	layerId: string,
	newParentId: string | null,
	rootSize: { width: number; height: number }
): CanvasLayer[] {
	if (!canReparent(layers, layerId, newParentId)) return layers;
	const absMap = computeAbsoluteRects(layers, rootSize);
	const layer = layers.find((l) => l.id === layerId);
	if (!layer) return layers;
	const abs = absMap.get(layerId) ?? layer.rect;

	let parentAbs: CanvasLayerRect = { x: 0, y: 0, w: rootSize.width, h: rootSize.height };
	let parentLayer: CanvasLayer | null = null;
	if (newParentId) {
		parentLayer = layers.find((l) => l.id === newParentId) ?? null;
		const pa = absMap.get(newParentId);
		if (pa) parentAbs = pa;
	}
	const pad = parentLayer ? contentPadding(parentLayer) : { left: 0, top: 0, right: 0, bottom: 0 };
	const contentW = Math.max(0, parentAbs.w - pad.left - pad.right);
	const contentH = Math.max(0, parentAbs.h - pad.top - pad.bottom);
	const local: CanvasLayerRect = {
		x: abs.x - parentAbs.x - pad.left,
		y: abs.y - parentAbs.y - pad.top,
		w: abs.w,
		h: abs.h
	};
	const siblings = getChildren(layers, newParentId).filter((c) => c.id !== layerId);
	const zIndex = siblings.length ? Math.max(...siblings.map((s) => s.zIndex)) + 1 : 0;
	const slot = slotFromLocalRect({ width: contentW, height: contentH }, local);

	return layers.map((l) =>
		l.id === layerId
			? {
					...l,
					parentId: newParentId,
					rect: local,
					slot: { ...slot, order: zIndex },
					zIndex
				}
			: l
	);
}

/** Wrap one or more layers in a new parent (`group`, `hBox`, `border`, …). */
export function wrapSelection(
	doc: CanvasDocument,
	selectedIds: string[],
	wrapKind: CanvasLayerKind = 'group'
): { doc: CanvasDocument; wrapperId: string } | null {
	if (!selectedIds.length) return null;
	const set = new Set(selectedIds);
	let layers = doc.layers;
	const rootSize = { width: doc.width, height: doc.height };

	// Exclude descendants when parent+child are both selected
	let selected = layers.filter((l) => set.has(l.id));
	selected = selected.filter(
		(l) => !selected.some((other) => other.id !== l.id && isDescendant(layers, l.id, other.id))
	);
	if (!selected.length) return null;
	const wrapIds = selected.map((l) => l.id);

	// Only wrap siblings that share the same parent — otherwise lift to root first
	let parentId = selected[0].parentId ?? null;
	if (!selected.every((l) => (l.parentId ?? null) === parentId)) {
		for (const id of wrapIds) {
			layers = reparentLayer(layers, id, null, rootSize);
		}
		parentId = null;
		selected = wrapIds
			.map((id) => layers.find((l) => l.id === id))
			.filter(Boolean) as CanvasLayer[];
	}

	const absMap = computeAbsoluteRects(layers, rootSize);
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const l of selected) {
		const r = absMap.get(l.id) ?? l.rect;
		minX = Math.min(minX, r.x);
		minY = Math.min(minY, r.y);
		maxX = Math.max(maxX, r.x + r.w);
		maxY = Math.max(maxY, r.y + r.h);
	}
	const wrapperAbs: CanvasLayerRect = {
		x: minX,
		y: minY,
		w: Math.max(24, maxX - minX),
		h: Math.max(24, maxY - minY)
	};

	let parentAbs: CanvasLayerRect = { x: 0, y: 0, w: doc.width, h: doc.height };
	let parentLayer: CanvasLayer | null = null;
	if (parentId) {
		parentLayer = layers.find((l) => l.id === parentId) ?? null;
		const pa = absMap.get(parentId);
		if (pa) parentAbs = pa;
	}
	const pad = parentLayer ? contentPadding(parentLayer) : { left: 0, top: 0, right: 0, bottom: 0 };
	const contentW = Math.max(0, parentAbs.w - pad.left - pad.right);
	const contentH = Math.max(0, parentAbs.h - pad.top - pad.bottom);
	const wrapperLocal: CanvasLayerRect = {
		x: wrapperAbs.x - parentAbs.x - pad.left,
		y: wrapperAbs.y - parentAbs.y - pad.top,
		w: wrapperAbs.w,
		h: wrapperAbs.h
	};
	const zIndex = Math.min(...selected.map((s) => s.zIndex));
	const wrapper = createCanvasLayer(wrapKind, {
		name: wrapKind === 'group' ? 'Group' : wrapKind,
		parentId,
		rect: wrapperLocal,
		slot: slotFromLocalRect({ width: contentW, height: contentH }, wrapperLocal),
		zIndex,
		clipChildren: wrapKind === 'border' || wrapKind === 'canvasPanel' || wrapKind === 'scrollBox',
		autoSizeChildren: wrapKind === 'group',
		fill:
			wrapKind === 'border' || wrapKind === 'roundRect'
				? '#ffffff'
				: wrapKind === 'group'
					? 'transparent'
					: undefined,
		borderRadius: wrapKind === 'border' || wrapKind === 'roundRect' ? 12 : undefined,
		opacity: 1
	});

	let resultLayers = [...layers, wrapper];
	for (const id of wrapIds) {
		resultLayers = reparentLayer(resultLayers, id, wrapper.id, rootSize);
	}

	return { doc: { ...doc, layers: resultLayers }, wrapperId: wrapper.id };
}

export function groupLayers(doc: CanvasDocument, selectedIds: string[]) {
	return wrapSelection(doc, selectedIds, 'group');
}

export function ungroupLayers(doc: CanvasDocument, groupId: string): CanvasDocument {
	const group = doc.layers.find((l) => l.id === groupId);
	if (!group) return doc;
	const parentId = group.parentId ?? null;
	const children = getChildren(doc.layers, groupId);
	const rootSize = { width: doc.width, height: doc.height };
	let layers = doc.layers;
	for (const c of children) {
		layers = reparentLayer(layers, c.id, parentId, rootSize);
	}
	layers = layers.filter((l) => l.id !== groupId);
	return { ...doc, layers };
}

/** Delete layer and all descendants. */
export function deleteSubtree(doc: CanvasDocument, ids: string[]): CanvasDocument {
	const remove = new Set<string>();
	for (const id of ids) {
		for (const sid of getSubtreeIds(doc.layers, id)) remove.add(sid);
	}
	return { ...doc, layers: doc.layers.filter((l) => !remove.has(l.id)) };
}

/** Duplicate subtree with new ids; keeps relative hierarchy. */
export function duplicateSubtree(
	doc: CanvasDocument,
	rootIds: string[],
	offset = { x: 16, y: 16 }
): { doc: CanvasDocument; newIds: string[] } {
	const absMap = computeAbsoluteRects(doc.layers, { width: doc.width, height: doc.height });
	const idMap = new Map<string, string>();
	const toCopy: CanvasLayer[] = [];
	for (const rootId of rootIds) {
		for (const id of getSubtreeIds(doc.layers, rootId)) {
			if (idMap.has(id)) continue;
			const layer = doc.layers.find((l) => l.id === id);
			if (!layer) continue;
			idMap.set(id, uid('layer'));
			toCopy.push(layer);
		}
	}

	const clones: CanvasLayer[] = toCopy.map((layer) => {
		const newId = idMap.get(layer.id)!;
		const isRoot = rootIds.includes(layer.id);
		const parentMapped =
			layer.parentId && idMap.has(layer.parentId)
				? idMap.get(layer.parentId)!
				: isRoot
					? (layer.parentId ?? null)
					: (layer.parentId ?? null);
		let rect = { ...layer.rect };
		let slot = layer.slot
			? { ...layer.slot, anchors: { ...layer.slot.anchors }, offsets: { ...layer.slot.offsets } }
			: undefined;
		if (isRoot) {
			rect = { ...rect, x: rect.x + offset.x, y: rect.y + offset.y };
			if (slot) {
				slot = translateSlot(slot, offset.x, offset.y);
			}
		}
		return {
			...layer,
			id: newId,
			parentId: parentMapped,
			rect,
			slot,
			overrides: layer.overrides ? { ...layer.overrides } : undefined
		};
	});

	// Fix parentId for non-copied parents of roots — already handled
	const newIds = rootIds.map((id) => idMap.get(id)!).filter(Boolean);
	return { doc: { ...doc, layers: [...doc.layers, ...clones] }, newIds };
}

export function reorderSiblings(
	layers: CanvasLayer[],
	parentId: string | null,
	orderedChildIds: string[]
): CanvasLayer[] {
	const set = new Set(orderedChildIds);
	return layers.map((l) => {
		if ((l.parentId ?? null) !== parentId || !set.has(l.id)) return l;
		const z = orderedChildIds.indexOf(l.id);
		return { ...l, zIndex: z, slot: { ...(l.slot ?? defaultSlotFromRect(l.rect)), order: z } };
	});
}

/** Sync layer.rect from its slot given parent size (for editors that edit rect). */
export function syncRectFromSlot(
	layer: CanvasLayer,
	parentSize: { width: number; height: number }
): CanvasLayer {
	if (!layer.slot) return layer;
	return { ...layer, rect: resolveSlotRect(parentSize, layer.slot) };
}

export function syncSlotFromRect(
	layer: CanvasLayer,
	parentSize: { width: number; height: number }
): CanvasLayer {
	const anchors = layer.slot?.anchors ?? ANCHOR_PRESETS.topLeft;
	const slot = {
		...slotFromLocalRect(parentSize, layer.rect, anchors),
		padding: layer.slot?.padding,
		sizeRule: layer.slot?.sizeRule,
		alignment: layer.slot?.alignment,
		order: layer.slot?.order
	};
	return { ...layer, slot, rect: rectFromSlot(slot, parentSize) };
}

const GROUP_FIT_EPS = 0.5;

function rectsApproxEqual(a: CanvasLayerRect, b: CanvasLayerRect, eps = GROUP_FIT_EPS): boolean {
	return (
		Math.abs(a.x - b.x) < eps &&
		Math.abs(a.y - b.y) < eps &&
		Math.abs(a.w - b.w) < eps &&
		Math.abs(a.h - b.h) < eps
	);
}

function rootFrame(rootSize: { width: number; height: number }): CanvasLayerRect {
	return { x: 0, y: 0, w: rootSize.width, h: rootSize.height };
}

function ancestorDepth(
	layers: CanvasLayer[],
	layerId: string,
	map: Map<string, CanvasLayer>
): number {
	let d = 0;
	let cur = map.get(layerId);
	while (cur?.parentId) {
		d += 1;
		cur = map.get(cur.parentId);
		if (d > layers.length) break;
	}
	return d;
}

/** Write an absolute rect back to layer.rect / slot in parent-local space. */
export function layerFromAbsoluteRect(
	layer: CanvasLayer,
	absRect: CanvasLayerRect,
	parentAbs: CanvasLayerRect | null,
	parentLayer: CanvasLayer | null,
	rootSize: { width: number; height: number }
): CanvasLayer {
	const pad = parentLayer ? contentPadding(parentLayer) : { left: 0, top: 0, right: 0, bottom: 0 };
	const frame = parentAbs ?? rootFrame(rootSize);
	const originX = frame.x + pad.left;
	const originY = frame.y + pad.top;
	const contentW = Math.max(0, frame.w - pad.left - pad.right);
	const contentH = Math.max(0, frame.h - pad.top - pad.bottom);
	const local: CanvasLayerRect = {
		x: absRect.x - originX,
		y: absRect.y - originY,
		w: absRect.w,
		h: absRect.h
	};
	return syncSlotFromRect({ ...layer, rect: local }, { width: contentW, height: contentH });
}

/**
 * Figma-style groups: origin + size is the AABB of direct children.
 * Children keep their absolute positions (local coords are rebased).
 * Nested groups are fitted innermost-first.
 */
export function fitGroupsToChildren(
	layers: CanvasLayer[],
	rootSize: { width: number; height: number }
): CanvasLayer[] {
	const byId = new Map(layers.map((l) => [l.id, l]));
	const groups = layers
		.filter((l) => l.kind === 'group')
		.sort((a, b) => ancestorDepth(layers, b.id, byId) - ancestorDepth(layers, a.id, byId));
	if (!groups.length) return layers;

	let next = layers;
	for (const group of groups) {
		next = fitOneGroup(next, group.id, rootSize);
	}
	return next;
}

function fitOneGroup(
	layers: CanvasLayer[],
	groupId: string,
	rootSize: { width: number; height: number }
): CanvasLayer[] {
	const children = getChildren(layers, groupId);
	if (!children.length) return layers;

	const absMap = computeAbsoluteRects(layers, rootSize);
	const group = layers.find((l) => l.id === groupId);
	if (!group) return layers;

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const c of children) {
		const r = absMap.get(c.id);
		if (!r) continue;
		minX = Math.min(minX, r.x);
		minY = Math.min(minY, r.y);
		maxX = Math.max(maxX, r.x + r.w);
		maxY = Math.max(maxY, r.y + r.h);
	}
	if (!Number.isFinite(minX)) return layers;

	const newAbs: CanvasLayerRect = {
		x: minX,
		y: minY,
		w: Math.max(1, maxX - minX),
		h: Math.max(1, maxY - minY)
	};
	const oldAbs = absMap.get(groupId) ?? group.rect;
	if (rectsApproxEqual(oldAbs, newAbs)) return layers;

	const byId = new Map(layers.map((l) => [l.id, l]));
	const parent = group.parentId ? (byId.get(group.parentId) ?? null) : null;
	const parentAbs = group.parentId ? (absMap.get(group.parentId) ?? null) : rootFrame(rootSize);
	const updated = new Map<string, CanvasLayer>();
	updated.set(groupId, layerFromAbsoluteRect(group, newAbs, parentAbs, parent, rootSize));
	for (const c of children) {
		const r = absMap.get(c.id);
		if (!r) continue;
		updated.set(c.id, layerFromAbsoluteRect(c, r, newAbs, group, rootSize));
	}
	return layers.map((l) => updated.get(l.id) ?? l);
}

/** Groups default on; other containers opt in via `autoSizeChildren`. */
export function shouldAutoSizeChildren(layer: CanvasLayer): boolean {
	if (layer.autoSizeChildren != null) return layer.autoSizeChildren;
	return layer.kind === 'group';
}

export function topLevelSelectedIds(layers: CanvasLayer[], ids: string[]): string[] {
	const set = new Set(ids);
	return ids.filter((id) => !getAncestors(layers, id).some((a) => set.has(a.id)));
}

export function unionAbsRect(
	absMap: Map<string, CanvasLayerRect>,
	ids: string[]
): CanvasLayerRect | null {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const id of ids) {
		const r = absMap.get(id);
		if (!r) continue;
		minX = Math.min(minX, r.x);
		minY = Math.min(minY, r.y);
		maxX = Math.max(maxX, r.x + r.w);
		maxY = Math.max(maxY, r.y + r.h);
	}
	if (!Number.isFinite(minX)) return null;
	return { x: minX, y: minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
}

function applyAbsoluteRects(
	layers: CanvasLayer[],
	nextAbsMap: Map<string, CanvasLayerRect>,
	prevAbsMap: Map<string, CanvasLayerRect>,
	rootSize: { width: number; height: number }
): CanvasLayer[] {
	const byId = new Map(layers.map((l) => [l.id, l]));
	return layers.map((l) => {
		const abs = nextAbsMap.get(l.id);
		if (!abs) return l;
		const prev = prevAbsMap.get(l.id);
		const parent = l.parentId ? (byId.get(l.parentId) ?? null) : null;
		const parentAbs = l.parentId
			? (nextAbsMap.get(l.parentId) ?? prevAbsMap.get(l.parentId) ?? null)
			: rootFrame(rootSize);
		const updated = layerFromAbsoluteRect(l, abs, parentAbs, parent, rootSize);
		return prev ? applyTextAutoSize(l, updated, prev, abs) : updated;
	});
}

/**
 * Scale a group (or any subtree) from `prevAbs` to `nextAbs`.
 * Descendants keep their relative placement inside the box unless
 * `scaleDescendants` is false (then they keep world position).
 */
export function scaleSubtreeAbsolute(
	layers: CanvasLayer[],
	rootId: string,
	prevAbs: CanvasLayerRect,
	nextAbs: CanvasLayerRect,
	rootSize: { width: number; height: number },
	opts?: { scaleDescendants?: boolean }
): CanvasLayer[] {
	const scaleDescendants = opts?.scaleDescendants ?? true;
	const sx = prevAbs.w > 0 ? nextAbs.w / prevAbs.w : 1;
	const sy = prevAbs.h > 0 ? nextAbs.h / prevAbs.h : 1;
	const absMap = computeAbsoluteRects(layers, rootSize);
	const ids = new Set(getSubtreeIds(layers, rootId));
	const nextAbsMap = new Map<string, CanvasLayerRect>();
	for (const id of ids) {
		const r = absMap.get(id);
		if (!r) continue;
		if (id === rootId) {
			nextAbsMap.set(id, { ...nextAbs });
			continue;
		}
		if (!scaleDescendants) {
			nextAbsMap.set(id, r);
			continue;
		}
		nextAbsMap.set(id, {
			x: nextAbs.x + (r.x - prevAbs.x) * sx,
			y: nextAbs.y + (r.y - prevAbs.y) * sy,
			w: Math.max(1, r.w * sx),
			h: Math.max(1, r.h * sy)
		});
	}
	return applyAbsoluteRects(layers, nextAbsMap, absMap, rootSize);
}

/**
 * Scale (or move) a multi-selection as one AABB — Figma/Canva transform box.
 * Top-level selected layers map into `nextBox`; nested children follow if the
 * parent has auto-size children (groups default on).
 */
export function scaleSelectionAbsolute(
	layers: CanvasLayer[],
	selectedIds: string[],
	prevBox: CanvasLayerRect,
	nextBox: CanvasLayerRect,
	rootSize: { width: number; height: number }
): CanvasLayer[] {
	const sx = prevBox.w > 0 ? nextBox.w / prevBox.w : 1;
	const sy = prevBox.h > 0 ? nextBox.h / prevBox.h : 1;
	const absMap = computeAbsoluteRects(layers, rootSize);
	const byId = new Map(layers.map((l) => [l.id, l]));
	const nextAbsMap = new Map<string, CanvasLayerRect>();

	const mapRect = (r: CanvasLayerRect): CanvasLayerRect => ({
		x: nextBox.x + (r.x - prevBox.x) * sx,
		y: nextBox.y + (r.y - prevBox.y) * sy,
		w: Math.max(1, r.w * sx),
		h: Math.max(1, r.h * sy)
	});

	for (const id of topLevelSelectedIds(layers, selectedIds)) {
		const layer = byId.get(id);
		const r = absMap.get(id);
		if (!layer || !r) continue;
		nextAbsMap.set(id, mapRect(r));
		const scaleKids = shouldAutoSizeChildren(layer);
		for (const did of getDescendantIds(layers, id)) {
			const dr = absMap.get(did);
			if (!dr) continue;
			nextAbsMap.set(did, scaleKids ? mapRect(dr) : dr);
		}
	}
	return applyAbsoluteRects(layers, nextAbsMap, absMap, rootSize);
}
