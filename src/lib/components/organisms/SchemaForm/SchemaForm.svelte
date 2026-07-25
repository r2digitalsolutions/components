<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormTextarea from '$lib/components/molecules/FormTextarea/FormTextarea.svelte';
	import FormSelect from '$lib/components/molecules/FormSelect/FormSelect.svelte';
	import FormToggle from '$lib/components/molecules/FormToggle/FormToggle.svelte';
	import FormCheckbox from '$lib/components/molecules/FormCheckbox/FormCheckbox.svelte';
	import FormPasswordInput from '$lib/components/molecules/FormPasswordInput/FormPasswordInput.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import RadioGroup from '$lib/components/molecules/RadioGroup/RadioGroup.svelte';
	import MultiSelect from '$lib/components/molecules/MultiSelect/MultiSelect.svelte';
	import DatePicker from '$lib/components/molecules/DatePicker/DatePicker.svelte';
	import type { FormErrors } from '$lib/utils/formContext.js';

	export type SchemaFieldType =
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'tel'
		| 'url'
		| 'textarea'
		| 'select'
		| 'toggle'
		| 'checkbox'
		| 'date'
		| 'radio'
		| 'multiselect';

	export interface SchemaFieldOption {
		value: string;
		label: string;
	}

	export interface SchemaField {
		name: string;
		label: string;
		type?: SchemaFieldType;
		placeholder?: string;
		helperText?: string;
		required?: boolean;
		options?: SchemaFieldOption[];
		/** Group heading before this field */
		section?: string;
		defaultValue?: string | boolean | number | string[];
	}

	export type SchemaFormValue = string | boolean | number | string[];
	export type SchemaFormValues = Record<string, SchemaFormValue>;

	interface SchemaFormProps {
		schema?: SchemaField[];
		values?: SchemaFormValues;
		errors?: FormErrors;
		title?: string;
		description?: string;
		submitLabel?: string;
		cancelLabel?: string;
		showCancel?: boolean;
		loading?: boolean;
		class?: string;
		onsubmit?: (values: SchemaFormValues) => void;
		oncancel?: () => void;
	}

	let {
		schema = [],
		values = $bindable<SchemaFormValues>({}),
		errors = $bindable<FormErrors>({}),
		title,
		description,
		submitLabel = 'Save',
		cancelLabel = 'Cancel',
		showCancel = false,
		loading = false,
		class: className = '',
		onsubmit,
		oncancel
	}: SchemaFormProps = $props();

	$effect.pre(() => {
		const next = { ...values };
		let changed = false;
		for (const field of schema) {
			if (next[field.name] === undefined && field.defaultValue !== undefined) {
				next[field.name] = field.defaultValue;
				changed = true;
			} else if (next[field.name] === undefined) {
				const type = field.type ?? 'text';
				if (type === 'toggle' || type === 'checkbox') next[field.name] = false;
				else if (type === 'multiselect') next[field.name] = [];
				else next[field.name] = '';
				changed = true;
			}
		}
		if (changed) values = next;
	});

	function setValue(name: string, v: SchemaFormValue) {
		values = { ...values, [name]: v };
		if (name in errors) {
			const next = { ...errors };
			delete next[name];
			errors = next;
		}
	}

	function handleSubmit() {
		onsubmit?.(values);
	}

	const sections = $derived.by(() => {
		const groups: { title?: string; fields: SchemaField[] }[] = [];
		let current: { title?: string; fields: SchemaField[] } = { fields: [] };
		for (const field of schema) {
			if (field.section) {
				if (current.fields.length) groups.push(current);
				current = { title: field.section, fields: [field] };
			} else {
				current.fields.push(field);
			}
		}
		if (current.fields.length) groups.push(current);
		return groups;
	});
</script>

<Form
	bind:data={values}
	bind:errors
	{title}
	{description}
	{loading}
	class={className}
	onsubmit={handleSubmit}
>
	{#each sections as section, si (si)}
		{#if section.title}
			<div class={si > 0 ? 'pt-2' : ''}>
				<h3 class="mb-3 text-sm font-semibold text-primary">{section.title}</h3>
			</div>
		{/if}
		{#each section.fields as field (field.name)}
			{@const type = field.type ?? 'text'}
			{@const fieldError = errors[field.name]}
			{#if type === 'textarea'}
				<FormTextarea
					name={field.name}
					label={field.label}
					placeholder={field.placeholder}
					helperText={field.helperText}
					required={field.required}
					bindData
				/>
			{:else if type === 'select'}
				<FormSelect
					name={field.name}
					label={field.label}
					placeholder={field.placeholder ?? 'Select…'}
					helperText={field.helperText}
					required={field.required}
					options={field.options ?? []}
					bindData
				/>
			{:else if type === 'toggle'}
				<FormToggle
					name={field.name}
					label={field.label}
					helperText={field.helperText}
					bindData
				/>
			{:else if type === 'checkbox'}
				<FormCheckbox
					name={field.name}
					label={field.label}
					helperText={field.helperText}
					bindData
				/>
			{:else if type === 'password'}
				<FormPasswordInput
					name={field.name}
					label={field.label}
					placeholder={field.placeholder}
					helperText={field.helperText}
					required={field.required}
					bindData
				/>
			{:else if type === 'date'}
				<div class="w-full space-y-1">
					<DatePicker
						label={field.label}
						placeholder={field.placeholder ?? 'Select date…'}
						disabled={loading}
						value={String(values[field.name] ?? '')}
						onchange={(detail) => setValue(field.name, detail.value)}
					/>
					{#if fieldError}
						<FormError message={fieldError} />
					{:else if field.helperText}
						<p class="text-xs text-muted">{field.helperText}</p>
					{/if}
				</div>
			{:else if type === 'radio'}
				<RadioGroup
					name={field.name}
					label={field.label}
					options={field.options ?? []}
					required={field.required}
					disabled={loading}
					status={fieldError ? 'error' : 'default'}
					helperText={fieldError ?? field.helperText}
					value={String(values[field.name] ?? '')}
					onchange={(v) => setValue(field.name, v)}
				/>
			{:else if type === 'multiselect'}
				<div class="w-full space-y-1">
					<MultiSelect
						label={field.label}
						placeholder={field.placeholder ?? 'Select…'}
						options={field.options ?? []}
						disabled={loading}
						value={Array.isArray(values[field.name]) ? (values[field.name] as string[]) : []}
						onchange={(v) => setValue(field.name, v)}
					/>
					{#if fieldError}
						<FormError message={fieldError} />
					{:else if field.helperText}
						<p class="text-xs text-muted">{field.helperText}</p>
					{/if}
				</div>
			{:else}
				<FormField
					name={field.name}
					label={field.label}
					type={type === 'number' ? 'number' : type}
					placeholder={field.placeholder}
					helperText={field.helperText}
					required={field.required}
					bindData
				/>
			{/if}
		{/each}
	{/each}

	{#snippet footer()}
		<FormActions
			{submitLabel}
			{cancelLabel}
			{showCancel}
			variant="plain"
			fullWidth={false}
			align="end"
			oncancel={oncancel}
		/>
	{/snippet}
</Form>
