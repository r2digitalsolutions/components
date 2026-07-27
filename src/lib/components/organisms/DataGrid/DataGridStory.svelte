<script lang="ts">
	import DataGrid from './DataGrid.svelte';
	import type {
		DataGridColumn,
		CellNote,
		GridMark,
		DataGridFilter,
		DataGridViewMode,
		ConditionalFormatRule,
		GridSelection
	} from './types.js';
	import { EMPTY_SELECTION, noteKey } from './types.js';
	import ConditionalFormatPanel from '$lib/components/molecules/ConditionalFormatPanel/ConditionalFormatPanel.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { BulkAction } from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';

	type Example =
		| 'default'
		| 'rowSelection'
		| 'columnAndCell'
		| 'withNotes'
		| 'conditional'
		| 'formatPanel'
		| 'editable'
		| 'pinned'
		| 'large'
		| 'empty'
		| 'loading'
		| 'customDock'
		| 'readOnly'
		| 'marquee'
		| 'contextMenu'
		| 'responsive';

	let {
		example = 'default',
		sortable = true,
		editable = false,
		compact = false,
		striped = false
	}: {
		example?: Example;
		sortable?: boolean;
		editable?: boolean;
		compact?: boolean;
		striped?: boolean;
	} = $props();

	type Order = {
		id: string;
		customer: string;
		status: 'paid' | 'pending' | 'failed' | 'refunded';
		amount: number;
		channel: string;
		vip: boolean;
		due: string;
	};

	const statusOptions = [
		{ value: 'paid', label: 'Paid' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'failed', label: 'Failed' },
		{ value: 'refunded', label: 'Refunded' }
	];

	const baseColumns: DataGridColumn<Order>[] = [
		{ id: 'customer', header: 'Customer', sortable: true, minWidth: '10rem' },
		{ id: 'status', header: 'Status', sortable: true, width: '7rem', filterable: true },
		{ id: 'amount', header: 'Amount', align: 'right', sortable: true, width: '6rem' },
		{ id: 'channel', header: 'Channel', sortable: true, filterable: true }
	];

	const responsiveColumns: DataGridColumn<Order>[] = [
		{ id: 'customer', header: 'Customer', sortable: true, minWidth: '10rem', pinned: true },
		{ id: 'status', header: 'Status', sortable: true, width: '7rem', filterable: true },
		{
			id: 'amount',
			header: 'Amount',
			align: 'right',
			sortable: true,
			width: '6rem',
			hideBelow: 'sm'
		},
		{ id: 'channel', header: 'Channel', sortable: true, filterable: true, hideBelow: 'md' },
		{ id: 'due', header: 'Due', sortable: true, width: '9rem', hideBelow: 'lg' },
		{ id: 'vip', header: 'VIP', width: '5rem', hideBelow: 'lg' }
	];

	const editableColumns: DataGridColumn<Order>[] = [
		{
			id: 'customer',
			header: 'Customer',
			sortable: true,
			minWidth: '10rem',
			edit: { type: 'text', placeholder: 'Name' }
		},
		{
			id: 'status',
			header: 'Status',
			sortable: true,
			width: '9rem',
			edit: { type: 'select', options: statusOptions }
		},
		{
			id: 'amount',
			header: 'Amount',
			align: 'right',
			sortable: true,
			width: '7rem',
			edit: { type: 'number', min: 0, step: 1 }
		},
		{
			id: 'vip',
			header: 'VIP',
			width: '5rem',
			edit: { type: 'boolean' }
		},
		{
			id: 'due',
			header: 'Due',
			sortable: true,
			width: '9rem',
			edit: { type: 'date' }
		},
		{
			id: 'channel',
			header: 'Channel',
			sortable: true,
			edit: { type: 'text' }
		}
	];

	const pinnedColumns: DataGridColumn<Order>[] = [
		{ id: 'customer', header: 'Customer', sortable: true, pinned: true, width: '10rem' },
		{ id: 'status', header: 'Status', sortable: true, width: '7rem' },
		{ id: 'amount', header: 'Amount', align: 'right', sortable: true, width: '6rem' },
		{ id: 'channel', header: 'Channel', sortable: true, width: '8rem' },
		{ id: 'region', header: 'Region', sortable: true, width: '8rem', accessor: 'channel' },
		{ id: 'notes', header: 'Notes', width: '12rem', accessor: 'customer' }
	];

	const seed: Order[] = [
		{
			id: '1',
			customer: 'Ana López',
			status: 'paid',
			amount: 1280,
			channel: 'Web',
			vip: true,
			due: '2026-08-01'
		},
		{
			id: '2',
			customer: 'Carlos Ruiz',
			status: 'pending',
			amount: 420,
			channel: 'App',
			vip: false,
			due: '2026-08-12'
		},
		{
			id: '3',
			customer: 'Maya Chen',
			status: 'failed',
			amount: 89,
			channel: 'Web',
			vip: false,
			due: '2026-07-28'
		},
		{
			id: '4',
			customer: 'Jon Park',
			status: 'paid',
			amount: 2400,
			channel: 'Partner',
			vip: true,
			due: '2026-09-01'
		},
		{
			id: '5',
			customer: 'Sara Vidal',
			status: 'refunded',
			amount: 310,
			channel: 'Web',
			vip: false,
			due: '2026-08-05'
		},
		{
			id: '6',
			customer: 'Luis Ortega',
			status: 'paid',
			amount: 1560,
			channel: 'App',
			vip: true,
			due: '2026-08-20'
		},
		{
			id: '7',
			customer: 'Nora Kim',
			status: 'pending',
			amount: 75,
			channel: 'Web',
			vip: false,
			due: '2026-07-30'
		},
		{
			id: '8',
			customer: 'Evan Brooks',
			status: 'failed',
			amount: 990,
			channel: 'Partner',
			vip: false,
			due: '2026-08-15'
		}
	];

	let rows = $state<Order[]>([...seed]);
	let selection = $state<GridSelection>(EMPTY_SELECTION);
	let notes = $state<CellNote[]>([]);
	let marks = $state<GridMark[]>([]);
	let formatRules = $state<ConditionalFormatRule[]>([]);
	let filterQuery = $state('');
	let columnFilters = $state<DataGridFilter[]>([]);
	let expandedRows = $state<string[]>([]);
	let viewMode = $state<DataGridViewMode>('table');
	let lastAction = $state('');

	const demoNotes: CellNote[] = [
		{ rowId: '3', columnId: 'status', text: 'Retry payment tomorrow', author: 'ops' }
	];

	const demoMarks: GridMark[] = [
		{ rowId: '2', color: 'amber' },
		{ rowId: '4', columnId: 'amount', color: 'rose' }
	];

	const demoRules: ConditionalFormatRule[] = [
		{
			id: 'r1',
			name: 'Failed orders',
			enabled: true,
			target: 'row',
			when: { op: 'eq', columnId: 'status', value: 'failed' },
			style: { background: '#fee2e2', color: '#991b1b' },
			priority: 1
		},
		{
			id: 'r2',
			name: 'High value',
			enabled: true,
			target: 'cell',
			columnId: 'amount',
			when: { op: 'gt', columnId: 'amount', value: 1000 },
			style: { background: '#dcfce7', color: '#166534', fontWeight: 'semibold' },
			priority: 2
		}
	];

	// Reset demo state only when the story variant changes (not on every bind write-back).
	let seededFor = $state<Example | null>(null);
	$effect(() => {
		if (seededFor === example) return;
		seededFor = example;
		const wantsNotes = example === 'withNotes' || example === 'conditional' || example === 'formatPanel';
		const wantsRules =
			example === 'withNotes' || example === 'conditional' || example === 'formatPanel';
		const wantsMarks = example === 'contextMenu' || example === 'columnAndCell' || example === 'withNotes';
		notes = wantsNotes ? demoNotes.map((n) => ({ ...n })) : [];
		marks = wantsMarks ? demoMarks.map((m) => ({ ...m })) : [];
		formatRules = wantsRules ? demoRules.map((r) => ({ ...r })) : [];
		selection = EMPTY_SELECTION;
		filterQuery = '';
		columnFilters = [];
		expandedRows = example === 'responsive' ? ['1'] : [];
		viewMode = 'table';
	});

	const largeRows = $derived.by(() => {
		if (example !== 'large') return [] as Order[];
		return Array.from({ length: 80 }, (_, i) => ({
			id: String(i + 1),
			customer: `Customer ${i + 1}`,
			status: (['paid', 'pending', 'failed', 'refunded'] as const)[i % 4],
			amount: Math.round(50 + ((i * 37) % 3000)),
			channel: ['Web', 'App', 'Partner'][i % 3],
			vip: i % 5 === 0,
			due: `2026-08-${String((i % 28) + 1).padStart(2, '0')}`
		}));
	});

	const statusVariant = {
		paid: 'success',
		pending: 'warning',
		failed: 'error',
		refunded: 'default'
	} as const;

	const expandMeta: Record<
		string,
		{
			owner: string;
			sla: string;
			items: Array<{ sku: string; qty: number; price: number }>;
			activity: Array<{ at: string; text: string }>;
		}
	> = {
		'1': {
			owner: 'Support · Elena',
			sla: 'Next reply in 2h',
			items: [
				{ sku: 'PLAN-PRO', qty: 1, price: 980 },
				{ sku: 'ADDON-SEATS', qty: 3, price: 100 }
			],
			activity: [
				{ at: '09:12', text: 'Invoice sent to billing@acme.io' },
				{ at: 'Yesterday', text: 'VIP flag reviewed — keep priority queue' }
			]
		},
		'2': {
			owner: 'Billing · Marc',
			sla: 'Awaiting customer',
			items: [{ sku: 'PLAN-STARTER', qty: 1, price: 420 }],
			activity: [
				{ at: '11:40', text: 'Payment authorization pending' },
				{ at: '10:02', text: 'Checkout completed on App' }
			]
		},
		'3': {
			owner: 'Ops · Priya',
			sla: 'Retry scheduled',
			items: [{ sku: 'CREDITS-50', qty: 1, price: 89 }],
			activity: [
				{ at: '08:15', text: 'Card declined — insufficient funds' },
				{ at: '08:16', text: 'Auto-retry queued for tomorrow 09:00' }
			]
		},
		'4': {
			owner: 'Partners · Alex',
			sla: 'On track',
			items: [
				{ sku: 'PLAN-ENT', qty: 1, price: 1900 },
				{ sku: 'IMPL-PKG', qty: 1, price: 500 }
			],
			activity: [
				{ at: 'Mon', text: 'Partner portal order confirmed' },
				{ at: 'Sun', text: 'Contract countersigned' }
			]
		},
		'5': {
			owner: 'Support · Elena',
			sla: 'Refund posted',
			items: [{ sku: 'PLAN-STARTER', qty: 1, price: 310 }],
			activity: [
				{ at: '14:20', text: 'Refund issued to original card' },
				{ at: '13:55', text: 'Customer requested cancel within window' }
			]
		},
		'6': {
			owner: 'Success · Jo',
			sla: 'Healthy',
			items: [
				{ sku: 'PLAN-PRO', qty: 1, price: 980 },
				{ sku: 'ADDON-API', qty: 2, price: 290 }
			],
			activity: [{ at: 'Tue', text: 'Upsell to Pro completed' }]
		},
		'7': {
			owner: 'Billing · Marc',
			sla: 'Follow up today',
			items: [{ sku: 'CREDITS-50', qty: 1, price: 75 }],
			activity: [{ at: '07:50', text: 'Reminder email opened' }]
		},
		'8': {
			owner: 'Ops · Priya',
			sla: 'Investigate gateway',
			items: [{ sku: 'PLAN-PRO', qty: 1, price: 990 }],
			activity: [
				{ at: '16:01', text: '3DS challenge timed out' },
				{ at: '16:02', text: 'Escalated to payments channel' }
			]
		}
	};

	function rowExpand(row: Order) {
		return (
			expandMeta[row.id] ?? {
				owner: 'Unassigned',
				sla: '—',
				items: [{ sku: 'ITEM', qty: 1, price: row.amount }],
				activity: [{ at: '—', text: 'No recent activity' }]
			}
		);
	}

	function rowNotes(rowId: string) {
		return notes.filter((n) => n.rowId === rowId);
	}

	const customActions: BulkAction[] = [
		{ id: 'assign', label: 'Assign', variant: 'secondary' },
		{ id: 'tag', label: 'Tag', variant: 'secondary' },
		{ id: 'archive', label: 'Archive', variant: 'secondary' },
		{ id: 'export', label: 'Export CSV', variant: 'primary' },
		{ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true }
	];

	const isEmpty = $derived(example === 'empty');
	const isLoading = $derived(example === 'loading');
	const isLarge = $derived(example === 'large');
	const isReadOnly = $derived(example === 'readOnly');
	const usePinned = $derived(example === 'pinned');
	const useResponsive = $derived(example === 'responsive');
	const useEditableCols = $derived(example === 'editable' || example === 'contextMenu');
	const useCustomDock = $derived(example === 'customDock' || example === 'contextMenu');
	const canEdit = $derived(editable || example === 'editable' || example === 'contextMenu');
	const activeRows = $derived(isEmpty ? [] : isLarge ? largeRows : rows);
	const activeColumns = $derived(
		usePinned
			? pinnedColumns
			: useResponsive
				? responsiveColumns
				: useEditableCols
					? editableColumns
					: baseColumns
	);
	const showFormatPanel = $derived(example === 'formatPanel' || example === 'conditional');
	const useCellSelect = $derived(
		example === 'columnAndCell' ||
			example === 'withNotes' ||
			example === 'customDock' ||
			example === 'marquee' ||
			example === 'contextMenu'
	);

	function onCellEdit(rowId: string, columnId: string, value: unknown) {
		rows = rows.map((r) => {
			if (r.id !== rowId) return r;
			if (columnId === 'amount') return { ...r, amount: Number(value) || 0 };
			if (columnId === 'status') return { ...r, status: String(value) as Order['status'] };
			if (columnId === 'customer') return { ...r, customer: String(value) };
			if (columnId === 'channel') return { ...r, channel: String(value) };
			if (columnId === 'vip') return { ...r, vip: Boolean(value) };
			if (columnId === 'due') return { ...r, due: String(value) };
			return r;
		});
		lastAction = `Edited ${rowId}.${columnId} → ${String(value)}`;
	}
