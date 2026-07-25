<script lang="ts">
	import ChangePasswordForm from './ChangePasswordForm.svelte';

	let last = $state(false);
</script>

<div class="flex justify-center p-4">
	<ChangePasswordForm onsubmit={() => (last = true)} />
</div>
{#if last}
	<p class="text-center text-xs text-muted">Password update submitted</p>
{/if}
