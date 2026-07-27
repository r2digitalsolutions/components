<script lang="ts">
	import SecretField from './SecretField.svelte';
	let value = $state('sk_live_51Hx…demo');
</script>

<div class="mx-auto max-w-md p-4">
	<SecretField bind:value label="API key" />
</div>
