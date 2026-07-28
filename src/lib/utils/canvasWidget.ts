import {
	createCanvasLayer,
	defaultSlotFromRect,
	ensureLayerSlot,
	type CanvasDocument,
	type CanvasExposedProp,
	type CanvasLayer,
	type CanvasWidgetDefinition
} from './canvasDocument.js';
import {
	computeAbsoluteRects,
	contentPadding,
	deleteSubtree,
	getChildren,
	getSubtreeIds,
	slotFromLocalRect
} from './canvasHierarchy.js';
import { uid } from './mediaTracks.js';

const EXPOSEABLE_FIELDS = [
	'text',
	'fill',
	'src',
	'color',
	'opacity',
	'visible',
	'name',
	'fontSize',
	'borderRadius',
	'stroke',
	'strokeWidth',
	'textBackground',
	'objectFit'
] as const;

export type CanvasExposeableField = (typeof EXPOSEABLE_FIELDS)[number];

export function isExposeableField(field: string): field is CanvasExposeableField {
	return (EXPOSEABLE_FIELDS as readonly string[]).includes(field);
}

export function createWidgetDefinition(
	partial?: Partial<Omit<CanvasWidgetDefinition, 'id'>> & { id?: string }
): CanvasWidgetDefinition {
	return {
		id: partial?.id ?? uid('widget'),
		name: partial?.name ?? 'New Widget',
		width: partial?.width ?? 320,
		height: partial?.height ?? 200,
		background: partial?.background ?? 'transparent',
		layers: (partial?.layers ?? []).map(ensureLayerSlot),
		exposed: partial?.exposed ?? []
	};
}

function remapLayerIds(layers: CanvasLayer[]): { layers: CanvasLayer[]; idMap: Map<string, string> } {
	const idMap = new Map<string, string>();
	for (const l of layers) idMap.set(l.id, uid('layer'));
	const next = layers.map((l) => ({
		...l,
		id: idMap.get(l.id)!,
		parentId: l.parentId && idMap.has(l.parentId) ? idMap.get(l.parentId)! : null,
		slot: l.slot
			? {
					...l.slot,
					anchors: { ...l.slot.anchors },
					offsets: { ...l.slot.offsets },
					padding: l.slot.padding ? { ...l.slot.padding } : undefined,
					alignment: l.slot.alignment ? { ...l.slot.alignment } : undefined
				}
			: defaultSlotFromRect(l.rect),
		overrides: l.overrides ? { ...l.overrides } : undefined
	}));
	return { layers: next, idMap };
}

/**
 * Create a User Widget from selected scene layers (must share same parent).
 * Replaces selection with a single widget instance.
 */
