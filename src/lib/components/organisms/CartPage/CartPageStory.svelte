<script lang="ts">
	import CartPage from './CartPage.svelte';

	interface Props {
		variant?: 'default' | 'empty' | 'coupon';
	}

	let { variant = 'default' }: Props = $props();
	let last = $state('');
	let coupon = $state(variant === 'coupon' ? 'SAVE10' : '');
</script>

<div class="mx-auto max-w-5xl p-4">
	{#if variant === 'empty'}
		<CartPage
			items={[]}
			oncontinue={() => (last = 'continue')}
			oncheckout={() => (last = 'checkout')}
		/>
	{:else}
		<CartPage
			bind:coupon
			tax={2}
			discount={variant === 'coupon' ? 4.7 : 0}
			couponStatus={variant === 'coupon' ? 'valid' : 'idle'}
			couponMessage={variant === 'coupon' ? '10% off applied' : undefined}
			oncontinue={() => (last = 'continue')}
			oncheckout={() => (last = 'checkout')}
			onapplycoupon={(code) => {
				coupon = code;
				last = `coupon:${code}`;
			}}
			onremovecoupon={() => {
				coupon = '';
				last = 'coupon:removed';
			}}
		/>
	{/if}
	{#if last}
		<p class="mt-3 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
