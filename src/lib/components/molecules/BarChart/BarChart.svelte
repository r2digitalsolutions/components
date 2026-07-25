<script lang="ts">
	import { tipAlign, formatTick } from '$lib/utils/chart.js';

	export interface BarChartPoint {
		label: string;
		value: number;
		color?: string;
	}

	interface BarChartProps {
		data?: BarChartPoint[];
		height?: number;
		/** Soft floor so empty bars still show a stub */
		emptyBaseline?: boolean;
		interactive?: boolean;
		showValues?: boolean;
		unit?: string;
		class?: string;
	}

	const {
		data = [],
		height = 200,
		emptyBaseline = true,
		interactive = true,
		showValues = true,
		unit = '',
		class: className = ''
	}: BarChartProps = $props();

	const W = 420;
	const pad = { t: 24, r: 12, b: 32, l: 12 };
	const uid = `bc-${Math.random().toString(36).slice(2, 8)}`;
	const color = 'var(--color-brand-500, #6366f1)';

	let tipIndex = $state<number | null>(null);

	const max = $derived(Math.max(...data.map((d) => d.value), 1));

	const bars = $derived.by(() => {
		const innerW = W - pad.l - pad.r;
		const innerH = height - pad.t - pad.b;
		const slot = innerW / Math.max(data.length, 1);
		const bw = Math.min(36, Math.max(10, slot * 0.62));

		return data.map((d, i) => {
			let ratio = d.value / max;
			if (emptyBaseline && d.value <= 0) ratio = 0.04;
			else if (emptyBaseline) ratio = Math.max(0.06, ratio);
			const bh = ratio * innerH;
			const x = pad.l + i * slot + (slot - bw) / 2;
			const y = height - pad.b - bh;
			return { ...d, x, y, bw, bh, cx: x + bw / 2 };
		});
	});

	const tip = $derived.by(() => {
		if (tipIndex == null || !bars[tipIndex]) return null;
		const b = bars[tipIndex];
		const leftPct = (b.cx / W) * 100;
		return {
			...b,
			leftPct,
			topPct: (b.y / height) * 100,
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
		aria-label="Bar chart"
	>
		<defs>
			<linearGradient id="{uid}-bar" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color={color} stop-opacity="1" />
				<stop offset="100%" stop-color={color} stop-opacity="0.55" />
			</linearGradient>
		</defs>

		{#each bars as b, i}
			<rect
				x={b.x}
				y={b.y}
				width={b.bw}
				height={b.bh}
				rx="6"
				fill={b.color ?? `url(#${uid}-bar)`}
				opacity={tipIndex == null || tipIndex === i ? 1 : 0.35}
				class="transition-opacity"
			/>
			{#if showValues && b.value > 0}
				<text
					x={b.cx}
					y={b.y - 6}
					text-anchor="middle"
					class="fill-secondary"
					font-size="10"
					font-weight="600"
				>
					{formatTick(b.value, 0)}{unit}
				</text>
			{/if}
			<text x={b.cx} y={height - 8} text-anchor="middle" class="fill-muted" font-size="10">
				{b.label}
			</text>
			{#if interactive}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					x={b.x - 4}
					y={pad.t}
					width={b.bw + 8}
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
			<p class="text-[10px] font-medium text-muted">{tip.label}</p>
			<p class="text-sm font-semibold tabular-nums text-primary">{tip.value}{unit}</p>
		</div>
	{/if}
</div>