export function createWidgetFromSelection(
	doc: CanvasDocument,
	selectedIds: string[],
	name = 'Widget'
): { doc: CanvasDocument; definitionId: string; instanceId: string } | null {
	if (!selectedIds.length) return null;
	const set = new Set(selectedIds);
	const selected = doc.layers.filter((l) => set.has(l.id));
	if (!selected.length) return null;
	const parentId = selected[0].parentId ?? null;
	if (!selected.every((l) => (l.parentId ?? null) === parentId)) return null;

	const rootSize = { width: doc.width, height: doc.height };
	const absMap = computeAbsoluteRects(doc.layers, rootSize);

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	const subtreeIds = new Set<string>();
	for (const id of selectedIds) {
		for (const sid of getSubtreeIds(doc.layers, id)) subtreeIds.add(sid);
		const r = absMap.get(id) ?? selected.find((s) => s.id === id)!.rect;
		minX = Math.min(minX, r.x);
		minY = Math.min(minY, r.y);
		maxX = Math.max(maxX, r.x + r.w);
		maxY = Math.max(maxY, r.y + r.h);
	}

	const defW = Math.max(24, maxX - minX);
	const defH = Math.max(24, maxY - minY);

	const rawLayers = doc.layers.filter((l) => subtreeIds.has(l.id));
	const { layers: remapped, idMap } = remapLayerIds(rawLayers);

	// Re-root selected roots under null and convert abs → local within widget
	const defLayers = remapped.map((l) => {
		const oldId = [...idMap.entries()].find(([, n]) => n === l.id)?.[0];
		const wasRoot = oldId ? selectedIds.includes(oldId) : false;
		if (wasRoot) {
			const abs = oldId ? absMap.get(oldId) : null;
			const local = abs
				? { x: abs.x - minX, y: abs.y - minY, w: abs.w, h: abs.h }
				: l.rect;
			return {
				...l,
				parentId: null,
				rect: local,
				slot: defaultSlotFromRect(local)
			};
		}
		return l;
	});

	const definition = createWidgetDefinition({
		name,
		width: defW,
		height: defH,
		layers: defLayers,
		exposed: []
	});

	const zIndex = Math.min(...selected.map((s) => s.zIndex));
	const instanceRect = { x: minX, y: minY, w: defW, h: defH };
	// Convert instance rect to parent-local (respect content padding)
	let localRect = instanceRect;
	let slot = defaultSlotFromRect(instanceRect);
	if (parentId) {
		const parentLayer = doc.layers.find((l) => l.id === parentId) ?? null;
		const parentAbs = absMap.get(parentId) ?? { x: 0, y: 0, w: doc.width, h: doc.height };
		const pad = parentLayer
			? contentPadding(parentLayer)
			: { left: 0, top: 0, right: 0, bottom: 0 };
		const contentW = Math.max(1, parentAbs.w - pad.left - pad.right);
		const contentH = Math.max(1, parentAbs.h - pad.top - pad.bottom);
		localRect = {
			x: instanceRect.x - parentAbs.x - pad.left,
			y: instanceRect.y - parentAbs.y - pad.top,
			w: defW,
			h: defH
		};
		slot = slotFromLocalRect({ width: contentW, height: contentH }, localRect);
	} else {
		slot = slotFromLocalRect({ width: doc.width, height: doc.height }, instanceRect);
		localRect = instanceRect;
	}

	const instance = createCanvasLayer('widget', {
		name,
		parentId,
		definitionId: definition.id,
		overrides: {},
		rect: localRect,
		slot,
		zIndex
	});

	let layers = doc.layers.filter((l) => !subtreeIds.has(l.id));
	layers = [...layers, instance];

	return {
		doc: {
			...doc,
			version: 2,
			widgets: [...(doc.widgets ?? []), definition],
			layers
		},
		definitionId: definition.id,
		instanceId: instance.id
	};
}

/** Place a new instance of a widget definition into the document. */
export function placeWidgetInstance(
	doc: CanvasDocument,
	definitionId: string,
	opts?: { parentId?: string | null; x?: number; y?: number; name?: string }
): CanvasDocument | null {
	const def = (doc.widgets ?? []).find((w) => w.id === definitionId);
	if (!def) return null;
	const parentId = opts?.parentId ?? null;
	const absMap = computeAbsoluteRects(doc.layers, { width: doc.width, height: doc.height });
	const parentLayer = parentId ? (doc.layers.find((l) => l.id === parentId) ?? null) : null;
	const parentAbs = parentId
		? (absMap.get(parentId) ?? { x: 0, y: 0, w: doc.width, h: doc.height })
		: { x: 0, y: 0, w: doc.width, h: doc.height };
	const pad = parentLayer
		? contentPadding(parentLayer)
		: { left: 0, top: 0, right: 0, bottom: 0 };
	const contentW = Math.max(1, parentAbs.w - pad.left - pad.right);
	const contentH = Math.max(1, parentAbs.h - pad.top - pad.bottom);
	const x = opts?.x ?? (parentId ? Math.round((contentW - def.width) / 2) : 80);
	const y = opts?.y ?? (parentId ? Math.round((contentH - def.height) / 2) : 80);
	const rect = { x, y, w: def.width, h: def.height };
	const siblings = getChildren(doc.layers, parentId);
	const zIndex = siblings.length ? Math.max(...siblings.map((s) => s.zIndex)) + 1 : 0;
	const instance = createCanvasLayer('widget', {
		name: opts?.name ?? def.name,
		parentId,
		definitionId,
		overrides: {},
		rect,
		slot: slotFromLocalRect(
			parentId ? { width: contentW, height: contentH } : { width: doc.width, height: doc.height },
			rect
		),
		zIndex
	});
	return { ...doc, version: 2, layers: [...doc.layers, instance] };
}

