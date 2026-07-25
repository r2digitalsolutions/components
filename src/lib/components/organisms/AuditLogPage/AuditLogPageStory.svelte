<script lang="ts">
	import AuditLogPage from './AuditLogPage.svelte';
	import type { AuditEvent } from './AuditLogPage.svelte';

	interface Props {
		variant?: 'default' | 'empty';
	}

	let { variant = 'default' }: Props = $props();
	let query = $state('');
	let category = $state('all');
	let last = $state('');

	const events: AuditEvent[] = [
		{
			id: '1',
			title: 'API key rotated',
			description: 'Production key r2_live_***abcd was rotated by an admin.',
			actor: 'Ada Lovelace',
			avatar: 'https://i.pravatar.cc/40?img=5',
			date: Date.now() - 1000 * 60 * 12,
			category: 'security',
			severity: 'warning',
			target: 'key:prod',
			ip: '203.0.113.42'
		},
		{
			id: '2',
			title: 'SSO login',
			description: 'Successful SAML assertion from Okta.',
			actor: 'Alan Turing',
			avatar: 'https://i.pravatar.cc/40?img=12',
			date: Date.now() - 1000 * 60 * 45,
			category: 'security',
			severity: 'info',
			ip: '198.51.100.10'
		},
		{
			id: '3',
			title: 'Plan upgraded',
			description: 'Workspace moved from Starter to Pro.',
			actor: 'Grace Hopper',
			avatar: 'https://i.pravatar.cc/40?img=32',
			date: Date.now() - 1000 * 60 * 60 * 26,
			category: 'billing',
			severity: 'info',
			target: 'plan:pro'
		},
		{
			id: '4',
			title: 'Member invited',
			description: 'Invitation sent to julia@acme.com (Admin).',
			actor: 'Ada Lovelace',
			avatar: 'https://i.pravatar.cc/40?img=5',
			date: Date.now() - 1000 * 60 * 60 * 28,
			category: 'members',
			severity: 'info'
		},
		{
			id: '5',
			title: 'Failed login lockout',
			description: 'Account locked after 5 failed password attempts.',
			actor: 'unknown',
			date: Date.now() - 1000 * 60 * 60 * 50,
			category: 'security',
			severity: 'critical',
			ip: '192.0.2.88'
		},
		{
			id: '6',
			title: 'Webhook endpoint updated',
			description: 'Endpoint URL changed for invoice.paid.',
			actor: 'Grace Hopper',
			avatar: 'https://i.pravatar.cc/40?img=32',
			date: Date.now() - 1000 * 60 * 60 * 52,
			category: 'settings',
			severity: 'info',
			target: 'webhook:inv'
		}
	];
</script>

<div class="mx-auto max-w-4xl p-4">
	{#if variant === 'empty'}
		<AuditLogPage events={[]} bind:query bind:category />
	{:else}
		<AuditLogPage
			{events}
			bind:query
			bind:category
			onexport={() => (last = 'export')}
		/>
	{/if}
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
