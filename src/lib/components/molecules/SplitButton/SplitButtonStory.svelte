<script lang="ts">
	import SplitButton from './SplitButton.svelte';

	let props = $props<{
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	}>();
</script>

<SplitButton
	label="Save"
	variant={props.variant ?? 'primary'}
	size={props.size ?? 'md'}
	items={[
		{ id: 'draft', label: 'Save as draft' },
		{ id: 'template', label: 'Save as template' },
		{ id: 'sep', label: '', separator: true },
		{ id: 'publish', label: 'Save and publish' }
	]}
/>
