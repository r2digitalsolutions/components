<script lang="ts" module>
	export type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';
	export type WidgetResizeEdge = 'se' | 'e' | 's' | 'sw' | 'w' | 'ne' | 'n' | 'nw';
	export type WidgetHandleStyle = 'default' | 'canva';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import DragHandle from '$lib/components/atoms/DragHandle/DragHandle.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import X from '@lucide/svelte/icons/x';
	import {
		WIDGET_CANVAS_CONTEXT,
		type WidgetCanvasContext,
		type WidgetRect
	} from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';

	interface WidgetFrameProps {
		title?: string;
		description?: string;
		editable?: boolean;
		draggable?: boolean;
		resizable?: boolean;
		/** Built-in freeform drag/resize (absolute). Prefer inside WidgetCanvas. */
		freeform?: boolean;
		rect?: WidgetRect;
		minW?: number;
		minH?: number;
		/** Override canvas snap (default: inherit from WidgetCanvas) */
		snap?: boolean;
		/**
		 * Snap "en vivo" mientras arrastras o snap solo al soltar.
		 * Para que no se sienta que "no puedes mover" hacia arriba,
		 * recomiendo 'release'.
		 */
		snapMode?: 'live' | 'release';
		/**
		 * Resize handle look. `canva` = blue border + circular corner/edge handles.
		 */
		handleStyle?: WidgetHandleStyle;
		/**
		 * When false, no header chrome; freeform drag starts from the body.
		 * Use with canvas/artboard layers (Canva-like).
		 */
		showChrome?: boolean;
		/** Remove body padding so media/text fill the frame. */
		flush?: boolean;
		/** Selection chrome for canva: true = selected (border on; handles on hover),
		 * false = hide handles. Default: handles on hover.
		 */
		handlesVisible?: boolean;
		/** Limit which resize edges are shown (grid mode). Default: all edges. */
		resizeEdges?: WidgetResizeEdge[];
		/**
		 * Raise z-index while selected (`handlesVisible`). Canvas layers should
		 * set `false` so stacking order stays truthful; drag still raises via `mode`.
		 */
		raiseOnSelect?: boolean;
		/**
		 * Document stacking order (e.g. layer.zIndex). When set, freeform z-index
		 * follows this and only boosts temporarily while selected/dragging.
		 */
		stackIndex?: number;
		/** CSS transform on the freeform root (e.g. rotate/flip) so chrome rotates too. */
		transform?: string;
		collapsible?: boolean;
		collapsed?: boolean;
		loading?: boolean;
		reloading?: boolean;
		loadingMode?: 'skeleton' | 'spinner';
		loadingText?: string;
		reloadingText?: string;
		empty?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
		ondragstart?: (e: PointerEvent) => void;
		onresizestart?: (e: PointerEvent, edge: WidgetResizeEdge) => void;
		onremove?: () => void;
		/** Sync or async — body shows skeleton while pending / while `reloading` is true */
		onreload?: () => void | Promise<void>;
		oncollapse?: (collapsed: boolean) => void;
		onchange?: (rect: WidgetRect) => void;
		/** Fired when freeform drag/resize starts (after move threshold) or ends. */
		oninteract?: (active: boolean) => void;
	}

	let {
		title,
		description,
		editable = false,
		draggable = false,
		resizable = false,
		freeform = false,
		rect = $bindable<WidgetRect>({ x: 0, y: 0, w: 320, h: 220 }),
		minW = 200,
		minH = 120,
		snap,
		snapMode = 'release',
		handleStyle = 'default',
		showChrome = true,
		flush = false,
		handlesVisible,
		resizeEdges,
		raiseOnSelect = true,
		stackIndex,
		transform: frameTransform,
		collapsible = false,
		collapsed = $bindable(false),
		loading = false,
		reloading = false,
		loadingMode = 'spinner',
		loadingText = 'Cargando...',
		reloadingText = 'Actualizando...',
		empty = false,
		emptyTitle = 'No data yet',
		emptyDescription = 'This widget has nothing to show.',
		class: className = '',
		actions,
		children,
		ondragstart,
		onresizestart,
		onremove,
		onreload,
		oncollapse,
		onchange,
		oninteract
	}: WidgetFrameProps = $props();

	const canvas = getContext<WidgetCanvasContext | undefined>(WIDGET_CANVAS_CONTEXT);

	let mode = $state<'move' | 'resize' | null>(null);
	let edge = $state<WidgetResizeEdge>('se');
	let start = $state({ px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 });
	/** Pointer down awaiting movement threshold before starting freeform drag (preserves dblclick). */
	let pendingMove = $state<{
		pointerId: number;
		px: number;
		py: number;
		x: number;
		y: number;
		w: number;
		h: number;
	} | null>(null);
	let localBusy = $state(false);
	let localZ = $state(1);
	/** Tamaño local cuando resizable sin freeform (EditableChrome, etc.) */
	let localW = $state<number | null>(null);
	let localH = $state<number | null>(null);
	let rootEl: HTMLDivElement | null = null;

	function attachRoot(node: HTMLElement) {
		rootEl = node as HTMLDivElement;
		return () => {
			if (rootEl === node) rootEl = null;
		};
	}

	const showDragHandle = $derived(showChrome && (editable || freeform) && draggable);
	const showResizeHandle = $derived((editable || freeform) && resizable && !collapsed);
	const showReload = $derived(!!onreload);
	const busy = $derived(loading || reloading || localBusy);
	const snapEnabled = $derived(snap ?? canvas?.snap ?? false);
	const busyText = $derived(reloading || localBusy ? reloadingText : loadingText);
	/** DashboardGrid (u otro padre) gestiona el resize vía onresizestart */
	const delegateResize = $derived(!freeform && !!onresizestart);
	const builtinResize = $derived(freeform || (resizable && !delegateResize));
	const showHeader = $derived(
		showChrome &&
			(!!title ||
				showDragHandle ||
				!!actions ||
				(editable && !!onremove) ||
				collapsible ||
				showReload)
	);
	const isCanva = $derived(handleStyle === 'canva');
	const baseStack = $derived(stackIndex ?? localZ);
	const paintZ = $derived(
		mode || (raiseOnSelect && handlesVisible) ? 1_000_000 + baseStack : baseStack
	);

	function bringToFront() {
		if (!freeform) return;
		// Controlled stack: temporary raise comes from `paintZ` via handlesVisible/mode.
		if (stackIndex != null) return;
		localZ = Date.now();
	}

	function finalizeRect(next: WidgetRect): WidgetRect {
		const shouldSnapNow = snapEnabled && (snapMode === 'live' || mode === null);
		let r = {
			x: next.x,
			y: next.y,
			w: Math.max(minW, next.w),
			h: Math.max(minH, next.h)
		};
		if (canvas) {
			if (shouldSnapNow) r = canvas.snapRect(r, minW, minH);
			r = canvas.clampRect(r, minW, minH);
		} else {
			r = { ...r, x: Math.max(0, r.x), y: Math.max(0, r.y) };
		}
		return r;
	}

	function emitRect(next: WidgetRect) {
		const r = finalizeRect(next);
		rect = r;
		onchange?.(r);
	}

	function beginMove(e: PointerEvent) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		bringToFront();
		ondragstart?.(e);
		if (!freeform) return;
		// Defer actual drag until the pointer moves — keeps double-click working.
		pendingMove = { pointerId: e.pointerId, px: e.clientX, py: e.clientY, ...rect };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function beginResize(e: PointerEvent, nextEdge: WidgetResizeEdge) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		e.preventDefault();
		e.stopPropagation();
		bringToFront();
		pendingMove = null;
		onresizestart?.(e, nextEdge);
		if (delegateResize || !builtinResize) return;

		mode = 'resize';
		edge = nextEdge;
		oninteract?.(true);
		if (freeform) {
			start = { px: e.clientX, py: e.clientY, ...rect };
		} else {
			const box = rootEl?.getBoundingClientRect();
			start = {
				px: e.clientX,
				py: e.clientY,
				x: 0,
				y: 0,
				w: localW ?? box?.width ?? minW,
				h: localH ?? box?.height ?? minH
			};
		}
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (pendingMove && !mode) {
			const dxScreen = e.clientX - pendingMove.px;
			const dyScreen = e.clientY - pendingMove.py;
			if (Math.hypot(dxScreen, dyScreen) < 4) return;
			e.preventDefault();
			mode = 'move';
			start = {
				px: pendingMove.px,
				py: pendingMove.py,
				x: pendingMove.x,
				y: pendingMove.y,
				w: pendingMove.w,
				h: pendingMove.h
			};
			pendingMove = null;
			oninteract?.(true);
		}

		if (!mode || !builtinResize) return;
		const s = canvas?.scale || 1;
		const dx = (e.clientX - start.px) / s;
		const dy = (e.clientY - start.py) / s;

		if (mode === 'move') {
			if (!freeform) return;
			emitRect({
				...rect,
				x: start.x + dx,
				y: start.y + dy
			});
			return;
		}

		let { x, y, w, h } = start;
		if (edge.includes('e')) w = start.w + dx;
		if (edge.includes('s')) h = start.h + dy;
		if (edge.includes('w')) {
			w = start.w - dx;
			x = start.x + dx;
		}
		if (edge.includes('n')) {
			h = start.h - dy;
			y = start.y + dy;
		}
		w = Math.max(minW, w);
		h = Math.max(minH, h);
		if (edge.includes('w')) x = start.x + (start.w - w);
		if (edge.includes('n')) y = start.y + (start.h - h);

		// Shift: lock aspect ratio to the size at resize start
		if (e.shiftKey && start.w > 0 && start.h > 0) {
			const ratio = start.w / start.h;
			const isCorner = edge === 'ne' || edge === 'nw' || edge === 'se' || edge === 'sw';
			if (isCorner) {
				const dw = Math.abs(w - start.w);
				const dh = Math.abs(h - start.h);
				if (dw * start.h >= dh * start.w) {
					h = Math.max(minH, w / ratio);
					w = h * ratio;
				} else {
					w = Math.max(minW, h * ratio);
					h = w / ratio;
				}
				w = Math.max(minW, w);
				h = Math.max(minH, h);
				if (edge.includes('w')) x = start.x + (start.w - w);
				if (edge.includes('n')) y = start.y + (start.h - h);
			} else if (edge === 'e' || edge === 'w') {
				h = Math.max(minH, w / ratio);
				y = start.y + (start.h - h) / 2;
				if (edge === 'w') x = start.x + (start.w - w);
			} else if (edge === 'n' || edge === 's') {
				w = Math.max(minW, h * ratio);
				x = start.x + (start.w - w) / 2;
				if (edge === 'n') y = start.y + (start.h - h);
			}
		}

		if (freeform) {
			emitRect({ x, y, w, h });
		} else {
			localW = w;
			localH = h;
			onchange?.({ x: 0, y: 0, w, h });
		}
	}

	function onPointerUp() {
		const wasInteracting = mode === 'move' || mode === 'resize' || !!pendingMove;
		pendingMove = null;
		if (mode === 'resize' && freeform) {
			mode = null;
			emitRect({ ...rect });
			if (wasInteracting) oninteract?.(false);
			return;
		}
		if (mode === 'move' && freeform) {
			mode = null;
			emitRect({ ...rect });
			oninteract?.(false);
			return;
		}
		mode = null;
		if (wasInteracting) oninteract?.(false);
	}

	function toggleCollapse() {
		collapsed = !collapsed;
		oncollapse?.(collapsed);
	}

	async function handleReload() {
		if (busy) return;
		localBusy = true;
		try {
			await onreload?.();
		} finally {
			localBusy = false;
		}
	}

	const freeformEdgesDefault: { edge: WidgetResizeEdge; class: string }[] = [
		{ edge: 'e', class: 'top-2 bottom-2 -right-px w-1.5 cursor-e-resize' },
		{ edge: 's', class: 'left-2 right-2 -bottom-px h-1.5 cursor-s-resize' },
		{ edge: 'w', class: 'top-2 bottom-2 -left-px w-1.5 cursor-w-resize' },
		{ edge: 'n', class: 'left-2 right-2 -top-px h-1.5 cursor-n-resize' },
		{ edge: 'se', class: '-right-px -bottom-px h-3 w-3 cursor-se-resize' },
		{ edge: 'sw', class: '-left-px -bottom-px h-3 w-3 cursor-sw-resize' },
		{ edge: 'ne', class: '-right-px -top-px h-3 w-3 cursor-ne-resize' },
		{ edge: 'nw', class: '-left-px -top-px h-3 w-3 cursor-nw-resize' }
	];

	const freeformEdgesCanva: { edge: WidgetResizeEdge; class: string }[] = [
		{
			edge: 'n',
			class: 'left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-n-resize'
		},
		{
			edge: 's',
			class: 'left-1/2 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 cursor-s-resize'
		},
		{
			edge: 'e',
			class: 'top-1/2 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 cursor-e-resize'
		},
		{
			edge: 'w',
			class: 'top-1/2 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-w-resize'
		},
		{
			edge: 'nw',
			class: 'left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize'
		},
		{
			edge: 'ne',
			class: 'right-0 top-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 cursor-ne-resize'
		},
		{
			edge: 'sw',
			class: 'bottom-0 left-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 cursor-sw-resize'
		},
		{
			edge: 'se',
			class: 'bottom-0 right-0 h-3 w-3 translate-x-1/2 translate-y-1/2 cursor-se-resize'
		}
	];

	const freeformEdges = $derived(isCanva ? freeformEdgesCanva : freeformEdgesDefault);
	const visibleResizeEdges = $derived.by(() => {
		const allowed = resizeEdges ?? freeformEdges.map((h) => h.edge);
		const set = new Set(allowed);
		return freeformEdges.filter((h) => set.has(h.edge));
	});

	const rootStyle = $derived.by(() => {
		if (freeform) {
			const xf = frameTransform ? `transform:${frameTransform};transform-origin:0 0;` : '';
			return `left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${collapsed ? 'auto' : `${rect.h}px`};z-index:${paintZ};${xf}`;
		}
		if (localW != null) {
			const h = collapsed || localH == null ? 'auto' : `${localH}px`;
			return `width:${localW}px;height:${h};`;
		}
		return undefined;
	});

	const btnClass =
		'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:opacity-50';

	/** Handles only intercept pointers while hovered (or resizing), so neighbors can sit flush */
	const edgeAccent = $derived.by(() => {
		if (isCanva) {
			const visible =
				mode === 'resize'
					? 'pointer-events-auto opacity-100'
					: handlesVisible === false
						? 'pointer-events-none opacity-0'
						: 'pointer-events-none opacity-0 group-hover/widget:pointer-events-auto group-hover/widget:opacity-100';
			return [
				'absolute z-20 touch-none rounded-full border-2 border-[#3b82f6] bg-white shadow-sm',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/40',
				visible
			].join(' ');
		}
		return [
			'absolute z-10 touch-none rounded-sm bg-transparent transition-colors',
			'hover:bg-brand-500/70 focus-visible:bg-brand-500/70 focus-visible:outline-none',
			mode === 'resize' || handlesVisible === true
				? 'pointer-events-auto bg-brand-500/40'
				: 'pointer-events-none group-hover/widget:pointer-events-auto group-hover/widget:bg-brand-500/35'
		].join(' ');
	});

	const canvaBorder = $derived(
		isCanva && (handlesVisible === true || mode === 'resize' || mode === 'move')
	);

	/** `h-full` from parents must not win when collapsed — otherwise the card shell fills the grid cell empty. */
	const frameClassName = $derived.by(() => {
		if (!collapsed) return className;
		const base = className
			? String(className)
					.split(/\s+/)
					.filter((token) => token && token !== 'h-full' && token !== 'min-h-0')
			: [];
		return [...base, 'h-auto', 'max-h-fit', 'self-start', 'shrink-0'].join(' ');
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	{@attach attachRoot}
	class={[
		'group/widget min-h-0 min-w-0 flex flex-col overflow-visible',
		!isCanva && showChrome && 'rounded-xl border-border bg-surface-elevated overflow-hidden border',
		!isCanva && !showChrome && 'bg-transparent',
		isCanva && 'bg-transparent',
		canvaBorder && 'outline outline-2 outline-[#3b82f6]',
		freeform ? 'shadow-md absolute' : 'relative',
		isCanva && 'shadow-none',
		mode === 'move' && 'cursor-grabbing opacity-95',
		mode === 'resize' && !isCanva && 'ring-brand-500/40 ring-1',
		!showChrome && freeform && draggable && 'cursor-move',
		frameClassName
	]}
	style={rootStyle}
	onpointerdown={(e) => {
		bringToFront();
		if (!showChrome && freeform && draggable && e.button === 0) {
			const t = e.target as HTMLElement;
			if (t?.closest('[data-resize-handle]')) return;
			beginMove(e);
		}
	}}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	{#if showHeader}
		<div
			class={[
				'gap-2 border-border px-3 py-2.5 flex shrink-0 items-center border-b',
				showDragHandle && 'touch-none',
				collapsed && 'border-b-0'
			]}
			onpointerdown={(e) => {
				if (!showDragHandle) return;
				const target = e.target as HTMLElement;
				if (target?.closest('button, a, [data-resize-handle]')) return;
				beginMove(e);
			}}
		>
			{#if showDragHandle}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class={['mt-0.5 shrink-0', freeform ? 'px-1 py-0.5' : '']}
					onpointerdown={(e) => {
						e.stopPropagation();
						beginMove(e);
					}}
				>
					<DragHandle size={freeform ? 'md' : 'sm'} label={`Drag ${title ?? 'widget'}`} />
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				{#if title}
					<h3 class="text-sm font-semibold text-primary truncate leading-none">{title}</h3>
				{/if}
				{#if description}
					<p class="mt-0.5 text-muted truncate text-[11px] leading-none">{description}</p>
				{/if}
			</div>

			<div class="gap-0.5 flex shrink-0 items-center">
				{#if actions}
					{@render actions()}
				{/if}

				{#if showReload}
					<button
						type="button"
						class={btnClass}
						aria-label={`Reload ${title ?? 'widget'}`}
						disabled={busy}
						onclick={() => handleReload()}
					>
						<RefreshCw class={['h-3.5 w-3.5', busy && 'animate-spin']} aria-hidden="true" />
					</button>
				{/if}

				{#if collapsible}
					<button
						type="button"
						class={btnClass}
						aria-expanded={!collapsed}
						aria-label={collapsed ? 'Expand widget' : 'Collapse widget'}
						onpointerdown={(e) => e.stopPropagation()}
						onclick={(e) => {
							e.stopPropagation();
							toggleCollapse();
						}}
					>
						<ChevronDown
							class={['h-3.5 w-3.5 transition-transform', collapsed && '-rotate-90']}
							aria-hidden="true"
						/>
					</button>
				{/if}

				{#if editable && onremove}
					<button
						type="button"
						class={[btnClass, 'hover:bg-red-500/10 hover:text-red-600']}
						aria-label={`Remove ${title ?? 'widget'}`}
						onpointerdown={(e) => e.stopPropagation()}
						onclick={(e) => {
							e.stopPropagation();
							onremove?.();
						}}
					>
						<X class="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>
	{/if}

	{#if !collapsed}
		<div class={['min-h-0 relative flex-1', flush ? 'p-0 overflow-hidden' : 'p-3 overflow-auto']}>
			{#if busy}
				{#if loadingMode === 'spinner'}
					<div
						class="min-h-32 gap-2 flex flex-col items-center justify-center"
						aria-busy="true"
						aria-live="polite"
					>
						<Spinner label={busyText} />
						<p class="text-xs text-muted">{busyText}</p>
					</div>
				{:else}
					<div class="space-y-3" aria-busy="true" aria-live="polite">
						<Skeleton variant="text" width="55%" height="0.875rem" animation="shimmer" />
						<Skeleton variant="rounded" height="5rem" animation="shimmer" />
						<Skeleton variant="text" width="80%" animation="shimmer" />
						<Skeleton variant="text" width="65%" animation="shimmer" />
					</div>
				{/if}
			{:else if empty}
				<div
					class="min-h-32 rounded-lg border-border bg-surface/50 px-4 py-6 flex h-full flex-col items-center justify-center border border-dashed text-center"
				>
					<div
						class="mb-3 h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 flex items-center justify-center"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h10M4 17h6" />
						</svg>
					</div>
					<p class="text-sm font-medium text-primary">{emptyTitle}</p>
					<p class="mt-1 max-w-xs text-xs leading-relaxed text-muted">{emptyDescription}</p>
				</div>
			{:else if children}
				{@render children()}
			{/if}
		</div>
	{/if}

	{#if showResizeHandle}
		{#each visibleResizeEdges as h (h.edge)}
			<div
				data-resize-handle
				class={[edgeAccent, h.class]}
				role="separator"
				aria-orientation={h.edge === 'e' || h.edge === 'w' ? 'vertical' : 'horizontal'}
				aria-label={`Resize ${title ?? 'widget'} (${h.edge})`}
				onpointerdown={(e) => beginResize(e, h.edge)}
			></div>
		{/each}

		{#if !isCanva}
			<!-- SE grip (visual only, small) -->
			<div
				class={[
					'bottom-0.5 right-0.5 h-2.5 w-2.5 pointer-events-none absolute z-20 flex items-center justify-center',
					'text-muted/60 group-hover/widget:text-brand-500 transition-colors'
				]}
				aria-hidden="true"
			>
				<svg
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					class="h-2.5 w-2.5"
				>
					<path stroke-linecap="round" d="M7 11L11 7M4 11L11 4" />
				</svg>
			</div>
		{/if}
	{/if}
</div>
