<script lang="ts">
	import OrderSummary from './OrderSummary.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';

	let coupon = $state('');
	let status = $state<CouponStatus>('idle');
	let message = $state('');
	let discount = $state(0);

	function onapplycoupon(code: string) {
		status = 'loading';
		setTimeout(() => {
			if (code.toUpperCase() === 'SAVE10') {
				status = 'valid';
				message = '€10 off applied';
				discount = 10;
			} else {
				status = 'invalid';
				message = 'Invalid code';
				discount = 0;
			}
		}, 500);
	}
</script>

<div class="max-w-sm">
	<OrderSummary
		subtotal={86}
		shipping={0}
		tax={18}
		{discount}
		bind:coupon
		couponStatus={status}
		couponMessage={message}
		{onapplycoupon}
		onremovecoupon={() => {
			status = 'idle';
			message = '';
			discount = 0;
			coupon = '';
		}}
	/>
</div>
