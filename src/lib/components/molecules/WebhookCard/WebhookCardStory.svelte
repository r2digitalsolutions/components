<script lang="ts">
	import WebhookCard from './WebhookCard.svelte';
	import type { WebhookEndpoint } from './WebhookCard.svelte';

	const webhook: WebhookEndpoint = {
		id: '1',
		url: 'https://api.acme.dev/hooks/billing',
		description: 'Invoice paid and subscription events',
		events: ['invoice.paid', 'subscription.updated', 'customer.created', 'refund.created'],
		status: 'active',
		secretHint: 'whsec_••••a91f',
		lastDeliveryAt: Date.now() - 1000 * 60 * 12,
		successRate: 0.98
	};

	let last = $state('');
</script>

<div class="mx-auto max-w-xl p-4">
	<WebhookCard
		{webhook}
		ontest={(id) => (last = `test:${id}`)}
		onedit={(id) => (last = `edit:${id}`)}
		ontoggle={(id, en) => (last = `${en ? 'enable' : 'disable'}:${id}`)}
	/>
	{#if last}
		<p class="mt-3 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
