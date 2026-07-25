<script lang="ts">
	import IntegrationsPage from './IntegrationsPage.svelte';
	import type { IntegrationItem } from './IntegrationsPage.svelte';

	let items = $state<IntegrationItem[]>([
		{
			id: 'slack',
			name: 'Slack',
			description: 'Post alerts and mentions into channels.',
			category: 'Chat',
			icon: 'Sl',
			connected: true
		},
		{
			id: 'github',
			name: 'GitHub',
			description: 'Sync PRs, issues and deployment status.',
			category: 'Dev',
			icon: 'GH',
			connected: true
		},
		{
			id: 'linear',
			name: 'Linear',
			description: 'Two-way sync for issues and projects.',
			category: 'PM',
			icon: 'Ln',
			connected: false
		},
		{
			id: 'stripe',
			name: 'Stripe',
			description: 'Billing events and customer portal.',
			category: 'Payments',
			icon: 'St',
			connected: false
		}
	]);
</script>

<IntegrationsPage bind:items />
