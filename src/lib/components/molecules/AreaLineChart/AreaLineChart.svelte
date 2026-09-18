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
	const pad: ChartPad = { ...DEFAULT_PAD, b: 28, l: 40 };
	const uid = `alc-${Math.random().toString(36).slice(2, 8)}`;

	let tipIndex = $state<number | null>(null);

	const values = $derived(data.map((d) => d.value));
	const domain = $derived.by(() => {
		if (yMin !== undefined && yMax !== undefined) return { min: yMin, max: yMax };
		const auto = scaleDomain(values);
		/** Counts never go below zero unless the caller sets an explicit floor. */
		if (yMin !== undefined) return { min: yMin, max: Math.max(auto.max, yMin + 1) };
		if (values.length > 0 && Math.min(...values) >= 0 && auto.min < 0) {
			return { min: 0, max: auto.max };
		}
		return auto;
	});
	const points = $derived(mapPoints(values, W, height, pad, domain));
	const line = $derived(smooth ? smoothLinePath(points) : linearLinePath(points));
	const area = $derived(areaPath(line, points, height, pad));

	const integerValues = $derived(values.every((v) => Number.isInteger(v)));

	const gridYs = $derived.by(() => {
		const { min, max } = domain;
		return [0, 0.5, 1].map((t) => {
			const raw = min + t * (max - min);
			const label = integerValues ? String(Math.round(raw)) : formatTick(raw);
			return {
				y: pad.t + (1 - t) * (height - pad.t - pad.b),
				label
			};
		});
	});

	/** First / last / sparse middle — HTML so labels stay readable (SVG stretch does not squash them). */
	const xLabels = $derived.by(() => {
		const out: { label: string; leftPct: number }[] = [];
		for (let i = 0; i < data.length; i++) {
			const show = i === 0 || i === data.length - 1 || data.length <= 7;
			const p = points[i];
			if (!show || !p) continue;
			out.push({ label: data[i].label, leftPct: (p.x / W) * 100 });
		}
		return out;
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

<div
	class={['relative w-full select-none', className]}
	style:height={`${height}px`}
	role="img"
	aria-label="Area line chart"
>
	<!-- HTML axis labels: preserveAspectRatio=none would distort SVG <text> -->
	{#if showGrid}
		<div class="pointer-events-none absolute inset-0 z-[1]">
			{#each gridYs as g (g.label + g.y)}
				<span
					class="text-secondary absolute -translate-y-1/2 text-[11px] leading-none tabular-nums"
					style:left="0"
					style:top={`${(g.y / height) * 100}%`}
					style:width={`${(pad.l / W) * 100}%`}
					style:text-align="right"
					style:padding-right="6px"
				>
					{g.label}
				</span>
			{/each}
		</div>
	{/if}

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
		style:height={`${(pad.b / height) * 100}%`}
	>
		{#each xLabels as xl (xl.label + xl.leftPct)}
			<span
				class="text-secondary absolute top-1 -translate-x-1/2 text-[11px] leading-none whitespace-nowrap"
				style:left={`${xl.leftPct}%`}
			>
				{xl.label}
			</span>
		{/each}
	</div>

	<svg
		viewBox={`0 0 ${W} ${height}`}
		preserveAspectRatio="none"
		class="absolute inset-0 block h-full w-full overflow-visible"
		aria-hidden="true"
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
			{#each gridYs as g (g.label + g.y)}
				<line
					x1={pad.l}
					x2={W - pad.r}
					y1={g.y}
					y2={g.y}
					class="stroke-border"
					stroke-width="1"
					stroke-dasharray="4 4"
				/>
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

		{#each points as p, i (i)}
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
				<!-- svelte-ignore a11y_click_events_have_key_events -->
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
