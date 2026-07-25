<script lang="ts">
	import CheckoutTemplate from './CheckoutTemplate.svelte';
	import type { CheckoutLine, CheckoutStep } from './CheckoutTemplate.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';

	interface Props {
		example?:
			| 'default'
			| 'empty'
			| 'coupon'
			| 'shipping'
			| 'payment'
			| 'success'
			| 'loading';
		framed?: boolean;
	}

	let { example = 'default', framed = true }: Props = $props();

	const catalog: CheckoutLine[] = [
		{
			id: '1',
			title: 'Ceramic mug',
			subtitle: 'Sand / 350ml',
			price: 24,
			quantity: 2,
			image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80'
		},
		{
			id: '2',
			title: 'Pour-over set',
			subtitle: 'Matte stoneware',
			price: 64,
			quantity: 1,
			image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80'
		},
		{
			id: '3',
			title: 'Linen napkin set',
			subtitle: 'Set of 4 · oat',
			price: 32,
			quantity: 1,
			image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&q=80'
		}
	];

	let items = $state<CheckoutLine[]>(
		example === 'empty' ? [] : example === 'coupon' ? catalog.slice(0, 2) : [...catalog]
	);
	let step = $state<CheckoutStep>(
		example === 'shipping'
			? 'shipping'
			: example === 'payment'
				? 'payment'
				: example === 'success'
					? 'done'
					: 'cart'
	);
	let coupon = $state(example === 'coupon' ? 'WELCOME10' : '');
	let couponStatus = $state<CouponStatus>(example === 'coupon' ? 'valid' : 'idle');
	let couponMessage = $state(
		example === 'coupon' ? '10% off applied' : undefined as string | undefined
	);
	let discount = $state(example === 'coupon' ? 11.2 : 0);
	let email = $state('rafael@r2digisolutions.com');
	let line1 = $state(example === 'payment' || example === 'success' ? 'Calle Mayor 12' : '');
	let city = $state(example === 'payment' || example === 'success' ? 'Madrid' : '');
	let postal = $state(example === 'payment' || example === 'success' ? '28013' : '');
	let shippingMethod = $state('standard');
	let lastEvent = $state('');

	$effect(() => {
		if (example === 'empty') {
			items = [];
			step = 'cart';
		} else if (example === 'coupon') {
			items = catalog.slice(0, 2);
			step = 'cart';
			coupon = 'WELCOME10';
			couponStatus = 'valid';
			couponMessage = '10% off applied';
			discount = 11.2;
		} else if (example === 'shipping') {
			items = [...catalog];
			step = 'shipping';
		} else if (example === 'payment') {
			items = [...catalog];
			step = 'payment';
			line1 = 'Calle Mayor 12';
			city = 'Madrid';
			postal = '28013';
		} else if (example === 'success') {
			items = [...catalog];
			step = 'done';
		} else if (example === 'loading') {
			items = catalog.slice(0, 2);
			step = 'cart';
		} else {
			items = [...catalog];
			step = 'cart';
			coupon = '';
			couponStatus = 'idle';
			couponMessage = undefined;
			discount = 0;
		}
	});

	function applyCoupon(code: string) {
		couponStatus = 'loading';
		lastEvent = `coupon:apply:${code}`;
		window.setTimeout(() => {
			const normalized = code.trim().toUpperCase();
			if (normalized === 'WELCOME10' || normalized === 'SAVE10') {
				coupon = normalized;
				couponStatus = 'valid';
				couponMessage = '10% off applied';
				const sub = items.reduce((s, i) => s + i.price * i.quantity, 0);
				discount = Math.round(sub * 0.1 * 100) / 100;
			} else {
				couponStatus = 'invalid';
				couponMessage = 'Code not found';
				discount = 0;
			}
		}, 600);
	}

	function removeCoupon() {
		coupon = '';
		couponStatus = 'idle';
		couponMessage = undefined;
		discount = 0;
		lastEvent = 'coupon:remove';
	}
</script>

<div
	class={[
		'relative w-full overflow-hidden bg-surface',
		framed && 'rounded-2xl border border-border shadow-sm'
	]}
>
	<CheckoutTemplate
		bind:step
		{items}
		tax={18}
		{discount}
		bind:coupon
		{couponStatus}
		{couponMessage}
		bind:email
		bind:line1
		bind:city
		bind:postal
		bind:shippingMethod
		loading={example === 'loading'}
		orderId={example === 'success' ? 'ORD-28491' : undefined}
		oncontinue={() => {
			lastEvent = 'continue';
		}}
		onquantity={(id, qty) => {
			items = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
		}}
		onremove={(id) => {
			items = items.filter((i) => i.id !== id);
		}}
		onapplycoupon={applyCoupon}
		onremovecoupon={removeCoupon}
		oncheckout={() => {
			lastEvent = 'checkout';
		}}
		onplaceorder={(payload) => {
			lastEvent = `order:${payload.method}:${payload.email}`;
		}}
		onstepchange={(s) => {
			lastEvent = `step:${s}`;
		}}
	/>

	{#if lastEvent && !framed}
		<p class="px-4 pb-3 text-[11px] text-muted">Last: {lastEvent}</p>
	{/if}
</div>
