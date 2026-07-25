<script module lang="ts">
	export type GaugeSize = 'sm' | 'md' | 'lg' | 'xl';
	export type GaugeVariant = 'arc' | 'horseshoe' | 'ring';
	export type GaugeTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

	export interface GaugeZone {
		/** Start of zone as fraction of range (0–1) */
		at: number;
		color: string;
		label?: string;
	}

	const SIZE_PX: Record<GaugeSize, number> = {
		sm: 140,
		md: 200,
		lg: 260,
		xl: 320
	};

	const SIZE_STROKE: Record<GaugeSize, number> = {
		sm: 10,
		md: 14,
		lg: 16,
		xl: 18
	};

	const TONE_COLOR: Record<GaugeTone, string> = {
		brand: 'var(--color-brand-500, #6366f1)',
		success: '#22c55e',
		warning: '#f59e0b',
		danger: '#ef4444',
		info: '#0ea5e9',
		neutral: 'var(--color-secondary, #71717a)'
	};
</script>

<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	interface GaugeProps {
		value?: number;
		min?: number;
		max?: number;
		/** Preset size; overridden by `diameter` when set */
		size?: GaugeSize;
		/** Explicit diameter in px */
		diameter?: number;
		strokeWidth?: number;
		variant?: GaugeVariant;
		tone?: GaugeTone;
		color?: string;
		trackColor?: string;
		zones?: GaugeZone[];
		label?: string;
		description?: string;
		unit?: string;
		/** Text before the value, e.g. `$` */
		prefix?: string;
		decimals?: number;
		showValue?: boolean;
		showNeedle?: boolean;
		showTicks?: boolean;
		showMinMax?: boolean;
		animated?: boolean;
		/** Soften zone arcs behind the value stroke */
		showZones?: boolean;
		class?: string;
	}

	const {
		value = 0,
		min = 0,
		max = 100,
		size = 'md',
		diameter,
		strokeWidth,
		variant = 'arc',
		tone = 'brand',
		color,
		trackColor = 'var(--color-border, #e4e4e7)',
		zones = [],
		label = '',
		description = '',
		unit = '',
		prefix = '',
		decimals,
		showValue = true,
		showNeedle = true,
		showTicks = false,
		showMinMax = false,
		animated = true,
		showZones = true,
		class: className = ''
	}: GaugeProps = $props();

	const px = $derived(diameter ?? SIZE_PX[size]);
	const stroke = $derived(strokeWidth ?? SIZE_STROKE[size]);
	const range = $derived(max - min || 1);
	const clamped = $derived(Math.min(max, Math.max(min, value)));
	const pct = $derived((clamped - min) / range);

	/** Keep stroke caps / ticks inside the SVG box (no overflow). */
	const pad = $derived(
		Math.ceil(stroke / 2) + (showTicks ? 12 : 2) + (showMinMax ? 12 : 2)
	);
	const inner = $derived(Math.max(32, px - pad * 2));
	const cx = $derived(pad + inner / 2);
	const cy = $derived(pad + inner / 2);
	const r = $derived(Math.max(8, inner / 2 - stroke / 2));

	const angles = $derived.by(() => {
		if (variant === 'ring') {
			return { start: -Math.PI / 2, sweep: Math.PI * 2 * 0.9999 };
		}
		if (variant === 'horseshoe') {
			const sweep = (Math.PI * 4) / 3;
			return { start: Math.PI / 2 + (2 * Math.PI - sweep) / 2, sweep };
		}
		return { start: -Math.PI, sweep: Math.PI };
	});

	const startAngle = $derived(angles.start);
	const sweep = $derived(angles.sweep);

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
		// large-arc when the swept angle is strictly greater than 180°
		const angleSpan = Math.abs(to - from) * sweep;
		const large = angleSpan > Math.PI + 1e-6 ? 1 : 0;
		return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
	}

	const resolvedColor = $derived(color ?? TONE_COLOR[tone]);

	const valueColor = $derived.by(() => {
		if (!showZones || zones.length === 0) return resolvedColor;
		const sorted = [...zones].sort((a, b) => a.at - b.at);
		let c = resolvedColor;
		for (const z of sorted) {
			if (pct >= z.at) c = z.color;
		}
		return c;
	});

	const needleAngle = $derived(startAngle + pct * sweep);
	const needle = $derived(polar(needleAngle, Math.max(0, r - stroke * 0.75)));

	const svgWidth = $derived(px);
	// Arc only needs the upper half + room for stroke caps at the baseline.
	const svgHeight = $derived(
		variant === 'ring' || variant === 'horseshoe'
			? px
			: Math.ceil(cy + stroke / 2 + 2)
	);

	const valueDecimals = $derived(
		decimals ?? (clamped % 1 === 0 ? 0 : 1)
	);

	const valueText = $derived(
		`${prefix}${formatTick(clamped, valueDecimals)}${unit}`
	);

	const tickMarks = $derived.by(() => {
		if (!showTicks)
			return [] as {
				angle: number;
				outer: { x: number; y: number };
				inner: { x: number; y: number };
				major: boolean;
			}[];
		const marks = [];
		const steps = 10;
		const outerR = r + stroke / 2;
		for (let i = 0; i <= steps; i++) {
			const t = i / steps;
			const angle = startAngle + t * sweep;
			const major = i % 5 === 0;
			marks.push({
				angle,
				major,
				outer: polar(angle, outerR),
				inner: polar(angle, outerR - (major ? 8 : 4))
			});
		}
		return marks;
	});

	const activeZoneLabel = $derived.by(() => {
		if (!zones.length) return '';
		const sorted = [...zones].sort((a, b) => a.at - b.at);
		let labelText = '';
		for (const z of sorted) {
			if (pct >= z.at && z.label) labelText = z.label;
		}
		return labelText;
	});

	const valueSizeClass = $derived(
		size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'
	);
