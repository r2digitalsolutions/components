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
		valuePosition?: 'header' | 'tooltip';
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

	const trackHeightClasses = {
		sm: 'h-1.5',
		md: 'h-2',
		lg: 'h-3'
	};

	const thumbSizeClasses = {
		sm: 'h-4 w-4 -ml-2',
		md: 'h-5 w-5 -ml-2.5',
		lg: 'h-6 w-6 -ml-3'
	};

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

<div class={['flex flex-col gap-2 w-full select-none', className]}>
	{#if label || (showValue && valuePosition === 'header')}
		<div class="flex items-center justify-between text-sm font-medium">
			{#if label}
				<label for={sliderId} class="text-primary">{label}</label>
			{:else}
				<span></span>
			{/if}
			{#if showValue && valuePosition === 'header'}
				<span class="text-xs font-semibold font-mono text-brand-600 dark:text-brand-400">
					{value}{unit}
				</span>
			{/if}
		</div>
	{/if}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative flex items-center w-full py-2 cursor-pointer touch-none"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
	>
		<!-- Track background -->
		<div
			class={[
				'w-full rounded-full bg-border-strong dark:bg-surface-overlay relative overflow-hidden transition-all',
				trackHeightClasses[size]
			]}
		>
			<!-- Fill bar -->
			<div
				class="h-full bg-brand-500 rounded-full transition-all duration-75"
				style="width: {percentage}%"
			></div>
		</div>

		<!-- Custom Floating Thumb / Handle -->
		<div
			class={[
				'absolute top-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-md transition-transform duration-100 pointer-events-none flex items-center justify-center',
				thumbSizeClasses[size],
				(isFocused || isHovered) && 'scale-110 ring-4 ring-brand-500/20',
				disabled && 'opacity-50 border-gray-400'
			]}
			style="left: {percentage}%"
		>
			<!-- Inner brand dot -->
			<span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>

			<!-- Floating Tooltip directly above thumb -->
			{#if showValue && valuePosition === 'tooltip' && (isHovered || isFocused)}
				<div
					class="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold font-mono shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150"
				>
					{value}{unit}
					<!-- Tooltip arrow -->
					<div
						class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"
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
			class="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed h-full z-10"
			oninput={handleInput}
			onchange={handleChange}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
		/>
	</div>

	{#if showMarks}
		<div class="flex items-center justify-between text-[11px] font-mono text-muted -mt-1 px-0.5">
			<span>{min}{unit}</span>
			<span>{max}{unit}</span>
		</div>
	{/if}
</div>
