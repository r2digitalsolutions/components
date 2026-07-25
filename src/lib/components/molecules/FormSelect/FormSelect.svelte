<script lang="ts">
	import Select, {
		type SelectOption
	} from '$lib/components/molecules/Select/Select.svelte';
	import { getFormContext } from '$lib/utils/formContext.js';

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

	const contextError = $derived(
		errorMessage ?? (name && form ? form.getError(name) : undefined)
	);
	const resolvedStatus = $derived(contextError ? 'error' : status);
	const resolvedHelperText = $derived(contextError ?? helperText);
	const resolvedDisabled = $derived(disabled || Boolean(form?.loading) || Boolean(form?.disabled));

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
	<Select
		{id}
		{name}
		{label}
		{placeholder}
		{options}
		disabled={resolvedDisabled}
		{required}
		{searchable}
		{size}
		status={resolvedStatus}
		helperText={resolvedHelperText}
		bind:value
		onchange={handleChange}
	/>
</div>
