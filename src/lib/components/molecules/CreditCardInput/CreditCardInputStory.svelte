<script lang="ts">
	import CreditCardInput from './CreditCardInput.svelte';

	let number = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let name = $state('');
	let status = $state('');
</script>

<div class="max-w-md space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<CreditCardInput
		bind:number
		bind:expiry
		bind:cvc
		bind:name
		onchange={(p) => (status = `${p.brand} · ${p.valid ? 'valid' : 'incomplete'}`)}
	/>
	{#if status}
		<p class="text-xs text-muted">{status}</p>
	{/if}
</div>
