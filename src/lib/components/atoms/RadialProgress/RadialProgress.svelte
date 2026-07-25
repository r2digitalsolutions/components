<script lang="ts">
	import type { Snippet } from 'svelte';

	interface RadialProgressProps {
		value?: number;
		max?: number;
		size?: number;
		strokeWidth?: number;
		color?: string;
		trackColor?: string;
		/** Show centered percentage */
		showValue?: boolean;
		/** Warn color when remaining (max-value) <= threshold — useful for timers */
		warnBelow?: number;
		warnColor?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		value = 0,
		max = 100,
		size = 120,
		strokeWidth = 8,
		color = 'var(--color-brand-500, #6366f1)',
		trackColor = 'var(--color-border, #e4e4e7)',
		showValue = true,
		warnBelow,
		warnColor = '#ef4444',
		class: className = '',
		children
	}: RadialProgressProps = $props();

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const clamped = $derived(Math.min(max, Math.max(0, value)));
	const pct = $derived(max > 0 ? clamped / max : 0);
	const offset = $derived(circumference * (1 - pct));
	const remaining = $derived(max - clamped);
	const stroke = $derived(
		warnBelow !== undefined && remaining <= warnBelow ? warnColor : color
	);
</script>

<div
	class={['relative inline-flex items-center justify-center', className]}
	style:width={`${size}px`}
	style:height={`${size}px`}
	role="progressbar"
	aria-valuenow={clamped}
	aria-valuemin={0}
	aria-valuemax={max}
>
	<svg width={size} height={size} class="-rotate-90" aria-hidden="true">
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={trackColor}
			stroke-width={strokeWidth}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={stroke}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			class="transition-[stroke-dashoffset,stroke] duration-300 ease-out"
		/>
	</svg>
	<div class="absolute inset-0 flex flex-col items-center justify-center text-center">
		{#if children}
			{@render children()}
		{:else if showValue}
			<span class="text-lg font-semibold tabular-nums text-primary">
				{Math.round(pct * 100)}%
			</span>
		{/if}
	</div>
</div>
