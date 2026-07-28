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
		snapLayerRect,
		snapRectToGuides,
		type CanvasDocument,
		type CanvasGuide,
		type CanvasGuideOrientation,
		type CanvasLayer
	} from '$lib/utils/canvasDocument.js';
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
		class?: string;
		onselect?: (ids: string[]) => void;
		onzoom?: (zoom: number) => void;
		onlayerchange?: (layer: CanvasLayer) => void;
		ondocumentchange?: (doc: CanvasDocument) => void;
		oncontextlayer?: (payload: { id: string; x: number; y: number }) => void;
		/** Drop an element from the Elements panel onto the artboard. */
		ondropelement?: (payload: { def: CanvasElementDef; x: number; y: number }) => void;
	}

	let {
		document: doc,
		selectedIds = [],
		zoom = 1,
		showGrid = false,
		showGuides = true,
		snap = true,
		cellSize = 8,
		class: className = '',
		onselect,
		onzoom,
		onlayerchange,
		ondocumentchange,
		oncontextlayer,
		ondropelement
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

	const RULER_TOP = 20;
	/** Wide enough for upright major labels (e.g. 1000) beside ticks. */
	const RULER_LEFT = 36;
	const PAD = 48;
	const sorted = $derived([...doc.layers].sort((a, b) => a.zIndex - b.zIndex));
	const selectedSet = $derived(new Set(selectedIds));
	const guides = $derived(doc.guides ?? []);
	const guidesLocked = $derived(!!doc.guidesLocked);
	const artboardTransparent = $derived(backgroundAlpha(doc.background) < 0.999);

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

	function handleRect(layer: CanvasLayer, rect: WidgetRect) {
		const minW = layer.kind === 'line' || layer.kind === 'arrow' ? 24 : 40;
		const minH = layer.kind === 'line' ? 2 : 24;
		const next = snapLayerRect(
			{ x: rect.x, y: rect.y, w: rect.w, h: rect.h },
			cellSize,
			snap,
			{ width: doc.width, height: doc.height },
			minW,
			minH,
			guideSnapList
		);

		const dx = next.x - layer.rect.x;
		const dy = next.y - layer.rect.y;
		const moving =
			Math.abs(next.w - layer.rect.w) < 0.5 && Math.abs(next.h - layer.rect.h) < 0.5;
		const groupMove =
			moving &&
			selectedIds.length > 1 &&
			selectedSet.has(layer.id) &&
			(Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01);

		if (groupMove) {
			ondocumentchange?.({
				...doc,
				layers: doc.layers.map((l) => {
					if (!selectedSet.has(l.id) || l.locked) return l;
					if (l.id === layer.id) return { ...l, rect: next };
					const x = Math.min(
						Math.max(0, l.rect.x + dx),
						Math.max(0, doc.width - l.rect.w)
					);
					const y = Math.min(
						Math.max(0, l.rect.y + dy),
						Math.max(0, doc.height - l.rect.h)
					);
					return { ...l, rect: { ...l.rect, x, y } };
				})
			});
			return;
		}

		onlayerchange?.({ ...layer, rect: next });
	}

	function selectLayer(id: string, e: MouseEvent) {
		e.stopPropagation();
		if (e.shiftKey || e.metaKey || e.ctrlKey) {
			const set = new Set(selectedIds);
			if (set.has(id)) set.delete(id);
			else set.add(id);
			onselect?.([...set]);
			return;
		}
		// Keep multi-selection when clicking an already-selected item (group drag).
		if (selectedSet.has(id)) return;
		onselect?.([id]);
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
			.filter((l) => l.visible && !l.locked)
			.map((l) => ({
				id: l.id,
				x: originX + l.rect.x * s,
				y: originY + l.rect.y * s,
				width: l.rect.w * s,
				height: l.rect.h * s
			}));
	}

	function clientToDoc(clientX: number, clientY: number) {
		if (!artboardEl) return { x: 0, y: 0 };
		const aRect = artboardEl.getBoundingClientRect();
		return {
			x: (clientX - aRect.left) / scale,
			y: (clientY - aRect.top) / scale
		};
	}

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
				if (!(target instanceof Element)) return false;
				return Boolean(
					target.closest(
						'[data-layer-frame], [data-resize-handle], [data-guide], [data-ruler], button, input, textarea'
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
					class="relative shrink-0 shadow-[0_8px_40px_rgba(15,23,42,0.18)] ring-1 ring-black/10"
					style:width={`${boardW}px`}
					style:height={`${boardH}px`}
					onclick={(e) => {
						e.stopPropagation();
						clearSelectionIfEmptyClick(e);
					}}
				>
					<div
						class="absolute left-0 top-0 origin-top-left"
						style:width={`${doc.width}px`}
						style:height={`${doc.height}px`}
						style:transform={`scale(${scale})`}
					>
						<div class="absolute inset-0 overflow-hidden">
							{#if artboardTransparent}
								<div
									class="absolute inset-0"
									style:background-color="#e8ebef"
									style:background-image="linear-gradient(45deg,#cfd5dc 25%,transparent 25%),linear-gradient(-45deg,#cfd5dc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cfd5dc 75%),linear-gradient(-45deg,transparent 75%,#cfd5dc 75%)"
									style:background-size="16px 16px"
									style:background-position="0 0,0 8px,8px -8px,-8px 0"
									aria-hidden="true"
								></div>
							{/if}
							<div class="absolute inset-0" style:background-color={doc.background}></div>
							<div class="absolute inset-0">
								{#each sorted as layer (layer.id)}
									{@const lockedPass = !!layer.locked}
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										data-layer-item
										data-marquee-id={layer.id}
										class="contents"
										oncontextmenu={(e) => {
											if (lockedPass) return;
											e.preventDefault();
											e.stopPropagation();
											if (!selectedSet.has(layer.id)) onselect?.([layer.id]);
											oncontextlayer?.({ id: layer.id, x: e.clientX, y: e.clientY });
										}}
									>
										<MediaLayerItem
											{layer}
											selected={selectedSet.has(layer.id)}
											passthrough={lockedPass}
											onclick={(e) => selectLayer(layer.id, e)}
											onchange={(rect) => handleRect(layer, rect)}
										/>
									</div>
								{/each}
							</div>

							{#if showGrid}
								<div
									class="pointer-events-none absolute inset-0 z-100"
									style={gridOverlayStyle}
									aria-hidden="true"
								></div>
							{/if}
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
