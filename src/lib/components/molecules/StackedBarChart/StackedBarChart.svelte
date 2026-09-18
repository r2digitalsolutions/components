<script lang="ts">
	import { formatTick, tipAlign } from '$lib/utils/chart.js';

	export interface StackedSeries {
		id: string;
		label: string;
		color?: string;
		values: number[];
	}

	interface StackedBarChartProps {
		series?: StackedSeries[];
		labels?: string[];
		height?: number;
		interactive?: boolean;
		showLegend?: boolean;
		unit?: string;
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
		height = 220,
		interactive = true,
		showLegend = true,
		unit = '',
		class: className = ''
	}: StackedBarChartProps = $props();

	const W = 420;
	const pad = { t: 16, r: 12, b: 32, l: 12 };

	let tipCol = $state<number | null>(null);

	const colCount = $derived(
		Math.max(labels.length, ...series.map((s) => s.values.length), 0)
	);

	const stacks = $derived.by(() => {
		const innerW = W - pad.l - pad.r;
		const innerH = height - pad.t - pad.b;
		const totals = Array.from({ length: colCount }, (_, i) =>
			series.reduce((sum, s) => sum + Math.max(0, s.values[i] ?? 0), 0)
		);
		const max = Math.max(...totals, 1);
		const slot = innerW / Math.max(colCount, 1);
		const bw = Math.min(40, Math.max(12, slot * 0.58));

		return Array.from({ length: colCount }, (_, i) => {
			let y = height - pad.b;
			const segments = series.map((s, si) => {
				const value = Math.max(0, s.values[i] ?? 0);
				const bh = (value / max) * innerH;
				y -= bh;
				return {
					id: s.id,
					label: s.label,
					value,
					color: s.color ?? palette[si % palette.length],
					x: pad.l + i * slot + (slot - bw) / 2,
					y,
					bw,
					bh
				};
			});
			const cx = pad.l + i * slot + slot / 2;
			return {
				label: labels[i] ?? String(i + 1),
				total: totals[i],
				cx,
				topY: y,
				segments
			};
		});
	});

	const tip = $derived.by(() => {
		if (tipCol == null || !stacks[tipCol]) return null;
		const col = stacks[tipCol];
		const leftPct = (col.cx / W) * 100;
		return { ...col, leftPct, topPct: (col.topY / height) * 100, align: tipAlign(leftPct) };
	});

	function select(i: number) {
		if (!interactive) return;
		tipCol = tipCol === i ? null : i;
	}
</script>

<div class={['w-full space-y-3', className]}>
	<div class="relative w-full select-none">
		<svg
			viewBox={`0 0 ${W} ${height}`}
			class="h-auto w-full overflow-visible"
			role="img"
			aria-label="Stacked bar chart"
		>
			{#each stacks as col, i}
				{#each col.segments as seg}
					{#if seg.bh > 0}
						<rect
							x={seg.x}
							y={seg.y}
							width={seg.bw}
							height={seg.bh}
							fill={seg.color}
							opacity={tipCol == null || tipCol === i ? 1 : 0.35}
							class="transition-opacity"
						/>
					{/if}
				{/each}
				<text x={col.cx} y={height - 8} text-anchor="middle" class="fill-muted" font-size="10">
					{col.label}
				</text>
				{#if interactive}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<rect
						x={col.segments[0]?.x ?? col.cx - 16}
						y={pad.t}
						width={(col.segments[0]?.bw ?? 32) + 4}
						height={height - pad.t - pad.b}
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
				style:margin-top="-8px"
				role="status"
			>
				<p class="mb-1 text-[10px] font-medium text-muted">{tip.label}</p>
				{#each tip.segments as seg}
					{#if seg.value > 0}
						<div class="flex items-center gap-2 text-xs">
							<span class="size-1.5 rounded-full" style:background={seg.color}></span>
							<span class="text-secondary">{seg.label}</span>
							<span class="ml-auto font-semibold tabular-nums text-primary"
								>{formatTick(seg.value, 0)}{unit}</span
							>
						</div>
					{/if}
				{/each}
				<p class="mt-1 border-t border-border pt-1 text-xs font-semibold tabular-nums text-primary">
					Total {formatTick(tip.total, 0)}{unit}
				</p>
			</div>
		{/if}
	</div>

	{#if showLegend}
		<ul class="flex flex-wrap gap-3">
			{#each series as s, i}
				<li class="flex items-center gap-1.5 text-xs text-secondary">
					<span
						class="size-2 rounded-full"
						style:background={s.color ?? palette[i % palette.length]}
					></span>
					{s.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>
