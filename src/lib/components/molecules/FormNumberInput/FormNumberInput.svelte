<script lang="ts">
	import NumberInput from '$lib/components/molecules/NumberInput/NumberInput.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormNumberInputProps {
		name?: string;
		label?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		controls?: 'none' | 'stacked' | 'sides';
		bindData?: boolean;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		name,
		label,
		value = $bindable(0),
		min,
		max,
		step = 1,
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		size = 'md',
		controls = 'sides',
		bindData = false,
		class: className = '',
		onchange
	}: FormNumberInputProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, status, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => value,
			setLocal: (v) => {
				value = v;
			},
			map: (raw) => (typeof raw === 'number' ? raw : undefined)
		});
	});

	function handleChange(next: number) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full', className]}>
	<NumberInput
		{label}
		{min}
		{max}
		{step}
		{size}
		{controls}
		disabled={resolved.disabled}
		status={resolved.status}
		helperText={resolved.helperText}
		bind:value
		onchange={handleChange}
	/>
</div>
