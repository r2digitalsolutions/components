<script lang="ts">
	import {
		mapPoints,
		smoothLinePath,
		linearLinePath,
		scaleDomain,
		tipAlign,
		formatTick,
		DEFAULT_PAD,
		type ChartPad
	} from '$lib/utils/chart.js';

	export interface MultiLineSeries {
		id: string;
		label: string;
		color?: string;
		values: number[];
	}

	interface MultiLineChartProps {
		series?: MultiLineSeries[];
		labels?: string[];
		height?: number;
		smooth?: boolean;
		showGrid?: boolean;
		interactive?: boolean;
		yMin?: number;
		yMax?: number;
		class?: string;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#0ea5e9',
		'#a855f7'
	];

	const {
		series = [],
		labels = [],
		height = 200,
		smooth = true,
		showGrid = true,
		interactive = true,
		yMin,
		yMax,
		class: className = ''
	}: MultiLineChartProps = $props();

	const W = 500;
	const pad: ChartPad = { ...DEFAULT_PAD, b: 32 };

	let tipIndex = $state<number | null>(null);

	const allValues = $derived(series.flatMap((s) => s.values));
	const domain = $derived(
		yMin !== undefined && yMax !== undefined
			? { min: yMin, max: yMax }
			: scaleDomain(allValues)
	);

	const plotted = $derived(
		series.map((s, si) => {
			const points = mapPoints(s.values, W, height, pad, domain);
			const path = smooth ? smoothLinePath(points) : linearLinePath(points);
			return {
				...s,
				color: s.color ?? palette[si % palette.length],
				points,
				path
			};
		})
	);

	const gridYs = $derived.by(() => {
		const { min, max } = domain;
		return [0, 0.5, 1].map((t) => ({
			y: pad.t + (1 - t) * (height - pad.t - pad.b),
			label: formatTick(min + t * (max - min))
		}));
	});

	const tip = $derived.by(() => {
		if (tipIndex == null) return null;
		const first = plotted[0]?.points[tipIndex];
		if (!first) return null;
		const leftPct = (first.x / W) * 100;
		return {
			leftPct,
			topPct: (first.y / height) * 100,
			align: tipAlign(leftPct),
			label: labels[tipIndex] ?? `#${tipIndex + 1}`,
			x: first.x,
			rows: plotted.map((s) => ({
				label: s.label,
				color: s.color,
				value: s.values[tipIndex!]
			}))
		};
	});

	function select(i: number) {
		if (!interactive) return;
		tipIndex = tipIndex === i ? null : i;
	}

	const pointCount = $derived(Math.max(0, ...series.map((s) => s.values.length)));
</script>

<div class={['relative w-full select-none', className]}>
	<svg
		viewBox={`0 0 ${W} ${height}`}
		class="h-auto w-full overflow-visible"
		role="img"
		aria-label="Multi-line chart"
	>
		{#if showGrid}
			{#each gridYs as g}
				<line
					x1={pad.l}
					x2={W - pad.r}
					y1={g.y}
					y2={g.y}
					class="stroke-border"
					stroke-width="1"
					stroke-dasharray="4 4"
				/>
				<text x={pad.l - 8} y={g.y + 3} text-anchor="end" class="fill-muted" font-size="10">
					{g.label}
				</text>
			{/each}
		{/if}

		{#if tip}
			<line
				x1={tip.x}
				x2={tip.x}
				y1={pad.t}
				y2={height - pad.b}
				class="stroke-border-strong"
				stroke-width="1"
				stroke-dasharray="3 4"
			/>
		{/if}

		{#each plotted as s}
			{#if s.path}
				<path
					d={s.path}
					fill="none"
					stroke={s.color}
					stroke-width="2.25"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/if}
			{#each s.points as p}
				<circle cx={p.x} cy={p.y} r="3" fill={s.color} />
			{/each}
		{/each}

		{#each Array.from({ length: pointCount }, (_, i) => i) as i}
			{@const p = plotted[0]?.points[i]}
			{#if p && interactive}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					x={p.x - 12}
					y={pad.t}
					width="24"
					height={height - pad.t - pad.b}
					fill="transparent"
					class="cursor-pointer"
					onclick={() => select(i)}
				/>
			{/if}
			{#if p && (i === 0 || i === pointCount - 1 || pointCount <= 7)}
				<text x={p.x} y={height - 8} text-anchor="middle" class="fill-muted" font-size="10">
					{labels[i] ?? ''}
				</text>
			{/if}
		{/each}
	</svg>

	<ul class="mt-2 flex flex-wrap gap-3">
		{#each plotted as s}
			<li class="inline-flex items-center gap-1.5 text-xs text-secondary">
				<span class="h-2 w-2 rounded-full" style:background={s.color} aria-hidden="true"></span>
				{s.label}
			</li>
		{/each}
	</ul>

	{#if tip}
		<div
			class={[
				'pointer-events-none absolute z-10 -translate-y-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg',
				tip.align === 'start' && 'translate-x-0',
				tip.align === 'center' && '-translate-x-1/2',
				tip.align === 'end' && '-translate-x-full'
			]}
			style:left={`${tip.leftPct}%`}
			style:top={`${Math.min(tip.topPct, 40)}%`}
			style:margin-top="-8px"
			role="status"
		>
			<p class="mb-1 text-[10px] font-medium text-muted">{tip.label}</p>
			{#each tip.rows as row}
				<p class="flex items-center gap-1.5 text-xs">
					<span class="h-1.5 w-1.5 rounded-full" style:background={row.color}></span>
					<span class="text-secondary">{row.label}</span>
					<span class="ml-auto font-semibold tabular-nums text-primary">{row.value}</span>
				</p>
			{/each}
		</div>
	{/if}
</div>
