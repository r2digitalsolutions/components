<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';

	export interface LocaleOption {
		code: string;
		label: string;
	}

	interface LocaleSwitcherProps {
		value?: string;
		locales?: LocaleOption[];
		label?: string;
		class?: string;
		onchange?: (code: string) => void;
	}

	let {
		value = $bindable('en'),
		locales = [
			{ code: 'en', label: 'English' },
			{ code: 'es', label: 'Español' },
			{ code: 'fr', label: 'Français' },
			{ code: 'de', label: 'Deutsch' },
			{ code: 'pt', label: 'Português' }
		],
		label = 'Language',
		class: className = '',
		onchange
	}: LocaleSwitcherProps = $props();

	const options = $derived(
		locales.map((l): SelectOption => ({ value: l.code, label: l.label }))
	);
</script>

<Select
	{label}
	{options}
	bind:value
	class={className}
	onchange={(v) => onchange?.(v)}
/>
