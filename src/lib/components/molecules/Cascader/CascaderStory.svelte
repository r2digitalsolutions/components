<script lang="ts">
	import Cascader, { type CascaderOption } from './Cascader.svelte';

	let {
		label = 'Location',
		placeholder = 'Select location...',
		disabled = false,
		changeOnSelect = false
	}: {
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		changeOnSelect?: boolean;
	} = $props();

	const options: CascaderOption[] = [
		{
			value: 'eu',
			label: 'Europe',
			children: [
				{
					value: 'es',
					label: 'Spain',
					children: [
						{ value: 'mad', label: 'Madrid' },
						{ value: 'bcn', label: 'Barcelona' },
						{ value: 'vlc', label: 'Valencia' }
					]
				},
				{
					value: 'fr',
					label: 'France',
					children: [
						{ value: 'par', label: 'Paris' },
						{ value: 'lyo', label: 'Lyon' }
					]
				},
				{ value: 'de', label: 'Germany', disabled: true }
			]
		},
		{
			value: 'am',
			label: 'Americas',
			children: [
				{
					value: 'us',
					label: 'United States',
					children: [
						{ value: 'nyc', label: 'New York' },
						{ value: 'la', label: 'Los Angeles' },
						{ value: 'chi', label: 'Chicago' }
					]
				},
				{
					value: 'mx',
					label: 'Mexico',
					children: [
						{ value: 'cdmx', label: 'Mexico City' },
						{ value: 'gdl', label: 'Guadalajara' }
					]
				}
			]
		},
		{
			value: 'as',
			label: 'Asia',
			children: [
				{ value: 'jp', label: 'Japan', children: [{ value: 'tyo', label: 'Tokyo' }, { value: 'osa', label: 'Osaka' }] },
				{ value: 'cn', label: 'China', children: [{ value: 'bej', label: 'Beijing' }, { value: 'sha', label: 'Shanghai' }] }
			]
		}
	];

	let value = $state<string[]>([]);
</script>

<div class="w-72 space-y-3">
	<Cascader {options} {label} {placeholder} {disabled} {changeOnSelect} bind:value />
	<p class="text-xs text-muted">
		Valor: <span class="text-primary font-medium">{value.join(' > ') || '—'}</span>
	</p>
</div>
