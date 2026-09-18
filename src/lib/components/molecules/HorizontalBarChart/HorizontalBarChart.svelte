<script lang="ts">
	import { formatTick } from '$lib/utils/chart.js';

	export interface HBarPoint {
		label: string;
		value: number;
		color?: string;
	}

	interface HorizontalBarChartProps {
		data?: HBarPoint[];
		/** Kept for API compat — layout is CSS, not SVG viewBox */
		barWidth?: number;
		/** Kept for API compat — label column uses CSS */
		labelWidth?: number;
		rowHeight?: number;
		interactive?: boolean;
		showValues?: boolean;
		unit?: string;
		class?: string;
	}

	const {
		data = [],
		labelWidth = 88,
		rowHeight = 36,
		interactive = true,
		showValues = true,
		unit = '',
		class: className = ''
	}: HorizontalBarChartProps = $props();

	const color = 'var(--color-brand-500, #6366f1)';

	let tipIndex = $state<number | null>(null);

	const max = $derived(Math.max(...data.map((d) => d.value), 1));

	function select(i: number) {
		if (!interactive) return;
		tipIndex = tipIndex === i ? null : i;
	}
</script>

<div
	class={['relative w-full select-none', className]}
	role="img"
	aria-label="Horizontal bar chart"
>
	<ul class="flex flex-col" style:gap="2px">
		{#each data as r, i (r.label + i)}
			{@const ratio = Math.max(0, r.value) / max}
			{@const pct = Math.max(r.value > 0 ? 1.5 : 0, ratio * 100)}
			<li>
				<button
					type="button"
					class={[
						'grid w-full items-center gap-2 rounded-lg px-0.5 py-0.5 text-left transition-opacity',
						interactive && 'hover:bg-surface-overlay/80 cursor-pointer',
						!interactive && 'cursor-default',
						tipIndex != null && tipIndex !== i && 'opacity-40'
					]}
					style:min-height={`${rowHeight}px`}
					style:grid-template-columns={`minmax(0, ${labelWidth}px) minmax(0, 1fr) auto`}
					onclick={() => select(i)}
					disabled={!interactive}
				>
					<span
						class="text-secondary truncate text-right text-xs leading-snug"
						title={r.label}
					>
						{r.label}
					</span>
					<span class="bg-surface-overlay relative block h-4 overflow-hidden rounded-md">
						<span
							class="absolute inset-y-0 left-0 rounded-md transition-[width]"
							style:width={`${pct}%`}
							style:background={r.color ?? color}
						></span>
					</span>
					{#if showValues}
						<span class="text-secondary min-w-[2ch] text-right text-xs font-semibold tabular-nums">
							{formatTick(r.value, 0)}{unit}
						</span>
					{/if}
				</button>
			</li>
		{/each}
	</ul>

	{#if tipIndex != null && data[tipIndex]}
		{@const t = data[tipIndex]}
		<div
			class="pointer-events-none absolute top-0 right-0 z-10 rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 shadow-lg"
			role="status"
		>
			<p class="text-[10px] font-medium text-muted">{t.label}</p>
			<p class="text-sm font-semibold tabular-nums text-primary">{t.value}{unit}</p>
		</div>
	{/if}
</div>
