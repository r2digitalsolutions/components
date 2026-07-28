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
	| 'sticky';

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

export interface CanvasLayerRect {
	x: number;
	y: number;
	w: number;
	h: number;
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
	version: 1;
	width: number;
	height: number;
	background: string;
	layers: CanvasLayer[];
	guides?: CanvasGuide[];
	/** When true, all guides are locked. */
	guidesLocked?: boolean;
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
	sticky: {
		w: 220,
		h: 220,
		name: 'Sticky note',
		fill: '#fef08a',
		text: 'Note',
		fontSize: 20,
		borderRadius: 4,
		color: '#713f12'
	}
};

export function emptyCanvasDocument(
	partial?: Partial<Omit<CanvasDocument, 'version' | 'layers'>> & { layers?: CanvasLayer[] }
): CanvasDocument {
	return {
		version: 1,
		width: partial?.width ?? 1280,
		height: partial?.height ?? 720,
		background: partial?.background ?? '#ffffff',
		layers: partial?.layers ?? [],
		guides: partial?.guides ?? [],
		guidesLocked: partial?.guidesLocked ?? false
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
	return {
		id: uid('layer'),
		kind,
		name: partial?.name ?? d.name,
		src: partial?.src,
		text: partial?.text ?? d.text,
		fill: partial?.fill ?? d.fill,
		stroke: partial?.stroke,
		strokeWidth: partial?.strokeWidth ?? (kind === 'line' || kind === 'arrow' ? 4 : undefined),
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
		rect: partial?.rect ?? { x: 80, y: 80, w: d.w, h: d.h },
		zIndex: partial?.zIndex ?? 0,
		opacity: partial?.opacity ?? 1,
		visible: partial?.visible ?? true,
		locked: partial?.locked ?? false
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
