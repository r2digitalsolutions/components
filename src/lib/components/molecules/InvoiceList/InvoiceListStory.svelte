<script lang="ts">
	import InvoiceList from './InvoiceList.svelte';
	import type { InvoiceListItem } from './InvoiceList.svelte';

	const invoices: InvoiceListItem[] = [
		{
			id: '1',
			number: 'INV-2048',
			customer: 'Acme Corp',
			date: 'Jul 1, 2026',
			dueDate: 'Jul 31, 2026',
			amount: '€71.39',
			status: 'sent'
		},
		{
			id: '2',
			number: 'INV-2031',
			customer: 'Northwind',
			date: 'Jun 1, 2026',
			dueDate: 'Jun 30, 2026',
			amount: '€29.00',
			status: 'paid'
		},
		{
			id: '3',
			number: 'INV-2019',
			customer: 'Globex',
			date: 'May 1, 2026',
			dueDate: 'May 15, 2026',
			amount: '€148.00',
			status: 'overdue'
		},
		{
			id: '4',
			number: 'INV-2012',
			customer: 'Initech',
			date: 'Apr 12, 2026',
			amount: '€52.00',
			status: 'draft'
		}
	];

	let query = $state('');
	let last = $state('');
</script>

<div class="mx-auto max-w-4xl p-4">
	<InvoiceList
		{invoices}
		bind:query
		onview={(inv) => (last = `view:${inv.number}`)}
		ondownload={(inv) => (last = `pdf:${inv.number}`)}
		oncreate={() => (last = 'create')}
	/>
	{#if last}
		<p class="mt-3 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
