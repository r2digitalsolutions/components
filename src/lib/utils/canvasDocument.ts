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
	'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom' | 'center' | 'full';

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
	/**
	 * When true, the box hugs the text.
	 * Side handles set `textMaxWidth` so lines wrap; height always follows the type.
	 */
	autoSize?: boolean;
	/**
	 * Wrap width in layer pixels. Unset means the box grows with the longest line,
	 * including manual line breaks. Set by dragging the left or right handle.
	 */
	textMaxWidth?: number;
	/**
	 * When true, resizing this container scales children (position + size + text)
	 * relative to the parent — same idea as text `autoSize`. Groups default on.
	 */
	autoSizeChildren?: boolean;
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
	/** CSS filter percents. `100` is unchanged. Used by image and video layers. */
	brightness?: number;
	contrast?: number;
	saturate?: number;
	/**
	 * Extra zoom inside an image or video, on top of `objectFit`.
	 * `1` is the fit itself. The layer rect does not change.
	 */
	mediaScale?: number;
	/** Horizontal alignment of the fitted bitmap inside the layer. `0.5` is centered. */
	mediaX?: number;
	/** Vertical alignment of the fitted bitmap inside the layer. `0.5` is centered. */
	mediaY?: number;
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

/** One artboard inside a design. Every page shares the document size. */
export interface CanvasPage {
	id: string;
	name?: string;
	background: string;
	layers: CanvasLayer[];
	guides?: CanvasGuide[];
	guidesLocked?: boolean;
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
	/**
	 * Sheets of this design. Missing or empty means one page taken from the
	 * top-level background, layers and guides (older documents).
	 */
	pages?: CanvasPage[];
}

const TOP_LEFT: CanvasAnchors = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

/** Top-left point anchors; offsets encode x/y/w/h without needing parent size. */
export function defaultSlotFromRect(
	rect: CanvasLayerRect,
	anchors: CanvasAnchors = TOP_LEFT
): CanvasSlot {
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
		autoSizeChildren?: boolean;
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
	group: { w: 280, h: 200, name: 'Group', fill: 'transparent', autoSizeChildren: true },
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
	const background = partial?.background ?? '#ffffff';
	const layers = (partial?.layers ?? []).map(ensureLayerSlot);
	const guides = partial?.guides ?? [];
	const guidesLocked = partial?.guidesLocked ?? false;
	const pages =
		partial?.pages && partial.pages.length > 0
			? partial.pages
			: [
					blankCanvasPage({
						name: 'Hoja 1',
						background,
						layers,
						guides,
						guidesLocked
					})
				];
	const first = pages[0];
	return {
		version: 2,
		width: partial?.width ?? 1280,
		height: partial?.height ?? 720,
		background: first.background,
		layers: first.layers,
		guides: first.guides ?? [],
		guidesLocked: first.guidesLocked ?? false,
		widgets: partial?.widgets ?? [],
		pages
	};
}

export function blankCanvasPage(partial?: Partial<Omit<CanvasPage, 'id'>>): CanvasPage {
	return {
		id: uid('page'),
		name: partial?.name,
		background: partial?.background ?? '#ffffff',
		layers: partial?.layers ?? [],
		guides: partial?.guides ?? [],
		guidesLocked: partial?.guidesLocked ?? false
	};
}

/** Pages on a document. A document without `pages` is a single sheet. */
export function pagesOf(doc: CanvasDocument): CanvasPage[] {
	if (doc.pages && doc.pages.length > 0) return doc.pages;
	return [
		{
			id: 'page-1',
			name: 'Hoja 1',
			background: doc.background,
			layers: doc.layers,
			guides: doc.guides ?? [],
			guidesLocked: doc.guidesLocked ?? false
		}
	];
}

/** Persist `pages` without changing a document that already has them. */
export function documentWithPages(doc: CanvasDocument): CanvasDocument {
	if (doc.pages && doc.pages.length > 0) return doc;
	const page = pagesOf(doc)[0];
	return { ...doc, pages: [page] };
}

