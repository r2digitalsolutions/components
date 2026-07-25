<script lang="ts">
	import InvoicePage from './InvoicePage.svelte';
	import type { InvoiceStatus } from './InvoicePage.svelte';

	interface Props {
		status?: InvoiceStatus;
	}

	let { status = 'sent' }: Props = $props();
	let last = $state('');
</script>

<div class="p-4">
	<InvoicePage
		{status}
		paidAt={status === 'paid' ? 'Jul 20, 2026' : undefined}
		discount={status === 'paid' ? 5 : 0}
		ondownload={() => (last = 'pdf')}
		onsend={() => (last = 'send')}
		onmarkpaid={() => (last = 'paid')}
		onprint={() => (last = 'print')}
	/>
	{#if last}
		<p class="mt-3 text-center text-xs text-muted print:hidden">Action: {last}</p>
	{/if}
</div>
