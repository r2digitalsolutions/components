<script module lang="ts">
	export type {
		FieldType,
		ResourceField,
		ResourceCapabilities,
		ResourceDefinition,
		ResourceStudioMode,
		ResourceStudioLayout,
		ResourceStudioLabels,
		ResourceStudioView
	} from './types.js';
	export { DEFAULT_CAPABILITIES, resolveCapabilities } from './types.js';
	export { fieldsToColumns } from './fieldsToColumns.js';
	export { fieldsToSchema } from './fieldsToSchema.js';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import DataGrid from '$lib/components/organisms/DataGrid/DataGrid.svelte';
	import type {
		CellNote,
		ConditionalFormatRule,
		DataGridColumn,
		GridSelection
	} from '$lib/components/organisms/DataGrid/types.js';
	import { EMPTY_SELECTION } from '$lib/components/organisms/DataGrid/types.js';
	import ConditionalFormatPanel from '$lib/components/molecules/ConditionalFormatPanel/ConditionalFormatPanel.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Pagination from '$lib/components/molecules/Pagination/Pagination.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import ConfirmDelete from '$lib/components/molecules/ConfirmDelete/ConfirmDelete.svelte';
	import Drawer from '$lib/components/organisms/Drawer/Drawer.svelte';
	import SchemaForm from '$lib/components/organisms/SchemaForm/SchemaForm.svelte';
	import type { SchemaFormValues } from '$lib/components/organisms/SchemaForm/SchemaForm.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import DropZone from '$lib/components/molecules/DropZone/DropZone.svelte';
	import type { BulkAction } from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import {
		type ResourceDefinition,
		type ResourceStudioMode,
		type ResourceStudioLayout,
		type ResourceStudioLabels,
		type ResourceStudioView,
		resolveCapabilities
	} from './types.js';
	import { fieldsToColumns } from './fieldsToColumns.js';
	import { fieldsToSchema } from './fieldsToSchema.js';

	interface ResourceStudioProps {
		resources?: ResourceDefinition[];
		activeResourceId?: string;
		records?: Record<string, unknown>[];
		totalRecords?: number;
		loading?: boolean;
		page?: number;
		pageSize?: number;
		query?: string;
		selection?: GridSelection;
		notes?: CellNote[];
		formatRules?: ConditionalFormatRule[];
		modes?: ResourceStudioMode[];
		activeMode?: ResourceStudioMode;
		layout?: ResourceStudioLayout;
		labels?: ResourceStudioLabels;
		views?: ResourceStudioView[];
		activeViewId?: string;
		/** Filter `records` locally by the search box. Set false for server-side search. */
		clientSearch?: boolean;
		/** Open / bind the conditional format rules panel. */
		formatPanelOpen?: boolean;
		/** Override bulk dock actions (defaults from capabilities). */
		actions?: BulkAction[];
		class?: string;
		toolbar?: Snippet;
		sidebarItem?: Snippet<[ResourceDefinition, boolean]>;
		sidebarFooter?: Snippet;
		detail?: Snippet<[record: Record<string, unknown> | null]>;
		schemaPanel?: Snippet<[ResourceDefinition]>;
		queryPanel?: Snippet;
		activityPanel?: Snippet;
		recordForm?: Snippet<[mode: 'create' | 'edit', record: Record<string, unknown> | null]>;
		empty?: Snippet;
		dockExtra?: Snippet;
		cell?: Snippet<[Record<string, unknown>, DataGridColumn]>;
		onresourcechange?: (id: string) => void;
		onsearch?: (q: string) => void;
		onpagechange?: (page: number, pageSize: number) => void;
		onsort?: (columnId: string, dir: 'asc' | 'desc') => void;
		oncreate?: () => void;
		oninsert?: (record: Record<string, unknown>) => void;
		onupdate?: (id: string, patch: Record<string, unknown>) => void;
		ondelete?: (ids: string[]) => void;
		onduplicate?: (ids: string[]) => void;
		onexport?: (ids: string[] | 'all') => void;
		onimport?: (file: File) => void;
		oncelledit?: (id: string, fieldId: string, value: unknown) => void;
		/** Fired for dock actions not handled built-in (e.g. custom bulk workflow). */
		onaction?: (id: string, rowIds: string[]) => void;
		onselectionchange?: (s: GridSelection) => void;
		onnoteschange?: (notes: CellNote[]) => void;
		onformatruleschange?: (rules: ConditionalFormatRule[]) => void;
		onmodechange?: (mode: ResourceStudioMode) => void;
		onviewchange?: (viewId: string) => void;
		onrefresh?: () => void;
	}

	let {
		resources = [],
		activeResourceId = $bindable(''),
		records = [],
		totalRecords,
		loading = false,
		page = $bindable(1),
		pageSize = 25,
		query = $bindable(''),
		selection = $bindable<GridSelection>(EMPTY_SELECTION),
		notes = $bindable<CellNote[]>([]),
		formatRules = $bindable<ConditionalFormatRule[]>([]),
		modes = ['browse', 'detail', 'schema'] as ResourceStudioMode[],
		activeMode = $bindable<ResourceStudioMode>('browse'),
		layout = 'sidebar-main-detail',
		labels = {},
		views = [],
		activeViewId = $bindable(''),
		clientSearch = true,
		formatPanelOpen = $bindable(false),
		actions,
		class: className = '',
		toolbar,
		sidebarItem,
		sidebarFooter,
		detail,
		schemaPanel,
		queryPanel,
		activityPanel,
		recordForm,
		empty,
		dockExtra,
		cell,
		onresourcechange,
		onsearch,
		onpagechange,
		onsort,
		oncreate,
		oninsert,
		onupdate,
		ondelete,
		onduplicate,
		onexport,
		onimport,
		oncelledit,
		onaction,
		onselectionchange,
		onnoteschange,
		onformatruleschange,
		onmodechange,
		onviewchange,
		onrefresh
	}: ResourceStudioProps = $props();

	let sidebarQuery = $state('');
	let formOpen = $state(false);
	let formMode = $state<'create' | 'edit'>('create');
	let formRecord = $state<Record<string, unknown> | null>(null);
	let deleteOpen = $state(false);
	let pendingDeleteIds = $state<string[]>([]);
	let importOpen = $state(false);
	let focusedRecord = $state<Record<string, unknown> | null>(null);
	let draftForm = $state<SchemaFormValues>({});

	const formSchema = $derived(
		activeResource ? fieldsToSchema(activeResource.fields, { mode: formMode }) : []
	);

	const L = $derived({
		resources: labels.resources ?? 'Resources',
		records: labels.records ?? 'records',
		addRecord: labels.addRecord ?? 'Add record',
		schema: labels.schema ?? 'Schema',
		runQuery: labels.runQuery ?? 'Run query',
		searchPlaceholder: labels.searchPlaceholder ?? 'Search records…',
		detail: labels.detail ?? 'Detail',
		activity: labels.activity ?? 'Activity',
		query: labels.query ?? 'Query'
	});

	$effect(() => {
		if (!activeResourceId && resources[0]) {
			activeResourceId = resources[0].id;
		}
	});

	const activeResource = $derived(
		resources.find((r) => r.id === activeResourceId) ?? resources[0] ?? null
	);

	const caps = $derived(resolveCapabilities(activeResource?.capabilities));

	const primaryKey = $derived(activeResource?.primaryKey ?? 'id');

	const columns = $derived(activeResource ? fieldsToColumns(activeResource.fields) : []);

	const groups = $derived.by(() => {
		const map = new Map<string, ResourceDefinition[]>();
		const q = sidebarQuery.trim().toLowerCase();
		for (const r of resources) {
			if (q && !r.name.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) continue;
			const g = r.group ?? 'General';
			if (!map.has(g)) map.set(g, []);
			map.get(g)!.push(r);
		}
		return [...map.entries()];
	});

	const filteredRecords = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!clientSearch || !q) return records;
		const fieldIds =
			activeResource?.fields.filter((f) => !f.hidden).map((f) => f.id) ??
			(records[0] ? Object.keys(records[0]) : []);
		return records.filter((row) =>
			fieldIds.some((id) => String(row[id] ?? '').toLowerCase().includes(q))
		);
	});

	const visibleCount = $derived(
		clientSearch ? filteredRecords.length : (totalRecords ?? records.length)
	);

	const totalPages = $derived(
		Math.max(
			1,
			Math.ceil(
				(clientSearch ? filteredRecords.length : (totalRecords ?? records.length)) /
					Math.max(pageSize, 1)
			)
		)
	);

	const showSidebar = $derived(layout !== 'main-only');
	/** Companion inspector while browsing (large screens / stacked on small). */
	const showInspector = $derived(
		layout === 'sidebar-main-detail' && activeMode === 'browse' && modes.includes('detail')
	);

	function selectResource(id: string) {
		if (activeResourceId === id) return;
		activeResourceId = id;
		selection = EMPTY_SELECTION;
		focusedRecord = null;
		page = 1;
		query = '';
		if (activeMode !== 'browse' && modes.includes('browse')) activeMode = 'browse';
		onresourcechange?.(id);
		const res = resources.find((r) => r.id === id);
		if (res?.defaultFormatRules) {
			formatRules = res.defaultFormatRules.map((r) => ({ ...r }));
			onformatruleschange?.(formatRules);
		} else {
			formatRules = [];
			onformatruleschange?.([]);
		}
	}

	function setMode(mode: ResourceStudioMode) {
		if (!modes.includes(mode)) return;
		activeMode = mode;
		onmodechange?.(mode);
	}

	/** Keep inspector in sync when exactly one row is selected via checkbox/dock. */
	$effect(() => {
		const ids =
			selection.type === 'rows'
				? selection.ids
				: selection.type === 'cells'
					? [...new Set(selection.cells.map((c) => c.rowId))]
					: [];
		if (ids.length !== 1) return;
		const row = records.find((r) => String(r[primaryKey]) === ids[0]);
		if (row) focusedRecord = { ...row };
	});

	function openCreate() {
		formMode = 'create';
		formRecord = null;
		draftForm = Object.fromEntries(
			fieldsToSchema(activeResource?.fields ?? [], { mode: 'create' }).map((f) => [
				f.name,
				f.defaultValue ?? (f.type === 'toggle' || f.type === 'checkbox' ? false : '')
			])
		);
		formOpen = true;
		oncreate?.();
	}

	function openEdit(record: Record<string, unknown>) {
		formMode = 'edit';
		formRecord = record;
		const schema = fieldsToSchema(activeResource?.fields ?? [], { mode: 'edit' });
		draftForm = Object.fromEntries(
			schema.map((f) => {
				const raw = record[f.name];
				if (f.type === 'toggle' || f.type === 'checkbox') return [f.name, Boolean(raw)];
				if (f.type === 'number') return [f.name, raw == null || raw === '' ? '' : Number(raw)];
				return [f.name, raw == null ? '' : String(raw)];
			})
		);
		formOpen = true;
	}

	function submitForm(values: SchemaFormValues = draftForm) {
		const record: Record<string, unknown> = { ...values };
		for (const f of activeResource?.fields ?? []) {
			if (f.type === 'number' && record[f.id] != null && record[f.id] !== '') {
				record[f.id] = Number(record[f.id]);
			}
			if (f.type === 'boolean') {
				record[f.id] = record[f.id] === true || record[f.id] === 'true';
			}
		}
		if (formMode === 'create') {
			if (!record[primaryKey]) record[primaryKey] = crypto.randomUUID?.() ?? String(Date.now());
			oninsert?.(record);
		} else if (formRecord) {
			const id = String(formRecord[primaryKey]);
			onupdate?.(id, record);
		}
		formOpen = false;
	}

	function selectedRowIds(): string[] {
		if (selection.type === 'rows') return selection.ids;
		if (selection.type === 'cells') return [...new Set(selection.cells.map((c) => c.rowId))];
		return [];
	}

	function askDelete(ids: string[]) {
		pendingDeleteIds = ids;
		deleteOpen = true;
	}

	function confirmDelete() {
		ondelete?.(pendingDeleteIds);
		deleteOpen = false;
		pendingDeleteIds = [];
		selection = EMPTY_SELECTION;
	}

	function handleDockAction(id: string, sel: GridSelection) {
		const ids = selectedRowIds();
		if (id === 'delete' && caps.delete) {
			askDelete(ids);
			return;
		}
		if (id === 'duplicate' && caps.duplicate) {
			onduplicate?.(ids);
			return;
		}
		if (id === 'export' && caps.export) {
			onexport?.(ids.length ? ids : 'all');
			return;
		}
		if (id === 'format' && caps.conditionalFormat) {
			formatPanelOpen = true;
			return;
		}
		if (id === 'edit' && ids[0]) {
			const row = records.find((r) => String(r[primaryKey]) === ids[0]);
			if (row) openEdit(row);
			return;
		}
		onaction?.(id, ids);
		void sel;
	}

	const dockActions = $derived.by((): BulkAction[] => {
		if (actions) return actions;
		const list: BulkAction[] = [];
		if (caps.notes) list.push({ id: 'note', label: 'Note', variant: 'secondary' });
		if (caps.update) list.push({ id: 'edit', label: 'Edit', variant: 'secondary' });
		if (caps.duplicate) list.push({ id: 'duplicate', label: 'Duplicate', variant: 'secondary' });
		if (caps.export) list.push({ id: 'export', label: 'Export', variant: 'secondary' });
		if (caps.conditionalFormat) list.push({ id: 'format', label: 'Rules', variant: 'secondary' });
		list.push({ id: 'copy', label: 'Copy', variant: 'ghost' });
		if (caps.delete)
			list.push({ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true });
		return list;
	});

	function onRowClick(row: Record<string, unknown>) {
		focusedRecord = { ...row };
	}

	function onRowDblClick(row: Record<string, unknown>) {
		// Focus only — Detail mode is opened from the mode tab, never from row clicks.
		focusedRecord = { ...row };
	}

	function modeLabel(m: ResourceStudioMode): string {
		if (m === 'browse') return 'Browse';
		if (m === 'detail') return L.detail;
		if (m === 'schema') return L.schema;
		if (m === 'query') return L.query;
		return L.activity;
	}
