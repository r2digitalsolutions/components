<script lang="ts">
	import ShippingEstimate from './ShippingEstimate.svelte';

	let selected = $state('standard');

	const options = [
		{ id: 'economy', label: 'Economy', eta: '5–7 business days', price: 0 },
		{ id: 'standard', label: 'Standard', eta: '3–5 business days', price: 5.99 },
		{ id: 'express', label: 'Express', eta: '1–2 business days', price: 14.99 }
	];
</script>

<div class="mx-auto max-w-lg p-4">
	<ShippingEstimate {options} bind:selected />
</div>
