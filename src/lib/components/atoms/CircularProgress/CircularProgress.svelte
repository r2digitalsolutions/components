<script lang="ts">
	type CPVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
	type CPSize = 'sm' | 'md' | 'lg' | 'xl';

	interface CircularProgressProps {
		value?: number;
		max?: number;
		size?: CPSize | number;
		strokeWidth?: number;
		indeterminate?: boolean;
		variant?: CPVariant;
		showValue?: boolean;
		label?: string;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'md',
		strokeWidth,
		indeterminate = false,
		variant = 'primary',
		showValue = false,
		label,
		class: className = ''
	}: CircularProgressProps = $props();

	const sizeMap: Record<CPSize, number> = { sm: 40, md: 56, lg: 80, xl: 112 };
	const px = $derived(typeof size === 'number' ? size : sizeMap[size]);
	const sw = $derived(strokeWidth ?? Math.max(3, Math.round(px * 0.1)));
	const r = $derived((px - sw) / 2);
	const circ = $derived(2 * Math.PI * r);
	const pct = $derived(indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100)));
	const dashoffset = $derived(circ * (1 - pct / 100));

	const variantColors: Record<CPVariant, string> = {
		primary: 'stroke-brand-500',
		success: 'stroke-green-500',
		warning: 'stroke-amber-500',
		error: 'stroke-red-500',
		info: 'stroke-sky-500'
	};

	const variantTextColors: Record<CPVariant, string> = {
		primary: 'text-brand-600 dark:text-brand-400',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-amber-600 dark:text-amber-400',
		error: 'text-red-600 dark:text-red-400',
		info: 'text-sky-600 dark:text-sky-400'
	};

	const fontSize = $derived(px <= 40 ? 'text-[10px]' : px <= 56 ? 'text-xs' : px <= 80 ? 'text-sm' : 'text-base');
</script>

<div
	class={['inline-flex flex-col items-center gap-2', className]}
	role="progressbar"
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-label={label ?? 'Progress'}
>
	<div class="relative" style="width:{px}px;height:{px}px;">
		<svg
			width={px}
			height={px}
			viewBox="0 0 {px} {px}"
			fill="none"
			class={indeterminate ? 'animate-spin' : ''}
			aria-hidden="true"
		>
			<!-- Track -->
			<circle
				cx={px / 2}
				cy={px / 2}
				{r}
				stroke-width={sw}
				class="stroke-border-strong dark:stroke-surface-overlay"
			/>
			<!-- Fill -->
			<circle
				cx={px / 2}
				cy={px / 2}
				{r}
				stroke-width={sw}
				stroke-linecap="round"
				stroke-dasharray={circ}
				stroke-dashoffset={indeterminate ? circ * 0.75 : dashoffset}
				transform="rotate(-90 {px / 2} {px / 2})"
				class={['transition-[stroke-dashoffset] duration-500 ease-out', variantColors[variant]]}
			/>
		</svg>

		{#if showValue && !indeterminate}
			<div
				class={[
					'absolute inset-0 flex items-center justify-center font-bold font-mono',
					fontSize,
					variantTextColors[variant]
				]}
				aria-hidden="true"
			>
				{Math.round(pct)}%
			</div>
		{/if}
	</div>

	{#if label}
		<span class="text-xs text-secondary text-center leading-tight">{label}</span>
	{/if}
</div>
