<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import type { Snippet } from 'svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync,
		type FormFieldStatus
	} from '$lib/utils/formContext.js';

	export interface FormFieldControlProps {
		id?: string;
		name?: string;
		value: string;
		status: FormFieldStatus;
		helperText?: string;
		disabled: boolean;
		required: boolean;
		setValue: (next: string) => void;
		clearError: () => void;
	}

	/**
	 * Form-bound text input (email, tel, url, search, …).
	 * There is no separate `FormTextInput` — use this component.
	 */
	interface FormFieldProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: FormFieldStatus;
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
		/**
		 * Custom control instead of the default `<Input>`.
		 * Receives resolved status / disabled / helpers from form context.
		 */
		control?: Snippet<[FormFieldControlProps]>;
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
		control,
		class: className = '',
		oninput,
		onchange
	}: FormFieldProps = $props();

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

	function setValue(next: string) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
	}

	function clearFieldError() {
		if (name && form) form.clearError(name);
	}

	function handleInput(e: Event) {
		if (bindData && name && form) {
			form.setData(name, (e.currentTarget as HTMLInputElement).value);
			form.clearError(name);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	{#if control}
		{@render control({
			id,
			name,
			value,
			status: resolved.status,
			helperText: resolved.helperText,
			disabled: resolved.disabled,
			required,
			setValue,
			clearError: clearFieldError
		})}
	{:else}
		<Input
			{id}
			{name}
			{label}
			{placeholder}
			{type}
			disabled={resolved.disabled}
			{readonly}
			{required}
			{clearable}
			{size}
			{leadIcon}
			{trailIcon}
			oninput={handleInput}
			{onchange}
			status={resolved.status}
			helperText={resolved.helperText}
			bind:value
		/>
	{/if}
</div>
