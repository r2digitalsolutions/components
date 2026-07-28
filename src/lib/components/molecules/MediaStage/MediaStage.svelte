<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import MediaLayerItem from '$lib/components/molecules/MediaLayerItem/MediaLayerItem.svelte';
	import MarqueeRect from '$lib/components/atoms/MarqueeRect/MarqueeRect.svelte';
	import {
		WIDGET_CANVAS_CONTEXT,
		snapToGrid,
		snapWidgetRect,
		clampWidgetRect,
		type WidgetCanvasContext,
		type WidgetRect
	} from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';
	import {
		attachMarqueeSelect,
		resolveMarqueeSelection,
		type MarqueeRect as MarqueeBox
	} from '$lib/utils/marqueeSelect.js';
	import {
		createCanvasGuide,
		pathPointsToDoc,
		rebakePathLayer,
		snapLayerRect,
		snapRectToGuides,
		type CanvasDocument,
		type CanvasGuide,
		type CanvasGuideOrientation,
		type CanvasLayer
	} from '$lib/utils/canvasDocument.js';
	import {
		computeAbsoluteRects,
		contentPadding,
		LAYOUT_BOX_KINDS,
		slotFromLocalRect,
		clipPathForLayer
	} from '$lib/utils/canvasHierarchy.js';
	import { flattenLayersWithWidgets } from '$lib/utils/canvasWidget.js';
	import { backgroundAlpha } from '$lib/utils/canvasExport.js';
	import {
		CANVAS_ELEMENT_MIME,
		type CanvasElementDef
	} from '$lib/components/molecules/CanvasElementsPanel/CanvasElementsPanel.svelte';

	interface MediaStageProps {
		document: CanvasDocument;
		selectedIds?: string[];
		/** Multiplier on fit-to-view scale (1 = fit). */
		zoom?: number;
		showGrid?: boolean;
		showGuides?: boolean;
		snap?: boolean;
		cellSize?: number;
		/** Pen tool: click to place points, dblclick / Enter to finish, click first point to close. */
		drawMode?: boolean;
		/** Expand widget instances into resolved children for preview. */
		expandWidgets?: boolean;
		class?: string;
		onselect?: (ids: string[]) => void;
		onzoom?: (zoom: number) => void;
		onlayerchange?: (layer: CanvasLayer) => void;
		ondocumentchange?: (doc: CanvasDocument) => void;
		oncontextlayer?: (payload: { id: string; x: number; y: number }) => void;
		/** Drop an element from the Elements panel onto the artboard. */
		ondropelement?: (payload: { def: CanvasElementDef; x: number; y: number }) => void;
		ondrawcomplete?: (payload: { points: { x: number; y: number }[]; closed: boolean }) => void;
		ondrawcancel?: () => void;
		/** Double-click a widget instance or container. */
		onenterlayer?: (id: string) => void;
	}

	let {
		document: doc,
		selectedIds = [],
		zoom = 1,
		showGrid = false,
		showGuides = true,
		snap = true,
		cellSize = 8,
		drawMode = false,
		expandWidgets = true,
		class: className = '',
		onselect,
		onzoom,
		onlayerchange,
		ondocumentchange,
		oncontextlayer,
		ondropelement,
		ondrawcomplete,
		ondrawcancel,
		onenterlayer
	}: MediaStageProps = $props();

	let viewportEl = $state<HTMLDivElement | null>(null);
	let artboardEl = $state<HTMLDivElement | null>(null);
	let stageEl = $state<HTMLDivElement | null>(null);
	let vw = $state(0);
	let vh = $state(0);
	/** Artboard top-left relative to the visible scroll viewport (updates on scroll/zoom). */
	let boardScreenX = $state(0);
	let boardScreenY = $state(0);
	let marquee = $state<MarqueeBox | null>(null);
	let skipClearClick = false;
	let draggingGuideId = $state<string | null>(null);
	/** Full-stage guide line while dragging (screen coords relative to stage). */
	let guidePreview = $state<{
		orientation: CanvasGuideOrientation;
		x: number;
		y: number;
	} | null>(null);
	let draftPoints = $state<{ x: number; y: number }[]>([]);
	let draftCursor = $state<{ x: number; y: number } | null>(null);
	let activePathPoint = $state<number | null>(null);
	/** Local layer edits while dragging — commit to document on pointer up. */
	let draftLayers = $state<CanvasLayer[] | null>(null);
	let interactCount = $state(0);

	const RULER_TOP = 20;
	/** Wide enough for upright major labels (e.g. 1000) beside ticks. */
	const RULER_LEFT = 36;
	const PAD = 48;
	const workingLayers = $derived(draftLayers ?? doc.layers);
	const displayLayers = $derived(
		expandWidgets
			? flattenLayersWithWidgets(workingLayers, doc.widgets ?? [])
			: workingLayers
	);
	const absMap = $derived(
		computeAbsoluteRects(displayLayers, { width: doc.width, height: doc.height })
	);
	const sorted = $derived.by(() => {
		const out: typeof displayLayers = [];
		const walk = (parentId: string | null) => {
			const kids = displayLayers
				.filter((l) => (l.parentId ?? null) === parentId)
				.sort((a, b) => a.zIndex - b.zIndex);
			for (const k of kids) {
				out.push(k);
				walk(k.id);
			}
		};
		walk(null);
		return out;
	});
	const selectedSet = $derived(new Set(selectedIds));
	const sceneLayerIds = $derived(new Set(workingLayers.map((l) => l.id)));

	function resolveSelectableId(id: string): string {
		if (sceneLayerIds.has(id)) return id;
		const host = id.split('::')[0];
		return sceneLayerIds.has(host) ? host : id;
	}
	const guides = $derived(doc.guides ?? []);
	const guidesLocked = $derived(!!doc.guidesLocked);
	const artboardTransparent = $derived(backgroundAlpha(doc.background) < 0.999);
	const selectedPath = $derived(
		selectedIds.length === 1
			? (workingLayers.find((l) => l.id === selectedIds[0] && l.kind === 'path') ?? null)
			: null
	);

	const fitScale = $derived.by(() => {
		if (vw <= 0 || vh <= 0) return 1;
		const sx = (vw - PAD * 2) / doc.width;
		const sy = (vh - PAD * 2) / doc.height;
		return Math.max(0.05, Math.min(sx, sy, 1));
	});

	const scale = $derived(Math.min(4, Math.max(0.1, fitScale * zoom)));
	const boardW = $derived(doc.width * scale);
	const boardH = $derived(doc.height * scale);

	const guideSnapList = $derived(
		guides.map((g) => ({ orientation: g.orientation, position: g.position }))
	);

	type RulerTick = { pos: number; level: 'major' | 'mid' | 'minor' };

	/** Nice major step so labels sit ~56–80px apart on screen. */
	function majorStepForScale(s: number) {
		const targetDoc = 64 / Math.max(0.05, s);
		const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
		let best = nice[nice.length - 1];
		for (const n of nice) {
			if (n >= targetDoc) {
				best = n;
				break;
			}
			best = n;
		}
		return best;
	}

	function buildTicks(length: number, s: number): RulerTick[] {
		const major = majorStepForScale(s);
		const mid = major / 2;
		const minor = major / 10;
		const ticks: RulerTick[] = [];
		const eps = minor / 4;
		for (let p = 0; p <= length + eps; p += minor) {
			const pos = Math.round(p * 1000) / 1000;
			if (pos > length) break;
			const nearMajor = Math.abs(pos % major) < eps || Math.abs((pos % major) - major) < eps;
			const nearMid = Math.abs(pos % mid) < eps || Math.abs((pos % mid) - mid) < eps;
			ticks.push({
				pos,
				level: nearMajor ? 'major' : nearMid ? 'mid' : 'minor'
			});
		}
		return ticks;
	}

	const rulerTicksX = $derived(buildTicks(doc.width, scale));
	const rulerTicksY = $derived(buildTicks(doc.height, scale));

	/** Tick position inside the top / left ruler strips (aligned with the scroll viewport). */
	function tickX(docPos: number) {
		return boardScreenX + docPos * scale;
	}
	function tickY(docPos: number) {
		return boardScreenY + docPos * scale;
	}

	const api: WidgetCanvasContext = {
		get showGrid() {
			return showGrid;
		},
		get snap() {
			return snap;
		},
		get cellSize() {
			return cellSize;
		},
		get autoCells() {
			return 8;
		},
		get cellSizeMode() {
			return 'fixed' as const;
		},
		get scale() {
			return scale;
		},
		getBounds() {
			return { width: doc.width, height: doc.height };
		},
		snapValue(value: number) {
			return snapToGrid(value, cellSize, snap);
		},
		snapRect(rect: WidgetRect, minW: number, minH: number) {
			let r = snapWidgetRect(rect, cellSize, snap, minW, minH);
			if (guideSnapList.length) {
				const snapped = snapRectToGuides(r, guideSnapList, 8);
				r = { ...r, x: snapped.x, y: snapped.y };
			}
			return r;
		},
		clampRect(rect: WidgetRect, minW: number, minH: number) {
			return clampWidgetRect(rect, { width: doc.width, height: doc.height }, minW, minH);
		}
	};

	setContext(WIDGET_CANVAS_CONTEXT, api);

	const gridOverlayStyle = $derived.by(() => {
		const cell = Math.max(4, cellSize);
		const major = cell * 5;
		const fine = 'color-mix(in oklab, #0f172a 18%, transparent)';
		const bold = 'color-mix(in oklab, #0f172a 32%, transparent)';
		return [
			`background-image:`,
			`linear-gradient(to right, ${fine} 1px, transparent 1px),`,
			`linear-gradient(to bottom, ${fine} 1px, transparent 1px),`,
			`linear-gradient(to right, ${bold} 1px, transparent 1px),`,
			`linear-gradient(to bottom, ${bold} 1px, transparent 1px);`,
			`background-size:${cell}px ${cell}px, ${cell}px ${cell}px, ${major}px ${major}px, ${major}px ${major}px;`
		].join('');
	});

	function syncBoardScreen() {
		if (!viewportEl || !artboardEl) return;
		const v = viewportEl.getBoundingClientRect();
		const a = artboardEl.getBoundingClientRect();
		boardScreenX = a.left - v.left;
		boardScreenY = a.top - v.top;
	}

	function patchGuides(next: CanvasGuide[], locked = guidesLocked) {
		ondocumentchange?.({ ...doc, guides: next, guidesLocked: locked });
	}

	function absToLocalUpdate(layer: CanvasLayer, absRect: WidgetRect): CanvasLayer {
		const parentId = layer.parentId ?? null;
		const parentAbs = parentId ? (absMap.get(parentId) ?? null) : null;
		const parentLayer = parentId ? workingLayers.find((l) => l.id === parentId) : null;
		const pad = parentLayer
			? contentPadding(parentLayer)
			: { left: 0, top: 0, right: 0, bottom: 0 };
		const originX = (parentAbs?.x ?? 0) + pad.left;
		const originY = (parentAbs?.y ?? 0) + pad.top;
		const contentW = parentAbs
			? Math.max(0, parentAbs.w - pad.left - pad.right)
			: doc.width;
		const contentH = parentAbs
			? Math.max(0, parentAbs.h - pad.top - pad.bottom)
			: doc.height;
		const local = {
			x: absRect.x - originX,
			y: absRect.y - originY,
			w: absRect.w,
			h: absRect.h
		};
		const anchors = layer.slot?.anchors ?? { minX: 0, minY: 0, maxX: 0, maxY: 0 };
		const slot = {
			...slotFromLocalRect({ width: contentW, height: contentH }, local, anchors),
			padding: layer.slot?.padding,
			sizeRule: layer.slot?.sizeRule,
			alignment: layer.slot?.alignment,
			order: layer.slot?.order
		};
		return { ...layer, rect: local, slot };
	}

	function commitDraft() {
		if (!draftLayers) return;
		const layers = draftLayers;
		draftLayers = null;
		ondocumentchange?.({ ...doc, layers });
	}

	function handleLayerInteract(active: boolean) {
		if (active) {
			interactCount += 1;
			return;
		}
		interactCount = Math.max(0, interactCount - 1);
		if (interactCount === 0) commitDraft();
	}

	function cancelLayerDraft() {
		draftLayers = null;
		interactCount = 0;
	}

	function isLayoutLocked(layer: CanvasLayer): boolean {
		const parentId = layer.parentId ?? null;
		if (!parentId) return false;
		const parent = workingLayers.find((l) => l.id === parentId);
		return !!parent && LAYOUT_BOX_KINDS.has(parent.kind);
	}

	function handleRect(layer: CanvasLayer, rect: WidgetRect) {
		if (!sceneLayerIds.has(layer.id)) return;
		if (isLayoutLocked(layer)) return;
		const layers = draftLayers ?? doc.layers;
		const source = layers.find((l) => l.id === layer.id);
		if (!source) return;

		const minW = source.kind === 'line' || source.kind === 'arrow' ? 24 : 40;
		const minH = source.kind === 'line' ? 2 : 24;
		const nextAbs = snapLayerRect(
			{ x: rect.x, y: rect.y, w: rect.w, h: rect.h },
			cellSize,
			snap,
			{ width: doc.width, height: doc.height },
			minW,
			minH,
			guideSnapList
		);

		const prevAbs = absMap.get(source.id) ?? source.rect;
		const dx = nextAbs.x - prevAbs.x;
		const dy = nextAbs.y - prevAbs.y;
		const moving =
			Math.abs(nextAbs.w - prevAbs.w) < 0.5 && Math.abs(nextAbs.h - prevAbs.h) < 0.5;
		const groupMove =
			moving &&
			selectedIds.length > 1 &&
			selectedSet.has(source.id) &&
			(Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01);

		if (groupMove) {
			draftLayers = layers.map((l) => {
				if (!selectedSet.has(l.id) || l.locked) return l;
				const a = absMap.get(l.id) ?? l.rect;
				const moved = {
					x: a.x + dx,
					y: a.y + dy,
					w: a.w,
					h: a.h
				};
				return absToLocalUpdate(l, moved);
			});
			return;
		}

		const updated = absToLocalUpdate(source, nextAbs);
		draftLayers = layers.map((l) => (l.id === updated.id ? updated : l));
		// If somehow interact end already fired without draft, commit immediately.
		if (interactCount === 0) commitDraft();
	}

	function selectLayer(id: string, e: MouseEvent) {
		e.stopPropagation();
		const realId = resolveSelectableId(id);
		if (e.shiftKey || e.metaKey || e.ctrlKey) {
			const set = new Set(selectedIds);
			if (set.has(realId)) set.delete(realId);
			else set.add(realId);
			onselect?.([...set]);
			return;
		}
		// Keep multi-selection when clicking an already-selected item (group drag).
		if (selectedSet.has(realId)) return;
		onselect?.([realId]);
	}

	function clearSelectionIfEmptyClick(e?: MouseEvent) {
		if (skipClearClick) {
			skipClearClick = false;
			return;
		}
		if (e) {
			const t = e.target as HTMLElement | null;
			if (
				t?.closest(
					'[data-layer-item], [data-layer-frame], [data-resize-handle], [data-guide], [data-ruler]'
				)
			) {
				return;
			}
		}
		onselect?.([]);
	}

	function hasElementDrag(dt: DataTransfer | null) {
		if (!dt) return false;
		return [...dt.types].includes(CANVAS_ELEMENT_MIME);
	}

	function handleElementDragOver(e: DragEvent) {
		if (!hasElementDrag(e.dataTransfer)) return;
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
	}

	function handleElementDrop(e: DragEvent) {
		if (!hasElementDrag(e.dataTransfer)) return;
		e.preventDefault();
		e.stopPropagation();
		const raw = e.dataTransfer?.getData(CANVAS_ELEMENT_MIME);
		if (!raw || !ondropelement) return;
		try {
			const def = JSON.parse(raw) as CanvasElementDef;
			const pt = clientToDoc(e.clientX, e.clientY);
			ondropelement({ def, x: pt.x, y: pt.y });
		} catch {
			/* ignore bad payload */
		}
	}

	function layerHitBoxes(): { id: string; x: number; y: number; width: number; height: number }[] {
		if (!artboardEl || !viewportEl) return [];
		const vRect = viewportEl.getBoundingClientRect();
		const aRect = artboardEl.getBoundingClientRect();
		const originX = aRect.left - vRect.left + viewportEl.scrollLeft;
		const originY = aRect.top - vRect.top + viewportEl.scrollTop;
		const s = scale;
		return sorted
			.filter((l) => l.visible && !l.locked && sceneLayerIds.has(resolveSelectableId(l.id)))
			.map((l) => {
				const r = absMap.get(l.id) ?? l.rect;
				return {
					id: resolveSelectableId(l.id),
					x: originX + r.x * s,
					y: originY + r.y * s,
					width: r.w * s,
					height: r.h * s
				};
			});
	}

	function clientToDoc(clientX: number, clientY: number) {
		if (!artboardEl) return { x: 0, y: 0 };
		const aRect = artboardEl.getBoundingClientRect();
		return {
			x: (clientX - aRect.left) / scale,
			y: (clientY - aRect.top) / scale
		};
	}

	/** Topmost selectable layer at a document point (deepest in paint order). */
	function pickLayerAtDoc(pt: { x: number; y: number }): string | null {
		for (let i = sorted.length - 1; i >= 0; i--) {
			const l = sorted[i];
			if (!l.visible || l.locked) continue;
			const selectable = resolveSelectableId(l.id);
			if (!sceneLayerIds.has(l.id) && !sceneLayerIds.has(selectable)) continue;
			const r = absMap.get(l.id) ?? l.rect;
			if (pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h) {
				return selectable;
			}
		}
		return null;
	}

	function snapDocPoint(pt: { x: number; y: number }) {
		if (!snap) return pt;
		return {
			x: Math.round(pt.x / cellSize) * cellSize,
			y: Math.round(pt.y / cellSize) * cellSize
		};
	}

	function finishDraft(closed: boolean) {
		if (draftPoints.length < 2) {
			draftPoints = [];
			draftCursor = null;
			ondrawcancel?.();
			return;
		}
		const points = [...draftPoints];
		draftPoints = [];
		draftCursor = null;
		ondrawcomplete?.({ points, closed });
	}

	function cancelDraft() {
		draftPoints = [];
		draftCursor = null;
		ondrawcancel?.();
	}

	function handleDrawClick(e: MouseEvent) {
		if (!drawMode) return;
		e.preventDefault();
		e.stopPropagation();
		const raw = clientToDoc(e.clientX, e.clientY);
		const pt = snapDocPoint(raw);
		if (draftPoints.length >= 3) {
			const first = draftPoints[0];
			const dist = Math.hypot(pt.x - first.x, pt.y - first.y);
			if (dist <= 12 / scale) {
				finishDraft(true);
				return;
			}
		}
		draftPoints = [...draftPoints, pt];
	}

	function handleDrawMove(e: MouseEvent) {
		if (!drawMode || !draftPoints.length) {
			draftCursor = null;
			return;
		}
		draftCursor = snapDocPoint(clientToDoc(e.clientX, e.clientY));
	}

	function handleDrawDblClick(e: MouseEvent) {
		if (!drawMode) return;
		e.preventDefault();
		e.stopPropagation();
		finishDraft(false);
	}

	function beginPathPointDrag(index: number, e: PointerEvent) {
		if (!selectedPath || selectedPath.locked) return;
		e.preventDefault();
		e.stopPropagation();
		activePathPoint = index;
		const meta = selectedPath;
		const working = pathPointsToDoc(meta);
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);
		const onMove = (ev: PointerEvent) => {
			working[index] = snapDocPoint(clientToDoc(ev.clientX, ev.clientY));
			onlayerchange?.(rebakePathLayer(meta, working.map((p) => ({ ...p }))));
		};
		const onUp = () => {
			try {
				target.releasePointerCapture(e.pointerId);
			} catch {
				/* ignore */
			}
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

	function insertPathPoint(afterIndex: number, e: MouseEvent) {
		if (!selectedPath || selectedPath.locked) return;
		e.preventDefault();
		e.stopPropagation();
		const docs = pathPointsToDoc(selectedPath);
		const pt = snapDocPoint(clientToDoc(e.clientX, e.clientY));
		docs.splice(afterIndex + 1, 0, pt);
		onlayerchange?.(rebakePathLayer(selectedPath, docs));
	}

	function removeActivePathPoint() {
		if (!selectedPath || selectedPath.locked || activePathPoint == null) return;
		const docs = pathPointsToDoc(selectedPath);
		if (docs.length <= 2) return;
		docs.splice(activePathPoint, 1);
		activePathPoint = null;
		onlayerchange?.(rebakePathLayer(selectedPath, docs));
	}

	$effect(() => {
		if (!drawMode) {
			draftPoints = [];
			draftCursor = null;
		}
	});

	$effect(() => {
		if (!selectedPath) activePathPoint = null;
	});

	function clampGuidePos(orientation: CanvasGuideOrientation, pos: number) {
		const max = orientation === 'vertical' ? doc.width : doc.height;
		let p = Math.min(Math.max(0, pos), max);
		if (snap) p = snapToGrid(p, cellSize, true);
		return p;
	}

	function setGuidePreview(orientation: CanvasGuideOrientation, clientX: number, clientY: number) {
		if (!stageEl) return;
		const r = stageEl.getBoundingClientRect();
		guidePreview = {
			orientation,
			x: clientX - r.left,
			y: clientY - r.top
		};
	}

	function beginGuideDrag(guide: CanvasGuide, e: PointerEvent) {
		if (guidesLocked || guide.locked) return;
		e.preventDefault();
		e.stopPropagation();
		draggingGuideId = guide.id;
		setGuidePreview(guide.orientation, e.clientX, e.clientY);
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);

		const onMove = (ev: PointerEvent) => {
			setGuidePreview(guide.orientation, ev.clientX, ev.clientY);
			const pt = clientToDoc(ev.clientX, ev.clientY);
			const pos = clampGuidePos(
				guide.orientation,
				guide.orientation === 'vertical' ? pt.x : pt.y
			);
			patchGuides(guides.map((g) => (g.id === guide.id ? { ...g, position: pos } : g)));
		};
		const onUp = (ev: PointerEvent) => {
			draggingGuideId = null;
			guidePreview = null;
			try {
				target.releasePointerCapture(ev.pointerId);
			} catch {
				/* ignore */
			}
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

	/** Drag from ruler: live full-stage preview, commit guide on release. */
	function beginRulerDrag(orientation: CanvasGuideOrientation, e: PointerEvent) {
		if (guidesLocked) return;
		e.preventDefault();
		e.stopPropagation();
		setGuidePreview(orientation, e.clientX, e.clientY);

		const onMove = (ev: PointerEvent) => {
			setGuidePreview(orientation, ev.clientX, ev.clientY);
		};
		const onUp = (ev: PointerEvent) => {
			const pt = clientToDoc(ev.clientX, ev.clientY);
			const pos = clampGuidePos(orientation, orientation === 'vertical' ? pt.x : pt.y);
			patchGuides([...guides, createCanvasGuide(orientation, pos)]);
			guidePreview = null;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

	function removeGuide(id: string) {
		if (guidesLocked) return;
		patchGuides(guides.filter((g) => g.id !== id));
	}

	onMount(() => {
		if (!viewportEl) return;
		const el = viewportEl;
		const ro = new ResizeObserver(() => {
			vw = el.clientWidth;
			vh = el.clientHeight;
			requestAnimationFrame(syncBoardScreen);
		});
		ro.observe(el);
		vw = el.clientWidth;
		vh = el.clientHeight;
		requestAnimationFrame(syncBoardScreen);

		const onScroll = () => syncBoardScreen();
		el.addEventListener('scroll', onScroll, { passive: true });

		const disposeMarquee = attachMarqueeSelect(el, {
			getItems: () => layerHitBoxes(),
			shouldIgnore: (target) => {
				if (drawMode) return true;
				if (!(target instanceof Element)) return false;
				return Boolean(
					target.closest(
						'[data-layer-frame], [data-resize-handle], [data-guide], [data-ruler], [data-path-point], button, input, textarea'
					)
				);
			},
			onRect: (r) => (marquee = r),
			onDrag: ({ ids, modifier }) => {
				onselect?.(resolveMarqueeSelection(ids, selectedIds, modifier));
			},
			onSelect: ({ ids, modifier }) => {
				skipClearClick = true;
				onselect?.(resolveMarqueeSelection(ids, selectedIds, modifier));
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						skipClearClick = false;
					});
				});
			}
		});

		const onWheel = (e: WheelEvent) => {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				const intensity = Math.min(0.25, Math.abs(e.deltaY) / 400);
				const step = (e.deltaY > 0 ? -1 : 1) * Math.max(0.05, intensity);
				onzoom?.(Math.round((zoom + step) * 100) / 100);
				return;
			}
			e.preventDefault();
			el.scrollLeft += e.deltaX || e.deltaY;
			el.scrollTop += e.deltaY;
		};
		el.addEventListener('wheel', onWheel, { passive: false });

		let panX = 0;
		let panY = 0;
		let panning = false;
		const onPointerDown = (e: PointerEvent) => {
			if (e.button !== 1) return;
			e.preventDefault();
			panning = true;
			panX = e.clientX;
			panY = e.clientY;
			el.setPointerCapture(e.pointerId);
		};
		const onPointerMove = (e: PointerEvent) => {
			if (!panning) return;
			el.scrollLeft -= e.clientX - panX;
			el.scrollTop -= e.clientY - panY;
			panX = e.clientX;
			panY = e.clientY;
		};
		const onPointerUp = (e: PointerEvent) => {
			if (!panning) return;
			panning = false;
			try {
				el.releasePointerCapture(e.pointerId);
			} catch {
				/* ignore */
			}
		};
		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('auxclick', (e) => {
			if (e.button === 1) e.preventDefault();
		});

		return () => {
			ro.disconnect();
			disposeMarquee();
			el.removeEventListener('scroll', onScroll);
			el.removeEventListener('wheel', onWheel);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', onPointerUp);
		};
	});

	$effect(() => {
		// Re-measure when zoom / board size changes
		scale;
		boardW;
		boardH;
		queueMicrotask(syncBoardScreen);
	});
