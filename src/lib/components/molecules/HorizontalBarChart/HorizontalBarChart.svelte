<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	export interface HBarPoint {
		label: string;
		value: number;
		color?: string;
	}

	interface HorizontalBarChartProps {
		data?: HBarPoint[];
		/** Bar track width in viewBox units */
		barWidth?: number;
		rowHeight?: number;
		interactive?: boolean;
		showValues?: boolean;
		unit?: string;
		class?: string;
	}

	const {
		data = [],
		barWidth = 280,
		rowHeight = 36,
		interactive = true,
		showValues = true,
		unit = '',
		class: className = ''
	}: HorizontalBarChartProps = $props();

	const color = 'var(--color-brand-500, #6366f1)';
	const labelW = 88;
	const padR = 48;
	const W = $derived(labelW + barWidth + padR);
	const H = $derived(Math.max(data.length, 1) * rowHeight + 8);

	let tipIndex = $state<number | null>(null);

	const max = $derived(Math.max(...data.map((d) => d.value), 1));

	const rows = $derived(
		data.map((d, i) => {
			const ratio = Math.max(0, d.value) / max;
			const bw = Math.max(d.value > 0 ? 4 : 0, ratio * barWidth);
			const y = 4 + i * rowHeight;
			return { ...d, bw, y, midY: y + (rowHeight - 10) / 2 };
		})
	);

	function select(i: number) {
		if (!interactive) return;
		tipIndex = tipIndex === i ? null : i;
	}
</script>

<div class={['relative w-full select-none', className]}>
	<svg
		viewBox={`0 0 ${W} ${H}`}
		class="h-auto w-full overflow-visible"
		role="img"
		aria-label="Horizontal bar chart"
	>
		{#each rows as r, i}
			<text
				x={labelW - 8}
				y={r.midY + 4}
				text-anchor="end"
				class="fill-secondary"
				font-size="11"
			>
				{r.label}
			</text>
			<rect
				x={labelW}
				y={r.y + 4}
				width={barWidth}
				height={rowHeight - 14}
				rx="5"
				class="fill-surface-muted"
				opacity="0.6"
			/>
			<rect
				x={labelW}
				y={r.y + 4}
				width={r.bw}
				height={rowHeight - 14}
				rx="5"
				fill={r.color ?? color}
				opacity={tipIndex == null || tipIndex === i ? 1 : 0.35}
				class="transition-opacity"
			/>
			{#if showValues}
				<text
					x={labelW + r.bw + 6}
					y={r.midY + 4}
					class="fill-muted"
					font-size="10"
					font-weight="600"
				>
					{formatTick(r.value, 0)}{unit}
				</text>
			{/if}
			{#if interactive}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					x={0}
					y={r.y}
					width={W}
					height={rowHeight}
					fill="transparent"
					class="cursor-pointer"
					onclick={() => select(i)}
				/>
			{/if}
		{/each}
	</svg>

	{#if tipIndex != null && rows[tipIndex]}
		{@const t = rows[tipIndex]}
		<div
			class="pointer-events-none absolute z-10 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg"
			style:left={`${((labelW + t.bw) / W) * 100}%`}
			style:top={`${(t.y / H) * 100}%`}
			role="status"
		>
			<p class="text-[10px] font-medium text-muted">{t.label}</p>
			<p class="text-sm font-semibold tabular-nums text-primary">{t.value}{unit}</p>
		</div>
	{/if}
</div>