/** View of the document as the given sheet. Top-level fields mirror that sheet. */
export function projectPage(doc: CanvasDocument, pageId: string): CanvasDocument {
	const pages = pagesOf(doc);
	const page = pages.find((item) => item.id === pageId) ?? pages[0];
	return {
		...doc,
		pages,
		background: page.background,
		layers: page.layers,
		guides: page.guides ?? [],
		guidesLocked: page.guidesLocked ?? false
	};
}

/** Write one sheet and mirror it on the top-level fields (the active sheet). */
export function writePage(
	doc: CanvasDocument,
	pageId: string,
	patch: Partial<Omit<CanvasPage, 'id'>>
): CanvasDocument {
	const pages = pagesOf(doc);
	const index = Math.max(
		0,
		pages.findIndex((item) => item.id === pageId)
	);
	const current = pages[index] ?? pages[0];
	const nextPage: CanvasPage = { ...current, ...patch, id: current.id };
	const nextPages = pages.map((item, i) => (i === index ? nextPage : item));
	return {
		...doc,
		pages: nextPages,
		background: nextPage.background,
		layers: nextPage.layers,
		guides: nextPage.guides ?? [],
		guidesLocked: nextPage.guidesLocked ?? false
	};
}

/** Clone layer ids so a duplicated sheet does not share identity with the source. */
export function cloneCanvasLayers(layers: CanvasLayer[]): CanvasLayer[] {
	const idMap = new Map(layers.map((layer) => [layer.id, uid('layer')]));
	return layers.map((layer) => {
		const copy = JSON.parse(JSON.stringify(layer)) as CanvasLayer;
		copy.id = idMap.get(layer.id)!;
		if (copy.parentId && idMap.has(copy.parentId)) copy.parentId = idMap.get(copy.parentId)!;
		return copy;
	});
}

/** Migrate v1 (flat absolute layers) → v2 (parentId + slot). */
export function migrateCanvasDocument(
	doc: CanvasDocument | (Omit<CanvasDocument, 'version'> & { version?: number })
): CanvasDocument {
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
			partial?.strokeWidth ??
			(kind === 'line' || kind === 'arrow' || kind === 'path' ? 4 : undefined),
		fontSize: partial?.fontSize ?? d.fontSize,
		fontWeight: partial?.fontWeight,
		fontFamily: partial?.fontFamily,
		fontStyle: partial?.fontStyle,
		textDecoration: partial?.textDecoration,
		letterSpacing: partial?.letterSpacing,
		lineHeight: partial?.lineHeight,
		textAlign: partial?.textAlign ?? (kind === 'text' || kind === 'sticky' ? 'left' : undefined),
		autoSize: partial?.autoSize ?? (kind === 'text' ? true : kind === 'sticky' ? false : undefined),
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
		brightness: partial?.brightness ?? (kind === 'image' || kind === 'video' ? 100 : undefined),
		contrast: partial?.contrast ?? (kind === 'image' || kind === 'video' ? 100 : undefined),
		saturate: partial?.saturate ?? (kind === 'image' || kind === 'video' ? 100 : undefined),
		mediaScale: partial?.mediaScale ?? (kind === 'image' || kind === 'video' ? 1 : undefined),
		mediaX: partial?.mediaX ?? (kind === 'image' || kind === 'video' ? 0.5 : undefined),
		mediaY: partial?.mediaY ?? (kind === 'image' || kind === 'video' ? 0.5 : undefined),
		points: partial?.points,
		closed: partial?.closed ?? false,
		parentId: partial?.parentId ?? null,
		slot: partial?.slot,
		clipChildren: partial?.clipChildren ?? d.clipChildren ?? false,
		autoSizeChildren:
			partial?.autoSizeChildren ?? d.autoSizeChildren ?? (kind === 'group' ? true : undefined),
		gap: partial?.gap ?? d.gap,
		slotName: partial?.slotName ?? (kind === 'namedSlot' ? (partial?.name ?? d.name) : undefined),
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

/** Scalar fields that can reset to createCanvasLayer defaults (UE-style details). */
export type CanvasResettableField =
	| 'opacity'
	| 'rotation'
	| 'visible'
	| 'locked'
	| 'flipX'
	| 'flipY'
	| 'blur'
	| 'brightness'
	| 'contrast'
	| 'saturate'
	| 'mediaScale'
	| 'mediaX'
	| 'mediaY'
	| 'shadowBlur'
	| 'shadowColor'
	| 'fill'
	| 'stroke'
	| 'strokeWidth'
	| 'fontSize'
	| 'fontWeight'
	| 'fontFamily'
	| 'fontStyle'
	| 'textDecoration'
	| 'letterSpacing'
	| 'lineHeight'
	| 'textAlign'
	| 'autoSize'
	| 'color'
	| 'textBackground'
	| 'objectFit'
	| 'borderRadius'
	| 'gap'
	| 'columns'
	| 'clipChildren'
	| 'autoSizeChildren'
	| 'text'
	| 'name';

function canvasValuesEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	// Treat unset numeric effects as 0
	if ((a == null || a === 0) && (b == null || b === 0)) return true;
	if (a == null && b == null) return true;
	return false;
}

