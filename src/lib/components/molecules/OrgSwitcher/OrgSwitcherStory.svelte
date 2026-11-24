<script lang="ts">
	import OrgSwitcher from './OrgSwitcher.svelte';

	let value = $state('acme');
	let last = $state('');
</script>

<div class="max-w-sm gap-6 p-4 mx-auto grid">
	<OrgSwitcher
		bind:value
		oncreate={() => (last = 'create')}
		onchange={(id) => (last = `switch:${id}`)}
	/>
	<OrgSwitcher bind:value compact />
	<OrgSwitcher
		bind:value
		verifiedLabel="Verificada"
		orgs={[
			{ id: 'acme', name: 'Acme Corp', plan: 'Pro', tone: 'brand', verified: true },
			{ id: 'north', name: 'Northwind', plan: 'Starter', tone: 'sky' },
			{ id: 'globex', name: 'Globex Labs', plan: 'Team', tone: 'emerald', verified: true }
		]}
	/>
	{#if last}
		<p class="text-xs text-muted text-center">Action: {last}</p>
	{/if}
</div>
