<script lang="ts">
	import PasswordField from './PasswordField.svelte';

	let value = $state('Secret123!');
</script>

<div class="max-w-sm">
	<PasswordField bind:value hint="Use at least 8 characters with a number." />
</div>
