<script lang="ts">
	import StickyCTA from './StickyCTA.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
</script>

<div class="relative mx-auto h-72 max-w-sm overflow-hidden rounded-2xl border border-border bg-surface">
	<div class="space-y-2 p-4 pb-28">
		<p class="text-sm font-medium text-primary">Checkout preview</p>
		<p class="text-xs text-secondary">Sticky CTA stays above the home indicator on phones.</p>
	</div>
	<StickyCTA label="Pay now" hint="Secure checkout · SSL encrypted" placement="absolute">
		{#snippet leading()}
			<PriceTag amount={48} currency="EUR" size="sm" />
		{/snippet}
	</StickyCTA>
</div>