/** Default value for a layer field (same as createCanvasLayer would use). */
export function canvasLayerFieldDefault(
	kind: CanvasLayerKind,
	field: CanvasResettableField
): unknown {
	const d = LAYER_DEFAULTS[kind];
	switch (field) {
		case 'opacity':
			return 1;
		case 'rotation':
			return 0;
		case 'visible':
			return true;
		case 'locked':
			return false;
		case 'flipX':
		case 'flipY':
			return false;
		case 'blur':
		case 'shadowBlur':
			return undefined;
		case 'brightness':
		case 'contrast':
		case 'saturate':
			return kind === 'image' || kind === 'video' ? 100 : undefined;
		case 'mediaScale':
			return kind === 'image' || kind === 'video' ? 1 : undefined;
		case 'mediaX':
		case 'mediaY':
			return kind === 'image' || kind === 'video' ? 0.5 : undefined;
		case 'shadowColor':
			return undefined;
		case 'fill':
			return d.fill;
		case 'stroke':
			return undefined;
		case 'strokeWidth':
			return kind === 'line' || kind === 'arrow' || kind === 'path' ? 4 : undefined;
		case 'fontSize':
			return d.fontSize;
		case 'fontWeight':
		case 'fontFamily':
		case 'fontStyle':
		case 'textDecoration':
		case 'letterSpacing':
		case 'lineHeight':
			return undefined;
		case 'autoSize':
			return kind === 'text' ? true : kind === 'sticky' ? false : undefined;
		case 'textAlign':
			return kind === 'text' || kind === 'sticky' ? 'left' : undefined;
		case 'color':
			return d.color ?? (kind === 'text' ? '#0f172a' : undefined);
		case 'textBackground':
			return undefined;
		case 'objectFit':
			return kind === 'image' || kind === 'video' ? 'cover' : undefined;
		case 'borderRadius':
			return d.borderRadius;
		case 'gap':
			return d.gap;
		case 'columns':
			return kind === 'uniformGrid' ? 2 : undefined;
		case 'clipChildren':
			return d.clipChildren ?? false;
		case 'autoSizeChildren':
			return d.autoSizeChildren ?? kind === 'group';
		case 'text':
			return d.text;
		case 'name':
			return d.name;
		default:
			return undefined;
	}
}

export function isCanvasFieldModified(layer: CanvasLayer, field: CanvasResettableField): boolean {
	const def = canvasLayerFieldDefault(layer.kind, field);
	const raw = layer[field as keyof CanvasLayer];
	// Missing autoSize / autoSizeChildren on older docs → kind default.
	const cur =
		(field === 'autoSize' || field === 'autoSizeChildren') && raw === undefined ? def : raw;
	return !canvasValuesEqual(cur, def);
}

export function resetCanvasField(
	layer: CanvasLayer,
	field: CanvasResettableField
): Partial<CanvasLayer> {
	return { [field]: canvasLayerFieldDefault(layer.kind, field) } as Partial<CanvasLayer>;
}

