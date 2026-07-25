<script lang="ts">
	import WebhooksPage from './WebhooksPage.svelte';

	let last = $state('');
</script>

<div class="p-4">
	<WebhooksPage
		oncreate={() => (last = 'create')}
		ontest={(id) => (last = `test:${id}`)}
		onedit={(id) => (last = `edit:${id}`)}
		ontoggle={(id, en) => (last = `${en ? 'enable' : 'disable'}:${id}`)}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
