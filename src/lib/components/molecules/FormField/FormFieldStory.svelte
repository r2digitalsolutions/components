<script lang="ts">
	import FormField from './FormField.svelte';

	let props = $props<{
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		required?: boolean;
		clearable?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="w-80">
	<FormField
		label={props.label ?? 'Email address'}
		placeholder={props.placeholder ?? 'user@example.com'}
		type={props.type ?? 'email'}
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		errorMessage={props.errorMessage || undefined}
		disabled={props.disabled ?? false}
		required={props.required ?? false}
		clearable={props.clearable ?? false}
		size={props.size ?? 'md'}
		value={props.value ?? ''}
	/>
</div>
