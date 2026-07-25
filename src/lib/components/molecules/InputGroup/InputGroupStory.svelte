<script lang="ts">
	import InputGroup from './InputGroup.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let url = $state('acme');
	let price = $state('29');
</script>

<div class="max-w-sm">
	<Stack gap="md">
		<InputGroup label="Website" bind:value={url} prefix="https://" suffix=".com" hint="Your public site" />
		<InputGroup label="Price" bind:value={price} prefix="$" suffix="USD" type="number" />
	</Stack>
</div>
