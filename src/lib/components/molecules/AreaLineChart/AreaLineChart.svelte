<script lang="ts">
	import {
		mapPoints,
		smoothLinePath,
		linearLinePath,
		areaPath,
		scaleDomain,
		tipAlign,
		formatTick,
		DEFAULT_PAD,
		type ChartPad
	} from '$lib/utils/chart.js';

	export interface AreaLinePoint {
		label: string;
		value: number;
		/** Hollow / dashed segment (e.g. estimated) */
		estimated?: boolean;
	}

	interface AreaLineChartProps {
		data?: AreaLinePoint[];
		height?: number;
		/** CSS color or leave default brand */
		color?: string;
		smooth?: boolean;
		showArea?: boolean;
		showGrid?: boolean;
		showDots?: boolean;
		interactive?: boolean;
		yMin?: number;
		yMax?: number;
		unit?: string;
		class?: string;
	}

	const {
		data = [],
		height = 200,
		color = 'var(--color-brand-500, #6366f1)',
		smooth = true,
		showArea = true,
		showGrid = true,
		showDots = true,
		interactive = true,
		yMin,
		yMax,
		unit = '',
		class: className = ''
	}: AreaLineChartProps = $props();

	const W = 500;
	const pad: ChartPad = { ...DEFAULT_PAD, b: 32 };
	const uid = `alc-${Math.random().toString(36).slice(2, 8)}`;

	let tipIndex = $state<number | null>(null);

	const values = $derived(data.map((d) => d.value));
	const domain = $derived(
		yMin !== undefined && yMax !== undefined
			? { min: yMin, max: yMax }
			: scaleDomain(values)
	);
	const points = $derived(mapPoints(values, W, height, pad, domain));
	const line = $derived(smooth ? smoothLinePath(points) : linearLinePath(points));
	const area = $derived(areaPath(line, points, height, pad));

	const gridYs = $derived.by(() => {
		const { min, max } = domain;
		return [0, 0.5, 1].map((t) => ({
			y: pad.t + (1 - t) * (height - pad.t - pad.b),
			label: formatTick(min + t * (max - min))
		}));
	});

	const tip = $derived.by(() => {
		if (tipIndex == null || !points[tipIndex]) return null;
		const p = points[tipIndex];
		const leftPct = (p.x / W) * 100;
		return {
			...p,
			label: data[tipIndex]?.label ?? '',
			estimated: data[tipIndex]?.estimated,
			leftPct,
			topPct: (p.y / height) * 100,
			align: tipAlign(leftPct)
		};
	});

	function select(i: number) {
		if (!interactive) return;
		tipIndex = tipIndex === i ? null : i;
	}
</script>

<div class={['relative w-full select-none', className]}>
	<svg
		viewBox={`0 0 ${W} ${height}`}
		class="h-auto w-full overflow-visible"
		role="img"
		aria-label="Area line chart"
	>
		<defs>
			<linearGradient id="{uid}-fill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color={color} stop-opacity="0.35" />
				<stop offset="100%" stop-color={color} stop-opacity="0" />
			</linearGradient>
			<filter id="{uid}-glow" x="-20%" y="-20%" width="140%" height="140%">
				<feGaussianBlur stdDeviation="2.5" result="blur" />
				<feMerge>
					<feMergeNode in="blur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

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
				<text
					x={pad.l - 8}
					y={g.y + 3}
					text-anchor="end"
					class="fill-muted"
					font-size="10"
				>
					{g.label}
				</text>
			{/each}
		{/if}

		{#if showArea && area}
			<path d={area} fill={`url(#${uid}-fill)`} />
		{/if}

		{#if line}
			<path
				d={line}
				fill="none"
				stroke={color}
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				filter={`url(#${uid}-glow)`}
			/>
		{/if}

		{#each points as p, i}
			{#if showDots}
				<circle
					cx={p.x}
					cy={p.y}
					r={tipIndex === i ? 5 : 3.5}
					fill={data[i]?.estimated ? 'var(--color-surface-elevated, #fff)' : color}
					stroke={color}
					stroke-width={data[i]?.estimated ? 2 : 0}
					class="transition-all"
				/>
			{/if}
			{#if interactive}
				<!-- Hit area: pointer-only (no focus ring / square outline) -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<circle
					cx={p.x}
					cy={p.y}
					r="16"
					fill="transparent"
					class="cursor-pointer"
					onclick={() => select(i)}
				/>
			{/if}
		{/each}

		{#each data as d, i}
			{#if i === 0 || i === data.length - 1 || data.length <= 7}
				{@const p = points[i]}
				{#if p}
					<text
						x={p.x}
						y={height - 8}
						text-anchor="middle"
						class="fill-muted"
						font-size="10"
					>
						{d.label}
					</text>
				{/if}
			{/if}
		{/each}
	</svg>

	{#if tip}
		<div
			class={[
				'pointer-events-none absolute z-10 -translate-y-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg',
				tip.align === 'start' && 'translate-x-0',
				tip.align === 'center' && '-translate-x-1/2',
				tip.align === 'end' && '-translate-x-full'
			]}
			style:left={`${tip.leftPct}%`}
			style:top={`${tip.topPct}%`}
			style:margin-top="-10px"
			role="status"
		>
			<p class="text-[10px] font-medium text-muted">{tip.label}</p>
			<p class="text-sm font-semibold tabular-nums text-primary">
				{tip.value}{unit}
				{#if tip.estimated}
					<span class="ml-1 text-[10px] font-normal text-muted">est.</span>
				{/if}
			</p>
		</div>
	{/if}
</div>