/** Rename a widget definition (and matching instance names that still equal the old name). */
export function renameWidgetDefinition(
	doc: CanvasDocument,
	definitionId: string,
	name: string
): CanvasDocument {
	const trimmed = name.trim() || 'Widget';
	const prev = (doc.widgets ?? []).find((w) => w.id === definitionId);
	const oldName = prev?.name;
	return {
		...doc,
		version: 2,
		widgets: (doc.widgets ?? []).map((w) => (w.id === definitionId ? { ...w, name: trimmed } : w)),
		layers: doc.layers.map((l) =>
			l.kind === 'widget' && l.definitionId === definitionId && (!oldName || l.name === oldName)
				? { ...l, name: trimmed }
				: l
		)
	};
}

/** Duplicate a widget definition (new id, remapped layer ids). Does not place an instance. */
export function duplicateWidgetDefinition(
	doc: CanvasDocument,
	definitionId: string
): { doc: CanvasDocument; definitionId: string } | null {
	const def = (doc.widgets ?? []).find((w) => w.id === definitionId);
	if (!def) return null;
	const { layers, idMap } = remapLayerIds(def.layers);
	const exposed = def.exposed.map((e) => ({
		...e,
		id: uid('exp'),
		targetLayerId: idMap.get(e.targetLayerId) ?? e.targetLayerId
	}));
	const definition = createWidgetDefinition({
		name: `${def.name} Copy`,
		width: def.width,
		height: def.height,
		background: def.background,
		layers,
		exposed
	});
	return {
		doc: {
			...doc,
			version: 2,
			widgets: [...(doc.widgets ?? []), definition]
		},
		definitionId: definition.id
	};
}

/**
 * When a blueprint artboard size changes, optionally resize all instances to match.
 */
export function syncInstanceSizesToDefinition(
	doc: CanvasDocument,
	definitionId: string
): CanvasDocument {
	const def = (doc.widgets ?? []).find((w) => w.id === definitionId);
	if (!def) return doc;
	const absMap = computeAbsoluteRects(doc.layers, { width: doc.width, height: doc.height });
	return {
		...doc,
		layers: doc.layers.map((l) => {
			if (l.kind !== 'widget' || l.definitionId !== definitionId) return l;
			const parentId = l.parentId ?? null;
			const parentLayer = parentId ? (doc.layers.find((p) => p.id === parentId) ?? null) : null;
			const parentAbs = parentId
				? (absMap.get(parentId) ?? { x: 0, y: 0, w: doc.width, h: doc.height })
				: { x: 0, y: 0, w: doc.width, h: doc.height };
			const pad = parentLayer
				? contentPadding(parentLayer)
				: { left: 0, top: 0, right: 0, bottom: 0 };
			const contentW = Math.max(1, parentAbs.w - pad.left - pad.right);
			const contentH = Math.max(1, parentAbs.h - pad.top - pad.bottom);
			const rect = { ...l.rect, w: def.width, h: def.height };
			const slot = slotFromLocalRect(
				parentId ? { width: contentW, height: contentH } : { width: doc.width, height: doc.height },
				rect,
				l.slot?.anchors
			);
			return {
				...l,
				rect,
				slot: {
					...slot,
					padding: l.slot?.padding,
					sizeRule: l.slot?.sizeRule,
					alignment: l.slot?.alignment,
					order: l.slot?.order
				}
			};
		})
	};
}

function applyFieldOverride(layer: CanvasLayer, field: string, value: unknown): CanvasLayer {
	return { ...layer, [field]: value } as CanvasLayer;
}

/**
 * Resolve a widget instance into concrete layers (for render/export).
 * Layer ids are prefixed so they don't collide with scene ids.
 */
