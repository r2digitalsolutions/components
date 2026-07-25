<script lang="ts">
	import MaskedInput from '$lib/components/molecules/MaskedInput/MaskedInput.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

	interface CreditCardInputProps {
		number?: string;
		expiry?: string;
		cvc?: string;
		name?: string;
		disabled?: boolean;
		showHints?: boolean;
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
		showHints = true,
		class: className = '',
		onchange
	}: CreditCardInputProps = $props();

	function digitsOnly(v: string) {
		return v.replace(/\D/g, '');
	}

	function luhn(raw: string): boolean {
		const d = digitsOnly(raw);
		if (d.length < 13) return false;
		let sum = 0;
		let alt = false;
		for (let i = d.length - 1; i >= 0; i--) {
			let n = Number(d[i]);
			if (alt) {
				n *= 2;
				if (n > 9) n -= 9;
			}
			sum += n;
			alt = !alt;
		}
		return sum % 10 === 0;
	}

	function detectBrand(num: string): CardBrand {
		const d = digitsOnly(num);
		if (!d) return 'unknown';
		if (/^4/.test(d)) return 'visa';
		if (/^3[47]/.test(d)) return 'amex';
		if (/^5[1-5]/.test(d) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(d)) return 'mastercard';
		if (/^6(?:011|5)/.test(d)) return 'discover';
		return 'unknown';
	}

	const brand = $derived(detectBrand(number));
	const numberMask = $derived(brand === 'amex' ? '#### ###### #####' : '#### #### #### ####');
	const numberLen = $derived(brand === 'amex' ? 15 : 16);
	const cvcMask = $derived(brand === 'amex' ? '####' : '###');
	const cvcLen = $derived(brand === 'amex' ? 4 : 3);

	const numberDigits = $derived(digitsOnly(number));
	const numberComplete = $derived(numberDigits.length >= numberLen);
	const numberValid = $derived(numberComplete && luhn(number));

	const expiryValid = $derived.by(() => {
		if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
		const [mm, yy] = expiry.split('/').map(Number);
		const now = new Date();
		const exp = new Date(2000 + yy, mm); // end of expiry month
		return exp > now;
	});

	const cvcValid = $derived(new RegExp(`^\\d{${cvcLen}}$`).test(cvc));
	const nameValid = $derived(name.trim().length > 1);
	const valid = $derived(numberValid && expiryValid && cvcValid && nameValid);

	const brandLabel: Record<CardBrand, string> = {
		visa: 'Visa',
		mastercard: 'Mastercard',
		amex: 'Amex',
		discover: 'Discover',
		unknown: ''
	};

	const numberHint = $derived(
		showHints && numberComplete && !numberValid ? 'Check the card number' : undefined
	);
	const expiryHint = $derived(
		showHints && expiry.length === 5 && !expiryValid ? 'Invalid or expired' : undefined
	);
	const cvcHint = $derived(
		showHints && cvc.length >= cvcLen && !cvcValid ? `${cvcLen} digits required` : undefined
	);

	function emit() {
		onchange?.({ number, expiry, cvc, name, brand, valid });
	}

	$effect(() => {
		if (brand === 'amex' && cvc.length > 4) cvc = cvc.slice(0, 4);
		if (brand !== 'amex' && cvc.length > 3) cvc = cvc.slice(0, 3);
	});
</script>

<div class={['w-full space-y-3', className]}>
	<div class="relative">
		<MaskedInput
			mask={numberMask}
			label="Card number"
			placeholder={brand === 'amex' ? '3782 822463 10005' : '4242 4242 4242 4242'}
			bind:value={number}
			{disabled}
			status={numberComplete && !numberValid ? 'error' : numberValid ? 'success' : 'default'}
			helperText={numberHint}
			onchange={() => emit()}
		/>

		<div
			class="pointer-events-none absolute top-8 right-3 flex h-8 items-center gap-1.5 sm:top-9"
			aria-live="polite"
		>
			{#if brand === 'visa'}
				<span
					class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
					style="background:#1A1F71"
				>
					VISA
				</span>
			{:else if brand === 'mastercard'}
				<span class="relative flex h-5 w-8 items-center" aria-hidden="true">
					<span class="absolute left-0 h-5 w-5 rounded-full" style="background:#EB001B"></span>
					<span class="absolute right-0 h-5 w-5 rounded-full opacity-90" style="background:#F79E1B"
					></span>
				</span>
			{:else if brand === 'amex'}
				<span
					class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
					style="background:#2E77BC"
				>
					AMEX
				</span>
			{:else if brand === 'discover'}
				<span
					class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
					style="background:#FF6000"
				>
					DISC
				</span>
			{:else}
				<span class="flex gap-0.5 opacity-40" aria-hidden="true">
					<span class="h-4 w-6 rounded border border-border bg-surface-overlay"></span>
					<span class="h-4 w-6 rounded border border-border bg-surface-overlay"></span>
				</span>
			{/if}
			{#if brand !== 'unknown'}
				<span class="sr-only">{brandLabel[brand]} detected</span>
			{/if}
		</div>
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		<MaskedInput
			mask="##/##"
			label="Expiry"
			placeholder="MM/YY"
			bind:value={expiry}
			{disabled}
			status={expiry.length === 5 && !expiryValid ? 'error' : expiryValid ? 'success' : 'default'}
			helperText={expiryHint}
			onchange={() => emit()}
		/>
		<MaskedInput
			mask={cvcMask}
			label="CVC"
			placeholder={brand === 'amex' ? '1234' : '123'}
			bind:value={cvc}
			{disabled}
			status={cvc.length >= cvcLen && !cvcValid ? 'error' : cvcValid ? 'success' : 'default'}
			helperText={cvcHint}
			onchange={() => emit()}
		/>
	</div>

	<Input
		label="Name on card"
		placeholder="Ada Lovelace"
		bind:value={name}
		{disabled}
		status={name.length > 0 && !nameValid ? 'error' : nameValid ? 'success' : 'default'}
		oninput={() => emit()}
	/>
</div>
