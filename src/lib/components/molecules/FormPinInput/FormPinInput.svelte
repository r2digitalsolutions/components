<script lang="ts">
	import PinInput from '$lib/components/molecules/PinInput/PinInput.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormPinInputProps {
		id?: string;
		name?: string;
		label?: string;
		length?: number;
		value?: string;
		type?: 'text' | 'number' | 'password';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: string) => void;
		oncomplete?: (value: string) => void;
	}

	let {
		id,
		name,
		label,
		length = 4,
		value = $bindable(''),
		type = 'number',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange,
		oncomplete
	}: FormPinInputProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	const pinStatus = $derived<'default' | 'error' | 'success'>(
		resolved.status === 'error'
			? 'error'
			: resolved.status === 'success'
				? 'success'
				: 'default'
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
	<PinInput
		{id}
		{label}
		{length}
		{type}
		disabled={resolved.disabled}
		status={pinStatus}
		helperText={resolved.helperText}
		bind:value
		onchange={handleChange}
		{oncomplete}
	/>
</div>