export function resolveWidgetInstance(
	instance: CanvasLayer,
	definition: CanvasWidgetDefinition,
	idPrefix?: string
): CanvasLayer[] {
	const prefix = idPrefix ?? `${instance.id}::`;
	const idMap = new Map<string, string>();
	for (const l of definition.layers) idMap.set(l.id, `${prefix}${l.id}`);

	const overrides = instance.overrides ?? {};
	const exposedById = new Map(definition.exposed.filter((e) => e.exposed).map((e) => [e.id, e]));

	const fieldOverrides = new Map<string, Map<string, unknown>>();
	for (const [propId, value] of Object.entries(overrides)) {
		const exp = exposedById.get(propId);
		if (!exp) continue;
		const m = fieldOverrides.get(exp.targetLayerId) ?? new Map();
		m.set(exp.field, value);
		fieldOverrides.set(exp.targetLayerId, m);
	}

	return definition.layers.map((l) => {
		let next: CanvasLayer = {
			...l,
			id: idMap.get(l.id)!,
			parentId: l.parentId ? (idMap.get(l.parentId) ?? null) : null,
			slot: l.slot
				? {
						...l.slot,
						anchors: { ...l.slot.anchors },
						offsets: { ...l.slot.offsets }
					}
				: defaultSlotFromRect(l.rect)
		};
		const fo = fieldOverrides.get(l.id);
		if (fo) {
			for (const [field, value] of fo) {
				next = applyFieldOverride(next, field, value);
			}
		}
		return next;
	});
}

/** Expand all widget instances in a layer list (nested widgets + named-slot injection). */
export function flattenLayersWithWidgets(
	layers: CanvasLayer[],
	widgets: CanvasWidgetDefinition[],
	depth = 0
): CanvasLayer[] {
	if (depth > 8) return layers;
	const defs = new Map(widgets.map((w) => [w.id, w]));
	const widgetIds = new Set(
		layers.filter((l) => l.kind === 'widget' && l.definitionId).map((l) => l.id)
	);
	const out: CanvasLayer[] = [];

	for (const layer of layers) {
		// Scene children of widget instances are re-attached during expand (named slots / host).
		if (layer.parentId && widgetIds.has(layer.parentId) && layer.kind !== 'widget') {
			continue;
		}

		if (layer.kind === 'widget' && layer.definitionId) {
			const def = defs.get(layer.definitionId);
			if (!def) {
				out.push(layer);
				continue;
			}
			const resolved = resolveWidgetInstance(layer, def);
			const nested = resolved.map((l) =>
				l.parentId === null ? { ...l, parentId: layer.id } : l
			);

			const slotByName = new Map<string, string>();
			for (const l of nested) {
				if (l.kind === 'namedSlot') {
					const key = (l.slotName || l.name || '').trim();
					if (key) slotByName.set(key, l.id);
				}
			}

			const sceneKids = layers.filter((l) => (l.parentId ?? null) === layer.id);
			const hostLocal: CanvasLayer = {
				...layer,
				parentId: null,
				kind: 'group',
				clipChildren: false,
				rect: { x: 0, y: 0, w: layer.rect.w, h: layer.rect.h },
				slot: defaultSlotFromRect({ x: 0, y: 0, w: layer.rect.w, h: layer.rect.h })
			};
			const layoutProbe = computeAbsoluteRects([hostLocal, ...nested], {
				width: layer.rect.w,
				height: layer.rect.h
			});
			const injected = sceneKids.map((kid) => {
				const target = kid.fillSlot?.trim();
				const slotId = target ? slotByName.get(target) : undefined;
				if (!slotId) {
					return { ...kid, parentId: layer.id };
				}
				// Scene stores widget-local rects (parentId = instance). Convert to
				// slot-local so paint/hit-test match the named slot coordinate space.
				const slotAbs = layoutProbe.get(slotId) ?? { x: 0, y: 0, w: 0, h: 0 };
				const local = {
					x: kid.rect.x - slotAbs.x,
					y: kid.rect.y - slotAbs.y,
					w: kid.rect.w,
					h: kid.rect.h
				};
				return {
					...kid,
					parentId: slotId,
					rect: local,
					slot: kid.slot
						? {
								...kid.slot,
								...slotFromLocalRect(
									{ width: Math.max(1, slotAbs.w), height: Math.max(1, slotAbs.h) },
									local,
									kid.slot.anchors
								)
							}
						: defaultSlotFromRect(local)
				};
			});

			out.push({
				...layer,
				clipChildren: true,
				kind: 'group',
				name: layer.name
			});
			out.push(...flattenLayersWithWidgets([...nested, ...injected], widgets, depth + 1));
		} else {
			out.push(layer);
		}
	}
	return out;
}

