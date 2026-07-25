<script module lang="ts">
	export interface HeatmapCell {
		row: number;
		col: number;
		value: number;
		/** Optional custom tooltip label */
		label?: string;
	}

	export type HeatmapPalette =
		| 'brand'
		| 'green'
		| 'red'
		| 'blue'
		| 'orange'
		| 'purple'
		| 'diverging';

	export type HeatmapSize = 'sm' | 'md' | 'lg';

	export const HEATMAP_PALETTES: Record<
		HeatmapPalette,
		{ low: string; mid?: string; high: string }
	> = {
		brand: { low: '#e0e7ff', high: 'var(--color-brand-500, #6366f1)' },
		green: { low: '#dcfce7', high: '#16a34a' },
		red: { low: '#fee2e2', high: '#dc2626' },
		blue: { low: '#e0f2fe', high: '#0284c8' },
		orange: { low: '#ffedd5', high: '#ea580c' },
		purple: { low: '#f3e8ff', high: '#9333ea' },
		diverging: { low: '#3b82f6', mid: '#f4f4f5', high: '#ef4444' }
	};

	const SIZE_CELL: Record<HeatmapSize, number> = {
		sm: 20,
		md: 28,
		lg: 36
	};
</script>

<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	interface HeatmapProps {
		data?: HeatmapCell[];
		rows?: string[];
		cols?: string[];
		palette?: HeatmapPalette;
		colorLow?: string;
		colorMid?: string;
		colorHigh?: string;
		emptyColor?: string;
		/** Override scale domain */
		domainMin?: number;
		domainMax?: number;
		size?: HeatmapSize;
		cellSize?: number;
		cellGap?: number;
		cellRadius?: number;
		interactive?: boolean;
		/** Show numeric value inside each cell */
		showValues?: boolean;
		showLegend?: boolean;
		/** Rotate column labels for long headers */
		rotateColLabels?: boolean;
		unit?: string;
		decimals?: number;
		legendLabel?: string;
		ariaLabel?: string;
		class?: string;
		onhover?: (cell: HeatmapCell | null) => void;
		onselect?: (cell: HeatmapCell) => void;
	}

	const {
		data = [],
		rows = [],
		cols = [],
		palette = 'brand',
		colorLow,
		colorMid,
		colorHigh,
		emptyColor = 'var(--color-surface-muted, #f4f4f5)',
		domainMin,
		domainMax,
		size = 'md',
		cellSize,
		cellGap = 3,
		cellRadius = 5,
		interactive = true,
		showValues = false,
		showLegend = true,
		rotateColLabels = false,
		unit = '',
		decimals,
		legendLabel = 'Intensity',
		ariaLabel = 'Heatmap',
		class: className = '',
		onhover,
		onselect
	}: HeatmapProps = $props();

	let tip = $state<{
		row: number;
		col: number;
		value: number;
		label?: string;
		x: number;
		y: number;
	} | null>(null);

	const paletteColors = $derived(HEATMAP_PALETTES[palette]);
	const low = $derived(colorLow ?? paletteColors.low);
	const mid = $derived(colorMid ?? paletteColors.mid);
	const high = $derived(colorHigh ?? paletteColors.high);

	const resolvedCell = $derived(cellSize ?? SIZE_CELL[size]);
	const valueFont = $derived(size === 'sm' ? 8 : size === 'md' ? 9 : 11);

	const rowCount = $derived(Math.max(rows.length, ...data.map((d) => d.row + 1), 0));
	const colCount = $derived(Math.max(cols.length, ...data.map((d) => d.col + 1), 0));

	const valueMap = $derived.by(() => {
		const m = new Map<string, HeatmapCell>();
		for (const d of data) m.set(`${d.row}:${d.col}`, d);
		return m;
	});

	const domain = $derived.by(() => {
		const vals = data.map((d) => d.value);
		if (vals.length === 0) return { min: 0, max: 1 };
		return {
			min: domainMin ?? Math.min(...vals),
			max: domainMax ?? Math.max(...vals)
		};
	});

	const longestRow = $derived(
		rows.reduce((n, r) => Math.max(n, r.length), 2)
	);
	const labelW = $derived(Math.min(120, Math.max(40, longestRow * 6.2 + 12)));
	const labelH = $derived(rotateColLabels ? 52 : 22);
	const W = $derived(labelW + colCount * (resolvedCell + cellGap));
	const H = $derived(labelH + rowCount * (resolvedCell + cellGap));

	function tFor(value: number) {
		const { min, max } = domain;
		if (max === min) return 0.5;
		return Math.min(1, Math.max(0, (value - min) / (max - min)));
	}

	function mix2(a: string, b: string, t: number): string {
		const clamped = Math.min(1, Math.max(0, t));
		return `color-mix(in srgb, ${b} ${Math.round(clamped * 100)}%, ${a})`;
	}

	function cellColor(value: number | undefined): string {
		if (value === undefined) return emptyColor;
		const t = tFor(value);
		if (mid) {
			if (t <= 0.5) return mix2(low, mid, t * 2);
			return mix2(mid, high, (t - 0.5) * 2);
		}
		return mix2(low, high, t);
	}

	function formatValue(value: number) {
		const d = decimals ?? (value % 1 === 0 ? 0 : 1);
		return `${formatTick(value, d)}${unit}`;
	}

	function valueTextColor(value: number) {
		return tFor(value) > 0.55 ? '#fff' : 'var(--color-primary, #18181b)';
	}

	function showTip(row: number, col: number, cell: HeatmapCell | undefined, el?: SVGRectElement) {
		if (!interactive || !cell) {
			tip = null;
			onhover?.(null);
			return;
		}
		const x = labelW + col * (resolvedCell + cellGap) + resolvedCell / 2;
		const y = labelH + row * (resolvedCell + cellGap);
		tip = { row, col, value: cell.value, label: cell.label, x, y };
		onhover?.(cell);
		void el;
	}

	function selectCell(row: number, col: number, cell: HeatmapCell | undefined) {
		if (!interactive || !cell) return;
		onselect?.(cell);
		showTip(row, col, cell);
	}

	function clearTip() {
		tip = null;
		onhover?.(null);
	}

	const legendStops = $derived(
		mid ? [low, mid, high] : [low, high]
	);
