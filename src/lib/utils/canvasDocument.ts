import { uid } from './mediaTracks.js';

export type CanvasLayerKind =
	| 'image'
	| 'video'
	| 'audio'
	| 'text'
	| 'rect'
	| 'roundRect'
	| 'ellipse'
	| 'triangle'
	| 'star'
	| 'hexagon'
	| 'pentagon'
	| 'diamond'
	| 'heart'
	| 'line'
	| 'arrow'
	| 'path'
	| 'sticky'
	| 'canvasPanel'
	| 'overlay'
	| 'border'
	| 'hBox'
	| 'vBox'
	| 'sizeBox'
	| 'scaleBox'
	| 'group'
	| 'widget'
	| 'namedSlot'
	| 'scrollBox'
	| 'wrapBox'
	| 'uniformGrid';

export type CanvasObjectFit = 'cover' | 'contain' | 'fill';
export type CanvasTextAlign = 'left' | 'center' | 'right';
export type CanvasFontStyle = 'normal' | 'italic';
export type CanvasTextDecoration = 'none' | 'underline' | 'line-through';
export type CanvasAlign =
	| 'left'
	| 'center-h'
	| 'right'
	| 'top'
	| 'center-v'
	| 'bottom'
	| 'center'
	| 'full';

/** Normalized point inside a layer rect (0–1). */
export interface CanvasPoint {
	x: number;
	y: number;
}

