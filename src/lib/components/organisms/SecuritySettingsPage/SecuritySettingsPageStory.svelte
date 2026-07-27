<script lang="ts">
	import SecuritySettingsPage from './SecuritySettingsPage.svelte';
	import type { SessionInfo } from '$lib/components/molecules/SessionRow/SessionRow.svelte';

	let twoFactorEnabled = $state(true);
	let sessions = $state<SessionInfo[]>([
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
	]);

	let last = $state('');

	function handleRevoke(id: string) {
		sessions = sessions.filter((s) => s.id !== id);
		last = `revoke:${id}`;
	}
</script>

<div class="p-4">
	<SecuritySettingsPage
		bind:twoFactorEnabled
		{sessions}
		onchangePassword={() => (last = 'change-password')}
		ontoggle2fa={(enabled) => (last = `2fa:${enabled}`)}
		onrevokeSession={handleRevoke}
		ondeleteAccount={() => (last = 'delete-account')}
	/>
</div>

{#if last}
	<p class="pb-4 text-center text-xs text-muted">Action: {last}</p>
{/if}
