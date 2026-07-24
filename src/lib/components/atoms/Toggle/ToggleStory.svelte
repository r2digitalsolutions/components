<script lang="ts">
	import Toggle from './Toggle.svelte';

	let props = $props<{
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		labelPosition?: 'left' | 'right';
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<Toggle
	checked={props.checked ?? false}
	disabled={props.disabled ?? false}
	label={props.label ?? 'Enable notifications'}
	labelPosition={props.labelPosition ?? 'right'}
	size={props.size ?? 'md'}
/>
