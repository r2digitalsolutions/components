<script lang="ts">
	import Stack from './Stack.svelte';

	let props = $props<{
		gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		direction?: 'vertical' | 'horizontal';
	}>();
</script>

<Stack gap={props.gap ?? 'md'} direction={props.direction ?? 'vertical'} class="w-full max-w-sm">
	<div class="rounded-lg bg-brand-100 px-3 py-2 text-sm dark:bg-brand-950/50">Item A</div>
	<div class="rounded-lg bg-brand-100 px-3 py-2 text-sm dark:bg-brand-950/50">Item B</div>
	<div class="rounded-lg bg-brand-100 px-3 py-2 text-sm dark:bg-brand-950/50">Item C</div>
</Stack>
