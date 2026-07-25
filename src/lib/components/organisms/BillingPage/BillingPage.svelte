<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import PromoCard from '$lib/components/molecules/PromoCard/PromoCard.svelte';
	import FeatureList from '$lib/components/molecules/FeatureList/FeatureList.svelte';
	import type { FeatureListItem } from '$lib/components/molecules/FeatureList/FeatureList.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Meter from '$lib/components/atoms/Meter/Meter.svelte';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Download from '@lucide/svelte/icons/download';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Users from '@lucide/svelte/icons/users';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import Zap from '@lucide/svelte/icons/zap';

	export type BillingStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

	export interface BillingUsageItem {
		id: string;
		label: string;
		value: number;
		max: number;
		unit?: string;
		tone?: 'default' | 'success' | 'warning' | 'error' | 'brand';
	}

	export interface BillingPaymentMethod {
		brand: string;
		last4: string;
		expMonth: number;
		expYear: number;
	}

	export interface BillingInvoice {
		id: string;
		number: string;
		date: string;
		amount: string;
		status: 'paid' | 'open' | 'void' | 'uncollectible';
	}

	interface BillingPageProps {
		planName?: string;
		price?: string;
		period?: string;
		renewalDate?: string;
		seats?: string;
		status?: BillingStatus;
		/** Trial / next invoice hint */
		nextInvoiceAmount?: string;
		paymentMethod?: BillingPaymentMethod | null;
		usage?: BillingUsageItem[];
		invoices?: BillingInvoice[];
		features?: FeatureListItem[];
		showAnnualPromo?: boolean;
		class?: string;
		onupgrade?: () => void;
		onmanage?: () => void;
		oncancel?: () => void;
		onchangeseats?: () => void;
		ondownloadinvoice?: (invoice: BillingInvoice) => void;
		onswitchyearly?: () => void;
	}

	const {
		planName = 'Pro',
		price = '$29',
		period = '/mo',
		renewalDate = 'Aug 25, 2026',
		seats = '8 of 10 seats',
		status = 'active',
		nextInvoiceAmount = '$29.00',
		paymentMethod = {
			brand: 'Visa',
			last4: '4242',
			expMonth: 12,
			expYear: 2028
		},
		usage = [
			{ id: 'seats', label: 'Seats', value: 8, max: 10, unit: 'seats', tone: 'brand' },
			{ id: 'storage', label: 'Storage', value: 42, max: 100, unit: 'GB', tone: 'default' },
			{ id: 'api', label: 'API requests', value: 78, max: 100, unit: 'k this month', tone: 'warning' }
		],
		invoices = [
			{ id: '1', number: 'INV-2048', date: 'Jul 1, 2026', amount: '$29.00', status: 'paid' },
			{ id: '2', number: 'INV-2031', date: 'Jun 1, 2026', amount: '$29.00', status: 'paid' },
			{ id: '3', number: 'INV-2019', date: 'May 1, 2026', amount: '$29.00', status: 'paid' }
		],
		features = [
			{ id: '1', title: 'Unlimited projects', icon: 'check' },
			{ id: '2', title: 'Advanced analytics', icon: 'bolt' },
			{ id: '3', title: 'Priority support', icon: 'shield' },
			{ id: '4', title: 'SSO & audit logs', icon: 'spark' }
		],
		showAnnualPromo = true,
		class: className = '',
		onupgrade,
		onmanage,
		oncancel,
		onchangeseats,
		ondownloadinvoice,
		onswitchyearly
	}: BillingPageProps = $props();

	const statusMeta: Record<
		BillingStatus,
		{ label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'primary' }
	> = {
		active: { label: 'Active', variant: 'success' },
		past_due: { label: 'Past due', variant: 'warning' },
		canceled: { label: 'Canceled', variant: 'error' },
		trialing: { label: 'Trial', variant: 'info' }
	};

	const invoiceStatusVariant: Record<
		BillingInvoice['status'],
		'success' | 'warning' | 'secondary' | 'error'
	> = {
		paid: 'success',
		open: 'warning',
		void: 'secondary',
		uncollectible: 'error'
	};

	const usageIcon: Record<string, typeof Users> = {
		seats: Users,
		storage: HardDrive,
		api: Zap
	};
</script>

