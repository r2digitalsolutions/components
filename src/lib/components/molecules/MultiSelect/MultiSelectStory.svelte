<script lang="ts">
	import MultiSelect, { type MultiSelectOption } from './MultiSelect.svelte';

	let {
		searchable = true,
		max,
		label = 'Skills',
		disabled = false
	}: {
		searchable?: boolean;
		max?: number;
		label?: string;
		disabled?: boolean;
	} = $props();

	const options: MultiSelectOption[] = [
		{ value: 'ts', label: 'TypeScript' },
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'node', label: 'Node.js' },
		{ value: 'css', label: 'CSS' },
		{ value: 'sql', label: 'SQL' },
		{ value: 'go', label: 'Go' },
		{ value: 'rust', label: 'Rust', disabled: true }
	];

	let value = $state(['ts', 'svelte']);
	let open = $state(false);
</script>

<div class="flex w-96 flex-col gap-3">
	<MultiSelect
		{options}
		{label}
		{searchable}
		{max}
		{disabled}
		bind:value
		bind:open
		placeholder="Pick skills…"
	/>
	<p class="text-xs text-muted">
		Values: <span class="text-primary">{value.join(', ') || '—'}</span>
	</p>
</div>
