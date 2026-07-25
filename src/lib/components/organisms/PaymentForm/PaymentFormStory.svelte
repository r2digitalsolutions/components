<script lang="ts">
	import PaymentForm from './PaymentForm.svelte';

	interface Props {
		variant?: 'default' | 'invoice' | 'loading';
	}

	let { variant = 'default' }: Props = $props();
	let paid = $state('');
	let email = $state('ap@acme.com');
	let method = $state<'card' | 'invoice'>(variant === 'invoice' ? 'invoice' : 'card');
</script>

<div class="flex justify-center p-4">
	<PaymentForm
		bind:email
		bind:method
		loading={variant === 'loading'}
		amount="$49.00"
		amountLabel="Pay $49.00"
		onsubmit={(p) => (paid = `${p.method}:${p.email || 'no-email'}`)}
	/>
</div>
{#if paid}
	<p class="text-center text-xs text-muted">Submitted: {paid}</p>
{/if}
