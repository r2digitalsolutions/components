<script lang="ts">
	import LeadDetailPage from './LeadDetailPage.svelte';
	import type { LeadEvent, LeadReply, RelatedLead } from './LeadDetailPage.svelte';

	const lead = {
		name: 'Jordan Lee',
		company: 'Northwind Traders',
		email: 'jordan.lee@northwind.io',
		phone: '+1 (415) 555-0198',
		status: 'Qualified',
		score: 82
	};

	const events: LeadEvent[] = [
		{
			id: 'e1',
			action: 'Demo scheduled',
			actor: 'Ada Lovelace',
			target: 'Product walkthrough',
			time: new Date(Date.now() - 2 * 60 * 60 * 1000),
			severity: 'info'
		},
		{
			id: 'e2',
			action: 'Email opened',
			actor: 'Jordan Lee',
			target: 'Enterprise pricing deck',
			time: new Date(Date.now() - 26 * 60 * 60 * 1000),
			severity: 'info'
		},
		{
			id: 'e3',
			action: 'Score updated',
			actor: 'System',
			target: '82 → qualified threshold',
			time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
			severity: 'warning'
		},
		{
			id: 'e4',
			action: 'Lead created',
			actor: 'Marketing form',
			target: 'Website signup',
			time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			severity: 'info',
			ip: '203.0.113.42'
		}
	];

	const replies: LeadReply[] = [
		{
			id: 'r1',
			author: 'Ada Lovelace',
			body: 'Strong fit for the enterprise tier — they need SSO and audit logs. Follow up after the demo.',
			avatar: 'https://i.pravatar.cc/120?img=5',
			time: '2 hours ago'
		},
		{
			id: 'r2',
			author: 'Alan Turing',
			body: 'Confirmed technical contact is their VP Engineering. Loop me in on the integration questions.',
			avatar: 'https://i.pravatar.cc/120?img=12',
			time: 'Yesterday',
			depth: 0
		}
	];

	const related: RelatedLead[] = [
		{
			id: 'rel1',
			title: 'Northwind — Enterprise deal',
			subtitle: 'Opportunity · $48k ARR',
			kind: 'Deal',
			meta: 'Open'
		},
		{
			id: 'rel2',
			title: 'Sam Rivera',
			subtitle: 'VP Engineering · Decision maker',
			kind: 'Contact',
			image: 'https://i.pravatar.cc/120?img=15'
		},
		{
			id: 'rel3',
			title: 'Q3 outbound campaign',
			subtitle: 'Source · LinkedIn ads',
			kind: 'Campaign'
		}
	];
</script>

<div class="p-4 sm:p-6">
	<LeadDetailPage {lead} {events} {replies} {related} />
</div>
