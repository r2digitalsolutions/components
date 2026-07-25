<script lang="ts">
	import CartPage from './CartPage.svelte';

	let last = $state(false);
</script>

<div class="p-4">
	<CartPage oncheckout={() => (last = true)} />
</div>
{#if last}
	<p class="text-center text-xs text-muted">Checkout started</p>
{/if}
