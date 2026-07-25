<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import WebhookCard from '$lib/components/molecules/WebhookCard/WebhookCard.svelte';
	import type { WebhookEndpoint } from '$lib/components/molecules/WebhookCard/WebhookCard.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Webhook from '@lucide/svelte/icons/webhook';

	interface WebhooksPageProps {
		title?: string;
		description?: string;
		webhooks?: WebhookEndpoint[];
		query?: string;
		class?: string;
		oncreate?: () => void;
		ontest?: (id: string) => void;
		onedit?: (id: string) => void;
		ontoggle?: (id: string, enabled: boolean) => void;
	}

	let {
		title = 'Webhooks',
		description = 'Push events to your backends when something changes in the workspace.',
		webhooks = $bindable<WebhookEndpoint[]>([
			{
				id: '1',
				url: 'https://api.acme.dev/hooks/billing',
				description: 'Billing and subscription lifecycle',
				events: ['invoice.paid', 'subscription.updated', 'customer.created'],
				status: 'active',
				secretHint: 'whsec_••••a91f',
				lastDeliveryAt: Date.now() - 1000 * 60 * 12,
				successRate: 0.98
			},
			{
				id: '2',
				url: 'https://hooks.northwind.io/r2/events',
				description: 'Sync members into the CRM',
				events: ['member.invited', 'member.removed'],
				status: 'failing',
				secretHint: 'whsec_••••12cd',
				lastDeliveryAt: Date.now() - 1000 * 60 * 60 * 6,
				successRate: 0.42
			},
			{
				id: '3',
				url: 'https://staging.acme.dev/hooks',
				description: 'Staging only',
				events: ['*'],
				status: 'disabled',
				secretHint: 'whsec_••••zz00'
			}
		]),
		query = $bindable(''),
		class: className = '',
		oncreate,
		ontest,
		onedit,
		ontoggle
	}: WebhooksPageProps = $props();

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return webhooks;
		return webhooks.filter(
			(w) =>
				w.url.toLowerCase().includes(q) ||
				(w.description?.toLowerCase().includes(q) ?? false) ||
				(w.events?.some((e) => e.toLowerCase().includes(q)) ?? false)
		);
	});

	function toggle(id: string, enabled: boolean) {
		webhooks = webhooks.map((w) =>
			w.id === id ? { ...w, status: enabled ? 'active' : 'disabled' } : w
		);
		ontoggle?.(id, enabled);
	}
</script>

<div class={['mx-auto w-full max-w-3xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			{#if oncreate}
				<Button size="sm" onclick={() => oncreate?.()}>
					<Plus class="h-3.5 w-3.5" strokeWidth={2} />
					Add endpoint
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<SearchInput bind:value={query} placeholder="Search URL or event…" />

	{#if visible.length === 0}
		<EmptyState
			title="No webhooks"
			description="Create an endpoint to receive workspace events in real time."
		>
			{#snippet icon()}
				<Webhook class="h-7 w-7" strokeWidth={1.75} />
			{/snippet}
			{#snippet action()}
				{#if oncreate}
					<Button size="sm" onclick={() => oncreate?.()}>Add endpoint</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{:else}
		<ul class="space-y-3">
			{#each visible as webhook (webhook.id)}
				<li>
					<WebhookCard {webhook} {ontest} {onedit} ontoggle={toggle} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
