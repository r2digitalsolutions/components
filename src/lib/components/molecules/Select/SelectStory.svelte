<script lang="ts">
	import Select from './Select.svelte';

	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	let props = $props<{
		label?: string;
		placeholder?: string;
		options?: SelectOption[];
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		searchable?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}>();

	const countryOptions: SelectOption[] = [
		{ value: 'es', label: 'Spain 🇪🇸' },
		{ value: 'us', label: 'United States 🇺🇸' },
		{ value: 'mx', label: 'Mexico 🇲🇽' },
		{ value: 'ar', label: 'Argentina 🇦🇷' },
		{ value: 'co', label: 'Colombia 🇨🇴' },
		{ value: 'uk', label: 'United Kingdom 🇬🇧' }
	];
</script>

<div class="w-80 max-w-full">
	<Select
		label={props.label ?? 'Country'}
		placeholder={props.placeholder ?? 'Select country...'}
		options={props.options ?? countryOptions}
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		disabled={props.disabled ?? false}
		required={props.required ?? false}
		searchable={props.searchable ?? false}
		size={props.size ?? 'md'}
		value={props.value ?? 'es'}
	/>
</div>
