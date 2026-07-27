<script lang="ts">
	interface Props {
		example?: 'scroll' | 'fitAuto8' | 'fullscreenAuto8';
	}

	let { example = 'scroll' }: Props = $props();

	import WidgetCanvas from './WidgetCanvas.svelte';
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';

	let showGrid = $state(true);
	let snap = $state(true);
	let cellSize = $state(24);

	let a = $state<WidgetRect>({ x: 24, y: 24, w: 288, h: 192 });
	let b = $state<WidgetRect>({ x: 312, y: 24, w: 288, h: 192 });
	let c = $state<WidgetRect>({ x: 24, y: 240, w: 576, h: 168 });

	const canvasMode = $derived(example === 'scroll' ? 'scroll' : example === 'fitAuto8' ? 'fit' : 'fullscreen');
	const cellSizeMode = $derived(example === 'scroll' ? 'fixed' : 'auto');
	const autoCells = $derived(8);
</script>

<div class="w-full max-w-5xl space-y-2">
	<p class="text-xs text-muted">
		{#if example === 'scroll'}
			Scroll por el tablero (1600×1000). Rejilla + snap (celda fixed).
		{:else if example === 'fitAuto8'}
			Modo <span class="font-medium text-primary">fit</span> sin scroll + celda auto a 8.
		{:else}
			Modo <span class="font-medium text-primary">fullscreen</span> sin scroll + celda auto a 8.
		{/if}
		<span class="tabular-nums text-primary">
			· A {a.x},{a.y} {a.w}×{a.h}
		</span>
	</p>

	<WidgetCanvas
		bind:showGrid
		bind:snap
		bind:cellSize
		mode={canvasMode}
		cellSizeMode={cellSizeMode}
		autoCells={autoCells}
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

		<WidgetFrame
			bind:rect={b}
			freeform
			draggable
			resizable
			title="Metrics"
			description="KPIs"
		>
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