</script>

<div class="space-y-4">
	{#if example === 'columnAndCell' || example === 'marquee'}
		<p class="text-xs text-muted">
			Tip: click a cell to select · drag to rubber-band select (Windows-style) · Shift+drag to add ·
			Cmd/Ctrl+drag to toggle · Shift+click for range · Cmd/Ctrl+click to multi-select · Alt+click or
			right-click header to select a column · Mark from the dock to tint cells.
		</p>
	{:else if example === 'editable'}
		<p class="text-xs text-muted">
			Tip: double-click or press F2 to edit · editors adapt by column type (text, select, number,
			toggle, date).
		</p>
	{:else if example === 'contextMenu'}
		<p class="text-xs text-muted">
			Tip: right-click for Mark / Clear mark · tinted backgrounds are persistent · dock Mark opens the
			color palette · selection uses a stronger brand highlight.
		</p>
	{:else if example === 'responsive'}
		<p class="text-xs text-muted">
			Tip: resize the viewport — columns with hideBelow move into the row expand panel · switch
			table/list/card/grid · search and column filters · drag header edges to resize columns.
		</p>
	{:else if example === 'default' || example === 'rowSelection'}
		<p class="text-xs text-muted">
			Tip: drag across rows to rubber-band select · right-click for options · ⋯ for row actions ·
			Shift+drag to add · Cmd/Ctrl+drag to toggle.
		</p>
	{/if}

	{#if lastAction}
		<p class="rounded-lg bg-surface-overlay px-3 py-2 text-xs text-secondary">{lastAction}</p>
	{/if}

	<DataGrid
		columns={activeColumns}
		rows={activeRows}
		bind:selection
		bind:notes
		bind:marks
		bind:formatRules
		bind:filterQuery
		bind:columnFilters
		bind:expandedRows
		bind:viewMode
		{sortable}
		{compact}
		{striped}
		editable={canEdit && !isReadOnly}
		selectable={!isReadOnly}
		collapsible={useResponsive || example === 'withNotes'}
		filterable={useResponsive}
		showViewModes={useResponsive}
		titleColumnId="customer"
		selectColumns={example === 'columnAndCell' || example === 'customDock' || example === 'marquee' || example === 'contextMenu'}
		selectCells={useCellSelect}
		marqueeSelect={!isReadOnly}
		contextMenu={!isReadOnly}
		showRowActions={!isReadOnly}
		actions={useCustomDock ? customActions : undefined}
		loading={isLoading}
		empty={isEmpty ? 'No orders match your filters.' : 'No results'}
		showDock={!isReadOnly}
		oncelledit={onCellEdit}
		onaction={(id) => {
			lastAction = `Action: ${id}`;
		}}
	>
		{#snippet cell(row, column)}
			{#if column.id === 'status'}
				<Badge variant={statusVariant[row.status as Order['status']]}>
					{row.status}
				</Badge>
			{:else if column.id === 'amount'}
				<span class="tabular-nums">${Number(row.amount).toLocaleString()}</span>
			{:else if column.id === 'customer'}
				<span class="font-medium">{row.customer as string}</span>
			{:else if column.id === 'vip'}
				<span class={row.vip ? 'font-medium text-brand-600' : 'text-muted'}>
					{row.vip ? 'Yes' : 'No'}
				</span>
			{:else if column.id === 'due'}
				<span class="tabular-nums text-secondary">{row.due as string}</span>
			{:else}
				{row[column.id as keyof Order]}
			{/if}
		{/snippet}
		{#snippet expandedRow(row, hiddenCols)}
			{@const meta = rowExpand(row)}
			{@const cellNotes = rowNotes(row.id)}
			<div class="space-y-4">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div class="min-w-0 space-y-1">
						<p class="text-sm font-semibold text-primary">
							Order #{row.id}
							<span class="font-normal text-muted">· {row.customer}</span>
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<Badge size="sm" variant={statusVariant[row.status]}>{row.status}</Badge>
							{#if row.vip}
								<Badge size="sm" variant="primary">VIP</Badge>
							{/if}
							<span class="text-xs text-muted">{row.channel} · due {row.due}</span>
						</div>
					</div>
					<div class="text-right text-xs text-muted">
						<p class="font-medium text-secondary">{meta.owner}</p>
						<p>{meta.sla}</p>
					</div>
				</div>

				{#if hiddenCols.length}
					<div>
						<p class="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
							Hidden on this viewport
						</p>
						<dl class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{#each hiddenCols as col (col.id)}
								<div class="min-w-0 rounded-lg border border-border bg-surface px-3 py-2">
									<dt class="text-[11px] font-semibold text-muted uppercase">{col.header}</dt>
									<dd class="mt-0.5 text-sm text-primary">
										{row[col.id as keyof Order]}
									</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}

				<div class="grid gap-3 lg:grid-cols-2">
					<div class="rounded-xl border border-border bg-surface p-3">
						<p class="text-[11px] font-semibold tracking-wide text-muted uppercase">Line items</p>
						<ul class="mt-2 divide-y divide-border">
							{#each meta.items as item (item.sku)}
								<li class="flex items-center justify-between gap-3 py-1.5 text-sm">
									<span class="font-medium text-primary">
										{item.sku}
										<span class="font-normal text-muted">×{item.qty}</span>
									</span>
									<span class="tabular-nums text-secondary"
										>${item.price.toLocaleString()}</span
									>
								</li>
							{/each}
						</ul>
						<p class="mt-2 flex justify-between border-t border-border pt-2 text-xs font-semibold text-primary">
							<span>Total</span>
							<span class="tabular-nums">${row.amount.toLocaleString()}</span>
						</p>
					</div>

					<div class="rounded-xl border border-border bg-surface p-3">
						<p class="text-[11px] font-semibold tracking-wide text-muted uppercase">Activity</p>
						<ul class="mt-2 space-y-2">
							{#each meta.activity as event, i (`${row.id}-${i}`)}
								<li class="flex gap-2 text-sm">
									<span class="w-16 shrink-0 tabular-nums text-xs text-muted">{event.at}</span>
									<span class="text-primary">{event.text}</span>
								</li>
							{/each}
						</ul>
						{#if cellNotes.length}
							<div class="mt-3 space-y-1.5 border-t border-border pt-2">
								<p class="text-[11px] font-semibold tracking-wide text-muted uppercase">
									Cell notes
								</p>
								{#each cellNotes as note (noteKey(note.rowId, note.columnId))}
									<p class="rounded-md bg-amber-500/10 px-2 py-1.5 text-xs text-primary">
										<span class="font-semibold text-secondary">{note.columnId}:</span>
										{note.text}
									</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/snippet}
	</DataGrid>

	{#if showFormatPanel}
		<ConditionalFormatPanel
			bind:rules={formatRules}
			columns={baseColumns.map((c) => ({ id: c.id, label: c.header }))}
		/>
	{/if}

	{#if example === 'withNotes' || example === 'contextMenu' || example === 'columnAndCell'}
		<div class="flex items-center gap-2 text-xs text-muted">
			<span>Notes: {notes.length}</span>
			<span>Marks: {marks.length}</span>
			{#if example === 'withNotes'}
				<Button
					size="xs"
					variant="secondary"
					onclick={() => {
						notes = [
							...notes,
							{
								rowId: '1',
								columnId: 'customer',
								text: 'VIP account — prioritize support'
							}
						];
					}}>Seed note on Ana</Button
				>
			{/if}
		</div>
	{/if}
</div>
