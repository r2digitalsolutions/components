<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import Download from '@lucide/svelte/icons/download';
	import Send from '@lucide/svelte/icons/send';
	import Printer from '@lucide/svelte/icons/printer';
	import Check from '@lucide/svelte/icons/check';
	import Building2 from '@lucide/svelte/icons/building-2';

	export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

	export interface InvoiceParty {
		name: string;
		email?: string;
		addressLines?: string[];
		taxId?: string;
	}

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
		paidAt?: string;
		status?: InvoiceStatus;
		from?: InvoiceParty;
		billTo?: InvoiceParty;
		lines?: InvoiceLine[];
		taxRate?: number;
		discount?: number;
		currency?: string;
		notes?: string;
		brandName?: string;
		class?: string;
		ondownload?: () => void;
		onsend?: () => void;
		onprint?: () => void;
		onmarkpaid?: () => void;
	}

	const {
		invoiceNumber = 'INV-2048',
		issuedAt = 'Jul 1, 2026',
		dueAt = 'Jul 31, 2026',
		paidAt,
		status = 'sent',
		from = {
			name: 'R2 Digi Solutions',
			email: 'billing@r2digi.com',
			addressLines: ['Calle Mayor 12', '28013 Madrid, Spain'],
			taxId: 'ES B12345678'
		},
		billTo = {
			name: 'Acme Corp',
			email: 'ap@acme.com',
			addressLines: ['120 Market Street', 'San Francisco, CA 94105'],
			taxId: 'US 98-7654321'
		},
		lines = [
			{ id: '1', description: 'Pro plan · Jul 2026', qty: 1, unitPrice: 29 },
			{ id: '2', description: 'Extra seats (5)', qty: 5, unitPrice: 6 },
			{ id: '3', description: 'Priority support', qty: 1, unitPrice: 49 }
		],
		taxRate = 0.21,
		discount = 0,
		currency = 'EUR',
		notes = 'Payment due within 30 days. Bank transfer or card accepted.',
		brandName = 'R2 Digi',
		class: className = '',
		ondownload,
		onsend,
		onprint,
		onmarkpaid
	}: InvoicePageProps = $props();

	const subtotal = $derived(lines.reduce((s, l) => s + l.qty * l.unitPrice, 0));
	const discountAmount = $derived(Math.max(0, discount));
	const taxable = $derived(Math.max(0, subtotal - discountAmount));
	const tax = $derived(taxable * taxRate);
	const total = $derived(taxable + tax);

	const money = (n: number) =>
		new Intl.NumberFormat('en', { style: 'currency', currency }).format(n);

	const statusMeta: Record<
		InvoiceStatus,
		{ label: string; variant: 'secondary' | 'info' | 'success' | 'error' | 'warning' }
	> = {
		draft: { label: 'Draft', variant: 'secondary' },
		sent: { label: 'Sent', variant: 'info' },
		paid: { label: 'Paid', variant: 'success' },
		overdue: { label: 'Overdue', variant: 'error' },
		void: { label: 'Void', variant: 'warning' }
	};

	function printInvoice() {
		onprint?.();
		if (typeof window !== 'undefined') window.print();
	}
</script>

