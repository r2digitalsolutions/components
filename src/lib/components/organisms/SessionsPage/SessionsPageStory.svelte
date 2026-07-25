<script lang="ts">
	import SessionsPage from './SessionsPage.svelte';

	let last = $state('');
</script>

<div class="p-4">
	<SessionsPage
		onrevoke={(id) => (last = `revoke:${id}`)}
		onrevokeothers={() => (last = 'revoke-others')}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
