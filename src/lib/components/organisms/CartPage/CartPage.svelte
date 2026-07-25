<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import CartLineItem from '$lib/components/molecules/CartItem/CartItem.svelte';
	import OrderSummary from '$lib/components/molecules/OrderSummary/OrderSummary.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Lock from '@lucide/svelte/icons/lock';

	export interface CartItem {
		id: string;
		name: string;
		subtitle?: string;
		price: number;
		qty: number;
		image?: string;
		max?: number;
	}

	interface CartPageProps {
		title?: string;
		description?: string;
		items?: CartItem[];
		currency?: string;
		shipping?: number;
		tax?: number;
		discount?: number;
		coupon?: string;
		couponStatus?: CouponStatus;
		couponMessage?: string;
		showCoupon?: boolean;
		continueLabel?: string;
		class?: string;
		oncheckout?: () => void;
		oncontinue?: () => void;
		onapplycoupon?: (code: string) => void;
		onremovecoupon?: () => void;
		onchange?: (items: CartItem[]) => void;
	}

	let {
		title = 'Cart',
		description = 'Review items before checkout.',
		items = $bindable<CartItem[]>([
			{
				id: '1',
				name: 'Pro plan · monthly',
				subtitle: '$29 / seat',
				price: 29,
				qty: 1,
				image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80'
			},
			{
				id: '2',
				name: 'Extra seats',
				subtitle: '$6 each',
				price: 6,
				qty: 3,
				image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=120&q=80'
			}
		]),
		currency = 'USD',
		shipping = 0,
		tax = 0,
		discount = 0,
		coupon = $bindable(''),
		couponStatus = 'idle',
		couponMessage,
		showCoupon = true,
		continueLabel = 'Continue shopping',
		class: className = '',
		oncheckout,
		oncontinue,
		onapplycoupon,
		onremovecoupon,
		onchange
	}: CartPageProps = $props();

	const subtotal = $derived(items.reduce((s, i) => s + i.price * i.qty, 0));
	const total = $derived(Math.max(0, subtotal + shipping + tax - discount));
	const itemCount = $derived(items.reduce((s, i) => s + i.qty, 0));

	function setQty(id: string, qty: number) {
		items = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
		onchange?.(items);
	}

	function remove(id: string) {
		items = items.filter((i) => i.id !== id);
		onchange?.(items);
	}

	function money(n: number) {
		return new Intl.NumberFormat('en', { style: 'currency', currency }).format(n);
	}
</script>

<div class={['mx-auto w-full max-w-5xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			{#if items.length}
				<Badge size="sm" variant="secondary">{itemCount} {itemCount === 1 ? 'item' : 'items'}</Badge>
			{/if}
		{/snippet}
		{#snippet actions()}
			{#if oncontinue}
				<Button size="sm" variant="ghost" onclick={() => oncontinue?.()}>
					<ArrowLeft class="h-3.5 w-3.5" strokeWidth={2} />
					{continueLabel}
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if items.length === 0}
		<div
			class="rounded-2xl border border-border bg-surface-elevated px-4 py-10 shadow-sm sm:px-6"
		>
			<EmptyState
				title="Your cart is empty"
				description="Add a plan or seats to continue to checkout."
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
	{:else}
		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
			<section class="min-w-0 space-y-3" aria-label="Cart items">
				{#each items as item (item.id)}
					<CartLineItem
						id={item.id}
						title={item.name}
						subtitle={item.subtitle}
						image={item.image}
						price={item.price}
						quantity={item.qty}
						{currency}
						max={item.max ?? 99}
						onquantity={(q) => setQty(item.id, q)}
						onremove={() => remove(item.id)}
					/>
				{/each}
			</section>

			<aside class="min-w-0 space-y-4 lg:sticky lg:top-4 lg:self-start">
				<OrderSummary
					{subtotal}
					{shipping}
					{tax}
					{discount}
					{currency}
					{showCoupon}
					bind:coupon
					{couponStatus}
					{couponMessage}
					{onapplycoupon}
					{onremovecoupon}
				/>

				<div class="space-y-3">
					<Button class="w-full" onclick={() => oncheckout?.()}>
						Checkout · {money(total)}
					</Button>
					<p class="flex items-center justify-center gap-1.5 text-[11px] text-muted">
						<Lock class="h-3 w-3" strokeWidth={2} />
						Secure checkout · SSL encrypted
					</p>
				</div>
			</aside>
		</div>
	{/if}
</div>
