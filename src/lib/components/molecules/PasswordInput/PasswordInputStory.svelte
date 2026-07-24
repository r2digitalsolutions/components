<script lang="ts">
	import PasswordInput from './PasswordInput.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		status?: 'default' | 'error' | 'success' | 'warning';
	}>();

	let value = $state('');
</script>

<div class="w-80 max-w-full">
	<PasswordInput
		bind:value
		size={props.size ?? 'md'}
		disabled={props.disabled ?? false}
		status={props.status ?? 'default'}
		helperText="At least 8 characters"
	/>
</div>
