<script lang="ts">
	import FilterBar, { type FilterChip } from './FilterBar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let query = $state('');
	let filters = $state<FilterChip[]>([
		{ id: 'active', label: 'Status: Active' },
		{ id: 'team', label: 'Team: Design' }
	]);

	const presets = [
		{ id: 'mine', label: 'Assigned to me' },
		{ id: 'week', label: 'Updated this week' }
	];

	function addPreset(preset: FilterChip) {
		if (filters.some((f) => f.id === preset.id)) return;
		filters = [...filters, preset];
	}
</script>

<div class="w-full max-w-2xl space-y-4">
	<FilterBar bind:query bind:filters>
		{#snippet actions()}
			<Button
				size="sm"
				variant="secondary"
				onclick={() => addPreset(presets[filters.length % presets.length])}
			>
				Add filter
			</Button>
		{/snippet}
	</FilterBar>

	<div class="rounded-xl border border-border bg-surface px-4 py-6 text-sm text-secondary">
		<p class="font-medium text-primary">Results preview</p>
		<p class="mt-1 text-xs text-muted">
			Type in the search field or remove chips — only one clear control on the input.
		</p>
	</div>
</div>
