<script lang="ts">
	import Input from './Input.svelte';

	let props = $props<{
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		clearable?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="w-80">
	<Input
		label={props.label ?? 'Email address'}
		placeholder={props.placeholder ?? 'Enter value...'}
		type={props.type ?? 'text'}
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		disabled={props.disabled ?? false}
		readonly={props.readonly ?? false}
		required={props.required ?? false}
		clearable={props.clearable ?? false}
		size={props.size ?? 'md'}
		value={props.value ?? ''}
	/>
</div>
