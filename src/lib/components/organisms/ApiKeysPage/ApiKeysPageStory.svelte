<script lang="ts">
	import ApiKeysPage from './ApiKeysPage.svelte';

	let created = $state(0);
</script>

<div class="mx-auto max-w-2xl p-4">
	<ApiKeysPage
		oncreate={() => (created += 1)}
		onrevoke={(id) => console.log('revoke', id)}
	/>
</div>
{#if created}
	<p class="text-center text-xs text-muted">Create clicked ×{created}</p>
{/if}
