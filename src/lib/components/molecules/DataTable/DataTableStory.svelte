<script lang="ts">
	import DataTable, { type DataTableColumn } from './DataTable.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	let props = $props<{
		sortable?: boolean;
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		stickyHeader?: boolean;
	}>();

	type Row = {
		id: string;
		name: string;
		role: string;
		status: 'active' | 'invited' | 'paused';
		seats: number;
	};

	const columns: DataTableColumn<Row>[] = [
		{ id: 'name', header: 'Name', sortable: true },
		{ id: 'role', header: 'Role', sortable: true },
		{ id: 'status', header: 'Status' },
		{ id: 'seats', header: 'Seats', align: 'right', sortable: true, width: '5rem' }
	];

	const rows: Row[] = [
		{ id: '1', name: 'Ana López', role: 'Admin', status: 'active', seats: 3 },
		{ id: '2', name: 'Carlos Ruiz', role: 'Editor', status: 'active', seats: 1 },
		{ id: '3', name: 'Maya Chen', role: 'Viewer', status: 'invited', seats: 0 },
		{ id: '4', name: 'Jon Park', role: 'Editor', status: 'paused', seats: 2 },
		{ id: '5', name: 'Sara Vidal', role: 'Admin', status: 'active', seats: 4 }
	];

	const statusVariant = {
		active: 'success',
		invited: 'warning',
		paused: 'default'
	} as const;
</script>

<div class="max-w-2xl">
	<DataTable
		{columns}
		{rows}
		sortable={props.sortable ?? true}
		striped={props.striped ?? false}
		hoverable={props.hoverable ?? true}
		compact={props.compact ?? false}
		stickyHeader={props.stickyHeader ?? false}
	>
		{#snippet cell(row, column)}
			{#if column.id === 'status'}
				<Badge variant={statusVariant[row.status as Row['status']]}>
					{row.status}
				</Badge>
			{:else if column.id === 'name'}
				<span class="font-medium">{row.name as string}</span>
			{:else}
				{row[column.id as keyof Row]}
			{/if}
		{/snippet}
	</DataTable>
</div>
