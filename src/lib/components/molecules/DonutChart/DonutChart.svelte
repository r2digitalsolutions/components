<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	export interface DonutSlice {
		label: string;
		value: number;
		color?: string;
	}

	interface DonutChartProps {
		data?: DonutSlice[];
		size?: number;
		thickness?: number;
		interactive?: boolean;
		showLegend?: boolean;
		showCenter?: boolean;
		unit?: string;
		centerLabel?: string;
		class?: string;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#0ea5e9',
		'#a855f7',
		'#ef4444'
	];

	const {
		data = [],
		size = 180,
		thickness = 28,
		interactive = true,
		showLegend = true,
		showCenter = true,
		unit = '',
		centerLabel = 'Total',
		class: className = ''
	}: DonutChartProps = $props();

	let active = $state<number | null>(null);

	const total = $derived(data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1);
	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const r = $derived((size - thickness) / 2 - 4);
	const innerR = $derived(r - thickness);

	const slices = $derived.by(() => {
		let angle = -Math.PI / 2;
		return data.map((d, i) => {
			const value = Math.max(0, d.value);
			const slice = (value / total) * Math.PI * 2;
			const start = angle;
			angle += slice;
			const large = slice > Math.PI ? 1 : 0;
			const x1 = cx + r * Math.cos(start);
			const y1 = cy + r * Math.sin(start);
			const x2 = cx + r * Math.cos(angle);
			const y2 = cy + r * Math.sin(angle);
			const ix1 = cx + innerR * Math.cos(angle);
			const iy1 = cy + innerR * Math.sin(angle);
			const ix2 = cx + innerR * Math.cos(start);
			const iy2 = cy + innerR * Math.sin(start);
			const path =
				slice <= 0
					? ''
					: [
							`M ${x1} ${y1}`,
							`A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
							`L ${ix1} ${iy1}`,
							`A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`,
							'Z'
						].join(' ');
			return {
				...d,
				value,
				path,
				color: d.color ?? palette[i % palette.length],
				pct: value / total
			};
		});
	});

	const focus = $derived(active != null ? slices[active] : null);

	function select(i: number) {
		if (!interactive) return;
		active = active === i ? null : i;
	}
</script>

<div class={['flex flex-col items-center gap-4 sm:flex-row sm:items-start', className]}>
	<div class="relative shrink-0" style:width={`${size}px`} style:height={`${size}px`}>
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			class="overflow-visible"
			role="img"
			aria-label="Donut chart"
		>
			{#each slices as s, i}
				{#if s.path}
					<path
						d={s.path}
						fill={s.color}
						opacity={active == null || active === i ? 1 : 0.35}
						class="transition-opacity {interactive ? 'cursor-pointer' : ''}"
						onclick={() => select(i)}
						role={interactive ? 'button' : undefined}
						tabindex={interactive ? 0 : undefined}
						onkeydown={(e) => {
							if (interactive && (e.key === 'Enter' || e.key === ' ')) {
								e.preventDefault();
								select(i);
							}
						}}
					/>
				{/if}
			{/each}
		</svg>

		{#if showCenter}
			<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
				{#if focus}
					<p class="max-w-[70%] truncate text-[10px] font-medium text-muted">{focus.label}</p>
					<p class="text-lg font-semibold tabular-nums text-primary">
						{formatTick(focus.value, 0)}{unit}
					</p>
					<p class="text-[10px] text-muted">{Math.round(focus.pct * 100)}%</p>
				{:else}
					<p class="text-[10px] font-medium text-muted">{centerLabel}</p>
					<p class="text-lg font-semibold tabular-nums text-primary">
						{formatTick(total, 0)}{unit}
					</p>
				{/if}
			</div>
		{/if}
	</div>

	{#if showLegend}
		<ul class="flex min-w-0 flex-1 flex-col gap-1.5 self-stretch sm:pt-2">
			{#each slices as s, i}
				<li>
					<button
						type="button"
						class={[
							'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
							interactive && 'hover:bg-surface-muted',
							active === i && 'bg-surface-muted'
						]}
						onclick={() => select(i)}
						disabled={!interactive}
					>
						<span
							class="size-2.5 shrink-0 rounded-full"
							style:background={s.color}
							aria-hidden="true"
						></span>
						<span class="min-w-0 flex-1 truncate text-sm text-primary">{s.label}</span>
						<span class="shrink-0 text-xs font-semibold tabular-nums text-secondary">
							{formatTick(s.value, 0)}{unit}
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
