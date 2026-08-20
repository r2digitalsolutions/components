<script lang="ts">
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		resolveRemoteInputProps,
		parseRemoteFieldName,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	/**
	 * Kit remote: pass `.as('password').name` as `name`, not the full `.as()` spread
	 * (Kit’s `value` get/set fights local binding).
	 */
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
		bindData?: boolean;
		inputName?: string;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		defaultValue?: unknown;
		type?: string;
		'aria-invalid'?: boolean | 'true' | 'false';
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
		inputName,
		class: className = '',
		oninput,
		onchange,
		defaultValue: _kitDefaultValue = undefined,
		type: _kitType = undefined,
		'aria-invalid': _ariaInvalid = undefined
	}: FormPasswordInputProps = $props();

	const form = getFormContext();
	const parsed = $derived(parseRemoteFieldName(name, form?.remoteFormId));
	const logicalName = $derived(parsed.logicalName);

	const resolved = $derived(
		resolveFormFieldState({
			name: logicalName,
			errorMessage,
			helperText,
			status,
			disabled,
			form
		})
	);

	const htmlName = $derived.by(() => {
		if (inputName) return inputName;
		if (parsed.isEncoded) return parsed.htmlName;
		return resolveRemoteInputProps(form?.remoteFormId, name, 'password').name;
	});

	$effect(() => {
		if (!bindData || !logicalName || !form) return;
		applyFormDataSync({
			fromCtx: form.data[logicalName],
			getLocal: () => value,
			setLocal: (v) => {
				value = v;
			},
			map: (raw) => (raw !== undefined ? String(raw) : undefined)
		});
	});

	function handleInput(e: Event) {
		if (bindData && logicalName && form) {
			form.setData(logicalName, (e.currentTarget as HTMLInputElement).value);
			form.clearError(logicalName);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	<PasswordInput
		{id}
		name={htmlName}
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