export interface CanvasLayerRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** UMG-style anchors (0–1 normalized against parent). */
export interface CanvasAnchors {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

/** UMG slot: anchors + offsets in px relative to anchored edges. */
export interface CanvasSlot {
	anchors: CanvasAnchors;
	offsets: { left: number; top: number; right: number; bottom: number };
	padding?: { left: number; top: number; right: number; bottom: number };
	sizeRule?: 'auto' | 'fill' | 'fixed';
	alignment?: { x: number; y: number };
	order?: number;
}

export interface CanvasExposedProp {
	id: string;
	targetLayerId: string;
	field: string;
	label: string;
	/** true = editable on instances (eye open) */
	exposed: boolean;
}

export interface CanvasWidgetDefinition {
	id: string;
	name: string;
	width: number;
	height: number;
	background?: string;
	layers: CanvasLayer[];
	exposed: CanvasExposedProp[];
}

export interface CanvasLayer {
	id: string;
	kind: CanvasLayerKind;
	name: string;
	src?: string;
	text?: string;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	fontSize?: number;
	fontWeight?: number | string;
	fontFamily?: string;
	fontStyle?: CanvasFontStyle;
	textDecoration?: CanvasTextDecoration;
	letterSpacing?: number;
	lineHeight?: number;
	textAlign?: CanvasTextAlign;
	color?: string;
	/** Text box background */
	textBackground?: string;
	objectFit?: CanvasObjectFit;
	borderRadius?: number;
	rotation?: number;
	flipX?: boolean;
	flipY?: boolean;
	shadowBlur?: number;
	shadowColor?: string;
	blur?: number;
	/** For `path`: normalized points (0–1) relative to rect. */
	points?: CanvasPoint[];
	/** For `path`: close the shape into a filled polygon. */
	closed?: boolean;
	/** Parent layer id; null/undefined = artboard root. */
	parentId?: string | null;
	/** UMG slot (preferred). When missing, derived from rect + top-left anchors. */
	slot?: CanvasSlot;
	clipChildren?: boolean;
	/** Gap for hBox / vBox / wrapBox / uniformGrid */
	gap?: number;
	/** namedSlot: public slot name exposed on the User Widget */
	slotName?: string;
	/** Child of a widget instance: which named slot to fill */
	fillSlot?: string;
	/** uniformGrid column count */
	columns?: number;
	/** kind === 'widget' */
	definitionId?: string;
	/** Exposed prop overrides on widget instances */
	overrides?: Record<string, unknown>;
	rect: CanvasLayerRect;
	zIndex: number;
	opacity: number;
	visible: boolean;
	locked: boolean;
}

export type CanvasGuideOrientation = 'horizontal' | 'vertical';

export interface CanvasGuide {
	id: string;
	orientation: CanvasGuideOrientation;
	/** X for vertical, Y for horizontal (document px). */
	position: number;
	locked?: boolean;
}

export interface CanvasDocument {
	version: 1 | 2;
	width: number;
	height: number;
	background: string;
	layers: CanvasLayer[];
	guides?: CanvasGuide[];
	/** When true, all guides are locked. */
	guidesLocked?: boolean;
	/** Local User Widget library (v2). */
	widgets?: CanvasWidgetDefinition[];
}

const TOP_LEFT: CanvasAnchors = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

/** Top-left point anchors; offsets encode x/y/w/h without needing parent size. */
export function defaultSlotFromRect(rect: CanvasLayerRect, anchors: CanvasAnchors = TOP_LEFT): CanvasSlot {
	const a = { ...anchors };
	// Only valid without parent size when anchors are a point at origin (top-left).
	if (a.minX === 0 && a.minY === 0 && a.maxX === 0 && a.maxY === 0) {
		return {
			anchors: a,
			offsets: {
				left: rect.x,
				top: rect.y,
				right: -(rect.x + rect.w),
				bottom: -(rect.y + rect.h)
			}
		};
	}
	return {
		anchors: a,
		offsets: {
			left: rect.x,
			top: rect.y,
			right: -(rect.x + rect.w),
			bottom: -(rect.y + rect.h)
		}
	};
}

/** For top-left point anchors, offsets.left/top = x/y and right/bottom = -(x+w)/-(y+h) when parent size unknown.
 * Prefer slotFromLocalRect from canvasHierarchy when parent size is known. */
export function rectFromSlot(
	slot: CanvasSlot,
	parentSize: { width: number; height: number }
): CanvasLayerRect {
	const left = slot.anchors.minX * parentSize.width + slot.offsets.left;
	const top = slot.anchors.minY * parentSize.height + slot.offsets.top;
	const right = slot.anchors.maxX * parentSize.width - slot.offsets.right;
	const bottom = slot.anchors.maxY * parentSize.height - slot.offsets.bottom;
	return {
		x: left,
		y: top,
		w: Math.max(1, right - left),
		h: Math.max(1, bottom - top)
	};
}

const LAYER_DEFAULTS: Record<
	CanvasLayerKind,
	{
		w: number;
		h: number;
		name: string;
		fill?: string;
		text?: string;
		fontSize?: number;
		borderRadius?: number;
		color?: string;
		clipChildren?: boolean;
		gap?: number;
	}
> = {
	image: { w: 320, h: 240, name: 'Image' },
	video: { w: 480, h: 270, name: 'Video' },
	audio: { w: 200, h: 48, name: 'Audio' },
	text: { w: 280, h: 64, name: 'Text', text: 'Add your text', fontSize: 32 },
	rect: { w: 240, h: 160, name: 'Rectangle', fill: '#3b82f6' },
	roundRect: { w: 240, h: 160, name: 'Rounded', fill: '#8b5cf6', borderRadius: 24 },
	ellipse: { w: 200, h: 200, name: 'Ellipse', fill: '#22c55e' },
	triangle: { w: 200, h: 180, name: 'Triangle', fill: '#f59e0b' },
	star: { w: 200, h: 200, name: 'Star', fill: '#ef4444' },
	hexagon: { w: 200, h: 200, name: 'Hexagon', fill: '#06b6d4' },
	pentagon: { w: 200, h: 200, name: 'Pentagon', fill: '#a855f7' },
	diamond: { w: 180, h: 180, name: 'Diamond', fill: '#f43f5e' },
	heart: { w: 200, h: 180, name: 'Heart', fill: '#ec4899' },
	line: { w: 280, h: 4, name: 'Line', fill: '#94a3b8' },
	arrow: { w: 280, h: 24, name: 'Arrow', fill: '#0f172a' },
	path: { w: 240, h: 180, name: 'Path', fill: '#0f172a' },
	sticky: {
		w: 220,
		h: 220,
		name: 'Sticky note',
		fill: '#fef08a',
		text: 'Note',
		fontSize: 20,
		borderRadius: 4,
		color: '#713f12'
	},
	canvasPanel: { w: 400, h: 300, name: 'Canvas Panel', fill: 'transparent', clipChildren: true },
	overlay: { w: 320, h: 240, name: 'Overlay', fill: 'transparent', clipChildren: true },
	border: { w: 320, h: 240, name: 'Border', fill: '#ffffff', borderRadius: 12, clipChildren: true },
	hBox: { w: 360, h: 80, name: 'Horizontal Box', fill: 'transparent', gap: 8 },
	vBox: { w: 200, h: 240, name: 'Vertical Box', fill: 'transparent', gap: 8 },
	sizeBox: { w: 200, h: 200, name: 'Size Box', fill: 'transparent', clipChildren: true },
	scaleBox: { w: 240, h: 240, name: 'Scale Box', fill: 'transparent', clipChildren: true },
	group: { w: 280, h: 200, name: 'Group', fill: 'transparent' },
	widget: { w: 280, h: 160, name: 'Widget' },
	namedSlot: { w: 200, h: 120, name: 'Named Slot', fill: 'rgba(59,130,246,0.08)' },
	scrollBox: { w: 280, h: 320, name: 'Scroll Box', fill: 'transparent', clipChildren: true },
	wrapBox: { w: 360, h: 200, name: 'Wrap Box', fill: 'transparent', gap: 8 },
	uniformGrid: { w: 320, h: 240, name: 'Uniform Grid', fill: 'transparent', gap: 8 }
};

export function emptyCanvasDocument(
	partial?: Partial<Omit<CanvasDocument, 'version' | 'layers'>> & {
		layers?: CanvasLayer[];
		widgets?: CanvasWidgetDefinition[];
	}
): CanvasDocument {
	return {
		version: 2,
		width: partial?.width ?? 1280,
		height: partial?.height ?? 720,
		background: partial?.background ?? '#ffffff',
		layers: (partial?.layers ?? []).map(ensureLayerSlot),
		guides: partial?.guides ?? [],
		guidesLocked: partial?.guidesLocked ?? false,
		widgets: partial?.widgets ?? []
	};
}

/** Migrate v1 (flat absolute layers) → v2 (parentId + slot). */
export function migrateCanvasDocument(doc: CanvasDocument | (Omit<CanvasDocument, 'version'> & { version?: number })): CanvasDocument {
	const version = doc.version ?? 1;
	if (version >= 2) {
		// Hot path: already v2 with slots — keep identity to avoid thrashing drag reactivity.
		if (
			doc.version === 2 &&
			doc.widgets &&
			doc.layers.every((l) => l.slot && l.parentId !== undefined)
		) {
			return doc as CanvasDocument;
		}
		return {
			...doc,
			version: 2,
			widgets: doc.widgets ?? [],
			layers: doc.layers.map(ensureLayerSlot)
		};
	}
	return {
		...doc,
		version: 2,
		widgets: doc.widgets ?? [],
		layers: doc.layers.map((l) =>
			ensureLayerSlot({
				...l,
				parentId: l.parentId ?? null,
				slot: l.slot ?? defaultSlotFromRect(l.rect),
				clipChildren: l.clipChildren
			})
		)
	};
}

export function ensureLayerSlot(layer: CanvasLayer): CanvasLayer {
	if (layer.slot && layer.parentId !== undefined) return layer;
	return {
		...layer,
		parentId: layer.parentId ?? null,
		slot: layer.slot ?? defaultSlotFromRect(layer.rect)
	};
}

export function createCanvasGuide(
	orientation: CanvasGuideOrientation,
	position: number,
	partial?: Partial<Omit<CanvasGuide, 'id' | 'orientation' | 'position'>>
): CanvasGuide {
	return {
		id: uid('guide'),
		orientation,
		position,
		locked: partial?.locked ?? false
	};
}

export function createCanvasLayer(
	kind: CanvasLayerKind,
	partial?: Partial<Omit<CanvasLayer, 'id' | 'kind'>>
): CanvasLayer {
	const d = LAYER_DEFAULTS[kind];
	const rect = partial?.rect ?? { x: 80, y: 80, w: d.w, h: d.h };
	return ensureLayerSlot({
		id: uid('layer'),
		kind,
		name: partial?.name ?? d.name,
		src: partial?.src,
		text: partial?.text ?? d.text,
		fill: partial?.fill ?? d.fill,
		stroke: partial?.stroke,
		strokeWidth:
			partial?.strokeWidth ?? (kind === 'line' || kind === 'arrow' || kind === 'path' ? 4 : undefined),
		fontSize: partial?.fontSize ?? d.fontSize,
		fontWeight: partial?.fontWeight,
		fontFamily: partial?.fontFamily,
		fontStyle: partial?.fontStyle,
		textDecoration: partial?.textDecoration,
		letterSpacing: partial?.letterSpacing,
		lineHeight: partial?.lineHeight,
		textAlign: partial?.textAlign ?? (kind === 'text' || kind === 'sticky' ? 'left' : undefined),
		color: partial?.color ?? d.color ?? (kind === 'text' ? '#0f172a' : undefined),
		textBackground: partial?.textBackground,
		objectFit: partial?.objectFit ?? (kind === 'image' || kind === 'video' ? 'cover' : undefined),
		borderRadius: partial?.borderRadius ?? d.borderRadius,
		rotation: partial?.rotation ?? 0,
		flipX: partial?.flipX ?? false,
		flipY: partial?.flipY ?? false,
		shadowBlur: partial?.shadowBlur,
		shadowColor: partial?.shadowColor,
		blur: partial?.blur,
		points: partial?.points,
		closed: partial?.closed ?? false,
		parentId: partial?.parentId ?? null,
		slot: partial?.slot,
		clipChildren: partial?.clipChildren ?? d.clipChildren ?? false,
		gap: partial?.gap ?? d.gap,
		slotName: partial?.slotName ?? (kind === 'namedSlot' ? partial?.name ?? d.name : undefined),
		fillSlot: partial?.fillSlot,
		columns: partial?.columns ?? (kind === 'uniformGrid' ? 2 : undefined),
		definitionId: partial?.definitionId,
		overrides: partial?.overrides,
		rect,
		zIndex: partial?.zIndex ?? 0,
		opacity: partial?.opacity ?? 1,
		visible: partial?.visible ?? true,
		locked: partial?.locked ?? false
	});
}

export function reorderCanvasLayers(layers: CanvasLayer[], orderedIds: string[]): CanvasLayer[] {
	const map = new Map(layers.map((l) => [l.id, l]));
	const next: CanvasLayer[] = [];
	orderedIds.forEach((id, i) => {
		const layer = map.get(id);
		if (layer) {
			next.push({ ...layer, zIndex: i });
			map.delete(id);
		}
	});
	for (const layer of map.values()) {
		next.push({ ...layer, zIndex: next.length });
	}
	return next;
}

export function updateCanvasLayer(
	doc: CanvasDocument,
	layerId: string,
	updater: (l: CanvasLayer) => CanvasLayer
): CanvasDocument {
	return {
		...doc,
		layers: doc.layers.map((l) => (l.id === layerId ? updater(l) : l))
	};
}

export function updateCanvasLayers(
	doc: CanvasDocument,
	ids: string[],
	updater: (l: CanvasLayer) => CanvasLayer
): CanvasDocument {
	const set = new Set(ids);
	return {
		...doc,
		layers: doc.layers.map((l) => (set.has(l.id) ? updater(l) : l))
	};
}

export function snapLayerRect(
	rect: CanvasLayerRect,
	cellSize: number,
	enabled: boolean,
	bounds: { width: number; height: number },
	minW = 24,
	minH = 24,
	guides: Pick<CanvasGuide, 'orientation' | 'position'>[] = [],
	guideThreshold = 8
): CanvasLayerRect {
	const snap = (v: number) => (enabled ? Math.round(v / cellSize) * cellSize : v);
	let w = Math.max(minW, enabled ? snap(rect.w) : rect.w);
	let h = Math.max(minH, enabled ? snap(rect.h) : rect.h);
	let x = enabled ? snap(rect.x) : rect.x;
	let y = enabled ? snap(rect.y) : rect.y;

	if (guides.length && guideThreshold > 0) {
		const snapped = snapRectToGuides({ x, y, w, h }, guides, guideThreshold);
		x = snapped.x;
		y = snapped.y;
	}

	x = Math.min(Math.max(0, x), Math.max(0, bounds.width - w));
	y = Math.min(Math.max(0, y), Math.max(0, bounds.height - h));
	w = Math.min(w, bounds.width - x);
	h = Math.min(h, bounds.height - y);
	return { x, y, w, h };
}

/** Snap left / center / right (or top / middle / bottom) edges to guides. */
export function snapRectToGuides(
	rect: CanvasLayerRect,
	guides: Pick<CanvasGuide, 'orientation' | 'position'>[],
	threshold = 8
): CanvasLayerRect {
	let { x, y, w, h } = rect;
	let bestDx = threshold + 1;
	let bestDy = threshold + 1;
	let nextX = x;
	let nextY = y;

	for (const g of guides) {
		if (g.orientation === 'vertical') {
			const candidates = [x, x + w / 2, x + w];
			for (const edge of candidates) {
				const d = Math.abs(edge - g.position);
				if (d < bestDx) {
					bestDx = d;
					nextX = x + (g.position - edge);
				}
			}
		} else {
			const candidates = [y, y + h / 2, y + h];
			for (const edge of candidates) {
				const d = Math.abs(edge - g.position);
				if (d < bestDy) {
					bestDy = d;
					nextY = y + (g.position - edge);
				}
			}
		}
	}

	if (bestDx <= threshold) x = nextX;
	if (bestDy <= threshold) y = nextY;
	return { x, y, w, h };
}

export function alignLayerRect(
	rect: CanvasLayerRect,
	bounds: { width: number; height: number },
	align: CanvasAlign
): CanvasLayerRect {
	if (align === 'full') {
		return { x: 0, y: 0, w: bounds.width, h: bounds.height };
	}
	let { x, y, w, h } = rect;
	switch (align) {
		case 'left':
			x = 0;
			break;
		case 'center-h':
			x = Math.max(0, (bounds.width - w) / 2);
			break;
		case 'right':
			x = Math.max(0, bounds.width - w);
			break;
		case 'top':
			y = 0;
			break;
		case 'center-v':
			y = Math.max(0, (bounds.height - h) / 2);
			break;
		case 'bottom':
			y = Math.max(0, bounds.height - h);
			break;
		case 'center':
			x = Math.max(0, (bounds.width - w) / 2);
			y = Math.max(0, (bounds.height - h) / 2);
			break;
	}
	return { x, y, w, h };
}

export const CANVAS_PRESETS = [
	{ id: 'hd', label: 'HD · 1280×720', width: 1280, height: 720 },
	{ id: 'fhd', label: 'Full HD · 1920×1080', width: 1920, height: 1080 },
	{ id: 'square', label: 'Instagram · 1080×1080', width: 1080, height: 1080 },
	{ id: 'story', label: 'Story · 1080×1920', width: 1080, height: 1920 },
	{ id: 'landscape', label: 'Landscape · 1600×900', width: 1600, height: 900 },
	{ id: 'presentation', label: 'Presentation · 1920×1080', width: 1920, height: 1080 },
	{ id: 'a4', label: 'A4 · 794×1123', width: 794, height: 1123 },
	{ id: 'twitter', label: 'X Post · 1600×900', width: 1600, height: 900 }
] as const;

export function presetIdForSize(width: number, height: number): string {
	const match = CANVAS_PRESETS.find((p) => p.width === width && p.height === height);
	return match?.id ?? 'custom';
}

/** Build a path layer from absolute document points. */
export function createPathFromDocPoints(
	docPoints: { x: number; y: number }[],
	opts?: { closed?: boolean; fill?: string; strokeWidth?: number; name?: string; zIndex?: number }
): CanvasLayer {
	const pad = 8;
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const p of docPoints) {
		minX = Math.min(minX, p.x);
		minY = Math.min(minY, p.y);
		maxX = Math.max(maxX, p.x);
		maxY = Math.max(maxY, p.y);
	}
	const w = Math.max(24, maxX - minX + pad * 2);
	const h = Math.max(24, maxY - minY + pad * 2);
	const x = minX - pad;
	const y = minY - pad;
	const points: CanvasPoint[] = docPoints.map((p) => ({
		x: w > 0 ? (p.x - x) / w : 0,
		y: h > 0 ? (p.y - y) / h : 0
	}));
	return createCanvasLayer('path', {
		name: opts?.name ?? (opts?.closed ? 'Shape' : 'Path'),
		fill: opts?.fill ?? '#0f172a',
		strokeWidth: opts?.strokeWidth ?? 3,
		closed: opts?.closed ?? false,
		points,
		zIndex: opts?.zIndex ?? 0,
		rect: { x, y, w, h }
	});
}

/** Recompute rect + normalized points after editing absolute doc points. */
export function rebakePathLayer(
	layer: CanvasLayer,
	docPoints: { x: number; y: number }[]
): CanvasLayer {
	const next = createPathFromDocPoints(docPoints, {
		closed: layer.closed,
		fill: layer.fill,
		strokeWidth: layer.strokeWidth,
		name: layer.name,
		zIndex: layer.zIndex
	});
	return {
		...layer,
		points: next.points,
		rect: next.rect,
		closed: next.closed
	};
}

export function pathPointsToDoc(layer: CanvasLayer): { x: number; y: number }[] {
	const pts = layer.points ?? [];
	const { x, y, w, h } = layer.rect;
	return pts.map((p) => ({ x: x + p.x * w, y: y + p.y * h }));
}
