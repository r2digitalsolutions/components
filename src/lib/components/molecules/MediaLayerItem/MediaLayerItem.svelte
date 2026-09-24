<script lang="ts">
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import {
		canvasLayerFilter,
		mediaContentBox,
		type CanvasLayer,
		type CanvasLayerRect
	} from '$lib/utils/canvasDocument.js';
	import type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';
	import { isContainerKind } from '$lib/utils/canvasHierarchy.js';
	import { CANVAS_SVG_SHAPES } from '$lib/utils/canvasShapes.js';

	interface MediaLayerItemProps {
		layer: CanvasLayer;
		/** Absolute (artboard) rect used for positioning. */
		displayRect?: CanvasLayerRect;
		/** CSS clip-path from ancestor clipChildren. */
		clipPath?: string;
		/**
		 * Global paint order on the stage. Prefer this over `layer.zIndex`, which is
		 * only meaningful among siblings and would let nested kids stack above
		 * higher root layers when everything shares one absolute stacking context.
		 */
		stackIndex?: number;
		/** Composed CSS transform (own + ancestor rotations) for flat-stage paint. */
		paintTransform?: string;
		selected?: boolean;
		/** When false, hide resize handles (multi-select uses a shared AABB). */
		showHandles?: boolean;
		/** Let clicks pass through (layer sits above the selection). */
		passthrough?: boolean;
		/** Synthetic resolved widget child — not directly editable. */
		readOnly?: boolean;
		/** Parent is a layout box (hBox/vBox/…) — no free drag. */
		layoutPositionLocked?: boolean;
		/** Parent owns child size (grid / scaleBox) — no free resize. */
		layoutSizeLocked?: boolean;
		/** @deprecated use layoutPositionLocked */
		layoutLocked?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		ondblclick?: (e: MouseEvent) => void;
		onchange?: (rect: WidgetRect) => void;
		/** Zoom and pan inside an image, or grow a text box so the type stays inside. */
		onpatch?: (
			partial: Partial<
				Pick<
					CanvasLayer,
					'mediaScale' | 'mediaX' | 'mediaY' | 'rect' | 'fontSize' | 'rotation' | 'textMaxWidth'
				>
			>
		) => void;
		/** Double-click turned this text or note into an editor. */
		editing?: boolean;
		ontextcommit?: (text: string) => void;
		/** True while this frame is being dragged/resized. */
		oninteract?: (active: boolean) => void;
		/**
		 * Parent owns live position (multi-select / selected group). The frame
		 * still reports pointer deltas; it must not visually detach from the group.
		 */
		followStageRect?: boolean;
	}

	let {
		layer,
		displayRect,
		clipPath,
		stackIndex,
		paintTransform,
		selected = false,
		showHandles,
		passthrough = false,
		readOnly = false,
		layoutPositionLocked = false,
		layoutSizeLocked = false,
		layoutLocked = false,
		class: className = '',
		onclick,
		ondblclick,
		onchange,
		onpatch,
		editing = false,
		ontextcommit,
		oninteract,
		followStageRect = false
	}: MediaLayerItemProps = $props();

	const pos = $derived(displayRect ?? layer.rect);
	const noDrag = $derived(layoutPositionLocked || layoutLocked);
	const noResize = $derived(layoutSizeLocked || layoutLocked);
	let rect = $state<WidgetRect>({ x: 0, y: 0, w: 100, h: 100 });
	let interacting = $state(false);
	let mediaBox = $state<HTMLDivElement | null>(null);
	let textEl = $state<HTMLDivElement | null>(null);
	let naturalW = $state(0);
	let naturalH = $state(0);
	let mediaGesture = $state(false);
	let mediaLive = $state<{ x: number; y: number; scale: number } | null>(null);
	let textFocused = false;
	let resizeEdge: string | null = null;
	let panOrigin = { x: 0, y: 0, mediaX: 0.5, mediaY: 0.5 };

	const mediaScale = $derived(mediaLive?.scale ?? layer.mediaScale ?? 1);
	const mediaX = $derived(mediaLive?.x ?? layer.mediaX ?? 0.5);
	const mediaY = $derived(mediaLive?.y ?? layer.mediaY ?? 0.5);
	const placed = $derived(
		mediaContentBox(
			{ w: Math.max(pos.w, 1), h: Math.max(pos.h, 1) },
			{ w: naturalW, h: naturalH },
			layer.objectFit,
			mediaScale,
			mediaX,
			mediaY
		)
	);

	function clamp01(n: number) {
		return Math.min(1, Math.max(0, n));
	}

	function onMediaLoad(e: Event) {
		const img = e.currentTarget as HTMLImageElement;
		if (!img.naturalWidth) return;
		naturalW = img.naturalWidth;
		naturalH = img.naturalHeight;
	}

	function currentMedia() {
		return {
			x: mediaLive?.x ?? layer.mediaX ?? 0.5,
			y: mediaLive?.y ?? layer.mediaY ?? 0.5,
			scale: mediaLive?.scale ?? layer.mediaScale ?? 1
		};
	}

	function beginMediaPan(e: PointerEvent) {
		if (e.button !== 0) return;
		e.stopPropagation();
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		mediaGesture = true;
		const cur = currentMedia();
		panOrigin = { x: e.clientX, y: e.clientY, mediaX: cur.x, mediaY: cur.y };
	}

	function moveMediaPan(e: PointerEvent) {
		if (!mediaGesture || !mediaBox) return;
		const box = mediaBox.getBoundingClientRect();
		if (box.width < 1 || box.height < 1) return;
		const docDx = ((e.clientX - panOrigin.x) / box.width) * Math.max(pos.w, 1);
		const docDy = ((e.clientY - panOrigin.y) / box.height) * Math.max(pos.h, 1);
		const base = mediaContentBox(
			{ w: Math.max(pos.w, 1), h: Math.max(pos.h, 1) },
			{ w: naturalW, h: naturalH },
			layer.objectFit,
			currentMedia().scale,
			0,
			0
		);
		const spanX = pos.w - base.w;
		const spanY = pos.h - base.h;
		mediaLive = {
			x: Math.abs(spanX) > 0.5 ? clamp01(panOrigin.mediaX + docDx / spanX) : panOrigin.mediaX,
			y: Math.abs(spanY) > 0.5 ? clamp01(panOrigin.mediaY + docDy / spanY) : panOrigin.mediaY,
			scale: currentMedia().scale
		};
	}

	function endMediaPan() {
		if (!mediaGesture) return;
		mediaGesture = false;
		const cur = currentMedia();
		onpatch?.({ mediaX: cur.x, mediaY: cur.y, mediaScale: cur.scale });
		mediaLive = null;
	}

	function readEditableText(el: HTMLElement) {
		return (el.innerText ?? '').replace(/\n$/, '');
	}

	function zoomMedia(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();
		const fit = layer.objectFit ?? 'cover';
		const min = fit === 'cover' ? 1 : 0.25;
		const cur = currentMedia();
		const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
		const scale = Math.min(6, Math.max(min, cur.scale * factor));
		mediaLive = { x: cur.x, y: cur.y, scale };
		onpatch?.({ mediaX: cur.x, mediaY: cur.y, mediaScale: scale });
		if (!mediaGesture) mediaLive = null;
	}

	const textAuto = $derived(
		(layer.kind === 'text' || layer.kind === 'sticky') && (layer.autoSize ?? layer.kind === 'text')
	);
	/** Canva: los laterales cambian el ancho; las esquinas escalan la letra. Arriba/abajo no existe. */
	const TEXT_RESIZE_EDGES = ['e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
	const isCornerEdge = (edge: string | null) =>
		edge === 'ne' || edge === 'nw' || edge === 'se' || edge === 'sw';
	let textResizeStart: { fontSize: number; w: number } | null = null;

	function onFrameInteract(active: boolean) {
		if (active) {
			interacting = true;
			if (resizeEdge && textAuto) {
				textResizeStart = {
					fontSize: layer.fontSize ?? (layer.kind === 'sticky' ? 20 : 32),
					w: Math.max(1, pos.w)
				};
			}
			oninteract?.(true);
			return;
		}
		const edge = resizeEdge;
		resizeEdge = null;
		textResizeStart = null;
		if (edge && textAuto) {
			const scaleX = pos.w > 0 ? layer.rect.w / pos.w : 1;
			onpatch?.({ textMaxWidth: Math.max(8, rect.w * scaleX) });
		}
		interacting = false;
		oninteract?.(false);
	}

	/** Esquina en texto: la letra sigue al ancho, igual que Canva. Los laterales no tocan la letra. */
	function onFrameRect(r: WidgetRect) {
		if (!followStageRect) rect = r;
		onchange?.(r);
		if (!textAuto || !textResizeStart || !isCornerEdge(resizeEdge)) return;
		const ratio = r.w / textResizeStart.w;
		if (!Number.isFinite(ratio) || ratio <= 0) return;
		const fontSize = Math.max(8, Math.min(400, Math.round(textResizeStart.fontSize * ratio)));
		if (fontSize !== (layer.fontSize ?? (layer.kind === 'sticky' ? 20 : 32))) {
			onpatch?.({ fontSize });
		}
	}

	function onTextBoxResize(next: { x: number; y: number; w: number; h: number }) {
		if (!textAuto || readOnly) return;
		const scaleX = pos.w > 0 ? layer.rect.w / pos.w : 1;
		const scaleY = pos.h > 0 ? layer.rect.h / pos.h : 1;
		const w = next.w * scaleX;
		const h = next.h * scaleY;
		if (Math.abs(w - layer.rect.w) <= 1 && Math.abs(h - layer.rect.h) <= 1) return;
		onpatch?.({ rect: { ...layer.rect, w, h } });
	}

	$effect(() => {
		if (!editing) {
			textFocused = false;
			return;
		}
		if (!textEl || textFocused) return;
		textFocused = true;
		const el = textEl;
		el.focus();
		const raw = (el.innerText ?? '').replace(/\n$/, '').trim();
		if (!raw) return;
		const range = document.createRange();
		range.selectNodeContents(el);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
	});

	$effect(() => {
		// Single-item drag/resize: WidgetFrame owns the live rect.
		// Group / multi-select: follow the stage so the grabbed object cannot detach.
		if (interacting && !followStageRect) return;
		rect = { x: pos.x, y: pos.y, w: pos.w, h: pos.h };
	});

	const cssFit = $derived(layer.objectFit ?? 'cover');
	/** Zoomed bitmaps use the measured box. Scale 1 is plain object-fit, same as before. */
	const zoomedMedia = $derived(Math.abs(mediaScale - 1) > 0.001);

	const contentTransform = $derived.by(() => {
		const parts: string[] = [];
		if (layer.flipX) parts.push('scaleX(-1)');
		if (layer.flipY) parts.push('scaleY(-1)');
		return parts.length ? parts.join(' ') : undefined;
	});

	const filter = $derived(canvasLayerFilter(layer));

	const boxShadow = $derived(
		layer.shadowBlur
			? `0 ${Math.round(layer.shadowBlur / 3)}px ${layer.shadowBlur}px ${layer.shadowColor ?? 'rgba(0,0,0,0.35)'}`
			: undefined
	);

	const handlesOn = $derived((showHandles ?? selected) && !readOnly);
	const svgShape = $derived(CANVAS_SVG_SHAPES[layer.kind]);
	const isPanel = $derived(isContainerKind(layer.kind) || layer.kind === 'widget');
	const clip = $derived(
		!!layer.clipChildren ||
			layer.kind === 'image' ||
			layer.kind === 'video' ||
			((layer.kind === 'text' || layer.kind === 'sticky') && !textAuto) ||
			layer.kind === 'border' ||
			layer.kind === 'canvasPanel' ||
			layer.kind === 'overlay' ||
			layer.kind === 'scrollBox' ||
			layer.kind === 'namedSlot'
	);
	const panelClip = $derived(
		!!layer.clipChildren || layer.kind === 'scrollBox' || layer.kind === 'namedSlot'
	);
</script>

{#if layer.visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class={['contents', className]}
		data-layer-item
		data-layer-frame={layer.id}
		onclick={(e) => {
			if (passthrough || readOnly) return;
			e.stopPropagation();
			onclick?.(e);
		}}
		ondblclick={(e) => {
			if (passthrough) return;
			e.stopPropagation();
			ondblclick?.(e);
		}}
	>
		<WidgetFrame
			freeform
			showChrome={false}
			flush
			clipContent={layer.kind === 'text' || layer.kind === 'sticky' ? !textAuto : true}
			handleStyle="canva"
			snapMode="live"
			hugContent={textAuto}
			hugMaxWidth={layer.textMaxWidth ?? 0}
			resizeEdges={textAuto ? [...TEXT_RESIZE_EDGES] : undefined}
			oncontentresize={onTextBoxResize}
			handlesVisible={handlesOn}
			raiseOnSelect={false}
			stackIndex={stackIndex ?? layer.zIndex}
			transform={paintTransform}
			rotation={layer.rotation ?? 0}
			onrotation={(deg) => onpatch?.({ rotation: deg })}
			draggable={!layer.locked && !readOnly && !noDrag}
			resizable={!layer.locked && !readOnly && !noResize && handlesOn}
			bind:rect
			applyRect={!followStageRect}
			minW={layer.kind === 'line' || layer.kind === 'arrow' || layer.kind === 'path'
				? 16
				: layer.kind === 'text' || layer.kind === 'sticky'
					? 8
					: 40}
			minH={layer.kind === 'line'
				? 4
				: layer.kind === 'text' || layer.kind === 'sticky'
					? 8
					: layer.kind === 'arrow' || layer.kind === 'path'
						? 16
						: 24}
			onresizestart={(_e, edge) => {
				resizeEdge = edge;
			}}
			class={['bg-transparent', passthrough || readOnly ? 'pointer-events-none' : '']
				.filter(Boolean)
				.join(' ')}
			onchange={onFrameRect}
			oninteract={onFrameInteract}
		>
			<div
				class="h-full w-full"
				style:opacity={layer.opacity}
				style:transform={contentTransform}
				style:filter
				style:box-shadow={boxShadow}
				style:border-radius={layer.borderRadius ? `${layer.borderRadius}px` : undefined}
				style:overflow={clip ? 'hidden' : undefined}
				style:clip-path={clipPath}
			>
				{#if layer.kind === 'image' && layer.src}
					<div class="relative h-full w-full" bind:this={mediaBox}>
						{#if zoomedMedia && naturalW > 0}
							<img
								src={layer.src}
								alt={layer.name}
								class="absolute max-w-none"
								draggable="false"
								style:width="{(placed.w / Math.max(pos.w, 1)) * 100}%"
								style:height="{(placed.h / Math.max(pos.h, 1)) * 100}%"
								style:left="{(placed.x / Math.max(pos.w, 1)) * 100}%"
								style:top="{(placed.y / Math.max(pos.h, 1)) * 100}%"
								onload={onMediaLoad}
							/>
						{:else}
							<img
								src={layer.src}
								alt={layer.name}
								class="h-full w-full"
								draggable="false"
								style:object-fit={cssFit}
								style:object-position="{mediaX * 100}% {mediaY * 100}%"
								onload={onMediaLoad}
							/>
						{/if}
						{#if selected && !readOnly && !passthrough}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="absolute cursor-grab active:cursor-grabbing"
								style="inset: 12px"
								onpointerdown={beginMediaPan}
								onpointermove={moveMediaPan}
								onpointerup={endMediaPan}
								onpointercancel={endMediaPan}
								onwheel={zoomMedia}
							></div>
						{/if}
					</div>
				{:else if layer.kind === 'video' && layer.src}
					<video
						src={layer.src}
						class="h-full w-full"
						style:object-fit={cssFit}
						style:object-position="{mediaX * 100}% {mediaY * 100}%"
						style:transform={zoomedMedia ? `scale(${mediaScale})` : undefined}
						muted
						playsinline
					></video>
				{:else if layer.kind === 'text' || layer.kind === 'sticky'}
					<div
						class={[
							'px-1.5 py-1 break-words whitespace-pre-wrap',
							!textAuto && 'h-full w-full overflow-hidden'
						]}
						style:background={layer.kind === 'sticky'
							? (layer.fill ?? '#fef08a')
							: layer.textBackground}
						style:color={layer.color ?? (layer.kind === 'sticky' ? '#713f12' : '#0f172a')}
						style:font-size="{layer.fontSize ?? (layer.kind === 'sticky' ? 20 : 32)}px"
						style:font-weight={layer.fontWeight ?? 600}
						style:font-family={layer.fontFamily}
						style:font-style={layer.fontStyle ?? 'normal'}
						style:text-decoration={layer.textDecoration ?? 'none'}
						style:letter-spacing={layer.letterSpacing != null
							? `${layer.letterSpacing}px`
							: undefined}
						style:line-height={layer.lineHeight ?? 1.25}
						style:text-align={layer.textAlign ?? 'left'}
						style:border-radius="{layer.borderRadius ?? (layer.kind === 'sticky' ? 4 : 0)}px"
					>
						{#if editing}
							<div
								bind:this={textEl}
								class="wrap-anywhere whitespace-pre-wrap outline-none"
								contenteditable="true"
								role="textbox"
								tabindex="0"
								onpointerdown={(e) => e.stopPropagation()}
								onblur={() => {
									if (textEl) ontextcommit?.(readEditableText(textEl));
								}}
							>
								{layer.text ?? (layer.kind === 'sticky' ? 'Note' : 'Text')}
							</div>
						{:else}
							<span class="wrap-anywhere whitespace-pre-wrap"
								>{layer.text ?? (layer.kind === 'sticky' ? 'Note' : 'Text')}</span
							>
						{/if}
					</div>
				{:else if layer.kind === 'rect' || layer.kind === 'roundRect' || layer.kind === 'border'}
					<div
						class="h-full w-full"
						style:background={layer.fill ?? (layer.kind === 'border' ? '#ffffff' : '#3b82f6')}
						style:border-radius="{layer.borderRadius ??
							(layer.kind === 'roundRect' || layer.kind === 'border' ? 12 : 0)}px"
						style:border={layer.stroke
							? `${layer.strokeWidth ?? 2}px solid ${layer.stroke}`
							: layer.kind === 'border'
								? '1px solid #e2e8f0'
								: undefined}
					></div>
				{:else if layer.kind === 'ellipse'}
					<div
						class="h-full w-full rounded-full"
						style:background={layer.fill ?? '#22c55e'}
						style:border={layer.stroke
							? `${layer.strokeWidth ?? 2}px solid ${layer.stroke}`
							: undefined}
					></div>
				{:else if svgShape}
					<svg
						class="h-full w-full"
						viewBox={`0 0 ${svgShape.viewBox.w} ${svgShape.viewBox.h}`}
						preserveAspectRatio={svgShape.meet ? 'xMidYMid meet' : 'none'}
					>
						<path
							d={svgShape.d}
							fill={layer.fill ?? svgShape.fill}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'line'}
					{@const vertical = pos.h > pos.w}
					{@const sw = Math.max(2, layer.strokeWidth ?? 4)}
					<div
						class={[
							'absolute rounded-full',
							vertical
								? 'top-0 left-1/2 h-full -translate-x-1/2'
								: 'left-0 top-1/2 w-full -translate-y-1/2'
						]}
						style:background={layer.fill ?? '#94a3b8'}
						style:width={vertical ? `${sw}px` : undefined}
						style:height={vertical ? undefined : `${sw}px`}
					></div>
				{:else if layer.kind === 'arrow'}
					{@const vertical = pos.h > pos.w}
					{@const sw = Math.max(2, layer.strokeWidth ?? 4)}
					{@const bw = pos.w}
					{@const bh = pos.h}
					{@const len = vertical ? bh : bw}
					{@const thick = vertical ? bw : bh}
					{@const head = Math.min(Math.max(14, thick * 0.9), len * 0.35, 40)}
					<svg
						class="h-full w-full overflow-visible"
						viewBox={`0 0 ${bw} ${bh}`}
						aria-hidden="true"
					>
						{#if vertical}
							{@const cx = bw / 2}
							<line
								x1={cx}
								y1={sw}
								x2={cx}
								y2={bh - head}
								stroke={layer.fill ?? '#0f172a'}
								stroke-width={sw}
								stroke-linecap="round"
							/>
							<polygon
								points={`${cx},${bh - sw} ${cx - head * 0.45},${bh - head} ${cx + head * 0.45},${bh - head}`}
								fill={layer.fill ?? '#0f172a'}
							/>
						{:else}
							{@const cy = bh / 2}
							<line
								x1={sw}
								y1={cy}
								x2={bw - head}
								y2={cy}
								stroke={layer.fill ?? '#0f172a'}
								stroke-width={sw}
								stroke-linecap="round"
							/>
							<polygon
								points={`${bw - sw},${cy} ${bw - head},${cy - head * 0.45} ${bw - head},${cy + head * 0.45}`}
								fill={layer.fill ?? '#0f172a'}
							/>
						{/if}
					</svg>
				{:else if layer.kind === 'path' && layer.points?.length}
					{@const bw = Math.max(1, pos.w)}
					{@const bh = Math.max(1, pos.h)}
					{@const d = layer.points
						.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * bw} ${p.y * bh}`)
						.join(' ')}
					<svg
						class="h-full w-full overflow-visible"
						viewBox={`0 0 ${bw} ${bh}`}
						aria-hidden="true"
					>
						<path
							d={layer.closed ? `${d} Z` : d}
							fill={layer.closed ? (layer.fill ?? '#0f172a') : 'none'}
							fill-opacity={layer.closed ? 0.15 : 1}
							stroke={layer.stroke ?? layer.fill ?? '#0f172a'}
							stroke-width={Math.max(2, layer.strokeWidth ?? 3)}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else if isPanel}
					<div
						class="relative h-full w-full"
						style:overflow={panelClip ? 'hidden' : 'visible'}
						style:background={layer.fill && layer.fill !== 'transparent'
							? layer.fill
							: 'transparent'}
						style:border={layer.kind === 'namedSlot'
							? '1px dashed color-mix(in oklab, #3b82f6 50%, transparent)'
							: layer.kind === 'scrollBox'
								? selected
									? '1px dashed color-mix(in oklab, #64748b 55%, transparent)'
									: '1px dashed color-mix(in oklab, #64748b 30%, transparent)'
								: selected
									? '1px dashed color-mix(in oklab, #64748b 35%, transparent)'
									: undefined}
						style:border-radius={layer.borderRadius ? `${layer.borderRadius}px` : undefined}
					>
						{#if layer.kind === 'namedSlot'}
							<span
								class="left-1.5 top-1.5 rounded bg-brand-500/15 px-1.5 py-0.5 font-semibold tracking-wide text-brand-600 pointer-events-none absolute text-[9px] uppercase"
							>
								{layer.slotName || layer.name || 'Slot'}
							</span>
						{/if}
						{#if layer.kind === 'scrollBox'}
							<span
								class="left-1.5 top-1.5 rounded bg-surface-overlay/90 px-1.5 py-0.5 font-semibold tracking-wide text-muted pointer-events-none absolute text-[9px] uppercase"
							>
								Scroll
							</span>
						{/if}
					</div>
				{:else}
					<div
						class="gap-2 bg-surface-overlay/80 text-secondary flex h-full w-full items-center justify-center"
					>
						<MediaKindIcon kind={layer.kind === 'audio' ? 'audio' : 'image'} />
						<span class="text-xs">{layer.name}</span>
					</div>
				{/if}
			</div>
		</WidgetFrame>
	</div>
{/if}
