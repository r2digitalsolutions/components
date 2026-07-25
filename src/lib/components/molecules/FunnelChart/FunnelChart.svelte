<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	export interface FunnelStep {
		label: string;
		value: number;
		color?: string;
	}

	interface FunnelChartProps {
		data?: FunnelStep[];
		/** Show conversion % from previous step */
		showConversion?: boolean;
		showValues?: boolean;
		unit?: string;
		height?: number;
		class?: string;
		onselect?: (step: FunnelStep, index: number) => void;
	}

	const palette = [
		'var(--color-brand-500, #6366f1)',
		'#818cf8',
		'#a78bfa',
		'#c084fc',
		'#e879f9',
		'#f472b6'
	];

	let {
		data = [],
		showConversion = true,
		showValues = true,
		unit = '',
		height = 48,
		class: className = '',
		onselect
	}: FunnelChartProps = $props();

	let active = $state<number | null>(null);

	const max = $derived(Math.max(1, ...data.map((d) => d.value)));
	const steps = $derived(
		data.map((d, i) => {
			const prev = i === 0 ? d.value : data[i - 1].value;
			const conversion = prev > 0 ? (d.value / prev) * 100 : 0;
			const widthPct = (d.value / max) * 100;
			return {
				...d,
				color: d.color ?? palette[i % palette.length],
				conversion,
				widthPct
			};
		})
	);
</script>

<div class={['flex flex-col gap-2', className]} role="list" aria-label="Funnel chart">
	{#each steps as step, i (step.label + i)}
		{@const isActive = active === i}
		<div class="flex flex-col gap-1" role="listitem">
			{#if showConversion && i > 0}
				<div class="flex items-center justify-center gap-1 py-0.5 text-[11px] text-muted">
					<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
					{step.conversion.toFixed(0)}% conversion
				</div>
			{/if}
			<button
				type="button"
				class={[
					'group relative mx-auto flex w-full max-w-full items-center justify-between overflow-hidden rounded-lg px-4 text-left transition-all',
					isActive ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface' : '',
					onselect || true ? 'cursor-pointer' : ''
				]}
				style:height={`${height}px`}
				style:width={`${Math.max(18, step.widthPct)}%`}
				style:background={step.color}
				onclick={() => {
					active = active === i ? null : i;
					onselect?.(step, i);
				}}
			>
				<span class="relative z-10 truncate text-sm font-medium text-white drop-shadow-sm">
					{step.label}
				</span>
				{#if showValues}
					<span class="relative z-10 shrink-0 text-sm font-semibold text-white drop-shadow-sm">
						{formatTick(step.value)}{unit}
					</span>
				{/if}
			</button>
		</div>
	{/each}
</div>
