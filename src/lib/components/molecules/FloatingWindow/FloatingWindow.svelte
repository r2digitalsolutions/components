<script lang="ts">
	import type { Snippet } from 'svelte';
	import Minus from '@lucide/svelte/icons/minus';
	import Square from '@lucide/svelte/icons/square';
	import X from '@lucide/svelte/icons/x';

	export interface WindowRect {
		x: number;
		y: number;
		w: number;
		h: number;
		z?: number;
		minimized?: boolean;
		maximized?: boolean;
	}

	export type WindowResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

	interface FloatingWindowProps {
		title?: string;
		rect?: WindowRect;
		minW?: number;
		minH?: number;
		active?: boolean;
		closable?: boolean;
		minimizable?: boolean;
		maximizable?: boolean;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
		onfocus?: () => void;
		onclose?: () => void;
		onminimize?: () => void;
		onmaximize?: () => void;
		onchange?: (rect: WindowRect) => void;
	}

	let {
		title = 'Window',
		rect = $bindable<WindowRect>({ x: 48, y: 48, w: 420, h: 300, z: 1 }),
		minW = 240,
		minH = 160,
		active = false,
		closable = true,
		minimizable = true,
		maximizable = true,
		class: className = '',
		actions,
		children,
		onfocus,
		onclose,
		onminimize,
		onmaximize,
		onchange
	}: FloatingWindowProps = $props();

	let mode = $state<'move' | 'resize' | null>(null);
	let edge = $state<WindowResizeEdge>('se');
	let start = $state({ px: 0, py: 0, ...rect });
	let beforeMax = $state<WindowRect | null>(null);

	function emit(next: WindowRect) {
		rect = next;
		onchange?.(next);
	}

	function focus() {
		onfocus?.();
	}

	function onTitlePointerDown(e: PointerEvent) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		if (rect.maximized) return;
		focus();
		mode = 'move';
		start = { px: e.clientX, py: e.clientY, ...rect };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onResizePointerDown(e: PointerEvent, nextEdge: WindowResizeEdge) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		if (rect.maximized || rect.minimized) return;
		e.preventDefault();
		e.stopPropagation();
		focus();
		mode = 'resize';
		edge = nextEdge;
		start = { px: e.clientX, py: e.clientY, ...rect };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!mode) return;
		const dx = e.clientX - start.px;
		const dy = e.clientY - start.py;

		if (mode === 'move') {
			emit({
				...rect,
				x: Math.max(0, start.x + dx),
				y: Math.max(0, start.y + dy),
				minimized: false
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
		emit({ ...rect, x: Math.max(0, x), y: Math.max(0, y), w, h, minimized: false, maximized: false });
	}

	function onPointerUp() {
		mode = null;
	}

	function toggleMaximize() {
		focus();
		if (rect.maximized) {
			const restored = beforeMax ?? { ...rect, maximized: false, w: 420, h: 300 };
			beforeMax = null;
			emit({ ...restored, maximized: false, minimized: false });
			onmaximize?.();
			return;
		}
		beforeMax = { ...rect };
		emit({ ...rect, maximized: true, minimized: false });
		onmaximize?.();
	}

	function minimize() {
		focus();
		emit({ ...rect, minimized: true, maximized: false });
		onminimize?.();
	}

	const edges: { edge: WindowResizeEdge; class: string }[] = [
		{ edge: 'n', class: 'left-2 right-2 top-0 h-1.5 cursor-n-resize' },
		{ edge: 's', class: 'left-2 right-2 bottom-0 h-1.5 cursor-s-resize' },
		{ edge: 'e', class: 'top-2 bottom-2 right-0 w-1.5 cursor-e-resize' },
		{ edge: 'w', class: 'top-2 bottom-2 left-0 w-1.5 cursor-w-resize' },
		{ edge: 'ne', class: 'right-0 top-0 h-3 w-3 cursor-ne-resize' },
		{ edge: 'nw', class: 'left-0 top-0 h-3 w-3 cursor-nw-resize' },
		{ edge: 'se', class: 'right-0 bottom-0 h-3 w-3 cursor-se-resize' },
		{ edge: 'sw', class: 'left-0 bottom-0 h-3 w-3 cursor-sw-resize' }
	];

	const windowStyle = $derived(
		rect.maximized
			? `z-index:${rect.z ?? 1}`
			: `left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${rect.h}px;z-index:${rect.z ?? 1}`
	);
</script>

{#if !rect.minimized}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		role="dialog"
		aria-label={title}
		tabindex="-1"
		class={[
			'absolute flex flex-col overflow-hidden rounded-xl border bg-surface-elevated shadow-lg',
			active ? 'border-brand-500/50 ring-1 ring-brand-500/30' : 'border-border',
			rect.maximized ? 'inset-2' : '',
			className
		]}
		style={windowStyle}
		onpointerdown={focus}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex shrink-0 cursor-grab items-center gap-2 border-b border-border bg-surface-overlay/60 px-2 py-1.5 active:cursor-grabbing"
			onpointerdown={onTitlePointerDown}
			ondblclick={toggleMaximize}
		>
			<div class="min-w-0 flex-1 truncate text-sm font-semibold text-primary">{title}</div>
			{#if actions}
				<div class="flex items-center gap-1">
					{@render actions()}
				</div>
			{/if}
			<div class="flex items-center gap-0.5">
				{#if minimizable}
					<button
						type="button"
						class="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface-elevated hover:text-primary"
						aria-label="Minimize"
						onclick={(e) => {
							e.stopPropagation();
							minimize();
						}}
					>
						<Minus class="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				{/if}
				{#if maximizable}
					<button
						type="button"
						class="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-surface-elevated hover:text-primary"
						aria-label={rect.maximized ? 'Restore' : 'Maximize'}
						onclick={(e) => {
							e.stopPropagation();
							toggleMaximize();
						}}
					>
						<Square class="h-3 w-3" aria-hidden="true" />
					</button>
				{/if}
				{#if closable}
					<button
						type="button"
						class="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-red-500/10 hover:text-red-600"
						aria-label="Close"
						onclick={(e) => {
							e.stopPropagation();
							onclose?.();
						}}
					>
						<X class="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>

		<div class="min-h-0 flex-1 overflow-auto">
			{#if children}{@render children()}{/if}
		</div>

		{#if !rect.maximized}
			{#each edges as h (h.edge)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class={['absolute z-20', h.class]}
					onpointerdown={(e) => onResizePointerDown(e, h.edge)}
				></div>
			{/each}
		{/if}
	</div>
{/if}
