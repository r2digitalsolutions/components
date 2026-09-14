<script lang="ts">
	export type ChartType = 'line' | 'bar' | 'donut';
	export interface ChartPoint {
		label: string;
		value: number;
		color?: string;
	}

	interface ChartProps {
		type?: ChartType;
		data?: ChartPoint[];
		height?: number;
		showLegend?: boolean;
		/** Max tick labels on the X axis (line/bar). */
		maxLabels?: number;
		emptyLabel?: string;
		class?: string;
	}

	const {
		type = 'bar',
		data = [],
		height = 180,
		showLegend = true,
		maxLabels = 7,
		emptyLabel = 'No data',
		class: className = ''
	}: ChartProps = $props();

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#22c55e',
		'#f59e0b',
		'#ef4444',
		'#0ea5e9',
		'#a855f7'
	];

	const max = $derived(Math.max(...data.map((d) => d.value), 1));
	const total = $derived(data.reduce((s, d) => s + d.value, 0));
	const isEmpty = $derived(data.length === 0 || total === 0);

	const labelStep = $derived(Math.max(1, Math.ceil(data.length / maxLabels)));

	const linePoints = $derived.by(() => {
		if (data.length < 2) return '';
		const w = 320;
		const h = height - 28;
		return data
			.map((d, i) => {
				const x = 16 + (i / (data.length - 1)) * (w - 32);
				const y = 12 + (1 - d.value / max) * (h - 16);
				return `${x},${y}`;
			})
			.join(' ');
	});

	const arcs = $derived.by(() => {
		const cx = 90;
		const cy = 90;
		const r = 70;
		let angle = -Math.PI / 2;
		const denom = total || 1;
		return data.map((d, i) => {
			const slice = (d.value / denom) * Math.PI * 2;
			const x1 = cx + r * Math.cos(angle);
			const y1 = cy + r * Math.sin(angle);
			angle += slice;
			const x2 = cx + r * Math.cos(angle);
			const y2 = cy + r * Math.sin(angle);
			const large = slice > Math.PI ? 1 : 0;
			return {
				d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
				color: d.color ?? palette[i % palette.length],
				label: d.label,
				value: d.value
			};
		});
	});

	function showLabel(i: number): boolean {
		if (data.length <= maxLabels) return true;
		return i % labelStep === 0 || i === data.length - 1;
	}
</script>

<div class={['relative w-full space-y-3', className]}>
	{#if isEmpty && type !== 'donut'}
		<div
			class="border-border bg-surface-overlay/40 text-muted flex items-center justify-center rounded-xl border border-dashed text-sm"
			style:height={`${height}px`}
		>
			{emptyLabel}
		</div>
	{:else if type === 'bar'}
		<svg
			viewBox={`0 0 320 ${height}`}
			preserveAspectRatio="xMidYMid meet"
			class="block w-full"
			style:height={`${height}px`}
			role="img"
			aria-label="Bar chart"
		>
			{#each data as d, i}
				{@const bw = Math.max(8, (320 - 32) / Math.max(data.length, 1) - 6)}
				{@const x = 16 + i * ((320 - 32) / Math.max(data.length, 1))}
				{@const bh = ((d.value / max) * (height - 36)) || 0}
				{@const y = height - 20 - bh}
				<rect
					{x}
					{y}
					width={bw}
					height={bh}
					rx="4"
					fill={d.color ?? palette[i % palette.length]}
					opacity="0.9"
				/>
				{#if showLabel(i)}
					<text
						x={x + bw / 2}
						y={height - 6}
						text-anchor="middle"
						class="fill-muted text-[9px]"
					>
						{d.label}
					</text>
				{/if}
			{/each}
		</svg>
	{:else if type === 'line'}
		<svg
			viewBox={`0 0 320 ${height}`}
			preserveAspectRatio="xMidYMid meet"
			class="block w-full"
			style:height={`${height}px`}
			role="img"
			aria-label="Line chart"
		>
			<!-- baseline -->
			<line
				x1="16"
				y1={height - 16}
				x2="304"
				y2={height - 16}
				stroke="currentColor"
				class="text-border"
				stroke-width="1"
			/>
			<polyline
				points={linePoints}
				fill="none"
				stroke={palette[0]}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			{#each data as d, i}
				{@const x = 16 + (i / Math.max(data.length - 1, 1)) * 288}
				{@const y = 12 + (1 - d.value / max) * (height - 44)}
				{#if data.length <= 14}
					<circle cx={x} cy={y} r="2.5" fill={palette[0]} />
				{/if}
				{#if showLabel(i)}
					<text x={x} y={height - 4} text-anchor="middle" class="fill-muted text-[9px]">{d.label}</text>
				{/if}
			{/each}
		</svg>
	{:else}
		<div class="flex flex-wrap items-center gap-4">
			<svg viewBox="0 0 180 180" class="h-44 w-44" role="img" aria-label="Donut chart">
				{#each arcs as a}
					<path d={a.d} fill={a.color} />
				{/each}
				<circle cx="90" cy="90" r="42" class="fill-surface-elevated" />
				<text x="90" y="86" text-anchor="middle" class="fill-primary text-sm font-semibold">
					{total}
				</text>
				<text x="90" y="104" text-anchor="middle" class="fill-muted text-[10px]">total</text>
			</svg>
		</div>
	{/if}

	{#if showLegend && !isEmpty}
		<ul class="flex flex-wrap gap-3">
			{#each data as d, i}
				<li class="text-secondary inline-flex items-center gap-1.5 text-xs">
					<span
						class="h-2.5 w-2.5 rounded-full"
						style:background={d.color ?? palette[i % palette.length]}
						aria-hidden="true"
					></span>
					{d.label}
					<span class="text-primary font-medium">{d.value}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
