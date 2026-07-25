<script lang="ts">
	type MeterTone = 'default' | 'success' | 'warning' | 'error' | 'brand';

	interface MeterProps {
		value: number;
		min?: number;
		max?: number;
		label?: string;
		showValue?: boolean;
		tone?: MeterTone;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		value,
		min = 0,
		max = 100,
		label,
		showValue = true,
		tone = 'default',
		size = 'md',
		class: className = ''
	}: MeterProps = $props();

	const pct = $derived(
		Math.min(100, Math.max(0, ((value - min) / (max - min || 1)) * 100))
	);

	const tones: Record<MeterTone, string> = {
		default: 'bg-secondary',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		brand: 'bg-brand-500'
	};

	const heights = {
		sm: 'h-1.5',
		md: 'h-2.5',
		lg: 'h-3.5'
	};
</script>

<div class={['w-full space-y-1.5', className]}>
	{#if label || showValue}
		<div class="flex items-center justify-between gap-3 text-xs">
			{#if label}
				<span class="font-medium text-secondary">{label}</span>
			{:else}
				<span></span>
			{/if}
			{#if showValue}
				<span class="tabular-nums text-muted">{Math.round(pct)}%</span>
			{/if}
		</div>
	{/if}
	<div
		class={['w-full overflow-hidden rounded-full bg-surface-overlay', heights[size]]}
		role="meter"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label ?? 'Meter'}
	>
		<div
			class={['h-full rounded-full transition-[width] duration-300 ease-out', tones[tone]]}
			style="width: {pct}%"
		></div>
	</div>
</div>