<div class={['mx-auto w-full max-w-5xl space-y-6', className]}>
	<PageHeader
		title="Billing"
		description="Manage your subscription, usage, payment method, and invoices."
	>
		{#snippet actions()}
			<Button size="sm" variant="secondary" onclick={() => onmanage?.()}>
				Manage payment
			</Button>
			{#if status !== 'canceled'}
				<Button size="sm" onclick={() => onupgrade?.()}>Upgrade plan</Button>
			{:else}
				<Button size="sm" onclick={() => onupgrade?.()}>Reactivate</Button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if status === 'past_due'}
		<Alert
			variant="warning"
			title="Payment past due"
			message="Update your payment method to keep {planName} features active. Access may be limited soon."
		/>
	{:else if status === 'canceled'}
		<Alert
			variant="error"
			title="Subscription canceled"
			message="Your plan stays available until {renewalDate}. Reactivate anytime to keep your data and seats."
		/>
	{:else if status === 'trialing'}
		<Alert
			variant="info"
			title="Trial in progress"
			message="Your trial ends on {renewalDate}. Add a payment method to continue on {planName}."
		/>
	{/if}

	<!-- Plan + usage -->
	<div class="grid gap-4 lg:grid-cols-5">
		<section class="lg:col-span-3">
			<Card padding="none" chrome={false} class="overflow-hidden">
				<div
					class="relative border-b border-border bg-gradient-to-br from-surface-overlay via-surface-elevated to-surface-elevated px-5 py-5 sm:px-6"
				>
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="min-w-0 space-y-2">
							<div class="flex flex-wrap items-center gap-2">
								<p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
									Current plan
								</p>
								<Badge size="sm" variant={statusMeta[status].variant}>
									{statusMeta[status].label}
								</Badge>
							</div>
							<div class="flex flex-wrap items-baseline gap-2">
								<h2 class="text-2xl font-semibold tracking-tight text-primary">{planName}</h2>
								<p class="text-lg text-secondary">
									<span class="font-semibold text-primary">{price}</span>
									<span class="text-muted">{period}</span>
								</p>
							</div>
							<p class="text-sm text-muted">
								{#if status === 'canceled'}
									Access until <span class="font-medium text-secondary">{renewalDate}</span>
								{:else if status === 'trialing'}
									Trial ends <span class="font-medium text-secondary">{renewalDate}</span>
								{:else}
									Renews <span class="font-medium text-secondary">{renewalDate}</span>
									{#if nextInvoiceAmount}
										· next invoice {nextInvoiceAmount}
									{/if}
								{/if}
							</p>
							<p class="text-sm text-secondary">{seats}</p>
						</div>
						<div class="flex flex-wrap gap-2">
							<Button size="sm" variant="secondary" onclick={() => onchangeseats?.()}>
								Edit seats
							</Button>
							<Button size="sm" variant="outline" onclick={() => onupgrade?.()}>
								Change plan
							</Button>
						</div>
					</div>
				</div>

				{#if usage.length}
					<div class="space-y-4 px-5 py-5 sm:px-6">
						<p class="text-xs font-semibold uppercase tracking-wide text-muted">Usage this period</p>
						<div class="grid gap-4 sm:grid-cols-1">
							{#each usage as item (item.id)}
								{@const Icon = usageIcon[item.id] ?? Sparkles}
								<div class="space-y-2 rounded-xl border border-border/80 bg-surface/40 p-3.5">
									<div class="flex items-center gap-2">
										<span
											class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-overlay text-secondary"
										>
											<Icon class="h-4 w-4" strokeWidth={2} />
										</span>
										<div class="min-w-0 flex-1">
											<p class="text-sm font-medium text-primary">{item.label}</p>
											<p class="text-[11px] text-muted">
												{item.value} / {item.max}
												{item.unit ?? ''}
											</p>
										</div>
									</div>
									<Meter
										value={item.value}
										max={item.max}
										tone={item.tone ?? 'brand'}
										size="sm"
										showValue={false}
										label=""
									/>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</Card>
		</section>

		<div class="flex flex-col gap-4 lg:col-span-2">
			{#if showAnnualPromo && status !== 'canceled'}
				<PromoCard
					eyebrow="Save 20%"
					badge="Annual"
					title="Switch to yearly billing"
					description="Lock in a lower rate and get two months free."
					actionLabel="Switch to yearly"
					onaction={() => onswitchyearly?.() ?? onupgrade?.()}
				/>
			{/if}

			<Card padding="lg" chrome={false}>
				<FeatureList title={`Included in ${planName}`} items={features} />
			</Card>
		</div>
	</div>

	<!-- Payment method -->
	<section class="space-y-3">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm font-semibold text-primary">Payment method</h3>
			<Button size="sm" variant="ghost" onclick={() => onmanage?.()}>
				{paymentMethod ? 'Update' : 'Add method'}
			</Button>
		</div>

		<Card padding="lg" chrome={false}>
			{#if paymentMethod}
				<div class="flex flex-wrap items-center gap-4">
					<span
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-overlay text-secondary ring-1 ring-border"
					>
						<CreditCard class="h-5 w-5" strokeWidth={2} />
					</span>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-semibold text-primary">
							{paymentMethod.brand} ···· {paymentMethod.last4}
						</p>
						<p class="text-xs text-muted">
							Expires {String(paymentMethod.expMonth).padStart(2, '0')}/{paymentMethod.expYear}
						</p>
					</div>
					{#if status === 'past_due'}
						<Badge variant="warning" size="sm">Needs update</Badge>
					{/if}
				</div>
			{:else}
				<EmptyState
					title="No payment method"
					description="Add a card to renew automatically and download invoices."
				>
					{#snippet action()}
						<Button size="sm" onclick={() => onmanage?.()}>Add payment method</Button>
					{/snippet}
				</EmptyState>
			{/if}
		</Card>
	</section>

	<!-- Invoices -->
	<section class="space-y-3">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-sm font-semibold text-primary">Invoice history</h3>
		</div>

		<Card padding="none" chrome={false} class="overflow-hidden">
			{#if invoices.length}
				<div class="overflow-x-auto">
					<table class="w-full min-w-[32rem] text-left text-sm">
						<thead>
							<tr class="border-b border-border bg-surface/50 text-[11px] uppercase tracking-wide text-muted">
								<th class="px-4 py-3 font-semibold sm:px-5">Invoice</th>
								<th class="px-4 py-3 font-semibold sm:px-5">Date</th>
								<th class="px-4 py-3 font-semibold sm:px-5">Amount</th>
								<th class="px-4 py-3 font-semibold sm:px-5">Status</th>
								<th class="px-4 py-3 font-semibold sm:px-5"><span class="sr-only">Actions</span></th>
							</tr>
						</thead>
						<tbody>
							{#each invoices as inv (inv.id)}
								<tr class="border-b border-border last:border-0 hover:bg-surface-overlay/40">
									<td class="px-4 py-3 font-medium text-primary sm:px-5">{inv.number}</td>
									<td class="px-4 py-3 text-secondary sm:px-5">{inv.date}</td>
									<td class="px-4 py-3 tabular-nums text-secondary sm:px-5">{inv.amount}</td>
									<td class="px-4 py-3 sm:px-5">
										<Badge size="sm" variant={invoiceStatusVariant[inv.status]}>
											{inv.status}
										</Badge>
									</td>
									<td class="px-4 py-3 text-right sm:px-5">
										<button
											type="button"
											class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted transition hover:bg-surface-overlay hover:text-primary"
											onclick={() => ondownloadinvoice?.(inv)}
										>
											<Download class="h-3.5 w-3.5" strokeWidth={2} />
											PDF
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="p-6">
					<EmptyState title="No invoices yet" description="Invoices will appear here after your first charge." />
				</div>
			{/if}
		</Card>
	</section>

	<!-- Danger zone -->
	{#if status !== 'canceled'}
		<section class="space-y-3">
			<h3 class="text-sm font-semibold text-primary">Danger zone</h3>
			<Card padding="lg" chrome={false} class="border-red-500/20">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="text-sm font-medium text-primary">Cancel subscription</p>
						<p class="text-xs leading-relaxed text-muted">
							You’ll keep access until the end of the billing period. You can reactivate later.
						</p>
					</div>
					<Button
						size="sm"
						variant="destructive"
						onclick={() => oncancel?.()}
					>
						Cancel plan
					</Button>
				</div>
			</Card>
		</section>
	{/if}
</div>
