<script lang="ts">
	export interface RadarAxis {
		key: string;
		label: string;
		max?: number;
	}

	export interface RadarSeries {
		label: string;
		values: Record<string, number>;
		color?: string;
	}

	interface RadarChartProps {
		axes?: RadarAxis[];
		series?: RadarSeries[];
		size?: number;
		levels?: number;
		showLabels?: boolean;
		showLegend?: boolean;
		fillOpacity?: number;
		class?: string;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#0ea5e9'
	];

	let {
		axes = [],
		series = [],
		size = 280,
		levels = 4,
		showLabels = true,
		showLegend = true,
		fillOpacity = 0.2,
		class: className = ''
	}: RadarChartProps = $props();

	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const radius = $derived(size * 0.36);
	const n = $derived(axes.length);

	function angle(i: number) {
		return -Math.PI / 2 + (i / n) * Math.PI * 2;
	}

	function point(i: number, ratio: number) {
		const a = angle(i);
		return {
			x: cx + Math.cos(a) * radius * ratio,
			y: cy + Math.sin(a) * radius * ratio
		};
	}

	const rings = $derived(
		Array.from({ length: levels }, (_, i) => {
			const ratio = (i + 1) / levels;
			const pts = axes.map((_, ai) => point(ai, ratio));
			return pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
		})
	);

	const spokes = $derived(
		axes.map((_, i) => {
			const p = point(i, 1);
			return { x2: p.x, y2: p.y };
		})
	);

	const polygons = $derived(
		series.map((s, si) => {
			const pts = axes.map((ax, i) => {
				const max = ax.max ?? 100;
				const v = Math.max(0, Math.min(max, s.values[ax.key] ?? 0));
				return point(i, v / max);
			});
			const path = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
			const color = s.color ?? palette[si % palette.length];
			return { ...s, path, color, pts };
		})
	);

	const labelPts = $derived(
		axes.map((ax, i) => {
			const p = point(i, 1.18);
			return { ...ax, ...p };
		})
	);
</script>

<div class={['inline-flex flex-col items-center gap-3', className]}>
	<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar chart">
		{#each rings as ring, i (i)}
			<path d={ring} fill="none" stroke="var(--border, #e4e4e7)" stroke-width="1" />
		{/each}
		{#each spokes as sp, i (i)}
			<line
				x1={cx}
				y1={cy}
				x2={sp.x2}
				y2={sp.y2}
				stroke="var(--border, #e4e4e7)"
				stroke-width="1"
			/>
		{/each}

		{#each polygons as poly (poly.label)}
			<path d={poly.path} fill={poly.color} fill-opacity={fillOpacity} stroke={poly.color} stroke-width="2" />
			{#each poly.pts as p, i (i)}
				<circle cx={p.x} cy={p.y} r="3" fill={poly.color} stroke="var(--surface-elevated, #fff)" stroke-width="1.5" />
			{/each}
		{/each}

		{#if showLabels}
			{#each labelPts as lp (lp.key)}
				<text
					x={lp.x}
					y={lp.y}
					text-anchor="middle"
					dominant-baseline="middle"
					style="font-size: 11px; fill: var(--text-secondary, #52525b); font-weight: 500"
				>
					{lp.label}
				</text>
			{/each}
		{/if}
	</svg>

	{#if showLegend && series.length > 0}
		<div class="flex flex-wrap justify-center gap-3">
			{#each polygons as poly (poly.label)}
				<span class="inline-flex items-center gap-1.5 text-xs text-secondary">
					<span class="h-2.5 w-2.5 rounded-full" style:background={poly.color}></span>
					{poly.label}
				</span>
			{/each}
		</div>
	{/if}
</div>
