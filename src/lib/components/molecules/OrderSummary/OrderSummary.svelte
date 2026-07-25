<script lang="ts">
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import CouponInput from '$lib/components/molecules/CouponInput/CouponInput.svelte';
	import type { CouponStatus } from '$lib/components/molecules/CouponInput/CouponInput.svelte';

	export interface OrderLine {
		id: string;
		label: string;
		amount: number;
	}

	interface OrderSummaryProps {
		subtotal: number;
		shipping?: number;
		tax?: number;
		discount?: number;
		currency?: string;
		lines?: OrderLine[];
		showCoupon?: boolean;
		coupon?: string;
		couponStatus?: CouponStatus;
		couponMessage?: string;
		class?: string;
		onapplycoupon?: (code: string) => void;
		onremovecoupon?: () => void;
	}

	let {
		subtotal,
		shipping = 0,
		tax = 0,
		discount = 0,
		currency = 'EUR',
		lines = [],
		showCoupon = true,
		coupon = $bindable(''),
		couponStatus = 'idle',
		couponMessage,
		class: className = '',
		onapplycoupon,
		onremovecoupon
	}: OrderSummaryProps = $props();

	const total = $derived(Math.max(0, subtotal + shipping + tax - discount));

	function money(n: number) {
		return new Intl.NumberFormat('en', { style: 'currency', currency }).format(n);
	}
</script>

<div class={['space-y-4 rounded-2xl border border-border bg-surface-elevated p-4', className]}>
	<p class="text-sm font-semibold text-primary">Order summary</p>

	{#if lines.length}
		<ul class="space-y-1.5">
			{#each lines as line (line.id)}
				<li class="flex justify-between gap-3 text-sm">
					<span class="text-secondary">{line.label}</span>
					<span class="tabular-nums text-primary">{money(line.amount)}</span>
				</li>
			{/each}
			<Divider class="my-2" />
		</ul>
	{/if}

	<dl class="space-y-1.5 text-sm">
		<div class="flex justify-between gap-3">
			<dt class="text-secondary">Subtotal</dt>
			<dd class="tabular-nums text-primary">{money(subtotal)}</dd>
		</div>
		<div class="flex justify-between gap-3">
			<dt class="text-secondary">Shipping</dt>
			<dd class="tabular-nums text-primary">{shipping === 0 ? 'Free' : money(shipping)}</dd>
		</div>
		{#if tax > 0}
			<div class="flex justify-between gap-3">
				<dt class="text-secondary">Tax</dt>
				<dd class="tabular-nums text-primary">{money(tax)}</dd>
			</div>
		{/if}
		{#if discount > 0}
			<div class="flex justify-between gap-3">
				<dt class="text-emerald-600 dark:text-emerald-400">Discount</dt>
				<dd class="tabular-nums text-emerald-600 dark:text-emerald-400">−{money(discount)}</dd>
			</div>
		{/if}
	</dl>

	{#if showCoupon}
		<CouponInput
			bind:value={coupon}
			status={couponStatus}
			message={couponMessage}
			size="sm"
			onapply={(c) => onapplycoupon?.(c)}
			onremove={() => onremovecoupon?.()}
		/>
	{/if}

	<Divider />
	<div class="flex items-baseline justify-between gap-3">
		<span class="text-sm font-semibold text-primary">Total</span>
		<span class="text-xl font-semibold tabular-nums text-primary">{money(total)}</span>
	</div>
</div>
