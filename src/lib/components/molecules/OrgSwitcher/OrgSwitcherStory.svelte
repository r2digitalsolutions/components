<script lang="ts">
	import OrgSwitcher from './OrgSwitcher.svelte';

	let value = $state('acme');
	let last = $state('');
</script>

<div class="mx-auto grid max-w-sm gap-6 p-4">
	<OrgSwitcher
		bind:value
		oncreate={() => (last = 'create')}
		onchange={(id) => (last = `switch:${id}`)}
	/>
	<OrgSwitcher bind:value compact />
	{#if last}
		<p class="text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
