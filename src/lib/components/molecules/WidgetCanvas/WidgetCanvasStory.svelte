<script lang="ts">
	interface Props {
		example?: 'scroll' | 'scrollAuto' | 'fitAuto8' | 'fullscreenAuto8';
	}

	let { example = 'scroll' }: Props = $props();

	import WidgetCanvas from './WidgetCanvas.svelte';
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';

	let showGrid = $state(true);
	let snap = $state(true);
	let cellSize = $state(24);
	let cellSizeMode = $state<'fixed' | 'auto'>('fixed');
	let autoCells = $state(8);
	let mode = $state<'scroll' | 'fit' | 'fullscreen'>('scroll');

	/** Layout pensado para tablero amplio (scroll). En fit/fullscreen se reescala. */
	const scrollLayout = {
		a: { x: 24, y: 24, w: 288, h: 192 },
		b: { x: 312, y: 24, w: 288, h: 192 },
		c: { x: 24, y: 240, w: 576, h: 168 }
	} satisfies Record<'a' | 'b' | 'c', WidgetRect>;

	/** 8×8 celdas: layout en unidades de celda (se multiplica por cellSize) */
	const fitLayout = {
		a: { x: 0, y: 0, w: 4, h: 3 },
		b: { x: 4, y: 0, w: 4, h: 3 },
		c: { x: 0, y: 3, w: 8, h: 2 }
	} satisfies Record<'a' | 'b' | 'c', { x: number; y: number; w: number; h: number }>;

	let a = $state<WidgetRect>({ ...scrollLayout.a });
	let b = $state<WidgetRect>({ ...scrollLayout.b });
	let c = $state<WidgetRect>({ ...scrollLayout.c });

	function applyFitLayout(size: number) {
		const s = Math.max(8, size);
		a = {
			x: fitLayout.a.x * s,
			y: fitLayout.a.y * s,
			w: fitLayout.a.w * s,
			h: fitLayout.a.h * s
		};
		b = {
			x: fitLayout.b.x * s,
			y: fitLayout.b.y * s,
			w: fitLayout.b.w * s,
			h: fitLayout.b.h * s
		};
		c = {
			x: fitLayout.c.x * s,
			y: fitLayout.c.y * s,
			w: fitLayout.c.w * s,
			h: fitLayout.c.h * s
		};
	}

	$effect(() => {
		if (example === 'scroll') {
			mode = 'scroll';
			cellSizeMode = 'fixed';
			cellSize = 24;
			a = { ...scrollLayout.a };
			b = { ...scrollLayout.b };
			c = { ...scrollLayout.c };
		} else if (example === 'scrollAuto') {
			mode = 'scroll';
			cellSizeMode = 'auto';
			autoCells = 8;
			a = { ...scrollLayout.a };
			b = { ...scrollLayout.b };
			c = { ...scrollLayout.c };
		} else if (example === 'fitAuto8') {
			mode = 'fit';
			cellSizeMode = 'auto';
			autoCells = 8;
		} else {
			mode = 'fullscreen';
			cellSizeMode = 'auto';
			autoCells = 8;
		}
	});

	/** Cuando la celda auto se calcula, encajar widgets en el N×N */
	$effect(() => {
		if (example !== 'fitAuto8' && example !== 'fullscreenAuto8') return;
		if (cellSizeMode !== 'auto' || cellSize <= 0) return;
		applyFitLayout(cellSize);
	});
</script>

<div class="w-full max-w-5xl space-y-2">
	<p class="text-xs text-muted">
		{#if example === 'scroll'}
			Scroll + celda fixed. Cambia a <span class="font-medium text-primary">auto</span> en la barra
			para ver el efecto.
		{:else if example === 'scrollAuto'}
			Scroll + <span class="font-medium text-primary">auto</span>: N celdas caben en el viewport;
			el tablero sigue siendo scrolleable.
		{:else if example === 'fitAuto8'}
			Modo <span class="font-medium text-primary">fit</span> sin scroll + auto.
		{:else}
			Modo <span class="font-medium text-primary">fullscreen</span> sin scroll + auto.
		{/if}
		<span class="tabular-nums text-primary">
			· A {a.x},{a.y} {a.w}×{a.h}
		</span>
	</p>

	<WidgetCanvas
		bind:showGrid
		bind:snap
		bind:cellSize
		bind:mode
		bind:cellSizeMode
		bind:autoCells
		width={1600}
		height={1000}
		viewportHeight={520}
	>
		<WidgetFrame
			bind:rect={a}
			freeform
			draggable
			resizable
			collapsible
			title="Notes"
			description="Freeform + snap"
		>
			<p class="text-sm text-secondary">Mueve y redimensiona; encaja a la rejilla si Snap está on.</p>
		</WidgetFrame>

		<WidgetFrame bind:rect={b} freeform draggable resizable title="Metrics" description="KPIs">
			<div class="grid grid-cols-2 gap-3">
				<div>
					<p class="text-[11px] text-muted">MRR</p>
					<p class="text-lg font-semibold tabular-nums text-primary">$12.4k</p>
				</div>
				<div>
					<p class="text-[11px] text-muted">Churn</p>
					<p class="text-lg font-semibold tabular-nums text-primary">1.8%</p>
				</div>
			</div>
		</WidgetFrame>

		<WidgetFrame
			bind:rect={c}
			freeform
			draggable
			resizable
			editable
			title="Inbox"
			description="3 unread"
			onremove={() => {
				c = { ...c, x: 24, y: 480 };
			}}
		>
			<ul class="space-y-1.5 text-sm text-secondary">
				<li>Design review invite</li>
				<li>Invoice reminder</li>
				<li>API quota warning</li>
			</ul>
		</WidgetFrame>
	</WidgetCanvas>
</div>
