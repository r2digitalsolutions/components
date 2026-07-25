<script lang="ts">
	import type { Snippet } from 'svelte';
	import CartLineItem from '$lib/components/molecules/CartItem/CartItem.svelte';
	import OrderSummary from '$lib/components/molecules/OrderSummary/OrderSummary.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';
	import StickyCTA from '$lib/components/molecules/StickyCTA/StickyCTA.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import AddressFields from '$lib/components/molecules/AddressFields/AddressFields.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import PaymentForm from '$lib/components/organisms/PaymentForm/PaymentForm.svelte';
	import type { PaymentMethod } from '$lib/components/organisms/PaymentForm/PaymentForm.svelte';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Lock from '@lucide/svelte/icons/lock';
	import Check from '@lucide/svelte/icons/check';
	import CheckCircle2 from '@lucide/svelte/icons/circle-check';
	import Package from '@lucide/svelte/icons/package';

	export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'done';

	export interface CheckoutLine {
		id: string;
		title: string;
		subtitle?: string;
		image?: string;
		price: number;
		quantity: number;
		max?: number;
	}

	export interface CheckoutShippingOption {
		id: string;
		label: string;
		description?: string;
		price: number;
		eta?: string;
	}

	interface CheckoutNavStep {
		id: CheckoutStep;
		label: string;
	}

	interface CheckoutTemplateProps {
		title?: string;
		description?: string;
		step?: CheckoutStep;
		items?: CheckoutLine[];
		shipping?: number;
		tax?: number;
		discount?: number;
		currency?: string;
		coupon?: string;
		couponStatus?: CouponStatus;
		couponMessage?: string;
		showCoupon?: boolean;
		showProgress?: boolean;
		shippingOptions?: CheckoutShippingOption[];
		shippingMethod?: string;
		email?: string;
		line1?: string;
		line2?: string;
		city?: string;
		state?: string;
		postal?: string;
		country?: string;
		orderId?: string;
		loading?: boolean;
		continueLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		successTitle?: string;
		successDescription?: string;
		class?: string;
		children?: Snippet;
		aside?: Snippet;
		actions?: Snippet;
		onstepchange?: (step: CheckoutStep) => void;
		oncheckout?: () => void;
		onplaceorder?: (payload: {
			method: PaymentMethod;
			email: string;
			saveCard: boolean;
		}) => void;
		oncontinue?: () => void;
		onapplycoupon?: (code: string) => void;
		onremovecoupon?: () => void;
		onquantity?: (id: string, qty: number) => void;
		onremove?: (id: string) => void;
	}

	let {
		title = 'Checkout',
		description = 'Review your bag, then ship and pay.',
		step = $bindable<CheckoutStep>('cart'),
		items = [],
		shipping = 0,
		tax = 0,
		discount = 0,
		currency = 'EUR',
		coupon = $bindable(''),
		couponStatus = 'idle',
		couponMessage,
		showCoupon = true,
		showProgress = true,
		shippingOptions = [
			{
				id: 'standard',
				label: 'Standard',
				description: 'Tracked parcel',
				price: 0,
				eta: '3–5 days'
			},
			{
				id: 'express',
				label: 'Express',
				description: 'Priority handling',
				price: 9.9,
				eta: '1–2 days'
			}
		],
		shippingMethod = $bindable('standard'),
		email = $bindable(''),
		line1 = $bindable(''),
		line2 = $bindable(''),
		city = $bindable(''),
		state = $bindable(''),
		postal = $bindable(''),
		country = $bindable('ES'),
		orderId,
		loading = false,
		continueLabel = 'Continue shopping',
		emptyTitle = 'Your bag is empty',
		emptyDescription = 'Add something you love, then come back to checkout.',
		successTitle = 'Order confirmed',
		successDescription = 'Thanks — a receipt is on its way to your inbox.',
		class: className = '',
		children,
		aside,
		actions,
		onstepchange,
		oncheckout,
		onplaceorder,
		oncontinue,
		onapplycoupon,
		onremovecoupon,
		onquantity,
		onremove
	}: CheckoutTemplateProps = $props();

	const navSteps: CheckoutNavStep[] = [
		{ id: 'cart', label: 'Bag' },
		{ id: 'shipping', label: 'Shipping' },
		{ id: 'payment', label: 'Payment' }
	];

	const subtotal = $derived(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
	const selectedShipping = $derived(
		shippingOptions.find((o) => o.id === shippingMethod) ?? shippingOptions[0]
	);
	const shippingCost = $derived(selectedShipping?.price ?? shipping);
	const total = $derived(Math.max(0, subtotal + shippingCost + tax - discount));
	const itemCount = $derived(items.reduce((s, i) => s + i.quantity, 0));
	const isEmpty = $derived(items.length === 0);
	const showSummary = $derived(!isEmpty && step !== 'done');

	const money = $derived(
		(n: number) => new Intl.NumberFormat('en', { style: 'currency', currency }).format(n)
	);

	const activeNavIndex = $derived(
		Math.max(
			0,
			navSteps.findIndex((s) => s.id === (step === 'done' ? 'payment' : step))
		)
	);
	const progressPct = $derived(((activeNavIndex + 1) / navSteps.length) * 100);

	const stepTitle = $derived(
		step === 'shipping'
			? 'Shipping'
			: step === 'payment'
				? 'Payment'
				: step === 'done'
					? successTitle
					: title
	);

	const stepDescription = $derived(
		step === 'shipping'
			? 'Delivery details for this order.'
			: step === 'payment'
				? 'Pay securely — card or invoice.'
				: step === 'done'
					? successDescription
					: description
	);

	const ctaLabel = $derived(
		step === 'cart' ? 'Continue' : step === 'shipping' ? 'Continue to payment' : 'Pay now'
	);

	const shippingReady = $derived(
		line1.trim().length > 0 && city.trim().length > 0 && postal.trim().length > 0
	);

	const ctaDisabled = $derived(
		isEmpty ||
			loading ||
			(step === 'shipping' && !shippingReady) ||
			step === 'payment' ||
			step === 'done'
	);

	function go(next: CheckoutStep) {
		step = next;
		onstepchange?.(next);
	}

	function canGoTo(index: number) {
		return index <= activeNavIndex;
	}

	function goNav(index: number) {
		if (!canGoTo(index)) return;
		const next = navSteps[index]?.id;
		if (next) go(next);
	}

	function primaryAction() {
		if (step === 'cart') {
			oncheckout?.();
			go('shipping');
			return;
		}
		if (step === 'shipping' && shippingReady) go('payment');
	}

	function back() {
		if (step === 'shipping') go('cart');
		else if (step === 'payment') go('shipping');
	}

	function handlePayment(payload: {
		method: PaymentMethod;
		email: string;
		saveCard: boolean;
	}) {
		if (payload.email) email = payload.email;
		onplaceorder?.(payload);
		go('done');
	}
</script>

<div
	class={[
		'relative w-full bg-surface',
		showSummary && step !== 'payment' && 'pb-28',
		className
	]}
>
	<Container size="5xl" class="py-6 sm:py-8">
		{#if step === 'done'}
			<div class="mx-auto max-w-md py-10 text-center sm:py-14">
				<div
					class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
				>
					<CheckCircle2 class="h-8 w-8" strokeWidth={1.5} />
				</div>
				<p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Complete</p>
				<h1 class="mt-2 text-2xl font-semibold tracking-tight text-primary">{successTitle}</h1>
				<p class="mt-2 text-sm leading-relaxed text-muted">{successDescription}</p>
				{#if orderId}
					<p
						class="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 font-mono text-xs text-secondary"
					>
						<Package class="h-3.5 w-3.5" strokeWidth={2} />
						{orderId}
					</p>
				{/if}
				<div class="mt-8 flex flex-wrap items-center justify-center gap-2">
					{#if oncontinue}
						<Button size="sm" onclick={() => oncontinue?.()}>{continueLabel}</Button>
					{/if}
					<Button size="sm" variant="ghost" onclick={() => go('cart')}>Back to bag</Button>
				</div>
			</div>
		{:else}
			<header class="mb-8 space-y-5">
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0">
						{#if !isEmpty && (step !== 'cart' || oncontinue)}
							<button
								type="button"
								class="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-primary"
								onclick={() => (step === 'cart' ? oncontinue?.() : back())}
							>
								<ArrowLeft class="h-3.5 w-3.5" strokeWidth={2} />
								{step === 'cart' ? continueLabel : 'Back'}
							</button>
						{/if}
						<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
							{#if isEmpty}
								Checkout
							{:else}
								Step {activeNavIndex + 1} of {navSteps.length}
							{/if}
						</p>
						<h1 class="mt-1 text-2xl font-semibold tracking-tight text-primary sm:text-[1.75rem]">
							{stepTitle}
						</h1>
						<p class="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{stepDescription}</p>
					</div>

					{#if actions}
						<div class="shrink-0 pt-1">
							{@render actions()}
						</div>
					{:else if !isEmpty}
						<p class="shrink-0 pt-1 text-xs tabular-nums text-muted">
							{itemCount} {itemCount === 1 ? 'item' : 'items'}
						</p>
					{/if}
				</div>

				{#if !isEmpty && showProgress}
					<nav class="space-y-3" aria-label="Checkout progress">
						<div
							class="h-1 overflow-hidden rounded-full bg-border/80"
							role="progressbar"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={Math.round(progressPct)}
							aria-label="Checkout progress"
						>
							<div
								class="h-full rounded-full bg-zinc-900 transition-[width] duration-300 ease-out dark:bg-zinc-100"
								style:width="{progressPct}%"
							></div>
						</div>

						<ol class="flex items-center gap-1 sm:gap-0">
							{#each navSteps as s, index (s.id)}
								{@const done = index < activeNavIndex}
								{@const current = index === activeNavIndex}
								{@const allowed = canGoTo(index)}
								<li class="flex min-w-0 flex-1 items-center">
									<button
										type="button"
										disabled={!allowed}
										aria-current={current ? 'step' : undefined}
										onclick={() => goNav(index)}
										class={[
											'group flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition-colors',
											allowed && !current && 'hover:bg-surface-overlay',
											!allowed && 'cursor-default'
										]}
									>
										<span
											class={[
												'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
												done && 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
												current &&
													'bg-zinc-900 text-white ring-2 ring-zinc-900/15 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-100/20',
												!done &&
													!current &&
													'bg-surface-overlay text-muted ring-1 ring-border'
											]}
										>
											{#if done}
												<Check class="h-3 w-3" strokeWidth={3} />
											{:else}
												{index + 1}
											{/if}
										</span>
										<span
											class={[
												'truncate text-xs font-medium',
												current ? 'text-primary' : done ? 'text-secondary' : 'text-muted'
											]}
										>
											{s.label}
										</span>
									</button>
									{#if index < navSteps.length - 1}
										<span
											class="mx-1 hidden h-px flex-1 bg-border sm:block"
											aria-hidden="true"
										></span>
									{/if}
								</li>
							{/each}
						</ol>
					</nav>
				{/if}
			</header>

			{#if isEmpty}
				<div class="rounded-2xl border border-dashed border-border bg-surface-elevated/60 px-4 py-12">
					<EmptyState
						title={emptyTitle}
						description={emptyDescription}
						class="border-0 bg-transparent shadow-none"
					>
						{#snippet icon()}
							<ShoppingBag class="h-7 w-7" strokeWidth={1.75} />
						{/snippet}
						{#snippet action()}
							{#if oncontinue}
								<Button size="sm" onclick={() => oncontinue?.()}>{continueLabel}</Button>
							{/if}
						{/snippet}
					</EmptyState>
				</div>
			{:else if children}
				{@render children()}
			{:else}
				<div
					class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]"
				>
					<section class="min-w-0 space-y-5" aria-label={stepTitle}>
						{#if step === 'cart'}
							<ul class="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-elevated">
								{#each items as item (item.id)}
									<li class="p-3 sm:p-3.5">
										<CartLineItem
											id={item.id}
											title={item.title}
											subtitle={item.subtitle}
											image={item.image}
											price={item.price}
											quantity={item.quantity}
											{currency}
											max={item.max ?? 99}
											class="border-0 bg-transparent p-0 shadow-none"
											onquantity={(q) => onquantity?.(item.id, q)}
											onremove={() => onremove?.(item.id)}
										/>
									</li>
								{/each}
							</ul>
						{:else if step === 'shipping'}
							<div class="space-y-6 rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6">
								<div class="space-y-4">
									<div>
										<p class="text-sm font-semibold text-primary">Contact</p>
										<p class="mt-0.5 text-xs text-muted">Order updates and receipt.</p>
									</div>
									<FormField
										label="Email"
										type="email"
										bind:value={email}
										required
										placeholder="you@company.com"
									/>
								</div>

								<div class="border-t border-border pt-6">
									<div class="mb-4">
										<p class="text-sm font-semibold text-primary">Address</p>
										<p class="mt-0.5 text-xs text-muted">Where we deliver the parcel.</p>
									</div>
									<AddressFields
										bind:line1
										bind:line2
										bind:city
										bind:state
										bind:postal
										bind:country
									/>
								</div>

								<div class="border-t border-border pt-6">
									<div class="mb-3">
										<p class="text-sm font-semibold text-primary">Delivery</p>
										<p class="mt-0.5 text-xs text-muted">Choose speed and cost.</p>
									</div>
									<div class="grid gap-2" role="radiogroup" aria-label="Shipping method">
										{#each shippingOptions as option (option.id)}
											{@const selected = shippingMethod === option.id}
											<button
												type="button"
												role="radio"
												aria-checked={selected}
												onclick={() => (shippingMethod = option.id)}
												class={[
													'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
													selected
														? 'border-zinc-900 bg-zinc-900/[0.03] dark:border-zinc-100 dark:bg-zinc-100/[0.06]'
														: 'border-border hover:bg-surface-overlay'
												]}
											>
												<span
													class={[
														'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
														selected
															? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
															: 'border-border'
													]}
													aria-hidden="true"
												>
													{#if selected}
														<span
															class="h-1.5 w-1.5 rounded-full bg-white dark:bg-zinc-900"
														></span>
													{/if}
												</span>
												<span class="min-w-0 flex-1">
													<span class="block text-sm font-medium text-primary"
														>{option.label}</span
													>
													{#if option.description || option.eta}
														<span class="block text-xs text-muted">
															{[option.description, option.eta].filter(Boolean).join(' · ')}
														</span>
													{/if}
												</span>
												<span class="shrink-0 text-sm font-medium tabular-nums text-primary">
													{option.price === 0 ? 'Free' : money(option.price)}
												</span>
											</button>
										{/each}
									</div>
								</div>
							</div>
						{:else if step === 'payment'}
							<PaymentForm
								amount={money(total)}
								amountLabel={`Pay ${money(total)}`}
								currencyNote={currency}
								bind:email
								loading={loading}
								summaryLines={[]}
								class="max-w-none"
								onsubmit={handlePayment}
							/>
						{/if}
					</section>

					{#if showSummary}
						<aside class="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
							{#if aside}
								{@render aside()}
							{/if}

							{#if step !== 'cart'}
								<div
									class="overflow-hidden rounded-2xl border border-border bg-surface-elevated"
								>
									<div class="border-b border-border px-4 py-3">
										<p class="text-xs font-semibold uppercase tracking-wide text-muted">
											In your bag
										</p>
									</div>
									<ul class="divide-y divide-border">
										{#each items as item (item.id)}
											<li class="flex items-center gap-3 px-4 py-3">
												<div
													class="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-overlay"
												>
													{#if item.image}
														<Image
															src={item.image}
															alt={item.title}
															class="h-full w-full object-cover"
														/>
													{/if}
													{#if item.quantity > 1}
														<span
															class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
														>
															{item.quantity}
														</span>
													{/if}
												</div>
												<div class="min-w-0 flex-1">
													<p class="truncate text-xs font-medium text-primary">{item.title}</p>
													{#if item.subtitle}
														<p class="truncate text-[11px] text-muted">{item.subtitle}</p>
													{/if}
												</div>
												<p class="shrink-0 text-xs tabular-nums text-secondary">
													{money(item.price * item.quantity)}
												</p>
											</li>
										{/each}
									</ul>
								</div>
							{/if}

							<OrderSummary
								{subtotal}
								shipping={shippingCost}
								{tax}
								{discount}
								{currency}
								showCoupon={showCoupon && step === 'cart'}
								bind:coupon
								{couponStatus}
								{couponMessage}
								{onapplycoupon}
								{onremovecoupon}
							/>

							{#if step === 'payment'}
								<p class="flex items-center justify-center gap-1.5 text-[11px] text-muted">
									<Lock class="h-3 w-3" strokeWidth={2} />
									Encrypted payment
								</p>
							{:else}
								<div class="hidden space-y-3 lg:block">
									<Button
										class="w-full"
										disabled={ctaDisabled}
										{loading}
										onclick={primaryAction}
									>
										{ctaLabel}
										<span class="opacity-70">· {money(total)}</span>
									</Button>
									<p class="flex items-center justify-center gap-1.5 text-[11px] text-muted">
										<Lock class="h-3 w-3" strokeWidth={2} />
										Secure checkout
									</p>
								</div>
							{/if}
						</aside>
					{/if}
				</div>
			{/if}
		{/if}
	</Container>

	{#if showSummary && step !== 'payment' && step !== 'done'}
		<StickyCTA
			label={ctaLabel}
			placement="absolute"
			disabled={ctaDisabled}
			{loading}
			hint="Secure checkout"
			onprimary={primaryAction}
			class="lg:hidden"
		>
			{#snippet leading()}
				<PriceTag amount={total} {currency} size="sm" />
			{/snippet}
		</StickyCTA>
	{/if}
</div>
