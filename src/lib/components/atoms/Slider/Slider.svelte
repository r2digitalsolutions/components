<script lang="ts">
	interface SliderProps {
		id?: string;
		name?: string;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		disabled?: boolean;
		showValue?: boolean;
		valuePosition?: 'header' | 'tooltip' | 'inline';
		/** Bordered inset control — for UE-style details / inspector panels. */
		variant?: 'default' | 'inset';
		showMarks?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (value: number) => void;
		oninput?: (value: number) => void;
	}

	let {
		id,
		name,
		label,
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(50),
		disabled = false,
		showValue = true,
		valuePosition = 'tooltip',
		variant = 'default',
		showMarks = false,
		unit = '',
		size = 'md',
		class: className = '',
		onchange,
		oninput
	}: SliderProps = $props();

	let isFocused = $state(false);
	let isHovered = $state(false);

	const sliderId = $derived(id ?? `slider-${Math.random().toString(36).slice(2, 9)}`);
	const percentage = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));
	const inset = $derived(variant === 'inset');
	const inlineValue = $derived(showValue && (valuePosition === 'inline' || inset));

	const trackHeightClasses = {
		sm: 'h-1',
		md: 'h-1.5',
		lg: 'h-2'
	};

	const thumbSizeClasses = {
		sm: 'h-3 w-3 -ml-1.5',
		md: 'h-3.5 w-3.5 -ml-[7px]',
		lg: 'h-4 w-4 -ml-2'
	};

	function formatValue(v: number): string {
		if (Number.isInteger(step) && Number.isInteger(v)) return String(v);
		const decimals = String(step).includes('.') ? String(step).split('.')[1]?.length ?? 2 : 2;
		return v.toFixed(Math.min(decimals, 2));
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseFloat(target.value);
		oninput?.(value);
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseFloat(target.value);
		onchange?.(value);
	}
</script>

<div class={['flex w-full select-none flex-col gap-1.5', className]}>
	{#if label || (showValue && valuePosition === 'header' && !inset)}
		<div class="flex items-center justify-between text-sm font-medium">
			{#if label}
				<label for={sliderId} class="text-primary">{label}</label>
			{:else}
				<span></span>
			{/if}
			{#if showValue && valuePosition === 'header' && !inset}
				<span class="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
					{formatValue(value)}{unit}
				</span>
			{/if}
		</div>
	{/if}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={[
			'relative flex w-full items-center gap-2',
			inset &&
				'h-7 rounded-md border border-border bg-surface-overlay/80 px-2 shadow-sm dark:bg-surface-overlay/50',
			!inset && 'py-1.5'
		]}
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
	>
		<div class="relative flex min-w-0 flex-1 cursor-pointer touch-none items-center py-1">
			<!-- Track background -->
			<div
				class={[
					'relative w-full overflow-hidden rounded-full',
					inset ? 'bg-border dark:bg-surface-elevated' : 'bg-border-strong dark:bg-surface-overlay',
					trackHeightClasses[size]
				]}
			>
				<!-- Fill bar -->
				<div class="h-full rounded-full bg-brand-500" style="width: {percentage}%"></div>
			</div>

			<!-- Custom Floating Thumb / Handle -->
			<div
				class={[
					'pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-500 bg-white shadow-md dark:bg-slate-900',
					'transition-[transform,box-shadow] duration-100',
					thumbSizeClasses[size],
					(isFocused || isHovered) && 'scale-110 ring-2 ring-brand-500/25',
					disabled && 'border-gray-400 opacity-50'
				]}
				style="left: {percentage}%"
			>
				<span class="h-1 w-1 rounded-full bg-brand-500"></span>

				{#if showValue && valuePosition === 'tooltip' && !inset && (isHovered || isFocused)}
					<div
						class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-lg animate-in fade-in zoom-in-95 duration-150 dark:bg-slate-100 dark:text-slate-900"
					>
						{formatValue(value)}{unit}
						<div
							class="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-100"
						></div>
					</div>
				{/if}
			</div>

			<!-- Transparent native input for accessibility and drag interaction -->
			<input
				id={sliderId}
				type="range"
				{name}
				{min}
				{max}
				{step}
				{disabled}
				bind:value
				class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
				oninput={handleInput}
				onchange={handleChange}
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
			/>
		</div>

		{#if inlineValue}
			<span
				class="w-9 shrink-0 text-right font-mono text-[10px] font-semibold tabular-nums text-secondary"
				aria-hidden="true"
			>
				{formatValue(value)}{unit}
			</span>
		{/if}
	</div>

	{#if showMarks}
		<div class="-mt-0.5 flex items-center justify-between px-0.5 font-mono text-[10px] text-muted">
			<span>{min}{unit}</span>
			<span>{max}{unit}</span>
		</div>
	{/if}
</div>
