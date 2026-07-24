<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	let props = $props<{
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		label?: string;
		helperText?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<Checkbox
	checked={props.checked ?? false}
	indeterminate={props.indeterminate ?? false}
	disabled={props.disabled ?? false}
	label={props.label ?? 'Accept terms and conditions'}
	helperText={props.helperText || undefined}
	size={props.size ?? 'md'}
/>
