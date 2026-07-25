<script lang="ts">
	import FeatureFlagRow from './FeatureFlagRow.svelte';
	import type { FeatureFlag } from './FeatureFlagRow.svelte';

	let flag = $state<FeatureFlag>({
		id: '1',
		key: 'billing.v2',
		name: 'Billing V2',
		description: 'New invoices UI and prorated upgrades.',
		enabled: true,
		environment: 'staging',
		rollout: 25,
		tags: ['billing', 'beta']
	});

	let last = $state('');
</script>

<div class="mx-auto max-w-xl space-y-3 p-4">
	<FeatureFlagRow
		{flag}
		onchange={(id, en) => {
			flag = { ...flag, enabled: en };
			last = `${en ? 'on' : 'off'}:${id}`;
		}}
		onedit={(id) => (last = `edit:${id}`)}
	/>
	{#if last}
		<p class="text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
