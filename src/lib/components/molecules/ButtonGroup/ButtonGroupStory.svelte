<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		attached?: boolean;
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<ButtonGroup
	attached={props.attached ?? true}
	orientation={props.orientation ?? 'horizontal'}
	size={props.size ?? 'md'}
	aria-label="Text alignment"
>
	<Button variant="secondary" size={props.size ?? 'md'}>Left</Button>
	<Button variant="secondary" size={props.size ?? 'md'}>Center</Button>
	<Button variant="secondary" size={props.size ?? 'md'}>Right</Button>
</ButtonGroup>
