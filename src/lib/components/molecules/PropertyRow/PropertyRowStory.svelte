<script lang="ts">
	import PropertyRow from './PropertyRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<div class="max-w-lg">
	<Stack gap="sm">
		<PropertyRow label="Workspace ID" value="ws_9f3a2c" copyable mono />
		<PropertyRow label="API key" value="r2_live_••••••••abcd" copyable mono />
		<PropertyRow label="Region" value="eu-west-1" />
	</Stack>
</div>
