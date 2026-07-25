<script lang="ts">
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import { getFormContext } from '$lib/utils/formContext.js';

	interface FormPasswordInputProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		required?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		name,
		label = 'Password',
		placeholder = 'Enter password',
		value = $bindable(''),
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		required = false,
		size = 'md',
		bindData = false,
		class: className = '',
		oninput,
		onchange
	}: FormPasswordInputProps = $props();

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

	function handleInput(e: Event) {
		if (bindData && name && form) {
			form.setData(name, (e.currentTarget as HTMLInputElement).value);
			form.clearError(name);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	<PasswordInput
		{id}
		{name}
		{label}
		{placeholder}
		disabled={resolvedDisabled}
		{required}
		{size}
		status={resolvedStatus}
		helperText={resolvedHelperText}
		oninput={handleInput}
		{onchange}
		bind:value
	/>
</div>
