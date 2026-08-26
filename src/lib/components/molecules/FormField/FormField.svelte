<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import type { Snippet } from 'svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		resolveRemoteInputProps,
		parseRemoteFieldName,
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
	 *
	 * Kit remote: pass the encoded `name` (and `type`) from `.as()`, **not** the full
	 * spread — Kit’s `value` get/set fights `$bindable` and can loop.
	 *
	 * @example
	 * ```svelte
	 * <FormField
	 *   name={login_user.fields.email.as('email').name}
	 *   type="email"
	 *   label="Email"
	 * />
	 * ```
	 */
	interface FormFieldProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'time';
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
		 * Uses the logical field name (strips Kit `/formId` when present).
		 */
		bindData?: boolean;
		/**
		 * Override HTML `name` if logical `name` is separate.
		 * Prefer passing Kit `.as(...).name` as `name` instead.
		 */
		inputName?: string;
		leadIcon?: Snippet;
		trailIcon?: Snippet;
		control?: Snippet<[FormFieldControlProps]>;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		/** Absorbed if a Kit `.as()` object is spread by mistake. */
		defaultValue?: unknown;
		'aria-invalid'?: boolean | 'true' | 'false';
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
		inputName,
		leadIcon,
		trailIcon,
		control,
		class: className = '',
		oninput,
		onchange,
		defaultValue: _kitDefaultValue = undefined,
		'aria-invalid': _ariaInvalid = undefined
	}: FormFieldProps = $props();

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

	/** HTML `name`: override → encoded as-is → else encode with remoteFormId. */
	const htmlName = $derived.by(() => {
		if (inputName) return inputName;
		if (parsed.isEncoded) return parsed.htmlName;
		return resolveRemoteInputProps(form?.remoteFormId, name, type).name;
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

	function setValue(next: string) {
		value = next;
		if (bindData && logicalName && form) {
			form.setData(logicalName, next);
			form.clearError(logicalName);
		}
	}

	function clearFieldError() {
		if (logicalName && form) form.clearError(logicalName);
	}

	function handleInput(e: Event) {
		if (bindData && logicalName && form) {
			form.setData(logicalName, (e.currentTarget as HTMLInputElement).value);
			form.clearError(logicalName);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	{#if control}
		{@render control({
			id,
			name: logicalName,
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
			name={htmlName}
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
