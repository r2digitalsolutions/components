<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';

	export interface TimezoneOption {
		value: string;
		label: string;
		offset?: string;
	}

	interface TimezoneSelectProps {
		value?: string;
		timezones?: TimezoneOption[];
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (tz: string) => void;
	}

	const DEFAULTS: TimezoneOption[] = [
		{ value: 'UTC', label: 'UTC', offset: '+00:00' },
		{ value: 'Europe/Madrid', label: 'Madrid', offset: '+01:00' },
		{ value: 'Europe/London', label: 'London', offset: '+00:00' },
		{ value: 'Europe/Berlin', label: 'Berlin', offset: '+01:00' },
		{ value: 'America/New_York', label: 'New York', offset: '-05:00' },
		{ value: 'America/Chicago', label: 'Chicago', offset: '-06:00' },
		{ value: 'America/Los_Angeles', label: 'Los Angeles', offset: '-08:00' },
		{ value: 'America/Mexico_City', label: 'Mexico City', offset: '-06:00' },
		{ value: 'America/Sao_Paulo', label: 'São Paulo', offset: '-03:00' },
		{ value: 'America/Buenos_Aires', label: 'Buenos Aires', offset: '-03:00' },
		{ value: 'Asia/Tokyo', label: 'Tokyo', offset: '+09:00' },
		{ value: 'Asia/Dubai', label: 'Dubai', offset: '+04:00' },
		{ value: 'Australia/Sydney', label: 'Sydney', offset: '+11:00' }
	];

	let {
		value = $bindable(''),
		timezones = DEFAULTS,
		label = 'Timezone',
		placeholder = 'Select a timezone…',
		disabled = false,
		size = 'sm',
		class: className = '',
		onchange
	}: TimezoneSelectProps = $props();

	const options = $derived(
		timezones.map(
			(tz): SelectOption => ({
				value: tz.value,
				label: tz.offset ? `${tz.label} (${tz.offset})` : tz.label
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
