<script lang="ts">
	import StickyCTA from './StickyCTA.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
</script>

<div class="grid gap-6 md:grid-cols-2">
	<div class="relative h-[22rem] overflow-hidden rounded-2xl border border-border bg-surface">
		<div class="space-y-2 p-4 pb-28">
			<p class="text-sm font-medium text-primary">Checkout · row</p>
			<p class="text-xs text-secondary">Floating bar with inset so corners aren’t clipped.</p>
		</div>
		<StickyCTA label="Pay now" hint="SSL encrypted" placement="absolute">
			{#snippet leading()}
				<div>
					<p class="text-[11px] font-medium text-muted">Total</p>
					<PriceTag amount={48} currency="EUR" size="sm" />
				</div>
			{/snippet}
		</StickyCTA>
	</div>

	<div class="relative h-[22rem] overflow-hidden rounded-2xl border border-border bg-surface">
		<div class="space-y-2 p-4 pb-44">
			<p class="text-sm font-medium text-primary">Checkout · stack</p>
			<p class="text-xs text-secondary">Meta on top, then full-width actions.</p>
		</div>
		<StickyCTA
			layout="stack"
			label="Place order"
			secondaryLabel="Save for later"
			meta="€128.00"
			hint="Free returns within 30 days"
			placement="absolute"
		/>
	</div>
</div>
