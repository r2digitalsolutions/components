<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';

	export interface CountryOption {
		code: string;
		name: string;
		flag: string;
	}

	interface CountrySelectProps {
		value?: string;
		countries?: CountryOption[];
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (code: string) => void;
	}

	const DEFAULTS: CountryOption[] = [
		{ code: 'ES', name: 'Spain', flag: '🇪🇸' },
		{ code: 'US', name: 'United States', flag: '🇺🇸' },
		{ code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
		{ code: 'DE', name: 'Germany', flag: '🇩🇪' },
		{ code: 'FR', name: 'France', flag: '🇫🇷' },
		{ code: 'MX', name: 'Mexico', flag: '🇲🇽' },
		{ code: 'AR', name: 'Argentina', flag: '🇦🇷' },
		{ code: 'BR', name: 'Brazil', flag: '🇧🇷' },
		{ code: 'PT', name: 'Portugal', flag: '🇵🇹' },
		{ code: 'IT', name: 'Italy', flag: '🇮🇹' }
	];

	let {
		value = $bindable(''),
		countries = DEFAULTS,
		label = 'Country',
		placeholder = 'Select a country…',
		disabled = false,
		size = 'sm',
		class: className = '',
		onchange
	}: CountrySelectProps = $props();

	const options = $derived(
		countries.map(
			(c): SelectOption => ({
				value: c.code,
				label: `${c.flag}  ${c.name}`
			})
		)
	);
</script>

<Select
	bind:value
	{options}
	{label}
	{placeholder}
	{disabled}
	{size}
	searchable
	class={className}
	onchange={(v) => onchange?.(v)}
/>
