<script lang="ts">
	import BillingPage from './BillingPage.svelte';
	import type { BillingStatus } from './BillingPage.svelte';

	interface Props {
		status?: BillingStatus;
		emptyPayment?: boolean;
		emptyInvoices?: boolean;
	}

	let {
		status = 'active',
		emptyPayment = false,
		emptyInvoices = false
	}: Props = $props();

	let last = $state('');
</script>

<div class="mx-auto max-w-5xl p-4">
	<BillingPage
		{status}
		paymentMethod={emptyPayment
			? null
			: { brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2028 }}
		invoices={emptyInvoices
			? []
			: [
					{ id: '1', number: 'INV-2048', date: 'Jul 1, 2026', amount: '$29.00', status: 'paid' },
					{ id: '2', number: 'INV-2031', date: 'Jun 1, 2026', amount: '$29.00', status: 'paid' },
					{ id: '3', number: 'INV-2019', date: 'May 1, 2026', amount: '$29.00', status: 'open' }
				]}
		onupgrade={() => (last = 'upgrade')}
		onmanage={() => (last = 'manage')}
		oncancel={() => (last = 'cancel')}
		onchangeseats={() => (last = 'seats')}
		onswitchyearly={() => (last = 'yearly')}
		ondownloadinvoice={(inv) => (last = `pdf:${inv.number}`)}
	/>
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
