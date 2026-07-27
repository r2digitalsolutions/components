<script lang="ts">
	import AuditEventRow from './AuditEventRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let last = $state('');
</script>

<div class="mx-auto max-w-xl p-4">
	<Stack gap="sm">
		<AuditEventRow
			action="User invited"
			actor="Ada Lovelace"
			target="charles.babbage@example.com"
			time={Date.now() - 3600000}
			severity="info"
			ip="192.168.1.42"
			onclick={() => (last = 'invited')}
		/>
		<AuditEventRow
			action="API key rotated"
			actor="System"
			time={Date.now() - 86400000}
			severity="warning"
		/>
		<AuditEventRow
			action="Failed login attempt"
			target="admin@example.com"
			time={Date.now() - 120000}
			severity="critical"
			ip="203.0.113.7"
		/>
	</Stack>
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Clicked: {last}</p>
	{/if}
</div>
