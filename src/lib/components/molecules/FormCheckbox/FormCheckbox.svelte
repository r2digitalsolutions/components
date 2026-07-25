<script lang="ts">
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';
	import { getFormContext } from '$lib/utils/formContext.js';

	interface FormCheckboxProps {
		id?: string;
		name?: string;
		label?: string;
		helperText?: string;
		errorMessage?: string;
		checked?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		value?: string;
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		class?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		id,
		name,
		label,
		helperText,
		errorMessage,
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		value,
		bindData = false,
		class: className = '',
		onchange
	}: FormCheckboxProps = $props();

	const form = getFormContext();

	const contextError = $derived(
		errorMessage ?? (name && form ? form.getError(name) : undefined)
	);
	const resolvedDisabled = $derived(disabled || Boolean(form?.loading) || Boolean(form?.disabled));

	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.data[name];
		if (typeof fromCtx === 'boolean' && fromCtx !== checked) {
			checked = fromCtx;
		}
	});

	function handleChange(next: boolean) {
		checked = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['flex w-full flex-col gap-1', className]}>
	<Checkbox
		{id}
		{name}
		{label}
		{value}
		{size}
		disabled={resolvedDisabled}
		bind:checked
		onchange={handleChange}
	/>
	{#if contextError}
		<FormError message={contextError} />
	{:else if helperText}
		<FieldHint text={helperText} />
	{/if}
</div>