<div class={['mx-auto w-full max-w-3xl space-y-4', className]}>
	<!-- Actions (hidden when printing) -->
	<div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<h1 class="text-xl font-semibold tracking-tight text-primary">Invoice</h1>
				<Badge size="sm" variant={statusMeta[status].variant}>{statusMeta[status].label}</Badge>
			</div>
			<p class="mt-0.5 text-sm text-muted">{invoiceNumber} · Due {dueAt}</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button size="sm" variant="ghost" onclick={printInvoice}>
				<Printer class="h-3.5 w-3.5" strokeWidth={2} />
				Print
			</Button>
			<Button size="sm" variant="secondary" onclick={() => ondownload?.()}>
				<Download class="h-3.5 w-3.5" strokeWidth={2} />
				PDF
			</Button>
			{#if status !== 'paid' && status !== 'void'}
				<Button size="sm" variant="secondary" onclick={() => onsend?.()}>
					<Send class="h-3.5 w-3.5" strokeWidth={2} />
					Send
				</Button>
				<Button size="sm" onclick={() => onmarkpaid?.()}>
					<Check class="h-3.5 w-3.5" strokeWidth={2} />
					Mark paid
				</Button>
			{/if}
		</div>
	</div>

	<!-- Document -->
	<article
		class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm print:rounded-none print:border-0 print:shadow-none"
	>
		<!-- Brand header -->
		<header
			class="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-surface/40 px-5 py-5 sm:px-7"
		>
			<div class="flex items-start gap-3">
				<span
					class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
				>
					<Building2 class="h-5 w-5" strokeWidth={2} />
				</span>
				<div>
					<p class="text-base font-semibold text-primary">{brandName}</p>
					{#if from.email}
						<p class="text-xs text-muted">{from.email}</p>
					{/if}
					{#if from.taxId}
						<p class="text-[11px] text-muted">Tax ID {from.taxId}</p>
					{/if}
				</div>
			</div>
			<div class="text-right">
				<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Invoice</p>
				<p class="mt-1 font-mono text-lg font-semibold text-primary">{invoiceNumber}</p>
				{#if status === 'paid'}
					<p class="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
						Paid{paidAt ? ` · ${paidAt}` : ''}
					</p>
				{:else if status === 'overdue'}
					<p class="mt-1 text-xs font-medium text-red-600 dark:text-red-400">Payment overdue</p>
				{/if}
			</div>
		</header>

		<div class="space-y-6 px-5 py-6 sm:px-7">
			<!-- Meta + parties -->
			<div class="grid gap-6 sm:grid-cols-2">
				<div class="space-y-4">
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">From</p>
						<p class="mt-1 text-sm font-semibold text-primary">{from.name}</p>
						{#each from.addressLines ?? [] as line}
							<p class="text-xs text-secondary">{line}</p>
						{/each}
					</div>
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Bill to</p>
						<p class="mt-1 text-sm font-semibold text-primary">{billTo.name}</p>
						{#if billTo.email}
							<p class="text-xs text-muted">{billTo.email}</p>
						{/if}
						{#each billTo.addressLines ?? [] as line}
							<p class="text-xs text-secondary">{line}</p>
						{/each}
						{#if billTo.taxId}
							<p class="text-[11px] text-muted">Tax ID {billTo.taxId}</p>
						{/if}
					</div>
				</div>

				<dl class="grid h-fit gap-2 rounded-xl border border-border bg-surface/50 p-4 text-sm sm:justify-self-end sm:min-w-[14rem]">
					<div class="flex justify-between gap-4">
						<dt class="text-muted">Issued</dt>
						<dd class="font-medium text-primary">{issuedAt}</dd>
					</div>
					<div class="flex justify-between gap-4">
						<dt class="text-muted">Due</dt>
						<dd class="font-medium text-primary">{dueAt}</dd>
					</div>
					<div class="flex justify-between gap-4 border-t border-border pt-2">
						<dt class="text-muted">Amount due</dt>
						<dd class="font-semibold text-primary">{money(total)}</dd>
					</div>
				</dl>
			</div>

			<Divider />

			<!-- Line items -->
			<div class="overflow-x-auto">
				<table class="w-full min-w-[28rem] text-left text-sm">
					<thead>
						<tr class="border-b border-border text-[11px] uppercase tracking-wide text-muted">
							<th class="pb-2.5 pr-3 font-semibold">Description</th>
							<th class="pb-2.5 pr-3 font-semibold">Qty</th>
							<th class="pb-2.5 pr-3 font-semibold">Unit</th>
							<th class="pb-2.5 text-right font-semibold">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each lines as line (line.id)}
							<tr class="border-b border-border/60 last:border-0">
								<td class="py-3 pr-3 text-primary">{line.description}</td>
								<td class="py-3 pr-3 tabular-nums text-secondary">{line.qty}</td>
								<td class="py-3 pr-3 tabular-nums text-secondary">{money(line.unitPrice)}</td>
								<td class="py-3 text-right font-medium tabular-nums text-primary">
									{money(line.qty * line.unitPrice)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Totals -->
			<div class="flex flex-col gap-6 sm:flex-row sm:justify-between">
				{#if notes}
					<p class="max-w-sm text-xs leading-relaxed text-muted">{notes}</p>
				{:else}
					<span></span>
				{/if}
				<div class="w-full max-w-xs space-y-1.5 text-sm">
					<div class="flex justify-between text-secondary">
						<span>Subtotal</span>
						<span class="tabular-nums">{money(subtotal)}</span>
					</div>
					{#if discountAmount > 0}
						<div class="flex justify-between text-secondary">
							<span>Discount</span>
							<span class="tabular-nums">−{money(discountAmount)}</span>
						</div>
					{/if}
					<div class="flex justify-between text-secondary">
						<span>Tax ({Math.round(taxRate * 100)}%)</span>
						<span class="tabular-nums">{money(tax)}</span>
					</div>
					<div
						class="flex justify-between border-t border-border pt-2 text-base font-semibold text-primary"
					>
						<span>Total</span>
						<span class="tabular-nums">{money(total)}</span>
					</div>
				</div>
			</div>
		</div>

		<footer class="border-t border-border bg-surface/30 px-5 py-3 text-center text-[11px] text-muted sm:px-7">
			Thank you for your business · {brandName}
		</footer>
	</article>
</div>
