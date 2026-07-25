<script lang="ts">
	import RadioGroup from '$lib/components/molecules/RadioGroup/RadioGroup.svelte';
	import {
		getFormContext,
		resolveFormFieldState
	} from '$lib/utils/formContext.js';

	interface RadioOption {
		value: string;
		label: string;
		helperText?: string;
		disabled?: boolean;
	}

	interface FormRadioGroupProps {
		name?: string;
		label?: string;
		value?: string;
		options?: RadioOption[];
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		required?: boolean;
		bindData?: boolean;
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
		errorMessage,
		disabled = false,
		required = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormRadioGroupProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, status, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.data[name];
		if (fromCtx !== undefined && String(fromCtx) !== value) {
			value = String(fromCtx);
		}
	});

	function handleChange(next: string) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full', className]}>
	<RadioGroup
		{name}
		{label}
		{options}
		{orientation}
		{size}
		{required}
		disabled={resolved.disabled}
		status={resolved.status === 'success' ? 'default' : resolved.status}
		helperText={resolved.helperText}
		bind:value
		onchange={handleChange}
	/>
</div>
