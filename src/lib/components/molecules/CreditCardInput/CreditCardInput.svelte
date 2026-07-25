<script lang="ts">
	import MaskedInput from '$lib/components/molecules/MaskedInput/MaskedInput.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

	interface CreditCardInputProps {
		number?: string;
		expiry?: string;
		cvc?: string;
		name?: string;
		disabled?: boolean;
		class?: string;
		onchange?: (payload: {
			number: string;
			expiry: string;
			cvc: string;
			name: string;
			brand: CardBrand;
			valid: boolean;
		}) => void;
	}

	let {
		number = $bindable(''),
		expiry = $bindable(''),
		cvc = $bindable(''),
		name = $bindable(''),
		disabled = false,
		class: className = '',
		onchange
	}: CreditCardInputProps = $props();

	function luhn(raw: string): boolean {
		const digits = raw.replace(/\D/g, '');
		if (digits.length < 13) return false;
		let sum = 0;
		let alt = false;
		for (let i = digits.length - 1; i >= 0; i--) {
			let n = Number(digits[i]);
			if (alt) {
				n *= 2;
				if (n > 9) n -= 9;
			}
			sum += n;
			alt = !alt;
		}
		return sum % 10 === 0;
	}

	const brand = $derived.by((): CardBrand => {
		const d = number.replace(/\D/g, '');
		if (/^4/.test(d)) return 'visa';
		if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
		if (/^3[47]/.test(d)) return 'amex';
		return 'unknown';
	});

	const numberValid = $derived(luhn(number));
	const expiryValid = $derived(/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry));
	const cvcValid = $derived(brand === 'amex' ? /^\d{4}$/.test(cvc) : /^\d{3}$/.test(cvc));
	const valid = $derived(numberValid && expiryValid && cvcValid && name.trim().length > 1);

	function emit() {
		onchange?.({ number, expiry, cvc, name, brand, valid });
	}
</script>

<div class={['w-full space-y-3', className]}>
	<MaskedInput
		mask="#### #### #### ####"
		label="Card number"
		placeholder="ACCT-000003"
		bind:value={number}
		{disabled}
		status={number && !numberValid ? 'error' : 'default'}
		helperText={number && !numberValid ? 'Invalid card number' : brand !== 'unknown' ? brand : undefined}
		onchange={() => emit()}
	/>

	<div class="grid gap-3 sm:grid-cols-2">
		<MaskedInput
			mask="##/##"
			label="Expiry"
			placeholder="MM/YY"
			bind:value={expiry}
			{disabled}
			status={expiry && !expiryValid ? 'error' : 'default'}
			onchange={() => emit()}
		/>
		<MaskedInput
			mask={brand === 'amex' ? '####' : '###'}
			label="CVC"
			placeholder={brand === 'amex' ? '1234' : '123'}
			bind:value={cvc}
			{disabled}
			status={cvc && !cvcValid ? 'error' : 'default'}
			onchange={() => emit()}
		/>
	</div>

	<Input
		label="Name on card"
		placeholder="Ada Lovelace"
		bind:value={name}
		{disabled}
		oninput={() => emit()}
	/>

	{#if valid}
		<FieldHint text="Card details look valid." tone="success" />
	{/if}
</div>