/**
 * Break / detach instance: inline resolved layers into the document and remove the instance.
 */
export function breakWidgetInstance(doc: CanvasDocument, instanceId: string): CanvasDocument {
	const instance = doc.layers.find((l) => l.id === instanceId && l.kind === 'widget');
	if (!instance?.definitionId) return doc;
	const def = (doc.widgets ?? []).find((w) => w.id === instance.definitionId);
	if (!def) return doc;

	const absMap = computeAbsoluteRects(doc.layers, { width: doc.width, height: doc.height });
	const instAbs = absMap.get(instanceId) ?? instance.rect;
	const resolved = resolveWidgetInstance(instance, def);
	const { layers: remapped, idMap } = remapLayerIds(resolved);

	const inlined = remapped.map((l) => {
		if (l.parentId === null) {
			const abs = {
				x: instAbs.x + l.rect.x,
				y: instAbs.y + l.rect.y,
				w: l.rect.w,
				h: l.rect.h
			};
			const parentId = instance.parentId ?? null;
			if (parentId) {
				const pa = absMap.get(parentId) ?? { x: 0, y: 0, w: doc.width, h: doc.height };
				const lr = { x: abs.x - pa.x, y: abs.y - pa.y, w: abs.w, h: abs.h };
				return {
					...l,
					parentId,
					rect: lr,
					slot: slotFromLocalRect({ width: pa.w, height: pa.h }, lr),
					zIndex: instance.zIndex + (l.zIndex ?? 0)
				};
			}
			return {
				...l,
				parentId: null,
				rect: abs,
				slot: defaultSlotFromRect(abs),
				zIndex: instance.zIndex + (l.zIndex ?? 0)
			};
		}
		return { ...l, zIndex: instance.zIndex + (l.zIndex ?? 0) };
	});

	const layers = [...doc.layers.filter((l) => l.id !== instanceId), ...inlined];
	return { ...doc, layers };
}

export function updateWidgetDefinition(
	doc: CanvasDocument,
	definitionId: string,
	updater: (d: CanvasWidgetDefinition) => CanvasWidgetDefinition
): CanvasDocument {
	const widgets = (doc.widgets ?? []).map((w) => (w.id === definitionId ? updater(w) : w));
	return { ...doc, version: 2, widgets };
}

/** Remove a widget definition and all of its instances (including nested scene children). */
export function deleteWidgetDefinition(doc: CanvasDocument, definitionId: string): CanvasDocument {
	const instanceIds = doc.layers
		.filter((l) => l.kind === 'widget' && l.definitionId === definitionId)
		.map((l) => l.id);
	const remove = new Set<string>();
	for (const id of instanceIds) {
		for (const sid of getSubtreeIds(doc.layers, id)) remove.add(sid);
	}
	return {
		...doc,
		version: 2,
		widgets: (doc.widgets ?? []).filter((w) => w.id !== definitionId),
		layers: doc.layers.filter((l) => !remove.has(l.id))
	};
}

export function setExposedProp(
	def: CanvasWidgetDefinition,
	targetLayerId: string,
	field: string,
	exposed: boolean,
	label?: string
): CanvasWidgetDefinition {
	const existing = def.exposed.find((e) => e.targetLayerId === targetLayerId && e.field === field);
	if (!exposed) {
		return {
			...def,
			exposed: def.exposed.filter((e) => !(e.targetLayerId === targetLayerId && e.field === field))
		};
	}
	if (existing) {
		return {
			...def,
			exposed: def.exposed.map((e) =>
				e.id === existing.id ? { ...e, exposed: true, label: label ?? e.label } : e
			)
		};
	}
	const prop: CanvasExposedProp = {
		id: uid('exp'),
		targetLayerId,
		field,
		label: label ?? field,
		exposed: true
	};
	return { ...def, exposed: [...def.exposed, prop] };
}

export function isPropExposed(
	def: CanvasWidgetDefinition | null | undefined,
	layerId: string,
	field: string
): boolean {
	if (!def) return false;
	return def.exposed.some((e) => e.exposed && e.targetLayerId === layerId && e.field === field);
}

