<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import Accordion from '$lib/components/molecules/Accordion/Accordion.svelte';
	import type { AccordionItem } from '$lib/components/molecules/Accordion/Accordion.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import InfoTile from '$lib/components/molecules/InfoTile/InfoTile.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface HelpCenterProps {
		faqs?: AccordionItem[];
		query?: string;
		class?: string;
		oncontact?: () => void;
	}

	let {
		faqs = [
			{
				id: 'billing',
				title: 'How does billing work?',
				content: 'Plans renew monthly or yearly. You can change seats anytime from Billing.'
			},
			{
				id: 'invite',
				title: 'How do I invite teammates?',
				content: 'Go to Team → Invite and add emails. Invites expire after 7 days.'
			},
			{
				id: 'sso',
				title: 'Do you support SSO?',
				content: 'Yes on Business plans. Contact sales to enable SAML / OIDC.'
			},
			{
				id: 'export',
				title: 'Can I export my data?',
				content: 'Workspace owners can export projects and activity from Settings → Data.'
			}
		],
		query = $bindable(''),
		class: className = '',
		oncontact
	}: HelpCenterProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return faqs;
		return faqs.filter(
			(f) =>
				f.title.toLowerCase().includes(q) ||
				(typeof f.content === 'string' && f.content.toLowerCase().includes(q))
		);
	});
</script>

<div class={['w-full space-y-6', className]}>
	<PageHeader
		title="Help Center"
		description="Find answers quickly, or reach out if you still need a hand."
	/>

	<SearchBar bind:value={query} placeholder="Search help articles…" buttonLabel="Search" />

	<Grid cols={1} gap="md" class="sm:grid-cols-3">
		<InfoTile title="Getting started" description="Setup, invites, and first project." tone="brand" />
		<InfoTile title="Billing" description="Plans, invoices, and seats." tone="info" />
		<InfoTile
			title="Contact support"
			description="Talk to a human."
			tone="success"
			onclick={() => oncontact?.()}
		/>
	</Grid>

	<Card padding="lg" chrome={false}>
		{#if filtered.length === 0}
			<EmptyState
				title="No articles found"
				description="Try another search, or contact support."
				class="border-0 bg-transparent"
			/>
		{:else}
			<Accordion items={filtered} />
		{/if}
	</Card>
</div>
