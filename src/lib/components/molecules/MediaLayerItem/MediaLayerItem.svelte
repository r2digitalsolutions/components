<script lang="ts">
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import type { CanvasLayer, CanvasLayerRect } from '$lib/utils/canvasDocument.js';
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
		/** True while this frame is being dragged/resized. */
		oninteract?: (active: boolean) => void;
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
		oninteract
	}: MediaLayerItemProps = $props();

	const pos = $derived(displayRect ?? layer.rect);
	const noDrag = $derived(layoutPositionLocked || layoutLocked);
	const noResize = $derived(layoutSizeLocked || layoutLocked);
	let rect = $state<WidgetRect>({ x: 0, y: 0, w: 100, h: 100 });
	let interacting = $state(false);

	$effect(() => {
		// Don't fight the local drag/resize rect while the user is interacting.
		if (interacting) return;
		rect = { x: pos.x, y: pos.y, w: pos.w, h: pos.h };
	});

	const fitClass = $derived(
		layer.objectFit === 'contain'
			? 'object-contain'
			: layer.objectFit === 'fill'
				? 'object-fill'
				: 'object-cover'
	);

	const contentTransform = $derived.by(() => {
		const parts: string[] = [];
		if (layer.flipX) parts.push('scaleX(-1)');
		if (layer.flipY) parts.push('scaleY(-1)');
		return parts.length ? parts.join(' ') : undefined;
	});

	const filter = $derived.by(() => {
		const parts: string[] = [];
		if (layer.blur) parts.push(`blur(${layer.blur}px)`);
		return parts.length ? parts.join(' ') : undefined;
	});

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
			layer.kind === 'sticky' ||
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
			handleStyle="canva"
			handlesVisible={handlesOn}
			raiseOnSelect={false}
			stackIndex={stackIndex ?? layer.zIndex}
			transform={paintTransform}
			draggable={!layer.locked && !readOnly && !noDrag}
			resizable={!layer.locked && !readOnly && !noResize && handlesOn}
			bind:rect
			minW={layer.kind === 'line' || layer.kind === 'arrow' || layer.kind === 'path' ? 16 : 40}
			minH={layer.kind === 'line' ? 4 : layer.kind === 'arrow' || layer.kind === 'path' ? 16 : 24}
			class={['bg-transparent', passthrough || readOnly ? 'pointer-events-none' : '']
				.filter(Boolean)
				.join(' ')}
			onchange={(r) => {
				rect = r;
				onchange?.(r);
			}}
			oninteract={(active) => {
				interacting = active;
				oninteract?.(active);
			}}
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
					<img
						src={layer.src}
						alt={layer.name}
						class={['h-full w-full', fitClass]}
						draggable="false"
					/>
				{:else if layer.kind === 'video' && layer.src}
					<video src={layer.src} class={['h-full w-full', fitClass]} muted playsinline></video>
				{:else if layer.kind === 'text' || layer.kind === 'sticky'}
					<div
						class="px-2 py-1 flex h-full w-full"
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
						style:justify-content={layer.textAlign === 'center'
							? 'center'
							: layer.textAlign === 'right'
								? 'flex-end'
								: 'flex-start'}
						style:text-align={layer.textAlign ?? 'left'}
						style:align-items={layer.kind === 'sticky' ? 'flex-start' : 'center'}
						style:border-radius="{layer.borderRadius ?? (layer.kind === 'sticky' ? 4 : 0)}px"
					>
						{layer.text ?? (layer.kind === 'sticky' ? 'Note' : 'Text')}
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
