<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import type { Snippet } from 'svelte';
	import { getFormContext } from '$lib/utils/formContext.js';

	interface FormFieldProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		clearable?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/**
		 * When true and inside `<Form>`, keep `value` in sync with `form.data[name]`.
		 * Requires `name`.
		 */
		bindData?: boolean;
		leadIcon?: Snippet;
		trailIcon?: Snippet;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(''),
		type = 'text',
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		readonly = false,
		required = false,
		clearable = false,
		size = 'md',
		bindData = false,
		leadIcon,
		trailIcon,
		class: className = '',
		oninput,
		onchange
	}: FormFieldProps = $props();

	const form = getFormContext();

	const contextError = $derived(
		errorMessage ?? (name && form ? form.getError(name) : undefined)
	);
	const resolvedStatus = $derived(contextError ? 'error' : status);
	const resolvedHelperText = $derived(contextError ?? helperText);
	const resolvedDisabled = $derived(disabled || Boolean(form?.loading) || Boolean(form?.disabled));

	// Seed / mirror into Form data bag
	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.getData<string>(name);
		if (fromCtx !== undefined && fromCtx !== value) {
			value = String(fromCtx);
		}
	});

	function handleInput(e: Event) {
		if (bindData && name && form) {
			form.setData(name, (e.currentTarget as HTMLInputElement).value);
			form.clearError(name);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	<Input
		{id}
		{name}
		{label}
		{placeholder}
		{type}
		disabled={resolvedDisabled}
		{readonly}
		{required}
		{clearable}
		{size}
		{leadIcon}
		{trailIcon}
		oninput={handleInput}
		{onchange}
		status={resolvedStatus}
		helperText={resolvedHelperText}
		bind:value
	/>
</div>
