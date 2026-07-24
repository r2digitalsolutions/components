<script lang="ts">
	import Accordion, { type AccordionItem } from './Accordion.svelte';

	let props = $props<{
		type?: 'single' | 'multiple';
		collapsible?: boolean;
	}>();

	const items: AccordionItem[] = [
		{
			id: 'billing',
			title: 'Billing & invoices',
			content: 'Download invoices, update your payment method, and manage tax details from Settings → Billing.'
		},
		{
			id: 'team',
			title: 'Team seats',
			content: 'Invite members with role-based access. Admins can transfer ownership at any time.'
		},
		{
			id: 'api',
			title: 'API access',
			content: 'Generate personal access tokens with scoped permissions. Rotate secrets every 90 days.'
		},
		{
			id: 'legacy',
			title: 'Legacy plan (disabled)',
			content: 'Hidden',
			disabled: true
		}
	];

	let value = $state<string[]>(['billing']);
</script>

<div class="max-w-lg">
	<Accordion
		{items}
		bind:value
		type={props.type ?? 'single'}
		collapsible={props.collapsible ?? true}
	/>
</div>
