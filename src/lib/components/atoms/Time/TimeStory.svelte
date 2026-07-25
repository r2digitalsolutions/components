<script lang="ts">
	import Time from './Time.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let props = $props<{ format?: 'short' | 'medium' | 'long' | 'time' | 'datetime' }>();
	const now = Date.now();
</script>

<Stack gap="sm">
	<Time date={now} format={props.format ?? 'medium'} />
	<Time date={now} format="datetime" />
	<Time date={now} format="time" />
</Stack>
