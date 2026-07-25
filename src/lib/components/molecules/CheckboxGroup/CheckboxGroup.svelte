<script lang="ts">
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';

	export interface CheckboxOption {
		value: string;
		label: string;
		helperText?: string;
		disabled?: boolean;
	}

	interface CheckboxGroupProps {
		options?: CheckboxOption[];
		value?: string[];
		name?: string;
		label?: string;
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options = [],
		value = $bindable<string[]>([]),
		name,
		label,
		orientation = 'vertical',
		size = 'md',
		disabled = false,
		class: className = '',
		onchange
	}: CheckboxGroupProps = $props();

	function isChecked(optionValue: string) {
		return value.includes(optionValue);
	}

	function toggle(optionValue: string, checked: boolean) {
		value = checked ? [...value, optionValue] : value.filter((v) => v !== optionValue);
		onchange?.(value);
	}
</script>

<fieldset class={['min-w-0', className]} {disabled}>
	{#if label}
		<legend class="mb-2 text-sm font-medium text-primary">{label}</legend>
	{/if}
	<div
		class={[
			'flex',
			orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-4 gap-y-2' : 'flex-col gap-2'
		]}
		role="group"
		aria-label={label}
	>
		{#each options as option (option.value)}
			<Checkbox
				{name}
				value={option.value}
				label={option.label}
				helperText={option.helperText}
				{size}
				disabled={disabled || option.disabled}
				checked={isChecked(option.value)}
				onchange={(checked) => toggle(option.value, checked)}
			/>
		{/each}
	</div>
</fieldset>
