<script lang="ts">
	import Barcode from './Barcode.svelte';
</script>

<div class="gap-8 bg-surface p-6 flex flex-col">
	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Code 128 (SKU)</p>
		<Barcode value="DEMO-SKU-001" />
	</div>
	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">EAN-13</p>
		<Barcode value="4006381333931" />
	</div>
	<div class="space-y-2">
		<p class="text-xs font-medium text-muted">Alphanumeric</p>
		<Barcode value="R2DIGI2026" />
	</div>
</div>
