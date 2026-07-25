<script lang="ts">
	import PasswordStrength from './PasswordStrength.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';

	let password = $state('Str0ng!');
</script>

<div class="w-full max-w-sm space-y-3">
	<PasswordInput bind:value={password} label="Password" />
	<PasswordStrength {password} />
</div>
