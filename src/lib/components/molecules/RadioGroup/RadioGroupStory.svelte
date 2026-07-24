<script lang="ts">
	import RadioGroup from './RadioGroup.svelte';

	interface RadioOption {
		value: string;
		label: string;
		helperText?: string;
		disabled?: boolean;
	}

	let props = $props<{
		label?: string;
		value?: string;
		options?: RadioOption[];
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'warning';
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
	}>();

	const defaultOptions: RadioOption[] = [
		{ value: 'free', label: 'Free Plan', helperText: 'Basic features, $0/month' },
		{ value: 'pro', label: 'Pro Plan', helperText: 'All features, $19/month' },
		{ value: 'enterprise', label: 'Enterprise', helperText: 'Custom pricing & dedicated support' }
	];
</script>

<div class="w-80 max-w-full">
	<RadioGroup
		label={props.label ?? 'Select Plan'}
		options={props.options ?? defaultOptions}
		orientation={props.orientation ?? 'vertical'}
		size={props.size ?? 'md'}
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		disabled={props.disabled ?? false}
		required={props.required ?? false}
		value={props.value ?? 'pro'}
	/>
</div>
