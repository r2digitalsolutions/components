<script lang="ts">
	import RolesPage from './RolesPage.svelte';

	let last = $state('');
</script>

<div class="p-4">
	<RolesPage
		oncreate={() => (last = 'create')}
		onedit={(id) => (last = `edit:${id}`)}
		onsave={() => (last = 'save')}
		onselect={(id) => (last = `select:${id}`)}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
