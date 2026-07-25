<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import CartLineItem from '$lib/components/molecules/CartItem/CartItem.svelte';
	import OrderSummary from '$lib/components/molecules/OrderSummary/OrderSummary.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';
	import StickyCTA from '$lib/components/molecules/StickyCTA/StickyCTA.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';

	export interface CheckoutLine {
		id: string;
		title: string;
		subtitle?: string;
		image?: string;
		price: number;
		quantity: number;
	}

	interface CheckoutTemplateProps {
		title?: string;
		items?: CheckoutLine[];
		shipping?: number;
		tax?: number;
		discount?: number;
		currency?: string;
		coupon?: string;
		couponStatus?: CouponStatus;
		couponMessage?: string;
		class?: string;
		aside?: Snippet;
		oncheckout?: () => void;
		onapplycoupon?: (code: string) => void;
		onremovecoupon?: () => void;
		onquantity?: (id: string, qty: number) => void;
		onremove?: (id: string) => void;
	}

	let {
		title = 'Checkout',
		items = [],
		shipping = 0,
		tax = 0,
		discount = 0,
		currency = 'EUR',
		coupon = $bindable(''),
		couponStatus = 'idle',
		couponMessage,
		class: className = '',
		aside,
		oncheckout,
		onapplycoupon,
		onremovecoupon,
		onquantity,
		onremove
	}: CheckoutTemplateProps = $props();

	const subtotal = $derived(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
	const total = $derived(Math.max(0, subtotal + shipping + tax - discount));
</script>

<div class={['relative w-full bg-surface pb-28', className]}>
	<Container size="5xl" class="space-y-6 py-6">
		<PageHeader {title} description="Review your cart and complete the purchase." />
		<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
			<div class="space-y-3">
				{#each items as item (item.id)}
					<CartLineItem
						id={item.id}
						title={item.title}
						subtitle={item.subtitle}
						image={item.image}
						price={item.price}
						quantity={item.quantity}
						{currency}
						onquantity={(q) => onquantity?.(item.id, q)}
						onremove={() => onremove?.(item.id)}
					/>
				{/each}
			</div>
			<div class="space-y-4">
				{#if aside}
					{@render aside()}
				{/if}
				<OrderSummary
					{subtotal}
					{shipping}
					{tax}
					{discount}
					{currency}
					bind:coupon
					{couponStatus}
					{couponMessage}
					{onapplycoupon}
					{onremovecoupon}
				/>
			</div>
		</div>
	</Container>

	<StickyCTA label="Pay now" placement="absolute" onprimary={() => oncheckout?.()}>
		{#snippet leading()}
			<PriceTag amount={total} {currency} size="sm" />
		{/snippet}
	</StickyCTA>
</div>
