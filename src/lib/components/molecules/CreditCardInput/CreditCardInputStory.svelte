<script lang="ts">
	import CreditCardInput from './CreditCardInput.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import type { CardBrand } from './CreditCardInput.svelte';

	let number = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let name = $state('');
	let brand = $state<CardBrand>('unknown');
	let valid = $state(false);

	const brandNames: Record<CardBrand, string> = {
		visa: 'Visa',
		mastercard: 'Mastercard',
		amex: 'American Express',
		discover: 'Discover',
		unknown: '—'
	};
</script>

<div class="max-w-md space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<CreditCardInput
		bind:number
		bind:expiry
		bind:cvc
		bind:name
		onchange={(p) => {
			brand = p.brand;
			valid = p.valid;
		}}
	/>

	<div class="flex items-center justify-between border-t border-border pt-3">
		<Text size="xs" tone="muted">
			Try <span class="font-mono text-secondary">4242…</span> (Visa) or
			<span class="font-mono text-secondary">3782…</span> (Amex)
		</Text>
		<span
			class={[
				'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
				valid
					? 'bg-green-500/15 text-green-700 dark:text-green-400'
					: 'bg-surface-overlay text-muted'
			]}
		>
			{valid ? 'Ready' : brandNames[brand]}
		</span>
	</div>
</div>
