<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	interface GaugeProps {
		value?: number;
		min?: number;
		max?: number;
		size?: number;
		strokeWidth?: number;
		color?: string;
		trackColor?: string;
		/** Thresholds as fractions of the range (0–1), left→right colors */
		zones?: { at: number; color: string }[];
		label?: string;
		unit?: string;
		showValue?: boolean;
		class?: string;
	}

	const {
		value = 0,
		min = 0,
		max = 100,
		size = 200,
		strokeWidth = 14,
		color = 'var(--color-brand-500, #6366f1)',
		trackColor = 'var(--color-border, #e4e4e7)',
		zones = [],
		label = '',
		unit = '',
		showValue = true,
		class: className = ''
	}: GaugeProps = $props();

	const range = $derived(max - min || 1);
	const clamped = $derived(Math.min(max, Math.max(min, value)));
	const pct = $derived((clamped - min) / range);

	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const r = $derived((size - strokeWidth) / 2 - 4);
	const startAngle = -Math.PI;
	const endAngle = 0;
	const sweep = Math.PI;

	function polar(angle: number, radius = r) {
		return {
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle)
		};
	}

	function arcPath(from: number, to: number, radius = r): string {
		const a0 = startAngle + from * sweep;
		const a1 = startAngle + to * sweep;
		const p0 = polar(a0, radius);
		const p1 = polar(a1, radius);
		const large = to - from > 0.5 ? 1 : 0;
		return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
	}

	const valueColor = $derived.by(() => {
		if (zones.length === 0) return color;
		const sorted = [...zones].sort((a, b) => a.at - b.at);
		let c = color;
		for (const z of sorted) {
			if (pct >= z.at) c = z.color;
		}
		return c;
	});

	const needleAngle = $derived(startAngle + pct * sweep);
	const needle = $derived(polar(needleAngle, r - strokeWidth));
	const height = $derived(cy + strokeWidth);
</script>

<div class={['inline-flex flex-col items-center', className]}>
	<svg
		width={size}
		height={height}
		viewBox={`0 0 ${size} ${height}`}
		class="overflow-visible"
		role="meter"
		aria-valuenow={clamped}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label || 'Gauge'}
	>
		<path
			d={arcPath(0, 1)}
			fill="none"
			stroke={trackColor}
			stroke-width={strokeWidth}
			stroke-linecap="round"
		/>
		{#if zones.length > 0}
			{#each [...zones].sort((a, b) => a.at - b.at) as z, i}
				{@const next = [...zones].sort((a, b) => a.at - b.at)[i + 1]?.at ?? 1}
				{#if next > z.at}
					<path
						d={arcPath(z.at, next)}
						fill="none"
						stroke={z.color}
						stroke-width={strokeWidth}
						stroke-linecap="butt"
						opacity="0.35"
					/>
				{/if}
			{/each}
		{/if}
		{#if pct > 0}
			<path
				d={arcPath(0, pct)}
				fill="none"
				stroke={valueColor}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				class="transition-[stroke-dashoffset,d] duration-300"
			/>
		{/if}
		<line
			x1={cx}
			y1={cy}
			x2={needle.x}
			y2={needle.y}
			stroke="var(--color-primary, currentColor)"
			stroke-width="2"
			stroke-linecap="round"
			class="transition-all duration-300"
		/>
		<circle cx={cx} cy={cy} r="4" class="fill-primary" />
	</svg>

	{#if showValue}
		<div class="-mt-2 text-center">
			<p class="text-2xl font-semibold tabular-nums text-primary">
				{formatTick(clamped, clamped % 1 === 0 ? 0 : 1)}{unit}
			</p>
			{#if label}
				<p class="text-xs text-muted">{label}</p>
			{/if}
		</div>
	{/if}
</div>
