<script lang="ts">
	import Heading from './Heading.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let props = $props<{ level?: 1 | 2 | 3 | 4; muted?: boolean }>();
</script>

<Stack gap="sm">
	<Heading level={props.level ?? 1}>Page title</Heading>
	<Heading level={2}>Section</Heading>
	<Heading level={3} muted={props.muted ?? false}>Subsection</Heading>
	<Heading level={6}>Eyebrow label</Heading>
</Stack>
