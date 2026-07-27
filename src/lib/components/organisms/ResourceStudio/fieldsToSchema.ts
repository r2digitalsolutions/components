import type { SchemaField, SchemaFieldType, SchemaFormValue } from '../SchemaForm/SchemaForm.svelte';
import type { ResourceField } from './types.js';

function mapFieldType(field: ResourceField): SchemaFieldType {
	switch (field.type) {
		case 'text':
		case 'json':
			return 'textarea';
		case 'number':
			return 'number';
		case 'boolean':
			return 'toggle';
		case 'date':
		case 'datetime':
			return 'date';
		case 'enum':
			return 'select';
		case 'string':
		case 'relation':
		case 'file':
		case 'custom':
		default:
			return field.options?.length ? 'select' : 'text';
	}
}

function coerceDefault(field: ResourceField): SchemaFormValue | undefined {
	if (field.defaultValue === undefined) return undefined;
	if (field.type === 'boolean') return Boolean(field.defaultValue);
	if (field.type === 'number') {
		const n = Number(field.defaultValue);
		return Number.isFinite(n) ? n : undefined;
	}
	return String(field.defaultValue);
}

/** Map ResourceField[] → SchemaForm fields (design-system controls). */
export function fieldsToSchema(
	fields: ResourceField[],
	options?: { mode?: 'create' | 'edit' }
): SchemaField[] {
	const mode = options?.mode ?? 'create';
	return fields
		.filter((f) => !f.hidden)
		.filter((f) => mode === 'edit' || !f.readonly)
		.map((f) => ({
			name: f.id,
			label: f.label,
			type: mapFieldType(f),
			required: f.required,
			helperText: f.description,
			options: f.options?.map((o) => ({ value: o.value, label: o.label })),
			defaultValue: coerceDefault(f),
			disabled: mode === 'edit' && Boolean(f.readonly),
			placeholder:
				f.type === 'enum' || f.options?.length
					? `Select ${f.label.toLowerCase()}…`
					: undefined
		}));
}
