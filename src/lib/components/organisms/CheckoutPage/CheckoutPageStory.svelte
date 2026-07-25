<script lang="ts">
	import CheckoutPage from './CheckoutPage.svelte';

	let selectedPlanId = $state('pro');
	let last = $state('');
</script>

<div class="p-4">
	<CheckoutPage
		bind:selectedPlanId
		onsubmit={(p) => (last = `${p.planId} · ${p.email}`)}
	/>
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Submitted: {last}</p>
	{/if}
</div>
