<script lang="ts">
	import { formatTick, DEFAULT_PAD, scaleDomain } from '$lib/utils/chart.js';
	import type { ChartPad } from '$lib/utils/chart.js';

	export interface ScatterPoint {
		x: number;
		y: number;
		label?: string;
		size?: number;
		color?: string;
		group?: string;
	}

	interface ScatterChartProps {
		data?: ScatterPoint[];
		width?: number;
		height?: number;
		pad?: ChartPad;
		xLabel?: string;
		yLabel?: string;
		unitX?: string;
		unitY?: string;
		dotRadius?: number;
		showGrid?: boolean;
		class?: string;
		onselect?: (point: ScatterPoint) => void;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#0ea5e9',
		'#a855f7',
		'#ef4444'
	];

	let {
		data = [],
		width = 420,
		height = 280,
		pad = DEFAULT_PAD,
		xLabel = '',
		yLabel = '',
		unitX = '',
		unitY = '',
		dotRadius = 5,
		showGrid = true,
		class: className = '',
		onselect
	}: ScatterChartProps = $props();

	let tip = $state<{ label: string; x: number; y: number } | null>(null);
	let active = $state<number | null>(null);

	const groups = $derived([...new Set(data.map((d) => d.group).filter(Boolean))] as string[]);
	const groupColor = $derived(
		Object.fromEntries(groups.map((g, i) => [g, palette[i % palette.length]]))
	);

	const xDom = $derived(scaleDomain(data.map((d) => d.x)));
	const yDom = $derived(scaleDomain(data.map((d) => d.y)));

	const plotW = $derived(width - pad.l - pad.r);
	const plotH = $derived(height - pad.t - pad.b);

	function sx(v: number) {
		const { min, max } = xDom;
		return pad.l + ((v - min) / (max - min || 1)) * plotW;
	}
	function sy(v: number) {
		const { min, max } = yDom;
		return pad.t + plotH - ((v - min) / (max - min || 1)) * plotH;
	}

	const xTicks = $derived(
		[0, 0.25, 0.5, 0.75, 1].map((t) => xDom.min + t * (xDom.max - xDom.min))
	);
	const yTicks = $derived(
		[0, 0.25, 0.5, 0.75, 1].map((t) => yDom.min + t * (yDom.max - yDom.min))
	);
</script>

<div class={['relative', className]} style:width={`${width}px`}>
	{#if tip}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-white shadow-md"
			style:left={`${tip.x}px`}
			style:top={`${tip.y}px`}
		>
			{tip.label}
		</div>
	{/if}

	<svg {width} {height} class="overflow-visible" role="img" aria-label="Scatter chart">
		{#if showGrid}
			{#each xTicks as tick (tick)}
				<line
					x1={sx(tick)}
					x2={sx(tick)}
					y1={pad.t}
					y2={height - pad.b}
					stroke="var(--border, #e4e4e7)"
					stroke-width="1"
				/>
			{/each}
			{#each yTicks as tick (tick)}
				<line
					x1={pad.l}
					x2={width - pad.r}
					y1={sy(tick)}
					y2={sy(tick)}
					stroke="var(--border, #e4e4e7)"
					stroke-width="1"
				/>
			{/each}
		{/if}

		{#each yTicks as tick (tick)}
			<text
				x={pad.l - 8}
				y={sy(tick) + 3}
				text-anchor="end"
				style="font-size: 10px; fill: var(--text-muted, #71717a)"
			>
				{formatTick(tick)}{unitY}
			</text>
		{/each}
		{#each xTicks as tick (tick)}
			<text
				x={sx(tick)}
				y={height - pad.b + 16}
				text-anchor="middle"
				style="font-size: 10px; fill: var(--text-muted, #71717a)"
			>
				{formatTick(tick)}{unitX}
			</text>
		{/each}

		{#if yLabel}
			<text
				x={14}
				y={height / 2}
				text-anchor="middle"
				transform={`rotate(-90 14 ${height / 2})`}
				style="font-size: 11px; fill: var(--text-secondary, #52525b)"
			>
				{yLabel}
			</text>
		{/if}
		{#if xLabel}
			<text
				x={pad.l + plotW / 2}
				y={height - 4}
				text-anchor="middle"
				style="font-size: 11px; fill: var(--text-secondary, #52525b)"
			>
				{xLabel}
			</text>
		{/if}

		{#each data as point, i (i)}
			{@const cx = sx(point.x)}
			{@const cy = sy(point.y)}
			{@const r = point.size ?? dotRadius}
			{@const color =
				point.color ?? (point.group ? groupColor[point.group] : palette[0])}
			<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
			<circle
				cx={cx}
				cy={cy}
				r={active === i ? r + 2 : r}
				fill={color}
				fill-opacity={active === null || active === i ? 0.85 : 0.35}
				stroke="var(--surface-elevated, #fff)"
				stroke-width="1.5"
				class={onselect ? 'cursor-pointer' : undefined}
				onmouseenter={() => {
					active = i;
					tip = {
						label:
							point.label ??
							`${formatTick(point.x)}${unitX}, ${formatTick(point.y)}${unitY}`,
						x: cx,
						y: cy - r - 4
					};
				}}
				onmouseleave={() => {
					active = null;
					tip = null;
				}}
				onclick={() => onselect?.(point)}
			/>
		{/each}
	</svg>

	{#if groups.length > 0}
		<div class="mt-2 flex flex-wrap gap-3">
			{#each groups as g (g)}
				<span class="inline-flex items-center gap-1.5 text-xs text-secondary">
					<span class="h-2.5 w-2.5 rounded-full" style:background={groupColor[g]}></span>
					{g}
				</span>
			{/each}
		</div>
	{/if}
</div>