</script>

<div class={['inline-flex max-w-full flex-col items-center overflow-hidden', className]}>
	<svg
		width={svgWidth}
		height={svgHeight}
		viewBox={`0 0 ${svgWidth} ${svgHeight}`}
		class="block max-w-full overflow-hidden"
		role="meter"
		aria-valuenow={clamped}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label || 'Gauge'}
	>
		<!-- Track -->
		<path
			d={arcPath(0, 1)}
			fill="none"
			stroke={trackColor}
			stroke-width={stroke}
			stroke-linecap="round"
		/>

		<!-- Zones -->
		{#if showZones && zones.length > 0}
			{#each [...zones].sort((a, b) => a.at - b.at) as z, i (z.at)}
				{@const sorted = [...zones].sort((a, b) => a.at - b.at)}
				{@const next = sorted[i + 1]?.at ?? 1}
				{#if next > z.at}
					<path
						d={arcPath(z.at, next)}
						fill="none"
						stroke={z.color}
						stroke-width={stroke}
						stroke-linecap="butt"
						opacity="0.35"
					/>
				{/if}
			{/each}
		{/if}

		<!-- Value arc -->
		{#if pct > 0.001}
			<path
				d={arcPath(0, Math.min(1, pct))}
				fill="none"
				stroke={valueColor}
				stroke-width={stroke}
				stroke-linecap="round"
				class={animated ? 'transition-[d] duration-500 ease-out' : undefined}
			/>
		{/if}

		<!-- Ticks -->
		{#each tickMarks as t}
			<line
				x1={t.outer.x}
				y1={t.outer.y}
				x2={t.inner.x}
				y2={t.inner.y}
				stroke="var(--color-muted, #a1a1aa)"
				stroke-width={t.major ? 1.5 : 1}
				opacity={t.major ? 0.7 : 0.4}
			/>
		{/each}

		{#if showNeedle}
			<line
				x1={cx}
				y1={cy}
				x2={needle.x}
				y2={needle.y}
				stroke="var(--color-primary, currentColor)"
				stroke-width="2"
				stroke-linecap="round"
				class={animated ? 'transition-all duration-500 ease-out' : undefined}
			/>
			<circle cx={cx} cy={cy} r={size === 'sm' ? 3 : 4} class="fill-primary" />
			<circle cx={cx} cy={cy} r={size === 'sm' ? 1.5 : 2} class="fill-surface-elevated" />
		{/if}

		{#if showMinMax}
			{@const minP = polar(startAngle, Math.max(0, r - stroke - 4))}
			{@const maxP = polar(startAngle + sweep, Math.max(0, r - stroke - 4))}
			<text
				x={minP.x}
				y={minP.y + (variant === 'arc' ? 10 : 0)}
				text-anchor="middle"
				dominant-baseline="middle"
				class="fill-muted text-[10px]"
			>
				{formatTick(min, min % 1 === 0 ? 0 : 1)}
			</text>
			<text
				x={maxP.x}
				y={maxP.y + (variant === 'arc' ? 10 : 0)}
				text-anchor="middle"
				dominant-baseline="middle"
				class="fill-muted text-[10px]"
			>
				{formatTick(max, max % 1 === 0 ? 0 : 1)}
			</text>
		{/if}

		{#if variant === 'ring' && showValue}
			<text
				x={cx}
				y={cy - (label ? 6 : 0)}
				text-anchor="middle"
				dominant-baseline="middle"
				class="fill-primary font-semibold"
				style:font-size={size === 'sm' ? '18px' : size === 'md' ? '28px' : '36px'}
			>
				{valueText}
			</text>
			{#if label}
				<text
					x={cx}
					y={cy + 18}
					text-anchor="middle"
					dominant-baseline="middle"
					class="fill-muted"
					style:font-size="11px"
				>
					{label}
				</text>
			{/if}
		{/if}
	</svg>

	{#if showValue && variant !== 'ring'}
		<div class={['text-center', variant === 'arc' ? '-mt-1' : '-mt-6']}>
			<p class={['font-semibold tabular-nums text-primary', valueSizeClass]}>
				{valueText}
			</p>
			{#if label}
				<p class="text-xs text-muted">{label}</p>
			{/if}
			{#if description || activeZoneLabel}
				<p class="mt-0.5 text-[11px] text-secondary">
					{description || activeZoneLabel}
				</p>
			{/if}
		</div>
	{:else if variant === 'ring' && (description || activeZoneLabel)}
		<p class="mt-1 text-center text-[11px] text-secondary">
			{description || activeZoneLabel}
		</p>
	{:else if label && !showValue}
		<p class="mt-1 text-xs text-muted">{label}</p>
	{/if}
</div>
