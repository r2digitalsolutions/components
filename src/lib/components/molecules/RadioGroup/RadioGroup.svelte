<script lang="ts">
	import Radio from '$lib/components/atoms/Radio/Radio.svelte';

	interface RadioOption {
		value: string;
		label: string;
		helperText?: string;
		disabled?: boolean;
	}

	interface RadioGroupProps {
		name?: string;
		label?: string;
		value?: string;
		options?: RadioOption[];
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'warning';
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		name,
		label,
		value = $bindable(''),
		options = [],
		orientation = 'vertical',
		size = 'md',
		status = 'default',
		helperText,
		disabled = false,
		required = false,
		class: className = '',
		onchange
	}: RadioGroupProps = $props();

	const groupName = $derived(name ?? `radiogroup-${Math.random().toString(36).slice(2, 9)}`);

	function handleSelect(selectedValue: string) {
		value = selectedValue;
		onchange?.(selectedValue);
	}
</script>

<div class={['flex flex-col gap-2 w-full', className]} role="radiogroup" aria-label={label}>
	{#if label}
		<span class="text-sm font-medium text-primary">
			{label}
			{#if required}
				<span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
			{/if}
		</span>
	{/if}

	<div
		class={[
			'flex gap-3',
			orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center gap-5'
		]}
	>
		{#each options as option (option.value)}
			<Radio
				name={groupName}
				value={option.value}
				label={option.label}
				helperText={option.helperText}
				disabled={disabled || option.disabled}
				checked={value === option.value}
				{size}
				onchange={handleSelect}
			/>
		{/each}
	</div>

	{#if helperText}
		<p class={['text-xs leading-relaxed', status === 'error' ? 'text-red-500' : 'text-muted']}>
			{helperText}
		</p>
	{/if}
</div>
