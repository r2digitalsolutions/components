<script lang="ts">
	import CheckboxGroup from './CheckboxGroup.svelte';

	let props = $props<{
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
	}>();

	let value = $state(['email']);
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<CheckboxGroup
		bind:value
		label="Notification channels"
		orientation={props.orientation ?? 'vertical'}
		size={props.size ?? 'md'}
		options={[
			{ value: 'email', label: 'Email', helperText: 'Product updates and digests' },
			{ value: 'push', label: 'Push notifications' },
			{ value: 'sms', label: 'SMS', disabled: true, helperText: 'Coming soon' }
		]}
	/>
	<p class="mt-3 text-xs text-muted">Selected: {value.join(', ') || 'none'}</p>
</div>
