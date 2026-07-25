<script lang="ts">
	import TableToolbar from './TableToolbar.svelte';
	import type { TableColumnOption, TableDensity } from './TableToolbar.svelte';

	let columns = $state<TableColumnOption[]>([
		{ id: 'name', label: 'Name', visible: true, locked: true },
		{ id: 'email', label: 'Email', visible: true },
		{ id: 'role', label: 'Role', visible: true },
		{ id: 'status', label: 'Status', visible: false },
		{ id: 'updated', label: 'Updated', visible: true }
	]);
	let density = $state<TableDensity>('comfortable');
	let search = $state('');
	let lastExport = $state('');
</script>

<div class="max-w-3xl space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<TableToolbar
		bind:columns
		bind:density
		bind:search
		selectedCount={2}
		onexport={(fmt) => (lastExport = fmt)}
	/>
	<p class="text-xs text-muted">
		Density: {density} · Search: “{search || '—'}” · Visible:
		{columns.filter((c) => c.visible !== false).map((c) => c.label).join(', ')}
		{#if lastExport}
			· Last export: {lastExport}
		{/if}
	</p>
</div>
