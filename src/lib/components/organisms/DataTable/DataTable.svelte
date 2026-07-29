<script module lang="ts">
	export interface DataTableColumn<Row = Record<string, unknown>> {
		id: string;
		header: string;
		/**
		 * How to read the cell value:
		 * - `keyof Row` / string (supports dot-path: `'profile.displayName'`)
		 * - function: `(row) => row.profile.displayName` (preferred for nested/typed access)
		 * Custom render via `cell` snippet still overrides display.
		 */
		accessor?: keyof Row | string | ((row: Row) => unknown);
		align?: 'left' | 'center' | 'right';
		sortable?: boolean;
		width?: string;
		class?: string;
	}
</script>

<script lang="ts" generics="T extends Record<string, unknown> = Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import { resolveAccessor, resolveRowKey } from '$lib/utils/columnAccessor.js';
	import type { RowKey } from '$lib/utils/columnAccessor.js';

	type SortDir = 'asc' | 'desc' | null;

	interface DataTableProps {
		columns?: DataTableColumn<T>[];
		rows?: T[];
		rowKey?: RowKey<T>;
		sortable?: boolean;
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		stickyHeader?: boolean;
		empty?: string;
		class?: string;
		/** Optional custom cell renderer: receives row + column id */
		cell?: Snippet<[T, DataTableColumn<T>]>;
		onrowclick?: (row: T) => void;
		onsort?: (columnId: string, direction: Exclude<SortDir, null>) => void;
	}

	let {
		columns = [] as DataTableColumn<T>[],
		rows = [] as T[],
		rowKey,
		sortable = false,
		striped = false,
		hoverable = true,
		compact = false,
		stickyHeader = false,
		empty = 'No results',
		class: className = '',
		cell,
		onrowclick,
		onsort
	}: DataTableProps = $props();

	let sortId = $state<string | null>(null);
	let sortDir = $state<SortDir>(null);

	function getKey(row: T, index: number): string {
		try {
			return resolveRowKey(row, rowKey, index);
		} catch {
			return String(index);
		}
	}

	function getValue(row: T, column: DataTableColumn<T>): unknown {
		try {
			return resolveAccessor(row, column.accessor, column.id);
		} catch {
			return undefined;
		}
	}

	function formatCell(value: unknown): string {
		if (value == null) return '';
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		return String(value);
	}

	const sortedRows = $derived.by(() => {
		if (!sortId || !sortDir) return rows;
		const col = columns.find((c) => c.id === sortId);
		if (!col) return rows;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => {
			const av = getValue(a, col);
			const bv = getValue(b, col);
			if (av == null && bv == null) return 0;
			if (av == null) return 1;
			if (bv == null) return -1;
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
		});
	});

	function canSort(column: DataTableColumn<T>) {
		if (column.sortable === false) return false;
		return sortable || column.sortable === true;
	}

	function toggleSort(column: DataTableColumn<T>) {
		if (!canSort(column)) return;

		if (sortId !== column.id) {
			sortId = column.id;
			sortDir = 'asc';
		} else if (sortDir === 'asc') {
			sortDir = 'desc';
		} else {
			sortId = null;
			sortDir = null;
			return;
		}
		if (sortDir) onsort?.(column.id, sortDir);
	}

	const alignClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	} as const;
</script>

<div class={['w-full overflow-x-auto rounded-xl border border-border bg-surface-elevated', className]}>
	<table class="w-full border-collapse text-sm">
		<thead
			class={[
				'border-b border-border bg-surface-overlay/80 text-xs font-semibold tracking-wide text-secondary uppercase',
				stickyHeader && 'sticky top-0 z-10'
			]}
		>
			<tr>
				{#each columns as column (column.id)}
					<th
						scope="col"
						class={[
							'px-3 font-semibold',
							compact ? 'py-2' : 'py-2.5',
							alignClass[column.align ?? 'left'],
							canSort(column) && 'cursor-pointer select-none hover:text-primary',
							column.class
						]}
						style={column.width ? `width:${column.width}` : undefined}
						aria-sort={
							sortId === column.id
								? sortDir === 'asc'
									? 'ascending'
									: 'descending'
								: canSort(column)
									? 'none'
									: undefined
						}
						onclick={() => canSort(column) && toggleSort(column)}
					>
						<span class="inline-flex items-center gap-1">
							{column.header}
							{#if canSort(column)}
								<span class="text-muted" aria-hidden="true">
									{#if sortId === column.id && sortDir === 'asc'}↑
									{:else if sortId === column.id && sortDir === 'desc'}↓
									{:else}↕{/if}
								</span>
							{/if}
						</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if sortedRows.length === 0}
				<tr>
					<td
						class="px-3 py-8 text-center text-sm text-muted"
						colspan={Math.max(columns.length, 1)}
					>
						{empty}
					</td>
				</tr>
			{:else}
				{#each sortedRows as row, index (getKey(row, index))}
					<tr
						class={[
							'border-b border-border last:border-b-0',
							striped && index % 2 === 1 && 'bg-surface-overlay/40',
							hoverable && 'hover:bg-surface-overlay/70',
							onrowclick && 'cursor-pointer'
						]}
						onclick={() => onrowclick?.(row)}
					>
						{#each columns as column (column.id)}
							<td
								class={[
									'px-3 text-primary',
									compact ? 'py-1.5' : 'py-2.5',
									alignClass[column.align ?? 'left'],
									column.class
								]}
							>
								{#if cell}
									{@render cell(row, column)}
								{:else}
									{formatCell(getValue(row, column))}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
