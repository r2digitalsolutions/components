<script lang="ts">
	/**
	 * Dual comparison curves (Atom onboarding weight-chart style).
	 * Pass explicit point series for "with plan" vs "without plan".
	 */
	import { mapPoints, smoothLinePath, areaPath, DEFAULT_PAD, type ChartPad } from '$lib/utils/chart.js';

	export interface ComparisonSeries {
		id: string;
		label: string;
		values: number[];
		color?: string;
		dashed?: boolean;
		showArea?: boolean;
	}

	interface ComparisonCurvesProps {
		series?: ComparisonSeries[];
		labels?: string[];
		height?: number;
		class?: string;
	}

	const {
		series = [],
		labels = [],
		height = 180,
		class: className = ''
	}: ComparisonCurvesProps = $props();

	const W = 420;
	const pad: ChartPad = { ...DEFAULT_PAD, l: 28, b: 28 };
	const uid = `cc-${Math.random().toString(36).slice(2, 8)}`;

	const all = $derived(series.flatMap((s) => s.values));
	const min = $derived(all.length ? Math.min(...all) - 1 : 0);
	const max = $derived(all.length ? Math.max(...all) + 1 : 1);

	const plotted = $derived(
		series.map((s, i) => {
			const points = mapPoints(s.values, W, height, pad, { min, max });
			const path = smoothLinePath(points);
			return {
				...s,
				color: s.color ?? (i === 0 ? 'var(--color-brand-500, #6366f1)' : '#a1a1aa'),
				points,
				path,
				area: s.showArea ? areaPath(path, points, height, pad) : ''
			};
		})
	);
</script>

<div class={['w-full', className]}>
	<svg viewBox={`0 0 ${W} ${height}`} class="h-auto w-full" role="img" aria-label="Comparison curves">
		<defs>
			{#each plotted as s}
				{#if s.showArea}
					<linearGradient id="{uid}-{s.id}" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color={s.color} stop-opacity="0.3" />
						<stop offset="100%" stop-color={s.color} stop-opacity="0" />
					</linearGradient>
				{/if}
			{/each}
		</defs>

		{#each plotted as s}
			{#if s.area}
				<path d={s.area} fill={`url(#${uid}-${s.id})`} />
			{/if}
			{#if s.path}
				<path
					d={s.path}
					fill="none"
					stroke={s.color}
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-dasharray={s.dashed ? '6 5' : undefined}
				/>
			{/if}
			{#each s.points as p, i}
				{#if i === s.points.length - 1}
					<circle cx={p.x} cy={p.y} r="4" fill={s.color} />
				{/if}
			{/each}
		{/each}

		{#each labels as label, i}
			{@const p = plotted[0]?.points[i]}
			{#if p && (i === 0 || i === labels.length - 1)}
				<text x={p.x} y={height - 6} text-anchor="middle" class="fill-muted" font-size="10">
					{label}
				</text>
			{/if}
		{/each}
	</svg>

	<ul class="mt-2 flex flex-wrap gap-3">
		{#each plotted as s}
			<li class="inline-flex items-center gap-1.5 text-xs text-secondary">
				<span
					class="h-0.5 w-4 rounded-full"
					style:background={s.color}
					style:opacity={s.dashed ? 0.7 : 1}
					aria-hidden="true"
				></span>
				{s.label}
			</li>
		{/each}
	</ul>
</div>
