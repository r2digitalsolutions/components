<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

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
		| 'checkbox';

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
		defaultValue?: string | boolean | number;
	}

	export type SchemaFormValues = Record<string, string | boolean | number>;

	interface SchemaFormProps {
		schema?: SchemaField[];
		values?: SchemaFormValues;
		title?: string;
		description?: string;
		submitLabel?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (values: SchemaFormValues) => void;
	}

	let {
		schema = [],
		values = $bindable<SchemaFormValues>({}),
		title,
		description,
		submitLabel = 'Save',
		loading = false,
		class: className = '',
		onsubmit
	}: SchemaFormProps = $props();

	// Seed defaults once
	$effect.pre(() => {
		const next = { ...values };
		let changed = false;
		for (const field of schema) {
			if (next[field.name] === undefined && field.defaultValue !== undefined) {
				next[field.name] = field.defaultValue;
				changed = true;
			} else if (next[field.name] === undefined) {
				next[field.name] = field.type === 'toggle' || field.type === 'checkbox' ? false : '';
				changed = true;
			}
		}
		if (changed) values = next;
	});

	function setValue(name: string, v: string | boolean | number) {
		values = { ...values, [name]: v };
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
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

<Form {title} {description} {loading} class={className} onsubmit={handleSubmit}>
	{#each sections as section, si (si)}
		{#if section.title}
			<div class={si > 0 ? 'pt-2' : ''}>
				<h3 class="mb-3 text-sm font-semibold text-primary">{section.title}</h3>
			</div>
		{/if}
		{#each section.fields as field (field.name)}
			{@const type = field.type ?? 'text'}
			{#if type === 'textarea'}
				<Textarea
					label={field.label}
					placeholder={field.placeholder}
					helperText={field.helperText}
					required={field.required}
					value={String(values[field.name] ?? '')}
					oninput={(e) => setValue(field.name, (e.currentTarget as HTMLTextAreaElement).value)}
				/>
			{:else if type === 'select'}
				<Select
					label={field.label}
					placeholder={field.placeholder ?? 'Select…'}
					helperText={field.helperText}
					required={field.required}
					options={field.options ?? []}
					value={String(values[field.name] ?? '')}
					onchange={(v) => setValue(field.name, v)}
				/>
			{:else if type === 'toggle'}
				<div class="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
					<div>
						<p class="text-sm font-medium text-primary">{field.label}</p>
						{#if field.helperText}
							<p class="text-xs text-muted">{field.helperText}</p>
						{/if}
					</div>
					<Toggle
						checked={Boolean(values[field.name])}
						onchange={(c) => setValue(field.name, c)}
					/>
				</div>
			{:else if type === 'checkbox'}
				<Checkbox
					label={field.label}
					checked={Boolean(values[field.name])}
					onchange={(c) => setValue(field.name, c)}
				/>
			{:else}
				<FormField
					name={field.name}
					label={field.label}
					type={type === 'number' ? 'number' : type}
					placeholder={field.placeholder}
					helperText={field.helperText}
					required={field.required}
					value={String(values[field.name] ?? '')}
					oninput={(e) => {
						const raw = (e.currentTarget as HTMLInputElement).value;
						setValue(field.name, type === 'number' ? Number(raw) : raw);
					}}
				/>
			{/if}
		{/each}
	{/each}

	{#snippet footer()}
		<div class="flex justify-end pt-2">
			<Button type="submit" loading={loading}>{submitLabel}</Button>
		</div>
	{/snippet}
</Form>
