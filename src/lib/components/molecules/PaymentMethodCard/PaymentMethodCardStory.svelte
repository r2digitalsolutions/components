<script lang="ts">
	import PaymentMethodCard from './PaymentMethodCard.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let last = $state('');
</script>

<div class="mx-auto max-w-lg p-4">
	<Stack gap="sm">
		<PaymentMethodCard
			brand="visa"
			last4="4242"
			expMonth={12}
			expYear={2027}
			isDefault
			onremove={() => (last = 'remove-4242')}
		/>
		<PaymentMethodCard
			brand="mastercard"
			last4="8210"
			expMonth={3}
			expYear={2026}
			onmakeDefault={() => (last = 'default-8210')}
			onremove={() => (last = 'remove-8210')}
		/>
		<PaymentMethodCard brand="amex" last4="1005" expMonth={8} expYear={2025} onselect={() => (last = 'select-amex')} />
	</Stack>
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
