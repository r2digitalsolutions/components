<script lang="ts">
	import Select, {
		type SelectOption
	} from '$lib/components/molecules/Select/Select.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormSelectProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		options?: SelectOption[];
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		required?: boolean;
		searchable?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		id,
		name,
		label,
		placeholder = 'Select an option...',
		options = [],
		value = $bindable(''),
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		required = false,
		searchable = false,
		size = 'md',
		bindData = false,
		class: className = '',
		onchange
	}: FormSelectProps = $props();

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
			map: (raw) => (raw !== undefined ? String(raw) : undefined)
		});
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
	<Select
		{id}
		{name}
		{label}
		{placeholder}
		{options}
		disabled={resolved.disabled}
		{required}
		{searchable}
		{size}
		status={resolved.status}
		helperText={resolved.helperText}
		bind:value
		onchange={handleChange}
	/>
</div>
