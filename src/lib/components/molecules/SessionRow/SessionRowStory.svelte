<script lang="ts">
	import SessionRow from './SessionRow.svelte';
	import type { SessionInfo } from './SessionRow.svelte';

	const sessions: SessionInfo[] = [
		{
			id: '1',
			device: 'desktop',
			browser: 'Chrome 126',
			os: 'macOS',
			location: 'Madrid, ES',
			ip: '85.12.••.41',
			lastActiveAt: Date.now(),
			current: true
		},
		{
			id: '2',
			device: 'mobile',
			browser: 'Safari',
			os: 'iOS 18',
			location: 'Barcelona, ES',
			ip: '79.44.••.19',
			lastActiveAt: Date.now() - 1000 * 60 * 60 * 5
		}
	];

	let last = $state('');
</script>

<div class="mx-auto max-w-xl space-y-3 p-4">
	{#each sessions as session (session.id)}
		<SessionRow {session} onrevoke={(id) => (last = `revoke:${id}`)} />
	{/each}
	{#if last}
		<p class="text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
