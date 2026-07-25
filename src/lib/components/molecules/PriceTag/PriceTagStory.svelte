<script lang="ts">
	import PriceTag from './PriceTag.svelte';
</script>

<div class="space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<PriceTag amount={29} currency="USD" period="/mo" compareAt={39} badge="Save 25%" />
	<PriceTag amount={79} currency="EUR" period="/mo" size="lg" />
</div>
