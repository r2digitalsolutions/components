<script lang="ts">
	import PaymentForm from './PaymentForm.svelte';

	let paid = $state(false);
</script>

<div class="flex justify-center p-4">
	<PaymentForm onsubmit={() => (paid = true)} />
</div>
{#if paid}
	<p class="text-center text-xs text-muted">Payment submitted</p>
{/if}
