<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import Check from '@lucide/svelte/icons/check';
	import Download from '@lucide/svelte/icons/download';

	export interface ReceiptLine {
		id: string;
		label: string;
		amount: string;
	}

	interface ReceiptCardProps {
		title?: string;
		receiptNumber?: string;
		paidAt?: string;
		method?: string;
		customer?: string;
		lines?: ReceiptLine[];
		total?: string;
		currencyNote?: string;
		class?: string;
		ondownload?: () => void;
		onviewinvoice?: () => void;
	}

	let {
		title = 'Payment received',
		receiptNumber = 'RCT-9182',
		paidAt = 'Jul 25, 2026 · 14:32',
		method = 'Visa ···· 4242',
		customer = 'Acme Corp',
		lines = [
			{ id: '1', label: 'Pro plan · Jul 2026', amount: '€29.00' },
			{ id: '2', label: 'Extra seats (5)', amount: '€30.00' },
			{ id: '3', label: 'Tax (21%)', amount: '€12.39' }
		],
		total = '€71.39',
		currencyNote = 'EUR',
		class: className = '',
		ondownload,
		onviewinvoice
	}: ReceiptCardProps = $props();
</script>

<article
	class={[
		'w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<div class="flex flex-col items-center gap-2 border-b border-border bg-emerald-500/5 px-5 py-6 text-center">
		<span
			class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
		>
			<Check class="h-6 w-6" strokeWidth={2.5} />
		</span>
		<h2 class="text-lg font-semibold tracking-tight text-primary">{title}</h2>
		<p class="text-xs text-muted">{paidAt}</p>
		<Badge size="sm" variant="success">Paid</Badge>
	</div>

	<div class="space-y-4 px-5 py-5">
		<dl class="space-y-2 text-sm">
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Receipt</dt>
				<dd class="font-mono text-xs font-medium text-primary">{receiptNumber}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Customer</dt>
				<dd class="font-medium text-secondary">{customer}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-muted">Method</dt>
				<dd class="font-medium text-secondary">{method}</dd>
			</div>
		</dl>

		<Divider />

		<ul class="space-y-2 text-sm">
			{#each lines as line (line.id)}
				<li class="flex justify-between gap-3">
					<span class="text-secondary">{line.label}</span>
					<span class="tabular-nums text-primary">{line.amount}</span>
				</li>
			{/each}
		</ul>

		<div class="flex justify-between border-t border-border pt-3 text-base font-semibold text-primary">
			<span>Total ({currencyNote})</span>
			<span class="tabular-nums">{total}</span>
		</div>

		<div class="flex flex-col gap-2 pt-1 sm:flex-row">
			{#if ondownload}
				<Button size="sm" variant="secondary" class="flex-1" onclick={() => ondownload?.()}>
					<Download class="h-3.5 w-3.5" strokeWidth={2} />
					Download
				</Button>
			{/if}
			{#if onviewinvoice}
				<Button size="sm" class="flex-1" onclick={() => onviewinvoice?.()}>View invoice</Button>
			{/if}
		</div>
	</div>
</article>
