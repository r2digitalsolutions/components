<script lang="ts">
	import Combobox, { type ComboboxOption } from './Combobox.svelte';
	import ComboboxItem from '$lib/components/molecules/ComboboxItem/ComboboxItem.svelte';
	import ComboboxMenuItem from '$lib/components/molecules/ComboboxMenuItem/ComboboxMenuItem.svelte';

	let {
		creatable = false,
		label = 'Framework',
		disabled = false,
		compound = false,
		menuItems = false
	}: {
		creatable?: boolean;
		label?: string;
		disabled?: boolean;
		compound?: boolean;
		menuItems?: boolean;
	} = $props();

	const options: ComboboxOption[] = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'Solid' },
		{ value: 'qwik', label: 'Qwik', disabled: true }
	];

	let value = $state('svelte');
	let query = $state('Svelte');
	let open = $state(false);
</script>

<div class="w-80 gap-3 flex flex-col">
	{#if menuItems}
		<Combobox {label} {disabled} bind:value bind:query bind:open placeholder="Search frameworks…">
			{#each options as option (option.value)}
				<ComboboxMenuItem value={option.value} label={option.label} disabled={option.disabled} />
			{/each}
		</Combobox>
	{:else if compound}
		<Combobox {label} {disabled} bind:value bind:query bind:open placeholder="Search frameworks…">
			{#each options as option (option.value)}
				<ComboboxItem value={option.value} label={option.label} disabled={option.disabled}>
					{option.label}
				</ComboboxItem>
			{/each}
		</Combobox>
	{:else}
		<Combobox
			{options}
			{label}
			{creatable}
			{disabled}
			bind:value
			bind:query
			bind:open
			placeholder="Search frameworks…"
		/>
	{/if}
	<p class="text-xs text-muted">
		Value: <span class="text-primary">{value || '—'}</span>
	</p>
</div>
