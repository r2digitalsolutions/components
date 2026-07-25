<script lang="ts">
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

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
		disabled={resolved.disabled}
		{required}
		{size}
		status={resolved.status}
		helperText={resolved.helperText}
		oninput={handleInput}
		{onchange}
		bind:value
	/>
</div>