</script>

<div class={['relative w-full select-none', className]}>
	<div class="overflow-x-auto">
		<svg
			viewBox={`0 0 ${W} ${H}`}
			width={W}
			height={H}
			class="max-w-none overflow-visible"
			role="img"
			aria-label={ariaLabel}
			onpointerleave={clearTip}
		>
			{#each cols as c, i}
				<text
					x={labelW + i * (resolvedCell + cellGap) + resolvedCell / 2}
					y={rotateColLabels ? labelH - 8 : 14}
					text-anchor={rotateColLabels ? 'start' : 'middle'}
					class="fill-muted"
					font-size="9"
					transform={rotateColLabels
						? `rotate(-45 ${labelW + i * (resolvedCell + cellGap) + resolvedCell / 2} ${labelH - 8})`
						: undefined}
				>
					{c}
				</text>
			{/each}

			{#each Array.from({ length: rowCount }, (_, r) => r) as r}
				<text
					x={labelW - 6}
					y={labelH + r * (resolvedCell + cellGap) + resolvedCell / 2 + 3}
					text-anchor="end"
					class="fill-secondary"
					font-size="10"
				>
					{rows[r] ?? r + 1}
				</text>
				{#each Array.from({ length: colCount }, (_, c) => c) as c}
					{@const cell = valueMap.get(`${r}:${c}`)}
					{@const value = cell?.value}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<g
						onpointerenter={(e) =>
							showTip(r, c, cell, e.currentTarget.querySelector('rect') ?? undefined)}
						onclick={() => selectCell(r, c, cell)}
					>
						<rect
							x={labelW + c * (resolvedCell + cellGap)}
							y={labelH + r * (resolvedCell + cellGap)}
							width={resolvedCell}
							height={resolvedCell}
							rx={cellRadius}
							fill={cellColor(value)}
							class={[
								'transition-opacity duration-150',
								interactive && value !== undefined ? 'cursor-pointer' : ''
							]}
							opacity={tip && (tip.row !== r || tip.col !== c) ? 0.4 : 1}
						>
							{#if cell}
								<title
									>{rows[r] ?? r + 1}{#if cols[c]}
										· {cols[c]}{/if}: {formatValue(cell.value)}</title
								>
							{/if}
						</rect>
						{#if showValues && value !== undefined && resolvedCell >= 22}
							<text
								x={labelW + c * (resolvedCell + cellGap) + resolvedCell / 2}
								y={labelH + r * (resolvedCell + cellGap) + resolvedCell / 2 + 3}
								text-anchor="middle"
								font-size={valueFont}
								font-weight="600"
								fill={valueTextColor(value)}
								class="pointer-events-none tabular-nums"
							>
								{formatTick(value, decimals ?? (value % 1 === 0 ? 0 : 1))}
							</text>
						{/if}
					</g>
				{/each}
			{/each}
		</svg>
	</div>

	{#if tip}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg"
			style:left={`${Math.min(92, Math.max(8, (tip.x / W) * 100))}%`}
			style:top={`${(tip.y / H) * 100}%`}
			style:margin-top="-6px"
			role="status"
		>
			<p class="text-[10px] font-medium text-muted">
				{tip.label ??
					`${rows[tip.row] ?? tip.row + 1}${cols[tip.col] ? ` · ${cols[tip.col]}` : ''}`}
			</p>
			<p class="text-sm font-semibold tabular-nums text-primary">
				{formatValue(tip.value)}
			</p>
		</div>
	{/if}

	{#if showLegend && data.length > 0}
		<div class="mt-3 flex flex-wrap items-center gap-2">
			<span class="text-[11px] text-muted">{legendLabel}</span>
			<div
				class="h-2.5 w-28 overflow-hidden rounded-full border border-border"
				style:background={`linear-gradient(90deg, ${legendStops.join(', ')})`}
				aria-hidden="true"
			></div>
			<span class="text-[11px] tabular-nums text-secondary">
				{formatTick(domain.min, decimals ?? (domain.min % 1 === 0 ? 0 : 1))}
				–
				{formatTick(domain.max, decimals ?? (domain.max % 1 === 0 ? 0 : 1))}{unit}
			</span>
		</div>
	{/if}
</div>
