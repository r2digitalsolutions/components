<script lang="ts">
	import Select, { type SelectOption } from './Select.svelte';

	let props = $props<{
		example?: 'default' | 'nested' | 'searchable';
		label?: string;
		placeholder?: string;
		options?: SelectOption[];
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		searchable?: boolean;
		flyToSelected?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}>();

	const example = $derived(props.example ?? 'default');

	const countryOptions: SelectOption[] = [
		{ value: 'es', label: 'Spain 🇪🇸' },
		{ value: 'us', label: 'United States 🇺🇸' },
		{ value: 'mx', label: 'Mexico 🇲🇽' },
		{ value: 'ar', label: 'Argentina 🇦🇷' },
		{ value: 'co', label: 'Colombia 🇨🇴' },
		{ value: 'uk', label: 'United Kingdom 🇬🇧' }
	];

	const nestedOptions: SelectOption[] = [
		{
			value: 'europe',
			label: 'Europe',
			children: [
				{ value: 'es', label: 'Spain 🇪🇸' },
				{ value: 'uk', label: 'United Kingdom 🇬🇧' },
				{ value: 'fr', label: 'France 🇫🇷' },
				{
					value: 'nordics',
					label: 'Nordics',
					children: [
						{ value: 'se', label: 'Sweden 🇸🇪' },
						{ value: 'no', label: 'Norway 🇳🇴' },
						{ value: 'dk', label: 'Denmark 🇩🇰' }
					]
				}
			]
		},
		{
			value: 'americas',
			label: 'Americas',
			children: [
				{ value: 'us', label: 'United States 🇺🇸' },
				{ value: 'mx', label: 'Mexico 🇲🇽' },
				{ value: 'ar', label: 'Argentina 🇦🇷' },
				{ value: 'co', label: 'Colombia 🇨🇴' }
			]
		},
		{
			value: 'asia',
			label: 'Asia',
			children: [
				{ value: 'jp', label: 'Japan 🇯🇵' },
				{ value: 'kr', label: 'South Korea 🇰🇷' },
				{ value: 'in', label: 'India 🇮🇳' }
			]
		}
	];

	const options = $derived(
		props.options ?? (example === 'nested' || example === 'searchable' ? nestedOptions : countryOptions)
	);

	let value = $state('');
	$effect(() => {
		value = props.value ?? (example === 'nested' || example === 'searchable' ? 'se' : 'es');
	});
</script>

<div class="w-80 max-w-full space-y-2">
	{#if example === 'nested' || example === 'searchable'}
		<p class="text-xs text-secondary">
			Recursive groups + <code class="text-primary">flyToSelected</code>
			{#if example === 'searchable'}
				. Search flattens leaves with breadcrumb.
			{/if}
		</p>
	{/if}

	<Select
		label={props.label ?? (example === 'nested' || example === 'searchable' ? 'Region' : 'Country')}
		placeholder={props.placeholder ?? 'Select…'}
		{options}
		bind:value
		status={props.status ?? 'default'}
		helperText={props.helperText || undefined}
		disabled={props.disabled ?? false}
		required={props.required ?? false}
		searchable={props.searchable ?? example === 'searchable'}
		flyToSelected={props.flyToSelected ?? true}
		size={props.size ?? 'md'}
	/>
</div>
