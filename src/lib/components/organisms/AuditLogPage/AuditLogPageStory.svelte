<script lang="ts">
	import AuditLogPage from './AuditLogPage.svelte';
	import type { AuditEvent } from './AuditLogPage.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';

	let query = $state('');
	let filters = $state<FilterChip[]>([
		{ id: 'security', label: 'Security' },
		{ id: 'billing', label: 'Billing' }
	]);

	const events: AuditEvent[] = [
		{
			id: '1',
			title: 'API key rotated',
			description: 'Production key r2_live_***abcd was rotated.',
			actor: 'Ada Lovelace',
			avatar: 'https://i.pravatar.cc/40?img=5',
			date: Date.now() - 1000 * 60 * 12,
			category: 'security'
		},
		{
			id: '2',
			title: 'Plan upgraded',
			description: 'Workspace moved from Starter to Pro.',
			actor: 'Grace Hopper',
			avatar: 'https://i.pravatar.cc/40?img=32',
			date: Date.now() - 1000 * 60 * 90,
			category: 'billing'
		},
		{
			id: '3',
			title: 'SSO login',
			description: 'Successful SAML assertion from Okta.',
			actor: 'Alan Turing',
			avatar: 'https://i.pravatar.cc/40?img=12',
			date: Date.now() - 1000 * 60 * 180,
			category: 'security'
		}
	];
</script>

<div class="mx-auto max-w-4xl p-4">
	<AuditLogPage {events} bind:query bind:filters />
</div>