</script>

{#snippet schemaBody(resource: ResourceDefinition)}
	{#if schemaPanel}
		{@render schemaPanel(resource)}
	{:else}
		<ul class="space-y-2">
			{#each resource.fields as field (field.id)}
				<li class="rounded-lg border border-border px-2.5 py-2">
					<div class="flex items-center justify-between gap-2">
						<span class="text-xs font-medium">{field.label}</span>
						<Badge size="sm" variant="secondary">{field.type}</Badge>
					</div>
					<p class="mt-0.5 font-mono text-[10px] text-muted">{field.id}</p>
					{#if field.required || field.unique || field.readonly}
						<div class="mt-1.5 flex flex-wrap gap-1">
							{#if field.required}<Badge size="sm" variant="warning">required</Badge>{/if}
							{#if field.unique}<Badge size="sm" variant="info">unique</Badge>{/if}
							{#if field.readonly}<Badge size="sm" variant="default">readonly</Badge>{/if}
						</div>
					{/if}
					{#if field.relation}
						<p class="mt-1 text-[10px] text-secondary">
							→ {field.relation.resourceId}.{field.relation.fieldId}
						</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{#snippet detailBody(record: Record<string, unknown> | null)}
	{#if detail}
		{@render detail(record)}
	{:else if record && activeResource}
		<div class="space-y-3">
			<div class="flex items-center justify-between gap-2">
				<p class="text-xs font-semibold">{L.detail}</p>
				{#if caps.update}
					<Button size="xs" variant="secondary" onclick={() => openEdit(record)}>Edit</Button>
				{/if}
			</div>
			<dl class="space-y-2">
				{#each activeResource.fields.filter((f) => !f.hidden) as field (field.id)}
					<div>
						<dt class="text-[10px] font-semibold tracking-wide text-muted uppercase">
							{field.label}
						</dt>
						<dd class="mt-0.5 break-all text-sm">
							{record[field.id] == null ? '—' : String(record[field.id])}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	{:else}
		<p class="py-8 text-center text-xs text-muted">Select a row to inspect.</p>
	{/if}
{/snippet}

<div
	class={[
		'flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-border bg-surface text-primary',
		className
	]}
>
	{#if showSidebar}
		<aside class="flex w-56 shrink-0 flex-col border-r border-border bg-surface-elevated">
			<div class="space-y-2 border-b border-border p-3">
				<p class="text-[11px] font-semibold tracking-wide text-secondary uppercase">{L.resources}</p>
				<SearchInput
					size="sm"
					bind:value={sidebarQuery}
					placeholder="Filter…"
					class="w-full"
				/>
			</div>
			<nav class="flex-1 overflow-y-auto p-2" aria-label={L.resources}>
				{#each groups as [group, items] (group)}
					<div class="mb-3">
						<p class="px-2 py-1 text-[10px] font-semibold tracking-wide text-muted uppercase">
							{group}
						</p>
						<ul class="space-y-0.5">
							{#each items as resource (resource.id)}
								{@const active = resource.id === activeResource?.id}
								<li>
									{#if sidebarItem}
										<button
											type="button"
											class="w-full text-left"
											onclick={() => selectResource(resource.id)}
										>
											{@render sidebarItem(resource, active)}
										</button>
									{:else}
										<button
											type="button"
											class={[
												'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
												active
													? 'bg-brand-500/10 font-medium text-brand-700 dark:text-brand-300'
													: 'text-secondary hover:bg-surface-overlay hover:text-primary'
											]}
											onclick={() => selectResource(resource.id)}
										>
											<span class="truncate">{resource.name}</span>
											{#if resource.recordCount != null}
												<span class="text-[10px] tabular-nums text-muted"
													>{resource.recordCount}</span
												>
											{/if}
										</button>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{:else}
					<p class="px-2 py-6 text-center text-xs text-muted">No resources</p>
				{/each}
			</nav>
			{#if sidebarFooter}
				<div class="border-t border-border p-2">
					{@render sidebarFooter()}
				</div>
			{/if}
		</aside>
	{/if}

	<div class="flex min-h-0 min-w-0 flex-1 flex-col">
		<header class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2">
			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-2">
					<h2 class="truncate text-sm font-semibold">
						{activeResource?.name ?? 'Select a resource'}
					</h2>
					{#if activeResource?.description}
						<p class="truncate text-xs text-muted">{activeResource.description}</p>
					{/if}
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-1 rounded-lg bg-surface-overlay/60 p-0.5">
				{#each modes as mode (mode)}
					<button
						type="button"
						class={[
							'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
							activeMode === mode
								? 'bg-surface-elevated text-primary shadow-sm'
								: 'text-secondary hover:text-primary'
						]}
						onclick={() => setMode(mode)}
					>
						{modeLabel(mode)}
					</button>
				{/each}
			</div>

			{#if caps.create}
				<Button size="sm" variant="primary" onclick={openCreate}>{L.addRecord}</Button>
			{/if}
			{#if caps.conditionalFormat}
				<Button
					size="sm"
					variant={formatPanelOpen ? 'secondary' : 'ghost'}
					onclick={() => (formatPanelOpen = !formatPanelOpen)}
				>
					Rules{formatRules.length ? ` (${formatRules.length})` : ''}
				</Button>
			{/if}
			{#if caps.import}
				<Button size="sm" variant="secondary" onclick={() => (importOpen = true)}>Import</Button>
			{/if}
			{#if caps.export}
				<Button size="sm" variant="ghost" onclick={() => onexport?.('all')}>Export</Button>
			{/if}
			{#if onrefresh}
				<Button size="sm" variant="ghost" onclick={() => onrefresh?.()}>Refresh</Button>
			{/if}
		</header>

		{#if views.length}
			<div class="flex shrink-0 flex-wrap gap-1.5 border-b border-border px-3 py-2">
				{#each views as view (view.id)}
					<button
						type="button"
						class={[
							'rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 transition-colors',
							activeViewId === view.id
								? 'bg-brand-500/10 text-brand-700 ring-brand-500/30 dark:text-brand-300'
								: 'text-secondary ring-border hover:bg-surface-overlay'
						]}
						onclick={() => {
							activeViewId = view.id;
							onviewchange?.(view.id);
						}}
					>
						{view.label}
					</button>
				{/each}
			</div>
		{/if}

		<div class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2">
			{#if toolbar}
				{@render toolbar()}
			{:else}
				<SearchInput
					size="sm"
					bind:value={query}
					placeholder={L.searchPlaceholder}
					class="min-w-[12rem] flex-1"
					onsubmit={(q) => onsearch?.(q)}
					oninput={() => {
						page = 1;
						onsearch?.(query);
					}}
				/>
				<span class="text-[11px] text-muted tabular-nums">
					{visibleCount}
					{L.records}
				</span>
			{/if}
		</div>

		<div class="flex min-h-0 flex-1 flex-col lg:flex-row">
			<div class="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3">
				{#if activeMode === 'query' && queryPanel}
					<div
						class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated p-3"
					>
						{@render queryPanel()}
					</div>
				{:else if activeMode === 'activity' && activityPanel}
					<div class="min-h-0 flex-1 overflow-auto">
						{@render activityPanel()}
					</div>
				{:else if activeMode === 'schema' && activeResource}
					<div class="min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-surface-elevated p-3">
						<p class="mb-3 text-xs font-semibold text-secondary">{L.schema}</p>
						{@render schemaBody(activeResource)}
					</div>
				{:else if activeMode === 'detail'}
					<div class="min-h-0 flex-1 overflow-auto rounded-xl border border-border bg-surface-elevated p-3">
						{#key focusedRecord ? String(focusedRecord[primaryKey] ?? '') : 'none'}
							{@render detailBody(focusedRecord)}
						{/key}
					</div>
				{:else if !activeResource}
					<EmptyState title="No resource selected" description="Pick one from the sidebar." />
				{:else if loading}
					<div class="space-y-2">
						{#each Array.from({ length: 6 }) as _, i (i)}
							<Skeleton class="h-9 w-full" />
						{/each}
					</div>
				{:else if filteredRecords.length === 0}
					{#if empty}
						{@render empty()}
					{:else}
						<EmptyState
							title={`No ${L.records}`}
							description={query.trim()
								? 'No matches for your search.'
								: 'Create a record or adjust your search.'}
						>
							{#snippet action()}
								{#if caps.create}
									<Button size="sm" variant="primary" onclick={openCreate}>{L.addRecord}</Button>
								{/if}
							{/snippet}
						</EmptyState>
					{/if}
				{:else}
					<div class="flex min-h-0 flex-1 flex-col gap-3">
						<DataGrid
							class="min-h-0 flex-1"
							{columns}
							rows={filteredRecords}
							rowKey={primaryKey}
							bind:selection
							bind:notes
							bind:formatRules
							editable={caps.editable && caps.update}
							selectable={
								caps.delete ||
								caps.export ||
								caps.notes ||
								caps.duplicate ||
								caps.update ||
								caps.editable
							}
							selectCells={false}
							selectColumns={false}
							selectOnClick={false}
							marqueeSelect
							contextMenu
							actions={dockActions}
							compact
							{cell}
							{dockExtra}
							onselectionchange={onselectionchange}
							onnoteschange={onnoteschange}
							onformatruleschange={onformatruleschange}
							oncelledit={(rowId, columnId, value) => oncelledit?.(rowId, columnId, value)}
							onaction={handleDockAction}
							onsort={(id, dir) => onsort?.(id, dir)}
							onrowclick={onRowClick}
							onrowdblclick={onRowDblClick}
						/>

						{#if visibleCount > pageSize || totalPages > 1}
							<div class="flex shrink-0 justify-end">
								<Pagination
									bind:page
									{totalPages}
									onchange={(p) => onpagechange?.(p, pageSize)}
								/>
							</div>
						{/if}
					</div>
				{/if}

				{#if formatPanelOpen && caps.conditionalFormat && activeMode === 'browse'}
					<div class="shrink-0 space-y-2">
						<ConditionalFormatPanel
							bind:rules={formatRules}
							columns={columns.map((c) => ({ id: c.id, label: c.header }))}
							onchange={(r) => onformatruleschange?.(r)}
						/>
						<div class="flex justify-end">
							<Button size="sm" variant="ghost" onclick={() => (formatPanelOpen = false)}
								>Hide rules</Button
							>
						</div>
					</div>
				{/if}
			</div>

			{#if showInspector && activeResource}
				<aside
					class="flex max-h-72 min-h-0 w-full shrink-0 flex-col border-t border-border bg-surface-elevated lg:max-h-none lg:w-72 lg:border-t-0 lg:border-l"
				>
					<div class="flex items-center gap-1 border-b border-border p-2">
						{#each (['detail', 'schema'] as ResourceStudioMode[]).filter((m) => modes.includes(m)) as m (m)}
							<button
								type="button"
								class={[
									'flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors',
									(m === 'detail' && activeMode === 'browse') || activeMode === m
										? 'bg-surface-overlay text-primary'
										: 'text-secondary hover:bg-surface-overlay/70 hover:text-primary'
								]}
								onclick={() => setMode(m === 'detail' ? 'browse' : m)}
							>
								{modeLabel(m)}
							</button>
						{/each}
						{#if focusedRecord && caps.update}
							<Button size="xs" variant="secondary" onclick={() => openEdit(focusedRecord!)}
								>Edit</Button
							>
						{/if}
					</div>
					<div class="min-h-0 flex-1 overflow-y-auto p-3">
						{#if activeMode === 'browse'}
							{#key focusedRecord ? String(focusedRecord[primaryKey] ?? '') : 'none'}
								{@render detailBody(focusedRecord)}
							{/key}
						{/if}
					</div>
				</aside>
			{/if}
		</div>
	</div>
</div>

<Drawer
	bind:open={formOpen}
	title={formMode === 'create' ? L.addRecord : 'Edit record'}
	side="right"
	size="md"
>
	{#if recordForm}
		{@render recordForm(formMode, formRecord)}
	{:else if activeResource}
		<SchemaForm
			schema={formSchema}
			bind:values={draftForm}
			showCancel
			submitLabel="Save"
			cancelLabel="Cancel"
			onsubmit={submitForm}
			oncancel={() => (formOpen = false)}
		/>
	{/if}
</Drawer>

<Drawer bind:open={importOpen} title="Import" side="right" size="sm">
	<DropZone
		label="Drop a CSV or JSON file"
		hint="Your app handles parsing via onimport"
		multiple={false}
		ondropfiles={(files) => {
			const file = files?.[0];
			if (file) {
				onimport?.(file);
				importOpen = false;
			}
		}}
	/>
</Drawer>

<ConfirmDelete
	bind:open={deleteOpen}
	entity={L.records}
	itemName={`${pendingDeleteIds.length} selected`}
	onconfirm={confirmDelete}
/>
