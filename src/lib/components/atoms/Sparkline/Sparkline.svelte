<script lang="ts">
	interface SparklineProps {
		data?: number[];
		width?: number;
		height?: number;
		strokeWidth?: number;
		fill?: boolean;
		tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
		class?: string;
	}

	const {
		data = [],
		width = 120,
		height = 32,
		strokeWidth = 1.75,
		fill = true,
		tone = 'brand',
		class: className = ''
	}: SparklineProps = $props();

	const tones: Record<NonNullable<SparklineProps['tone']>, string> = {
		brand: 'stroke-brand-500 fill-brand-500/15',
		success: 'stroke-green-500 fill-green-500/15',
		warning: 'stroke-amber-500 fill-amber-500/15',
		error: 'stroke-red-500 fill-red-500/15',
		neutral: 'stroke-secondary fill-border/40'
	};

	const points = $derived.by(() => {
		if (data.length < 2) return [] as { x: number; y: number }[];
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const pad = 2;
		return data.map((v, i) => ({
			x: pad + (i / (data.length - 1)) * (width - pad * 2),
			y: height - pad - ((v - min) / range) * (height - pad * 2)
		}));
	});

	const line = $derived(points.map((p) => `${p.x},${p.y}`).join(' '));
	const area = $derived(
		points.length
			? `M ${points[0].x},${height} L ${line.replace(/ /g, ' L ')} L ${points[points.length - 1].x},${height} Z`
			: ''
	);
</script>

<svg
	viewBox={`0 0 ${width} ${height}`}
	width={width}
	height={height}
	class={['overflow-visible', tones[tone], className]}
	aria-hidden="true"
	role="img"
>
	{#if fill && area}
		<path d={area} class="stroke-none" />
	{/if}
	{#if line}
		<polyline
			points={line}
			fill="none"
			stroke="currentColor"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
			class="[stroke:inherit]"
		/>
	{/if}
</svg>
