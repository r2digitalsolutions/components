<script lang="ts">
	import KeyValue from './KeyValue.svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
</script>

<Surface variant="elevated" padding="md" class="max-w-sm">
	<Stack gap="sm">
		<KeyValue label="Plan" value="Pro" />
		<Divider />
		<KeyValue label="Seats" value="8" />
		<Divider />
		<KeyValue label="Region" value="eu-west" />
	</Stack>
</Surface>
