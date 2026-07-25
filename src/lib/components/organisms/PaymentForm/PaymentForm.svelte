<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import CreditCardInput from '$lib/components/molecules/CreditCardInput/CreditCardInput.svelte';
	import AddressFields from '$lib/components/molecules/AddressFields/AddressFields.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import type { SegmentItem } from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import Lock from '@lucide/svelte/icons/lock';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Building2 from '@lucide/svelte/icons/building-2';

	export type PaymentMethod = 'card' | 'invoice';

	export interface PaymentSummaryLine {
		id: string;
		label: string;
		amount: string;
	}

	interface PaymentFormProps {
		loading?: boolean;
		amountLabel?: string;
		/** Large amount shown in the header (e.g. $49.00) */
		amount?: string;
		currencyNote?: string;
		email?: string;
		summaryLines?: PaymentSummaryLine[];
		methods?: SegmentItem[];
		method?: PaymentMethod;
		showSaveCard?: boolean;
		showBillingToggle?: boolean;
		class?: string;
		onsubmit?: (payload: {
			method: PaymentMethod;
			email: string;
			saveCard: boolean;
		}) => void;
		onmethodchange?: (method: PaymentMethod) => void;
	}

	let {
		loading = false,
		amountLabel = 'Pay $49.00',
		amount = '$49.00',
		currencyNote = 'USD',
		email = $bindable(''),
		summaryLines = [
			{ id: '1', label: 'Pro plan · monthly', amount: '$29.00' },
			{ id: '2', label: 'Extra seats × 3', amount: '$18.00' },
			{ id: '3', label: 'Tax', amount: '$2.00' }
		],
		methods = [
			{ id: 'card', label: 'Card' },
			{ id: 'invoice', label: 'Invoice' }
		],
		method = $bindable<PaymentMethod>('card'),
		showSaveCard = true,
		showBillingToggle = true,
		class: className = '',
		onsubmit,
		onmethodchange
	}: PaymentFormProps = $props();

	let number = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let name = $state('');
	let sameAsBilling = $state(true);
	let line1 = $state('');
	let city = $state('');
	let postal = $state('');
	let country = $state('ES');
	let cardValid = $state(false);
	let saveCard = $state(false);

	const emailOk = $derived(!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));
	const canSubmit = $derived(
		method === 'invoice' ? emailOk && email.trim().length > 0 : cardValid && emailOk
	);

	function handleMethod(id: string) {
		method = id as PaymentMethod;
		onmethodchange?.(method);
	}

	function handleSubmit() {
		if (!canSubmit || loading) return;
		onsubmit?.({ method, email: email.trim(), saveCard });
	}
</script>

<Card class={`w-full max-w-lg ${className}`} padding="none" chrome={false}>
	<!-- Amount header -->
	<div
		class="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-surface/40 px-5 py-5 sm:px-6"
	>
		<div class="min-w-0 space-y-1">
			<div class="flex flex-wrap items-center gap-2">
				<p class="text-sm font-semibold text-primary">Payment</p>
				<Badge size="sm" variant="success" rounded>
					<span class="inline-flex items-center gap-1">
						<Lock class="h-3 w-3" strokeWidth={2.5} />
						Secure
					</span>
				</Badge>
			</div>
			<p class="text-xs text-muted">Complete your purchase securely.</p>
		</div>
		<div class="text-right">
			<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Due today</p>
			<p class="text-2xl font-semibold tracking-tight tabular-nums text-primary">{amount}</p>
			<p class="text-[11px] text-muted">{currencyNote}</p>
		</div>
	</div>

	<div class="space-y-5 px-5 py-5 sm:px-6">
		{#if summaryLines.length}
			<ul class="space-y-1.5 rounded-xl border border-border bg-surface/50 p-3 text-sm">
				{#each summaryLines as line (line.id)}
					<li class="flex justify-between gap-3">
						<span class="text-secondary">{line.label}</span>
						<span class="tabular-nums text-primary">{line.amount}</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if methods.length > 1}
			<div class="space-y-2">
				<p class="text-xs font-semibold uppercase tracking-wide text-muted">Method</p>
				<SegmentedControl
					items={methods}
					bind:value={method}
					size="sm"
					fullWidth
					onchange={handleMethod}
				/>
			</div>
		{/if}

		<div>
			<Input
				label="Email for receipt"
				type="email"
				placeholder="you@company.com"
				bind:value={email}
				size="sm"
				status={email && !emailOk ? 'error' : 'default'}
				helperText={email && !emailOk ? 'Enter a valid email address' : undefined}
			/>
		</div>

		{#if method === 'card'}
			<FormSection title="Card details" description="Visa, Mastercard, and Amex accepted." divided={false}>
				<div class="mb-1 flex items-center gap-1.5 text-xs text-muted">
					<CreditCard class="h-3.5 w-3.5" strokeWidth={2} />
					Card number is encrypted
				</div>
				<CreditCardInput
					bind:number
					bind:expiry
					bind:cvc
					bind:name
					onchange={(p) => (cardValid = p.valid)}
				/>
				{#if showSaveCard}
					<div class="mt-3">
						<Checkbox bind:checked={saveCard} label="Save card for future payments" />
					</div>
				{/if}
			</FormSection>

			{#if showBillingToggle}
				<FormSection title="Billing address" divided={false}>
					<Checkbox bind:checked={sameAsBilling} label="Same as shipping address" />
					{#if !sameAsBilling}
						<div class="mt-3">
							<AddressFields bind:line1 bind:city bind:postal bind:country />
						</div>
					{/if}
				</FormSection>
			{/if}
		{:else}
			<div
				class="flex gap-3 rounded-xl border border-dashed border-border bg-surface/40 p-4 text-sm"
			>
				<span
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"
				>
					<Building2 class="h-4 w-4" strokeWidth={2} />
				</span>
				<div class="min-w-0 space-y-1">
					<p class="font-medium text-primary">Pay by invoice</p>
					<p class="text-xs leading-relaxed text-muted">
						We’ll email an invoice to <span class="font-medium text-secondary"
							>{email.trim() || 'your address'}</span
						>. Net 30 terms apply for approved accounts.
					</p>
				</div>
			</div>
		{/if}

		<Divider />

		<FormActions
			submitLabel={method === 'invoice' ? 'Request invoice' : amountLabel}
			showCancel={false}
			{loading}
			disabled={!canSubmit}
			align="end"
			fullWidth
			hint="Payments are encrypted end-to-end"
			variant="plain"
			onsubmit={handleSubmit}
		/>
	</div>
</Card>
