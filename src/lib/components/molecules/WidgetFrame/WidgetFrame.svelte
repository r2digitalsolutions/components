<script lang="ts" module>
	export type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';
	export type WidgetResizeEdge = 'se' | 'e' | 's' | 'sw' | 'w' | 'ne' | 'n' | 'nw';
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
		onchange
	}: WidgetFrameProps = $props();

	const canvas = getContext<WidgetCanvasContext | undefined>(WIDGET_CANVAS_CONTEXT);

	let mode = $state<'move' | 'resize' | null>(null);
	let edge = $state<WidgetResizeEdge>('se');
	let start = $state({ px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 });
	let localBusy = $state(false);
	let zIndex = $state(1);
	/** Tamaño local cuando resizable sin freeform (EditableChrome, etc.) */
	let localW = $state<number | null>(null);
	let localH = $state<number | null>(null);
	let rootEl = $state<HTMLDivElement | null>(null);

	const showDragHandle = $derived((editable || freeform) && draggable);
	const showResizeHandle = $derived((editable || freeform) && resizable && !collapsed);
	const showReload = $derived(!!onreload);
	const busy = $derived(loading || reloading || localBusy);
	const snapEnabled = $derived(snap ?? canvas?.snap ?? false);
	const busyText = $derived(reloading || localBusy ? reloadingText : loadingText);
	/** DashboardGrid (u otro padre) gestiona el resize vía onresizestart */
	const delegateResize = $derived(!freeform && !!onresizestart);
	const builtinResize = $derived(freeform || (resizable && !delegateResize));
	const showHeader = $derived(
		!!title ||
			showDragHandle ||
			!!actions ||
			(editable && !!onremove) ||
			collapsible ||
			showReload
	);

	function bringToFront() {
		if (!freeform) return;
		zIndex = Date.now();
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
		e.preventDefault();
		mode = 'move';
		start = { px: e.clientX, py: e.clientY, ...rect };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function beginResize(e: PointerEvent, nextEdge: WidgetResizeEdge) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		e.preventDefault();
		e.stopPropagation();
		bringToFront();
		onresizestart?.(e, nextEdge);
		if (delegateResize || !builtinResize) return;

		mode = 'resize';
		edge = nextEdge;
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
		if (!mode || !builtinResize) return;
		const dx = e.clientX - start.px;
		const dy = e.clientY - start.py;

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

		if (freeform) {
			emitRect({ x, y, w, h });
		} else {
			localW = w;
			localH = h;
			onchange?.({ x: 0, y: 0, w, h });
		}
	}

	function onPointerUp() {
		if (mode === 'resize' && freeform) {
			mode = null;
			emitRect({ ...rect });
			return;
		}
		mode = null;
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

	const freeformEdges: { edge: WidgetResizeEdge; class: string }[] = [
		{ edge: 'e', class: 'top-2 bottom-2 -right-px w-1.5 cursor-e-resize' },
		{ edge: 's', class: 'left-2 right-2 -bottom-px h-1.5 cursor-s-resize' },
		{ edge: 'w', class: 'top-2 bottom-2 -left-px w-1.5 cursor-w-resize' },
		{ edge: 'n', class: 'left-2 right-2 -top-px h-1.5 cursor-n-resize' },
		{ edge: 'se', class: '-right-px -bottom-px h-3 w-3 cursor-se-resize' },
		{ edge: 'sw', class: '-left-px -bottom-px h-3 w-3 cursor-sw-resize' },
		{ edge: 'ne', class: '-right-px -top-px h-3 w-3 cursor-ne-resize' },
		{ edge: 'nw', class: '-left-px -top-px h-3 w-3 cursor-nw-resize' }
	];

	const rootStyle = $derived.by(() => {
		if (freeform) {
			return `left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${collapsed ? 'auto' : `${rect.h}px`};z-index:${mode ? zIndex + 1000 : zIndex};`;
		}
		if (localW != null) {
			const h =
				collapsed || localH == null ? 'auto' : `${localH}px`;
			return `width:${localW}px;height:${h};`;
		}
		return undefined;
	});

	const btnClass =
		'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:opacity-50';

	/** Handles only intercept pointers while this widget is hovered (or resizing), so neighbors can sit flush */
	const edgeAccent = $derived(
		[
			'absolute z-10 touch-none rounded-sm bg-transparent transition-colors',
			'hover:bg-brand-500/70 focus-visible:bg-brand-500/70 focus-visible:outline-none',
			mode === 'resize'
				? 'pointer-events-auto bg-brand-500/40'
				: 'pointer-events-none group-hover/widget:pointer-events-auto group-hover/widget:bg-brand-500/35'
		].join(' ')
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={rootEl}
	class={[
		'group/widget flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated',
		freeform ? 'absolute shadow-md' : 'relative',
		collapsed && 'h-auto self-start',
		mode === 'move' && 'cursor-grabbing opacity-95',
		mode === 'resize' && 'ring-1 ring-brand-500/40',
		className
	]}
	style={rootStyle}
	onpointerdown={bringToFront}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	{#if showHeader}
		<div
			class={[
				'flex shrink-0 items-center gap-2 border-b border-border px-3 py-2.5',
				showDragHandle && 'touch-none',
				collapsed && 'border-b-0'
			]}
			onpointerdown={(e) => {
				// En freeform, permite arrastrar desde el header completo.
				// Excluimos botones para no interferir con reload/collapse/remove.
				if (!freeform || !showDragHandle) return;
				const target = e.target as HTMLElement;
				if (target?.closest('button')) return;
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
					<DragHandle
						size={freeform ? 'md' : 'sm'}
						label={`Drag ${title ?? 'widget'}`}
					/>
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				{#if title}
					<h3 class="truncate text-sm font-semibold leading-none text-primary">{title}</h3>
				{/if}
				{#if description}
					<p class="mt-0.5 truncate text-[11px] leading-none text-muted">{description}</p>
				{/if}
			</div>

			<div class="flex shrink-0 items-center gap-0.5">
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
						<RefreshCw
							class={['h-3.5 w-3.5', busy && 'animate-spin']}
							aria-hidden="true"
						/>
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
						onclick={() => onremove?.()}
					>
						<X class="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>
	{/if}

	{#if !collapsed}
		<div class="relative min-h-0 flex-1 overflow-auto p-3">
			{#if busy}
				{#if loadingMode === 'spinner'}
					<div
						class="flex min-h-32 flex-col items-center justify-center gap-2"
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
					class="flex h-full min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 px-4 py-6 text-center"
				>
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
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
		{#each freeformEdges as h (h.edge)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={[edgeAccent, h.class]}
				role="separator"
				aria-orientation={h.edge === 'e' || h.edge === 'w' ? 'vertical' : 'horizontal'}
				aria-label={`Resize ${title ?? 'widget'} (${h.edge})`}
				onpointerdown={(e) => beginResize(e, h.edge)}
			></div>
		{/each}

		<!-- SE grip (visual only, small) -->
		<div
			class={[
				'pointer-events-none absolute bottom-0.5 right-0.5 z-20 flex h-2.5 w-2.5 items-center justify-center',
				'text-muted/60 transition-colors group-hover/widget:text-brand-500'
			]}
			aria-hidden="true"
		>
			<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" class="h-2.5 w-2.5">
				<path stroke-linecap="round" d="M7 11L11 7M4 11L11 4" />
			</svg>
		</div>
	{/if}
</div>
