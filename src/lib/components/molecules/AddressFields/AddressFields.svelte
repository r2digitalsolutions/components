<script lang="ts">
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	interface AddressFieldsProps {
		line1?: string;
		line2?: string;
		city?: string;
		state?: string;
		postal?: string;
		country?: string;
		class?: string;
	}

	let {
		line1 = $bindable(''),
		line2 = $bindable(''),
		city = $bindable(''),
		state = $bindable(''),
		postal = $bindable(''),
		country = $bindable('ES'),
		class: className = ''
	}: AddressFieldsProps = $props();

	const countries: SelectOption[] = [
		{ value: 'ES', label: 'Spain' },
		{ value: 'PT', label: 'Portugal' },
		{ value: 'FR', label: 'France' },
		{ value: 'DE', label: 'Germany' },
		{ value: 'US', label: 'United States' },
		{ value: 'GB', label: 'United Kingdom' }
	];
</script>

<Stack gap="md" class={className}>
	<FormField label="Address line 1" bind:value={line1} required placeholder="Street and number" />
	<FormField label="Address line 2" bind:value={line2} placeholder="Apt, suite, etc. (optional)" />
	<div class="grid gap-3 sm:grid-cols-2">
		<FormField label="City" bind:value={city} required />
		<FormField label="State / Province" bind:value={state} />
	</div>
	<div class="grid gap-3 sm:grid-cols-2">
		<FormField label="Postal code" bind:value={postal} required />
		<Select label="Country" options={countries} bind:value={country} />
	</div>
</Stack>