/**
 * Scale fontSize with the box when `autoSize` is on (text / sticky).
 * Side handles reflow and the frame grows with the lines. Only a corner scales the type.
 */
export function applyTextAutoSize(
	from: CanvasLayer,
	to: CanvasLayer,
	prev: Pick<CanvasLayerRect, 'w' | 'h'>,
	next: Pick<CanvasLayerRect, 'w' | 'h'>
): CanvasLayer {
	if (from.kind !== 'text' && from.kind !== 'sticky') return to;
	const enabled = from.autoSize ?? from.kind === 'text';
	if (!enabled) return to;

	const dw = Math.abs(next.w - prev.w);
	const dh = Math.abs(next.h - prev.h);
	if (dw < 0.5 && dh < 0.5) return to;

	const sx = next.w / Math.max(1, prev.w);
	const sy = next.h / Math.max(1, prev.h);
	const widthChanged = Math.abs(sx - 1) > 0.02;
	const heightChanged = Math.abs(sy - 1) > 0.02;
	// Side handles reflow. A shorter box cannot squash the type: the frame grows instead.
	// Only a corner scales the font, and the box hugs the glyphs again on release.
	const scale = widthChanged && heightChanged ? sy : 1;
	if (!Number.isFinite(scale) || Math.abs(scale - 1) < 0.001) return to;

	const base = from.fontSize ?? (from.kind === 'sticky' ? 20 : 32);
	return {
		...to,
		fontSize: Math.max(8, Math.min(400, Math.round(base * scale)))
	};
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
	guideThreshold = 8,
	clampToBounds = true
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

	if (clampToBounds) {
		x = Math.min(Math.max(0, x), Math.max(0, bounds.width - w));
		y = Math.min(Math.max(0, y), Math.max(0, bounds.height - h));
		w = Math.min(w, bounds.width - x);
		h = Math.min(h, bounds.height - y);
	}
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

export const COVER_ARTBOARD = { width: 1800, height: 600 } as const;

/** Artboard with the photo fully visible. Scaling that layer is the zoom. */
export function coverDocumentFromImage(src: string, name = 'Cover'): CanvasDocument {
	return emptyCanvasDocument({
		width: COVER_ARTBOARD.width,
		height: COVER_ARTBOARD.height,
		background: '#111111',
		layers: [
			createCanvasLayer('image', {
				name,
				src,
				objectFit: 'contain',
				rect: { x: 0, y: 0, w: COVER_ARTBOARD.width, h: COVER_ARTBOARD.height }
			})
		]
	});
}

/** Drop session blob URLs on the cover layer so the JSON can be stored. */
export function persistCoverDocument(doc: CanvasDocument): CanvasDocument {
	return {
		...doc,
		layers: doc.layers.map((layer) =>
			layer.kind === 'image' && layer.name === 'Cover' && layer.src?.startsWith('blob:')
				? { ...layer, src: '' }
				: layer
		)
	};
}

/** Point the stored cover layer at the original file URL. */
export function hydrateCoverDocument(doc: CanvasDocument, src: string): CanvasDocument {
	return {
		...doc,
		layers: doc.layers.map((layer) =>
			layer.kind === 'image' && layer.name === 'Cover' && !layer.src ? { ...layer, src } : layer
		)
	};
}

/** Where the bitmap sits inside the layer box, in the same units as `box`. */
export function mediaContentBox(
	box: { w: number; h: number },
	natural: { w: number; h: number },
	fit: CanvasObjectFit | undefined,
	zoom = 1,
	mediaX = 0.5,
	mediaY = 0.5
): { x: number; y: number; w: number; h: number } {
	const mode = fit ?? 'cover';
	const z = zoom > 0 ? zoom : 1;
	let dw: number;
	let dh: number;
	if (mode === 'fill' || natural.w <= 0 || natural.h <= 0) {
		dw = box.w * z;
		dh = box.h * z;
	} else {
		const base =
			mode === 'contain'
				? Math.min(box.w / natural.w, box.h / natural.h)
				: Math.max(box.w / natural.w, box.h / natural.h);
		dw = natural.w * base * z;
		dh = natural.h * base * z;
	}
	return {
		x: (box.w - dw) * mediaX,
		y: (box.h - dh) * mediaY,
		w: dw,
		h: dh
	};
}

export function canvasLayerFilter(layer: {
	blur?: number;
	brightness?: number;
	contrast?: number;
	saturate?: number;
}): string | undefined {
	const parts: string[] = [];
	if (layer.blur) parts.push(`blur(${layer.blur}px)`);
	if (layer.brightness != null && layer.brightness !== 100)
		parts.push(`brightness(${layer.brightness}%)`);
	if (layer.contrast != null && layer.contrast !== 100) parts.push(`contrast(${layer.contrast}%)`);
	if (layer.saturate != null && layer.saturate !== 100) parts.push(`saturate(${layer.saturate}%)`);
	return parts.length ? parts.join(' ') : undefined;
}

/** Instagram puzzle feed: 3 columns × 1080 and 3 rows × 1350 (4:5 tiles). */
export const INSTAGRAM_GRID_PRESET_ID = 'ig-grid-3x3';

export const INSTAGRAM_GRID = {
	id: INSTAGRAM_GRID_PRESET_ID,
	cols: 3,
	rows: 3,
	cellWidth: 1080,
	cellHeight: 1350,
	width: 3240,
	height: 4050
} as const;

export const CANVAS_PRESETS = [
	{ id: 'cover', label: 'Cover · 1800×600', width: 1800, height: 600 },
	{ id: 'hd', label: 'HD · 1280×720', width: 1280, height: 720 },
	{ id: 'fhd', label: 'Full HD · 1920×1080', width: 1920, height: 1080 },
	{ id: 'square', label: 'Instagram · 1080×1080', width: 1080, height: 1080 },
	{ id: 'story', label: 'Story · 1080×1920', width: 1080, height: 1920 },
	{
		id: INSTAGRAM_GRID_PRESET_ID,
		label: 'Instagram 3×3 · 3240×4050',
		width: INSTAGRAM_GRID.width,
		height: INSTAGRAM_GRID.height
	},
	{ id: 'landscape', label: 'Landscape · 1600×900', width: 1600, height: 900 },
	{ id: 'presentation', label: 'Presentation · 1920×1080', width: 1920, height: 1080 },
	{ id: 'a4', label: 'A4 · 794×1123', width: 794, height: 1123 },
	{ id: 'twitter', label: 'X Post · 1600×900', width: 1600, height: 900 }
] as const;

/** Locked cut lines between the nine Instagram tiles. */
export function instagramGridGuides(): CanvasGuide[] {
	const guides: CanvasGuide[] = [];
	for (let col = 1; col < INSTAGRAM_GRID.cols; col++) {
		guides.push(createCanvasGuide('vertical', col * INSTAGRAM_GRID.cellWidth, { locked: true }));
	}
	for (let row = 1; row < INSTAGRAM_GRID.rows; row++) {
		guides.push(createCanvasGuide('horizontal', row * INSTAGRAM_GRID.cellHeight, { locked: true }));
	}
	return guides;
}

export function emptyInstagramGridDocument(): CanvasDocument {
	return emptyCanvasDocument({
		width: INSTAGRAM_GRID.width,
		height: INSTAGRAM_GRID.height,
		background: '#0b1f3a',
		guides: instagramGridGuides(),
		guidesLocked: true
	});
}

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

/** Map normalized path points → document space using an absolute (or local) rect. */
export function pathPointsToDoc(
	layer: CanvasLayer,
	absRect?: Pick<CanvasLayerRect, 'x' | 'y' | 'w' | 'h'>
): { x: number; y: number }[] {
	const pts = layer.points ?? [];
	const { x, y, w, h } = absRect ?? layer.rect;
	return pts.map((p) => ({ x: x + p.x * w, y: y + p.y * h }));
}
