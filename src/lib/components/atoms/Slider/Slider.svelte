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
		unit = '',
		size = 'md',
		class: className = '',
		onchange,
		oninput
	}: SliderProps = $props();

	const sliderId = $derived(id ?? `slider-${Math.random().toString(36).slice(2, 9)}`);
	const percentage = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));

	const heightClasses = {
		sm: 'h-1.5',
		md: 'h-2',
		lg: 'h-3'
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

<div class={['flex flex-col gap-2 w-full', className]}>
	{#if label || showValue}
		<div class="flex items-center justify-between text-sm font-medium">
			{#if label}
				<label for={sliderId} class="text-primary">{label}</label>
			{:else}
				<span></span>
			{/if}
			{#if showValue}
				<span class="text-brand-600 dark:text-brand-400 font-semibold font-mono text-xs bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
					{value}{unit}
				</span>
			{/if}
		</div>
	{/if}

	<div class="relative flex items-center w-full touch-none select-none">
		<!-- Track background -->
		<div class={['w-full rounded-full bg-border-strong overflow-hidden relative', heightClasses[size]]}>
			<!-- Fill bar -->
			<div
				class="h-full bg-brand-500 rounded-full transition-all duration-75"
				style="width: {percentage}%"
			></div>
		</div>

		<!-- Native range input transparent overlay -->
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
		/>
	</div>
</div>
