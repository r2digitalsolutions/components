<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Download from '@lucide/svelte/icons/download';
	import Eye from '@lucide/svelte/icons/eye';
	import type { InvoiceStatus } from '$lib/components/organisms/InvoicePage/InvoicePage.svelte';

	export interface InvoiceListItem {
		id: string;
		number: string;
		customer: string;
		date: string;
		dueDate?: string;
		amount: string;
		status: InvoiceStatus;
	}

	interface InvoiceListProps {
		title?: string;
		invoices?: InvoiceListItem[];
		query?: string;
		class?: string;
		onview?: (invoice: InvoiceListItem) => void;
		ondownload?: (invoice: InvoiceListItem) => void;
		oncreate?: () => void;
	}

	let {
		title = 'Invoices',
		invoices = [],
		query = $bindable(''),
		class: className = '',
		onview,
		ondownload,
		oncreate
	}: InvoiceListProps = $props();

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

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return invoices;
		return invoices.filter(
			(inv) =>
				inv.number.toLowerCase().includes(q) ||
				inv.customer.toLowerCase().includes(q) ||
				inv.status.includes(q)
		);
	});
</script>

<div
	class={[
		'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<div class="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-sm font-semibold text-primary">{title}</h2>
			<p class="text-[11px] text-muted">{filtered.length} invoices</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<div class="min-w-[10rem] flex-1 sm:max-w-xs">
				<SearchInput bind:value={query} placeholder="Search invoices…" size="sm" />
			</div>
			{#if oncreate}
				<Button size="sm" onclick={() => oncreate?.()}>New invoice</Button>
			{/if}
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="p-6">
			<EmptyState
				title="No invoices"
				description="Create an invoice or adjust your search."
				class="border-0 bg-transparent shadow-none"
			>
				{#snippet action()}
					{#if oncreate}
						<Button size="sm" onclick={() => oncreate?.()}>Create invoice</Button>
					{/if}
				{/snippet}
			</EmptyState>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full min-w-[36rem] text-left text-sm">
				<thead>
					<tr class="border-b border-border bg-surface/50 text-[11px] uppercase tracking-wide text-muted">
						<th class="px-4 py-2.5 font-semibold">Invoice</th>
						<th class="px-4 py-2.5 font-semibold">Customer</th>
						<th class="px-4 py-2.5 font-semibold">Date</th>
						<th class="px-4 py-2.5 font-semibold">Amount</th>
						<th class="px-4 py-2.5 font-semibold">Status</th>
						<th class="px-4 py-2.5 font-semibold"><span class="sr-only">Actions</span></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as inv (inv.id)}
						<tr class="border-b border-border/70 last:border-0 hover:bg-surface-overlay/40">
							<td class="px-4 py-3">
								<button
									type="button"
									class="font-medium text-primary hover:underline"
									onclick={() => onview?.(inv)}
								>
									{inv.number}
								</button>
								{#if inv.dueDate}
									<p class="text-[11px] text-muted">Due {inv.dueDate}</p>
								{/if}
							</td>
							<td class="px-4 py-3 text-secondary">{inv.customer}</td>
							<td class="px-4 py-3 text-muted">{inv.date}</td>
							<td class="px-4 py-3 font-medium tabular-nums text-primary">{inv.amount}</td>
							<td class="px-4 py-3">
								<Badge size="sm" variant={statusMeta[inv.status].variant}>
									{statusMeta[inv.status].label}
								</Badge>
							</td>
							<td class="px-4 py-3">
								<div class="flex justify-end gap-0.5">
									<button
										type="button"
										class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-primary"
										aria-label="View"
										onclick={() => onview?.(inv)}
									>
										<Eye class="h-4 w-4" strokeWidth={2} />
									</button>
									<button
										type="button"
										class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-primary"
										aria-label="Download"
										onclick={() => ondownload?.(inv)}
									>
										<Download class="h-4 w-4" strokeWidth={2} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
