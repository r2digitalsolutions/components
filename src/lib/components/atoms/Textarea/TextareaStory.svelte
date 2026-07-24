<script lang="ts">
	import Textarea from './Textarea.svelte';

	let props = $props<{
		label?: string;
		placeholder?: string;
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		rows?: number;
		maxLength?: number;
		showCount?: boolean;
		autoResize?: boolean;
	}>();
</script>

<div class="w-80 max-w-full">
	<Textarea
		label={props.label ?? 'Bio / Description'}
		placeholder={props.placeholder ?? 'Tell us about yourself...'}
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		disabled={props.disabled ?? false}
		readonly={props.readonly ?? false}
		required={props.required ?? false}
		rows={props.rows ?? 3}
		maxLength={props.maxLength}
		showCount={props.showCount ?? false}
		autoResize={props.autoResize ?? false}
		value={props.value ?? ''}
	/>
</div>
