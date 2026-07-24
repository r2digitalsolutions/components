<script lang="ts">
	interface RadioProps {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		helperText?: string;
		id?: string;
		name?: string;
		value: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		checked = false,
		disabled = false,
		label,
		helperText,
		id,
		name,
		value,
		size = 'md',
		class: className = '',
		onchange
	}: RadioProps = $props();

	const inputId = $derived(id ?? `radio-${Math.random().toString(36).slice(2, 9)}`);

	const sizeClasses = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const dotSizes = {
		sm: 'h-1.5 w-1.5',
		md: 'h-2 w-2',
		lg: 'h-2.5 w-2.5'
	};

	const labelSizeClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};

	function handleChange() {
		onchange?.(value);
	}
</script>

<div class={['flex items-start gap-2.5', className]}>
	<div class="flex items-center" style="padding-top: 1px">
		<div class="relative flex items-center justify-center">
			<input
				id={inputId}
				type="radio"
				{name}
				{value}
				{disabled}
				{checked}
				class={[
					'peer shrink-0 cursor-pointer border-2 border-border bg-surface-elevated rounded-full appearance-none transition-all duration-150',
					'checked:border-brand-500 checked:bg-brand-500',
					'hover:border-brand-400',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
					'disabled:cursor-not-allowed disabled:opacity-50',
					sizeClasses[size]
				]}
				onchange={handleChange}
			/>
			<!-- Inner white dot when checked -->
			<span
				class={[
					'absolute rounded-full bg-white transition-transform duration-150 pointer-events-none transform scale-0 peer-checked:scale-100',
					dotSizes[size]
				]}
			></span>
		</div>
	</div>

	{#if label || helperText}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<label
					for={inputId}
					class={[
						'font-medium text-primary cursor-pointer',
						labelSizeClasses[size],
						disabled && 'cursor-not-allowed opacity-50'
					]}
				>
					{label}
				</label>
			{/if}
			{#if helperText}
				<p class="text-xs text-muted">{helperText}</p>
			{/if}
		</div>
	{/if}
</div>