export function getExposedProp(
	def: CanvasWidgetDefinition | null | undefined,
	layerId: string,
	field: string
): CanvasExposedProp | undefined {
	return def?.exposed.find((e) => e.targetLayerId === layerId && e.field === field);
}

/** Blueprint default for an exposed prop (value on the target layer inside the definition). */
export function getExposedFieldDefault(
	def: CanvasWidgetDefinition,
	prop: CanvasExposedProp
): unknown {
	const target = def.layers.find((l) => l.id === prop.targetLayerId);
	if (!target) return undefined;
	const value = (target as Record<string, unknown>)[prop.field];
	if (value !== undefined) return value;
	if (prop.field === 'visible') return true;
	if (prop.field === 'opacity') return 1;
	if (prop.field === 'fontSize') return 32;
	if (prop.field === 'fill' || prop.field === 'color' || prop.field === 'stroke') return '#000000';
	return undefined;
}

/** Instance override if set, otherwise the blueprint default. */
export function resolveExposedPropValue(
	instance: CanvasLayer,
	def: CanvasWidgetDefinition,
	prop: CanvasExposedProp
): unknown {
	if (instance.overrides && Object.prototype.hasOwnProperty.call(instance.overrides, prop.id)) {
		return instance.overrides[prop.id];
	}
	return getExposedFieldDefault(def, prop);
}

/** Group exposed props by target layer for inspector headers. */
export function groupExposedPropsByLayer(
	def: CanvasWidgetDefinition
): { layerId: string; layerName: string; props: CanvasExposedProp[] }[] {
	const props = def.exposed.filter((e) => e.exposed);
	const order: string[] = [];
	const map = new Map<string, CanvasExposedProp[]>();
	for (const p of props) {
		if (!map.has(p.targetLayerId)) {
			order.push(p.targetLayerId);
			map.set(p.targetLayerId, []);
		}
		map.get(p.targetLayerId)!.push(p);
	}
	return order.map((layerId) => {
		const target = def.layers.find((l) => l.id === layerId);
		return {
			layerId,
			layerName: target?.name?.trim() || target?.kind || 'Layer',
			props: map.get(layerId)!
		};
	});
}

export function setInstanceOverride(
	doc: CanvasDocument,
	instanceId: string,
	propId: string,
	value: unknown
): CanvasDocument {
	return {
		...doc,
		layers: doc.layers.map((l) => {
			if (l.id !== instanceId) return l;
			const overrides = { ...(l.overrides ?? {}) };
			if (value === undefined) delete overrides[propId];
			else overrides[propId] = value;
			return { ...l, overrides };
		})
	};
}

export function documentAsWidgetEditSurface(
	doc: CanvasDocument,
	definitionId: string
): { width: number; height: number; background: string; layers: CanvasLayer[] } | null {
	const def = (doc.widgets ?? []).find((w) => w.id === definitionId);
	if (!def) return null;
	return {
		width: def.width,
		height: def.height,
		background: def.background ?? '#ffffff',
		layers: def.layers
	};
}

export function patchWidgetEditSurface(
	doc: CanvasDocument,
	definitionId: string,
	surface: { width?: number; height?: number; background?: string; layers?: CanvasLayer[] }
): CanvasDocument {
	return updateWidgetDefinition(doc, definitionId, (d) => ({
		...d,
		width: surface.width ?? d.width,
		height: surface.height ?? d.height,
		background: surface.background ?? d.background,
		layers: surface.layers ?? d.layers
	}));
}

export function getNamedSlotsFromDefinition(
	def: CanvasWidgetDefinition | null | undefined
): { layerId: string; name: string }[] {
	if (!def) return [];
	return def.layers
		.filter((l) => l.kind === 'namedSlot')
		.map((l) => ({
			layerId: l.id,
			name: (l.slotName || l.name || 'Slot').trim()
		}));
}

export function listFillableSlotsForInstance(
	doc: CanvasDocument,
	instanceId: string
): string[] {
	const inst = doc.layers.find((l) => l.id === instanceId && l.kind === 'widget');
	if (!inst?.definitionId) return [];
	const def = (doc.widgets ?? []).find((w) => w.id === inst.definitionId);
	return getNamedSlotsFromDefinition(def).map((s) => s.name);
}

export { deleteSubtree };
