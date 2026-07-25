<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import CreditCardInput from '$lib/components/molecules/CreditCardInput/CreditCardInput.svelte';
	import AddressFields from '$lib/components/molecules/AddressFields/AddressFields.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	interface PaymentFormProps {
		loading?: boolean;
		amountLabel?: string;
		class?: string;
		onsubmit?: () => void;
	}

	let {
		loading = false,
		amountLabel = 'Pay $49.00',
		class: className = '',
		onsubmit
	}: PaymentFormProps = $props();

	let number = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let name = $state('');
	let sameAsBilling = $state(true);
	let line1 = $state('');
	let city = $state('');
	let postal = $state('');
	let country = $state('ES');
	let cardValid = $state(false);
</script>

<Card class={`w-full max-w-lg ${className}`} padding="lg" chrome={false}>
	<div class="mb-5 space-y-1">
		<Heading level={2} size="xl">Payment</Heading>
		<Text size="sm" tone="muted">Enter card details to complete your purchase.</Text>
	</div>

	<Stack gap="lg">
		<FormSection title="Card" divided={false}>
			<CreditCardInput
				bind:number
				bind:expiry
				bind:cvc
				bind:name
				onchange={(p) => (cardValid = p.valid)}
			/>
		</FormSection>

		<FormSection title="Billing address" divided={false}>
			<Checkbox bind:checked={sameAsBilling} label="Same as shipping address" />
			{#if !sameAsBilling}
				<div class="mt-3">
					<AddressFields bind:line1 bind:city bind:postal bind:country />
				</div>
			{/if}
		</FormSection>

		<FormActions
			submitLabel={amountLabel}
			showCancel={false}
			{loading}
			disabled={!cardValid}
			align="end"
			onsubmit={() => onsubmit?.()}
		/>
	</Stack>
</Card>
