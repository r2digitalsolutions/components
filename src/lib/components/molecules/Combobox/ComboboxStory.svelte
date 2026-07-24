<script lang="ts">
	import Combobox, { type ComboboxOption } from './Combobox.svelte';

	let {
		creatable = false,
		label = 'Framework',
		disabled = false
	}: {
		creatable?: boolean;
		label?: string;
		disabled?: boolean;
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

<div class="flex w-80 flex-col gap-3">
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
	<p class="text-xs text-muted">
		Value: <span class="text-primary">{value || '—'}</span>
	</p>
</div>
