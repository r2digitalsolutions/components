<script lang="ts">
	type RangeSize = 'sm' | 'md' | 'lg';

	interface RangeSliderProps {
		id?: string;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
		value?: [number, number];
		disabled?: boolean;
		showValue?: boolean;
		unit?: string;
		size?: RangeSize;
		class?: string;
		onchange?: (value: [number, number]) => void;
		oninput?: (value: [number, number]) => void;
	}

	let {
		id,
		label,
		min = 0,
		max = 100,
		step = 1,
		value = $bindable([20, 80]),
		disabled = false,
		showValue = true,
		unit = '',
		size = 'md',
		class: className = '',
		onchange,
		oninput
	}: RangeSliderProps = $props();

	let focusedThumb = $state<'low' | 'high' | null>(null);
	let hoveredThumb = $state<'low' | 'high' | null>(null);
	/** Last interacted thumb stays above when they overlap. */
	let topThumb = $state<'low' | 'high'>('high');

	const baseId = $derived(id ?? `range-${Math.random().toString(36).slice(2, 9)}`);

	const pctLow = $derived(Math.min(100, Math.max(0, ((value[0] - min) / (max - min)) * 100)));
	const pctHigh = $derived(Math.min(100, Math.max(0, ((value[1] - min) / (max - min)) * 100)));

	const trackHeightClasses: Record<RangeSize, string> = {
		sm: 'h-1.5',
		md: 'h-2',
		lg: 'h-3'
	};

	const thumbSizeClasses: Record<RangeSize, string> = {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6'
	};

	const thumbPx = $derived(size === 'sm' ? 16 : size === 'lg' ? 24 : 20);

	function clamp(v: number) {
		return Math.min(max, Math.max(min, v));
	}

	function snap(v: number) {
		return Math.round((v - min) / step) * step + min;
	}

	function setLow(raw: number, emit: 'input' | 'change') {
		const snapped = snap(clamp(raw));
		const next: [number, number] = [Math.min(snapped, value[1] - step), value[1]];
		value = next;
		topThumb = 'low';
		if (emit === 'input') oninput?.(next);
		else onchange?.(next);
	}

	function setHigh(raw: number, emit: 'input' | 'change') {
		const snapped = snap(clamp(raw));
		const next: [number, number] = [value[0], Math.max(snapped, value[0] + step)];
		value = next;
		topThumb = 'high';
		if (emit === 'input') oninput?.(next);
		else onchange?.(next);
	}
</script>

<div class={['flex w-full select-none flex-col gap-2', className]}>
	{#if label || showValue}
		<div class="flex items-center justify-between text-sm font-medium">
			{#if label}
				<label class="text-primary" for="{baseId}-low">{label}</label>
			{:else}
				<span></span>
			{/if}
			{#if showValue}
				<span class="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
					{value[0]}{unit} – {value[1]}{unit}
				</span>
			{/if}
		</div>
	{/if}

	<div
		class="relative flex w-full touch-none items-center py-2"
		style="--thumb-size: {thumbPx}px"
	>
		<!-- Track background -->
		<div
			class={[
				'relative w-full rounded-full bg-border-strong dark:bg-surface-overlay',
				trackHeightClasses[size]
			]}
		>
			<div
				class="absolute h-full rounded-full bg-brand-500"
				style="left:{pctLow}%;width:{pctHigh - pctLow}%"
			></div>
		</div>

		<!-- Visual thumbs (decorative) -->
		<div
			class={[
				'pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-500 bg-white shadow-md dark:bg-slate-900',
				'transition-[transform,box-shadow] duration-100',
				thumbSizeClasses[size],
				(focusedThumb === 'low' || hoveredThumb === 'low') && 'scale-110 ring-4 ring-brand-500/20',
				disabled && 'border-gray-400 opacity-50'
			]}
			style="left:{pctLow}%"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
			{#if showValue && (focusedThumb === 'low' || hoveredThumb === 'low')}
				<div
					class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
				>
					{value[0]}{unit}
					<div
						class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-100"
					></div>
				</div>
			{/if}
		</div>

		<div
			class={[
				'pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-500 bg-white shadow-md dark:bg-slate-900',
				'transition-[transform,box-shadow] duration-100',
				thumbSizeClasses[size],
				(focusedThumb === 'high' || hoveredThumb === 'high') && 'scale-110 ring-4 ring-brand-500/20',
				disabled && 'border-gray-400 opacity-50'
			]}
			style="left:{pctHigh}%"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
			{#if showValue && (focusedThumb === 'high' || hoveredThumb === 'high')}
				<div
					class="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
				>
					{value[1]}{unit}
					<div
						class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-100"
					></div>
				</div>
			{/if}
		</div>

		<!--
			Native inputs: track has pointer-events:none; only thumbs receive hits.
			That way both handles are independently draggable.
		-->
		<input
			id="{baseId}-low"
			type="range"
			class="range-thumb absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
			style="z-index: {topThumb === 'low' ? 4 : 3}"
			{min}
			{max}
			{step}
			{disabled}
			value={value[0]}
			aria-label="Minimum value"
			aria-valuemin={min}
			aria-valuemax={value[1]}
			oninput={(e) => setLow(parseFloat((e.currentTarget as HTMLInputElement).value), 'input')}
			onchange={(e) => setLow(parseFloat((e.currentTarget as HTMLInputElement).value), 'change')}
			onfocus={() => {
				focusedThumb = 'low';
				topThumb = 'low';
			}}
			onblur={() => (focusedThumb = null)}
			onpointerdown={() => (topThumb = 'low')}
			onmouseenter={() => (hoveredThumb = 'low')}
			onmouseleave={() => (hoveredThumb = null)}
		/>
		<input
			id="{baseId}-high"
			type="range"
			class="range-thumb absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed"
			style="z-index: {topThumb === 'high' ? 4 : 3}"
			{min}
			{max}
			{step}
			{disabled}
			value={value[1]}
			aria-label="Maximum value"
			aria-valuemin={value[0]}
			aria-valuemax={max}
			oninput={(e) => setHigh(parseFloat((e.currentTarget as HTMLInputElement).value), 'input')}
			onchange={(e) => setHigh(parseFloat((e.currentTarget as HTMLInputElement).value), 'change')}
			onfocus={() => {
				focusedThumb = 'high';
				topThumb = 'high';
			}}
			onblur={() => (focusedThumb = null)}
			onpointerdown={() => (topThumb = 'high')}
			onmouseenter={() => (hoveredThumb = 'high')}
			onmouseleave={() => (hoveredThumb = null)}
		/>
	</div>

	<div class="mt-[-0.25rem] flex items-center justify-between px-0.5 font-mono text-[11px] text-muted">
		<span>{min}{unit}</span>
		<span>{max}{unit}</span>
	</div>
</div>

<style>
	.range-thumb {
		pointer-events: none;
	}

	.range-thumb::-webkit-slider-runnable-track {
		appearance: none;
		background: transparent;
		height: 100%;
	}

	.range-thumb::-moz-range-track {
		appearance: none;
		background: transparent;
		height: 100%;
		border: none;
	}

	.range-thumb::-webkit-slider-thumb {
		appearance: none;
		pointer-events: auto;
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: 9999px;
		background: transparent;
		border: none;
		/* Larger invisible hit target */
		box-shadow: 0 0 0 8px transparent;
		cursor: pointer;
	}

	.range-thumb::-moz-range-thumb {
		appearance: none;
		pointer-events: auto;
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: 9999px;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.range-thumb:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	.range-thumb:disabled::-moz-range-thumb {
		cursor: not-allowed;
	}
</style>
