<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	export interface HeatmapCell {
		row: number;
		col: number;
		value: number;
	}

	interface HeatmapProps {
		/** Flat cells; missing cells render as empty */
		data?: HeatmapCell[];
		rows?: string[];
		cols?: string[];
		/** Low → high color stops */
		colorLow?: string;
		colorHigh?: string;
		cellSize?: number;
		interactive?: boolean;
		unit?: string;
		class?: string;
	}

	const {
		data = [],
		rows = [],
		cols = [],
		colorLow = '#e0e7ff',
		colorHigh = 'var(--color-brand-500, #6366f1)',
		cellSize = 28,
		interactive = true,
		unit = '',
		class: className = ''
	}: HeatmapProps = $props();

	let tip = $state<{
		row: number;
		col: number;
		value: number;
		x: number;
		y: number;
	} | null>(null);

	const rowCount = $derived(Math.max(rows.length, ...data.map((d) => d.row + 1), 0));
	const colCount = $derived(Math.max(cols.length, ...data.map((d) => d.col + 1), 0));

	const valueMap = $derived.by(() => {
		const m = new Map<string, number>();
		for (const d of data) m.set(`${d.row}:${d.col}`, d.value);
		return m;
	});

	const domain = $derived.by(() => {
		const vals = data.map((d) => d.value);
		if (vals.length === 0) return { min: 0, max: 1 };
		return { min: Math.min(...vals), max: Math.max(...vals) };
	});

	const labelW = 56;
	const labelH = 22;
	const gap = 3;
	const W = $derived(labelW + colCount * (cellSize + gap));
	const H = $derived(labelH + rowCount * (cellSize + gap));

	function mix(t: number): string {
		// Prefer CSS color-mix when high is a CSS var / hex; fall back to opacity layering via fill + opacity
		const clamped = Math.min(1, Math.max(0, t));
		return `color-mix(in srgb, ${colorHigh} ${Math.round(clamped * 100)}%, ${colorLow})`;
	}

	function cellColor(value: number | undefined): string {
		if (value === undefined) return 'var(--color-surface-muted, #f4f4f5)';
		const { min, max } = domain;
		const t = max === min ? 0.5 : (value - min) / (max - min);
		return mix(t);
	}

	function onCell(row: number, col: number, value: number | undefined) {
		if (!interactive || value === undefined) {
			tip = null;
			return;
		}
		const x = labelW + col * (cellSize + gap) + cellSize / 2;
		const y = labelH + row * (cellSize + gap);
		tip = tip?.row === row && tip?.col === col ? null : { row, col, value, x, y };
	}
</script>

<div class={['relative w-full select-none overflow-x-auto', className]}>
	<svg
		viewBox={`0 0 ${W} ${H}`}
		class="h-auto min-w-full overflow-visible"
		role="img"
		aria-label="Heatmap"
	>
		{#each cols as c, i}
			<text
				x={labelW + i * (cellSize + gap) + cellSize / 2}
				y={14}
				text-anchor="middle"
				class="fill-muted"
				font-size="9"
			>
				{c}
			</text>
		{/each}

		{#each Array.from({ length: rowCount }, (_, r) => r) as r}
			<text
				x={labelW - 6}
				y={labelH + r * (cellSize + gap) + cellSize / 2 + 3}
				text-anchor="end"
				class="fill-secondary"
				font-size="10"
			>
				{rows[r] ?? r + 1}
			</text>
			{#each Array.from({ length: colCount }, (_, c) => c) as c}
				{@const value = valueMap.get(`${r}:${c}`)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					x={labelW + c * (cellSize + gap)}
					y={labelH + r * (cellSize + gap)}
					width={cellSize}
					height={cellSize}
					rx="5"
					fill={cellColor(value)}
					class={interactive && value !== undefined ? 'cursor-pointer' : ''}
					opacity={tip && (tip.row !== r || tip.col !== c) ? 0.45 : 1}
					onclick={() => onCell(r, c, value)}
				/>
			{/each}
		{/each}
	</svg>

	{#if tip}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg"
			style:left={`${(tip.x / W) * 100}%`}
			style:top={`${(tip.y / H) * 100}%`}
			style:margin-top="-6px"
			role="status"
		>
			<p class="text-[10px] font-medium text-muted">
				{rows[tip.row] ?? tip.row + 1}
				{#if cols[tip.col]}
					· {cols[tip.col]}
				{/if}
			</p>
			<p class="text-sm font-semibold tabular-nums text-primary">
				{formatTick(tip.value, tip.value % 1 === 0 ? 0 : 1)}{unit}
			</p>
		</div>
	{/if}
</div>
