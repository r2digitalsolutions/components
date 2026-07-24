<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		content?: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
	}>();
</script>

<div class="p-16">
	<Tooltip content={props.content ?? 'Helpful tip'} side={props.side ?? 'top'}>
		<Button variant="secondary" size="sm">Hover me</Button>
	</Tooltip>
</div>
