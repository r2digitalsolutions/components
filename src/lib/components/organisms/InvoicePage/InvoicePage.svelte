<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Descriptions from '$lib/components/molecules/Descriptions/Descriptions.svelte';
	import AddressFields from '$lib/components/molecules/AddressFields/AddressFields.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export interface InvoiceLine {
		id: string;
		description: string;
		qty: number;
		unitPrice: number;
	}

	interface InvoicePageProps {
		invoiceNumber?: string;
		issuedAt?: string;
		dueAt?: string;
		status?: 'draft' | 'sent' | 'paid' | 'overdue';
		lines?: InvoiceLine[];
		taxRate?: number;
		currency?: string;
		class?: string;
		ondownload?: () => void;
		onsend?: () => void;
	}

	const {
		invoiceNumber = 'INV-2048',
		issuedAt = '2026-07-01',
		dueAt = '2026-07-31',
		status = 'sent',
		lines = [
			{ id: '1', description: 'Pro plan · Jul 2026', qty: 1, unitPrice: 29 },
			{ id: '2', description: 'Extra seats (5)', qty: 5, unitPrice: 6 },
			{ id: '3', description: 'Priority support', qty: 1, unitPrice: 49 }
		],
		taxRate = 0.21,
		currency = 'EUR',
		class: className = '',
		ondownload,
		onsend
	}: InvoicePageProps = $props();

	let line1 = $state('Calle Mayor 12');
	let city = $state('Madrid');
	let postal = $state('28013');
	let country = $state('ES');

	const subtotal = $derived(lines.reduce((s, l) => s + l.qty * l.unitPrice, 0));
	const tax = $derived(subtotal * taxRate);
	const total = $derived(subtotal + tax);

	const money = (n: number) =>
		new Intl.NumberFormat('en', { style: 'currency', currency }).format(n);

	const statusVariant = {
		draft: 'secondary',
		sent: 'info',
		paid: 'success',
		overdue: 'error'
	} as const;
</script>

<div class={['mx-auto w-full max-w-3xl space-y-5', className]}>
	<PageHeader title="Invoice" description={`${invoiceNumber} · due ${dueAt}`}>
		{#snippet actions()}
			<Badge variant={statusVariant[status]} size="sm">{status}</Badge>
			<Button size="sm" variant="secondary" onclick={() => ondownload?.()}>Download PDF</Button>
			<Button size="sm" onclick={() => onsend?.()}>Send</Button>
		{/snippet}
	</PageHeader>

	<Card padding="lg" chrome={false}>
		<div class="mb-4 flex flex-wrap items-start justify-between gap-4">
			<div>
				<Heading level={3} size="sm">Bill to</Heading>
				<div class="mt-2 max-w-sm">
					<AddressFields bind:line1 bind:city bind:postal bind:country />
				</div>
			</div>
			<Descriptions
				bordered={false}
				columns={1}
				class="w-full max-w-xs"
				items={[
					{ label: 'Invoice #', value: invoiceNumber },
					{ label: 'Issued', value: issuedAt },
					{ label: 'Due', value: dueAt }
				]}
			/>
		</div>

		<Divider />

		<div class="mt-4 overflow-x-auto">
			<table class="w-full min-w-[28rem] text-left text-sm">
				<thead class="text-xs uppercase tracking-wide text-muted">
					<tr>
						<th class="pb-2 font-medium">Description</th>
						<th class="pb-2 font-medium">Qty</th>
						<th class="pb-2 font-medium">Unit</th>
						<th class="pb-2 text-right font-medium">Amount</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each lines as line (line.id)}
						<tr>
							<td class="py-2.5 text-primary">{line.description}</td>
							<td class="py-2.5 text-secondary">{line.qty}</td>
							<td class="py-2.5 text-secondary">{money(line.unitPrice)}</td>
							<td class="py-2.5 text-right font-medium text-primary">
								{money(line.qty * line.unitPrice)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 ml-auto w-full max-w-xs space-y-1.5 text-sm">
			<div class="flex justify-between text-secondary">
				<span>Subtotal</span><span>{money(subtotal)}</span>
			</div>
			<div class="flex justify-between text-secondary">
				<span>Tax ({Math.round(taxRate * 100)}%)</span><span>{money(tax)}</span>
			</div>
			<div class="flex justify-between border-t border-border pt-2 text-base font-semibold text-primary">
				<span>Total</span><span>{money(total)}</span>
			</div>
		</div>

		<div class="mt-6">
			<FormActions
				submitLabel="Mark as paid"
				cancelLabel="Save draft"
				align="end"
				onsubmit={() => onsend?.()}
				oncancel={() => {}}
			/>
		</div>
	</Card>
</div>
