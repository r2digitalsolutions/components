<script lang="ts">
	import CouponInput from './CouponInput.svelte';
	import type { CouponStatus } from './CouponInput.svelte';

	let value = $state('');
	let status = $state<CouponStatus>('idle');
	let message = $state('');

	function onapply(code: string) {
		status = 'loading';
		message = '';
		setTimeout(() => {
			if (code.toUpperCase() === 'SAVE20') {
				status = 'valid';
				message = '20% discount applied';
			} else {
				status = 'invalid';
				message = 'This coupon is not valid';
			}
		}, 600);
	}

	function onremove() {
		status = 'idle';
		message = '';
		value = '';
	}
</script>

<div class="max-w-sm">
	<CouponInput bind:value {status} {message} {onapply} {onremove} />
	<p class="mt-3 text-xs text-muted">Try <code class="font-mono">SAVE20</code></p>
</div>