</script>

<svelte:window
	onblur={() => {
		if (draftLayers) cancelLayerDraft();
	}}
	onkeydown={(e) => {
		const t = e.target as HTMLElement | null;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		if (drawMode) {
			if (e.key === 'Escape') {
				e.preventDefault();
				cancelDraft();
			} else if (e.key === 'Enter') {
				e.preventDefault();
				finishDraft(false);
			}
			return;
		}
		if (e.key === 'Escape' && draftLayers) {
			e.preventDefault();
			cancelLayerDraft();
			return;
		}
		if ((e.key === 'Delete' || e.key === 'Backspace') && e.altKey && activePathPoint != null) {
			e.preventDefault();
			removeActivePathPoint();
		}
	}}
/>

<div bind:this={stageEl} class={['relative flex h-full min-h-0 w-full flex-col', className]}>
	<!-- Top ruler — slim, crisp ticks -->
	<div
		class="relative z-30 flex shrink-0 border-b border-black/10 bg-[#eceff3] dark:border-white/10 dark:bg-[#1e2329]"
	>
		<div
			class="shrink-0 border-r border-black/10 bg-[#e2e6eb] dark:border-white/10 dark:bg-[#181c21]"
			style:width={`${RULER_LEFT}px`}
			style:height={`${RULER_TOP}px`}
		></div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			data-ruler="x"
			class="relative min-w-0 flex-1 cursor-ns-resize overflow-hidden"
			style:height={`${RULER_TOP}px`}
			title="Drag down to add a horizontal guide"
			onpointerdown={(e) => {
				if (e.button !== 0) return;
				beginRulerDrag('horizontal', e);
			}}
		>
			<svg class="absolute inset-0 h-full w-full" aria-hidden="true">
				{#each rulerTicksX as tick (tick.pos)}
					{@const left = tickX(tick.pos)}
					{#if left >= -8 && left <= (vw || 0) + 8}
						<line
							x1={left}
							x2={left}
							y1={tick.level === 'major' ? 5 : tick.level === 'mid' ? 9 : 12}
							y2={RULER_TOP}
							stroke="currentColor"
							class={tick.level === 'major'
								? 'text-slate-500 dark:text-slate-400'
								: tick.level === 'mid'
									? 'text-slate-400/80 dark:text-slate-500'
									: 'text-slate-300 dark:text-slate-600'}
							stroke-width="1"
						/>
						{#if tick.level === 'major'}
							<text
								x={left + 3}
								y="9"
								class="fill-slate-600 dark:fill-slate-300"
								font-size="9"
								font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
							>
								{Math.round(tick.pos)}
							</text>
						{/if}
					{/if}
				{/each}
			</svg>
		</div>
	</div>

	<div class="flex min-h-0 min-w-0 flex-1">
		<!-- Left ruler — upright labels (not rotated) so digits stay readable -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			data-ruler="y"
			class="relative z-30 shrink-0 cursor-ew-resize overflow-hidden border-r border-black/10 bg-[#eceff3] dark:border-white/10 dark:bg-[#1e2329]"
			style:width={`${RULER_LEFT}px`}
			title="Drag right to add a vertical guide"
			onpointerdown={(e) => {
				if (e.button !== 0) return;
				beginRulerDrag('vertical', e);
			}}
		>
			<svg class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
				{#each rulerTicksY as tick (tick.pos)}
					{@const top = tickY(tick.pos)}
					{#if top >= -8 && top <= (vh || 0) + 8}
						<line
							y1={top}
							y2={top}
							x1={tick.level === 'major' ? 22 : tick.level === 'mid' ? 28 : 31}
							x2={RULER_LEFT}
							stroke="currentColor"
							class={tick.level === 'major'
								? 'text-slate-500 dark:text-slate-400'
								: tick.level === 'mid'
									? 'text-slate-400/80 dark:text-slate-500'
									: 'text-slate-300 dark:text-slate-600'}
							stroke-width="1"
						/>
					{/if}
				{/each}
			</svg>
			{#each rulerTicksY as tick (tick.pos)}
				{#if tick.level === 'major'}
					{@const top = tickY(tick.pos)}
					{#if top >= 4 && top <= (vh || 0) - 2}
						<span
							class="pointer-events-none absolute left-0.5 w-[20px] text-right font-mono text-[9px] leading-none tabular-nums text-slate-700 dark:text-slate-200"
							style:top={`${top}px`}
							style:transform="translateY(-50%)"
						>
							{Math.round(tick.pos)}
						</span>
					{/if}
				{/if}
			{/each}
		</div>

		<!-- Scrollable canvas viewport -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={viewportEl}
			class="relative min-h-0 min-w-0 flex-1 overflow-auto"
			style:background-color="#dfe3e8"
			style:background-image="linear-gradient(45deg,#cfd5dc 25%,transparent 25%),linear-gradient(-45deg,#cfd5dc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cfd5dc 75%),linear-gradient(-45deg,transparent 75%,#cfd5dc 75%)"
			style:background-size="16px 16px"
			style:background-position="0 0,0 8px,8px -8px,-8px 0"
			role="presentation"
			onclick={clearSelectionIfEmptyClick}
			ondragover={handleElementDragOver}
			ondrop={handleElementDrop}
		>
			<div
				class="flex items-center justify-center"
				style:min-width="100%"
				style:min-height="100%"
				style:width={`${Math.max(vw || 0, boardW + PAD * 2)}px`}
				style:height={`${Math.max(vh || 0, boardH + PAD * 2)}px`}
			>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					bind:this={artboardEl}
					onclick={(e) => {
						e.stopPropagation();
						if (drawMode) {
							handleDrawClick(e);
							return;
						}
						clearSelectionIfEmptyClick(e);
					}}
					ondblclick={(e) => {
						if (drawMode) {
							handleDrawDblClick(e);
							return;
						}
						const pt = clientToDoc(e.clientX, e.clientY);
						const hit = pickLayerAtDoc(pt);
						if (hit) onenterlayer?.(hit);
					}}
					onmousemove={handleDrawMove}
					class={[
						'relative shrink-0 overflow-visible shadow-[0_8px_40px_rgba(15,23,42,0.18)] ring-1 ring-black/10',
						drawMode && 'cursor-crosshair'
					]}
					style:width={`${boardW}px`}
					style:height={`${boardH}px`}
				>
					<div
						class="absolute left-0 top-0 origin-top-left overflow-visible"
						style:width={`${doc.width}px`}
						style:height={`${doc.height}px`}
						style:transform={`scale(${scale})`}
					>
						<!-- Artboard surface (clipped). Layers sit above and may overhang like a compositor. -->
						<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
							{#if artboardTransparent}
								<div
									class="absolute inset-0"
									style:background-color="#e8ebef"
									style:background-image="linear-gradient(45deg,#cfd5dc 25%,transparent 25%),linear-gradient(-45deg,#cfd5dc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cfd5dc 75%),linear-gradient(-45deg,transparent 75%,#cfd5dc 75%)"
									style:background-size="16px 16px"
									style:background-position="0 0,0 8px,8px -8px,-8px 0"
								></div>
							{/if}
							<div class="absolute inset-0" style:background-color={doc.background}></div>
						</div>

						{#if showGrid}
							<div
								class="pointer-events-none absolute inset-0 z-100 overflow-hidden"
								style={gridOverlayStyle}
								aria-hidden="true"
							></div>
						{/if}

						<div class={['absolute inset-0 overflow-visible', drawMode && 'pointer-events-none']}>
							{#each sorted as layer, paintIndex (layer.id)}
								{@const realId = resolveSelectableId(layer.id)}
								{@const isSynthetic = !sceneLayerIds.has(layer.id)}
								{@const lockedPass = !!layer.locked || isSynthetic}
								{@const displayRect = absMap.get(layer.id) ?? layer.rect}
								{@const clipPath = clipPathForLayer(layer.id, displayLayers, absMap)}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									data-layer-item
									data-marquee-id={realId}
									class="contents"
									oncontextmenu={(e) => {
										if (lockedPass && isSynthetic) {
											e.preventDefault();
											e.stopPropagation();
											onselect?.([realId]);
											oncontextlayer?.({ id: realId, x: e.clientX, y: e.clientY });
											return;
										}
										if (layer.locked) return;
										e.preventDefault();
										e.stopPropagation();
										if (!selectedSet.has(realId)) onselect?.([realId]);
										oncontextlayer?.({ id: realId, x: e.clientX, y: e.clientY });
									}}
								>
									<MediaLayerItem
										{layer}
										{displayRect}
										{clipPath}
										stackIndex={paintIndex}
										selected={selectedSet.has(realId) && !isSynthetic}
										passthrough={!!layer.locked}
										readOnly={isSynthetic}
										layoutLocked={isLayoutLocked(layer)}
										onclick={(e) => selectLayer(layer.id, e)}
										ondblclick={(e) => {
											if (layer.locked) return;
											const pt = clientToDoc(e.clientX, e.clientY);
											const hit = pickLayerAtDoc(pt) ?? realId;
											onenterlayer?.(hit);
										}}
										onchange={(rect) => handleRect(layer, rect)}
										oninteract={handleLayerInteract}
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<MarqueeRect rect={marquee} />
		</div>
	</div>

	<!-- Guides span the full stage (rulers → viewport) so they align with ruler numbers -->
	{#if showGuides}
		{#each guides as guide (guide.id)}
			{@const locked = guidesLocked || !!guide.locked}
			{@const hiding = draggingGuideId === guide.id && guidePreview}
			{@const screenX = RULER_LEFT + tickX(guide.position)}
			{@const screenY = RULER_TOP + tickY(guide.position)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				data-guide={guide.id}
				class={[
					'absolute z-40',
					guide.orientation === 'vertical'
						? 'top-0 bottom-0 w-2 -translate-x-1/2 cursor-col-resize'
						: 'left-0 right-0 h-2 -translate-y-1/2 cursor-row-resize',
					locked && 'cursor-default',
					hiding && 'opacity-0'
				]}
				style={guide.orientation === 'vertical'
					? `left:${screenX}px`
					: `top:${screenY}px`}
				title={locked ? 'Guide locked' : 'Drag to move · Double-click to remove'}
				onpointerdown={(e) => beginGuideDrag(guide, e)}
				ondblclick={() => removeGuide(guide.id)}
			>
				<span
					class={[
						'pointer-events-none absolute bg-[#00c2ff]',
						guide.orientation === 'vertical'
							? 'left-1/2 top-0 h-full w-px -translate-x-1/2'
							: 'left-0 top-1/2 h-px w-full -translate-y-1/2',
						locked && 'opacity-60'
					]}
					style:box-shadow="0 0 0 1px rgba(0,194,255,0.35)"
					aria-hidden="true"
				></span>
			</div>
		{/each}
	{/if}

	<!-- Pen draft preview -->
	{#if drawMode && draftPoints.length}
		<svg
			class="pointer-events-none absolute inset-0 z-45 overflow-visible"
			aria-hidden="true"
		>
			{#each draftPoints as p, i (i)}
				{@const sx = RULER_LEFT + tickX(p.x)}
				{@const sy = RULER_TOP + tickY(p.y)}
				{#if i > 0}
					{@const prev = draftPoints[i - 1]}
					<line
						x1={RULER_LEFT + tickX(prev.x)}
						y1={RULER_TOP + tickY(prev.y)}
						x2={sx}
						y2={sy}
						stroke="#3b82f6"
						stroke-width="2"
						stroke-linecap="round"
					/>
				{/if}
				<circle cx={sx} cy={sy} r="4" fill="#fff" stroke="#3b82f6" stroke-width="2" />
			{/each}
			{#if draftCursor && draftPoints.length}
				{@const last = draftPoints[draftPoints.length - 1]}
				<line
					x1={RULER_LEFT + tickX(last.x)}
					y1={RULER_TOP + tickY(last.y)}
					x2={RULER_LEFT + tickX(draftCursor.x)}
					y2={RULER_TOP + tickY(draftCursor.y)}
					stroke="#3b82f6"
					stroke-width="2"
					stroke-dasharray="4 4"
					stroke-linecap="round"
				/>
			{/if}
		</svg>
		<div
			class="pointer-events-none absolute bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900/90 px-3 py-1.5 text-[11px] text-white shadow"
		>
			Click to add · near start to close · double-click / Enter to finish · Esc cancel
		</div>
	{/if}

	<!-- Editable path points -->
	{#if selectedPath && !drawMode && !selectedPath.locked}
		{@const docs = pathPointsToDoc(selectedPath)}
		{#each docs as p, i (i)}
			{@const sx = RULER_LEFT + tickX(p.x)}
			{@const sy = RULER_TOP + tickY(p.y)}
			{#if i < docs.length - 1 || selectedPath.closed}
				{@const next = docs[(i + 1) % docs.length]}
				{@const mx = RULER_LEFT + tickX((p.x + next.x) / 2)}
				{@const my = RULER_TOP + tickY((p.y + next.y) / 2)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<button
					type="button"
					class="absolute z-45 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-400/80 bg-white/80"
					style:left={`${mx}px`}
					style:top={`${my}px`}
					title="Double-click to add point"
					ondblclick={(e) => insertPathPoint(i, e)}
				></button>
			{/if}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				data-path-point={i}
				class={[
					'absolute z-46 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-blue-500 bg-white shadow',
					activePathPoint === i && 'ring-2 ring-blue-400'
				]}
				style:left={`${sx}px`}
				style:top={`${sy}px`}
				title="Drag to move · Alt+Delete to remove point"
				onpointerdown={(e) => beginPathPointDrag(i, e)}
			></div>
		{/each}
	{/if}

	<!-- Full-stage guide preview while dragging (edge to edge) -->
	{#if guidePreview}
		<div class="pointer-events-none absolute inset-0 z-50" aria-hidden="true">
			{#if guidePreview.orientation === 'vertical'}
				<div
					class="absolute top-0 bottom-0 w-px bg-[#00c2ff]"
					style:left={`${guidePreview.x}px`}
					style:box-shadow="0 0 0 1px rgba(0,194,255,0.35)"
				></div>
			{:else}
				<div
					class="absolute left-0 right-0 h-px bg-[#00c2ff]"
					style:top={`${guidePreview.y}px`}
					style:box-shadow="0 0 0 1px rgba(0,194,255,0.35)"
				></div>
			{/if}
		</div>
	{/if}
</div>
