<script lang="ts">
	import ResourceStudio from './ResourceStudio.svelte';
	import type { ResourceDefinition } from './types.js';
	import type {
		CellNote,
		ConditionalFormatRule,
		GridSelection
	} from '../DataGrid/types.js';
	import { EMPTY_SELECTION } from '../DataGrid/types.js';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CodeEditor from '$lib/components/molecules/CodeEditor/CodeEditor.svelte';

	type Example =
		| 'crudAdmin'
		| 'cms'
		| 'readOnly'
		| 'sqlBrowser'
		| 'customQuery'
		| 'notesAndRules'
		| 'bulkWorkflow'
		| 'empty'
		| 'loading'
		| 'mainOnly'
		| 'permissions';

	let { example = 'crudAdmin' }: { example?: Example } = $props();

	const users: ResourceDefinition = {
		id: 'users',
		name: 'Users',
		group: 'Auth',
		description: 'Account holders',
		recordCount: 4,
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true, unique: true },
			{ id: 'name', label: 'Name', type: 'string', required: true },
			{ id: 'email', label: 'Email', type: 'string', required: true, unique: true },
			{
				id: 'role',
				label: 'Role',
				type: 'enum',
				options: [
					{ value: 'admin', label: 'Admin' },
					{ value: 'editor', label: 'Editor' },
					{ value: 'viewer', label: 'Viewer' }
				]
			},
			{ id: 'active', label: 'Active', type: 'boolean' }
		]
	};

	const products: ResourceDefinition = {
		id: 'products',
		name: 'Products',
		group: 'Catalog',
		recordCount: 3,
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true },
			{ id: 'name', label: 'Name', type: 'string', required: true },
			{ id: 'price', label: 'Price', type: 'number', required: true },
			{
				id: 'status',
				label: 'Status',
				type: 'enum',
				options: [
					{ value: 'draft', label: 'Draft' },
					{ value: 'live', label: 'Live' },
					{ value: 'archived', label: 'Archived' }
				]
			}
		]
	};

	const orders: ResourceDefinition = {
		id: 'orders',
		name: 'Orders',
		group: 'Catalog',
		recordCount: 5,
		capabilities: {
			notes: true,
			conditionalFormat: true,
			duplicate: true,
			bulkEdit: true
		},
		defaultFormatRules: [
			{
				id: 'failed',
				name: 'Failed',
				enabled: true,
				target: 'row',
				when: { op: 'eq', columnId: 'status', value: 'failed' },
				style: { background: '#fee2e2', color: '#991b1b' },
				priority: 1
			},
			{
				id: 'high',
				name: 'High amount',
				enabled: true,
				target: 'cell',
				columnId: 'total',
				when: { op: 'gt', columnId: 'total', value: 500 },
				style: { background: '#dcfce7', color: '#166534', fontWeight: 'semibold' },
				priority: 2
			}
		],
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true },
			{
				id: 'userId',
				label: 'User',
				type: 'relation',
				relation: { resourceId: 'users', fieldId: 'id', displayField: 'name' }
			},
			{
				id: 'status',
				label: 'Status',
				type: 'enum',
				options: [
					{ value: 'paid', label: 'Paid' },
					{ value: 'pending', label: 'Pending' },
					{ value: 'failed', label: 'Failed' }
				]
			},
			{ id: 'total', label: 'Total', type: 'number' }
		]
	};

	const posts: ResourceDefinition = {
		id: 'posts',
		name: 'Posts',
		group: 'Content',
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true },
			{ id: 'title', label: 'Title', type: 'string', required: true },
			{ id: 'slug', label: 'Slug', type: 'string' },
			{ id: 'body', label: 'Body', type: 'text' },
			{
				id: 'status',
				label: 'Status',
				type: 'enum',
				options: [
					{ value: 'draft', label: 'Draft' },
					{ value: 'published', label: 'Published' }
				]
			}
		]
	};

	const pages: ResourceDefinition = {
		id: 'pages',
		name: 'Pages',
		group: 'Content',
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true },
			{ id: 'title', label: 'Title', type: 'string', required: true },
			{ id: 'path', label: 'Path', type: 'string' }
		]
	};

	const media: ResourceDefinition = {
		id: 'media',
		name: 'Media',
		group: 'Content',
		fields: [
			{ id: 'id', label: 'ID', type: 'string', readonly: true },
			{ id: 'name', label: 'Name', type: 'string' },
			{ id: 'mime', label: 'MIME', type: 'string' },
			{ id: 'size', label: 'Size', type: 'number' }
		]
	};

	const sqlUsers: ResourceDefinition = {
		...users,
		group: 'public',
		name: 'users',
		fields: users.fields.map((f) => ({
			...f,
			meta: { sqlType: f.type === 'string' ? 'varchar' : f.type }
		}))
	};

	const sqlOrders: ResourceDefinition = {
		...orders,
		group: 'public',
		name: 'orders'
	};

	const dataByResource: Record<string, Record<string, unknown>[]> = {
		users: [
			{ id: 'u1', name: 'Ana López', email: 'ana@r2.dev', role: 'admin', active: true },
			{ id: 'u2', name: 'Carlos Ruiz', email: 'carlos@r2.dev', role: 'editor', active: true },
			{ id: 'u3', name: 'Maya Chen', email: 'maya@r2.dev', role: 'viewer', active: false },
			{ id: 'u4', name: 'Jon Park', email: 'jon@r2.dev', role: 'editor', active: true }
		],
		products: [
			{ id: 'p1', name: 'Pro Plan', price: 49, status: 'live' },
			{ id: 'p2', name: 'Starter', price: 19, status: 'live' },
			{ id: 'p3', name: 'Legacy', price: 9, status: 'archived' }
		],
		orders: [
			{ id: 'o1', userId: 'u1', status: 'paid', total: 1280 },
			{ id: 'o2', userId: 'u2', status: 'pending', total: 120 },
			{ id: 'o3', userId: 'u3', status: 'failed', total: 89 },
			{ id: 'o4', userId: 'u1', status: 'paid', total: 640 },
			{ id: 'o5', userId: 'u4', status: 'failed', total: 990 }
		],
		posts: [
			{
				id: 'post1',
				title: 'Launch notes',
				slug: 'launch-notes',
				body: 'We shipped ResourceStudio.',
				status: 'published'
			},
			{
				id: 'post2',
				title: 'Draft ideas',
				slug: 'draft-ideas',
				body: 'WIP',
				status: 'draft'
			}
		],
		pages: [
			{ id: 'pg1', title: 'Home', path: '/' },
			{ id: 'pg2', title: 'Pricing', path: '/pricing' }
		],
		media: [
			{ id: 'm1', name: 'hero.png', mime: 'image/png', size: 240000 },
			{ id: 'm2', name: 'guide.pdf', mime: 'application/pdf', size: 1200000 }
		]
	};

	const readOnlyResources: ResourceDefinition[] = [
		{
			...products,
			capabilities: {
				create: false,
				update: false,
				delete: false,
				editable: false,
				export: true,
				notes: false,
				conditionalFormat: false
			}
		}
	];

	const permissionResources: ResourceDefinition[] = [
		{
			...users,
			capabilities: {
				create: true,
				update: true,
				delete: false,
				export: true,
				editable: true
			}
		}
	];

	const resources = $derived.by((): ResourceDefinition[] => {
		if (example === 'cms') return [posts, pages, media];
		if (example === 'readOnly') return readOnlyResources;
		if (example === 'sqlBrowser' || example === 'customQuery') return [sqlUsers, sqlOrders];
		if (example === 'notesAndRules' || example === 'bulkWorkflow')
			return [orders, users, products];
		if (example === 'mainOnly') return [orders];
		if (example === 'permissions') return permissionResources;
		if (example === 'empty' || example === 'loading') return [users, products, orders];
		return [users, products, orders];
	});

	let activeResourceId = $state('users');
	let selection = $state<GridSelection>(EMPTY_SELECTION);
	let notes = $state<CellNote[]>([
		{ rowId: 'o3', columnId: 'status', text: 'Chargeback risk — follow up' }
	]);
	let formatRules = $state<ConditionalFormatRule[]>([]);
	let query = $state('');
	let page = $state(1);
	let sql = $state('select * from orders where total > 500;');
	let gql = $state('query {\n  orders(where: { total: { _gt: 500 } }) {\n    id\n    total\n  }\n}');
	let log = $state('');

	$effect(() => {
		// Reset selection when the Storybook example changes — do not fight user clicks.
		if (example === 'mainOnly' || example === 'notesAndRules' || example === 'bulkWorkflow') {
			activeResourceId = 'orders';
		} else if (example === 'cms') {
			activeResourceId = 'posts';
		} else if (example === 'sqlBrowser' || example === 'customQuery') {
			activeResourceId = 'users';
		} else if (example === 'readOnly') {
			activeResourceId = 'products';
		} else if (example === 'permissions') {
			activeResourceId = 'users';
		} else {
			activeResourceId = 'users';
		}
		selection = EMPTY_SELECTION;
		page = 1;
		query = '';
	});

	$effect(() => {
		const res = resources.find((r) => r.id === activeResourceId);
		formatRules = (res?.defaultFormatRules ?? []).map((r) => ({ ...r }));
	});

	const records = $derived.by(() => {
		if (example === 'empty') return [];
		const key =
			activeResourceId === 'users' || activeResourceId === 'sql-users'
				? 'users'
				: activeResourceId;
		return dataByResource[key] ?? dataByResource[activeResourceId] ?? [];
	});

	const modes = $derived.by(() => {
		if (example === 'sqlBrowser' || example === 'customQuery') {
			return ['browse', 'schema', 'query', 'detail'] as const;
		}
		if (example === 'cms') return ['browse', 'detail', 'schema'] as const;
		if (example === 'mainOnly') return ['browse', 'detail'] as const;
		return ['browse', 'detail', 'schema'] as const;
	});

	const layout = $derived(
		example === 'mainOnly' ? ('main-only' as const) : ('sidebar-main-detail' as const)
	);

	const labels = $derived(
		example === 'sqlBrowser'
			? {
					resources: 'Tables',
					records: 'rows',
					addRecord: 'Insert row',
					schema: 'Schema',
					query: 'SQL',
					runQuery: 'Run SQL'
				}
			: example === 'customQuery'
				? {
						resources: 'Collections',
						query: 'GraphQL',
						runQuery: 'Execute'
					}
				: undefined
	);

	function mutateInsert(record: Record<string, unknown>) {
		const list = dataByResource[activeResourceId];
		if (list) list.unshift(record);
		log = `insert ${JSON.stringify(record)}`;
	}

	function mutateUpdate(id: string, patch: Record<string, unknown>) {
		const list = dataByResource[activeResourceId];
		if (!list) return;
		const idx = list.findIndex((r) => String(r.id) === id);
		if (idx >= 0) list[idx] = { ...list[idx], ...patch };
		log = `update ${id}`;
	}

	function mutateDelete(ids: string[]) {
		const list = dataByResource[activeResourceId];
		if (!list) return;
		dataByResource[activeResourceId] = list.filter((r) => !ids.includes(String(r.id)));
		log = `delete ${ids.join(',')}`;
	}
</script>

<div class="flex h-svh flex-col">
	{#if log}
		<p class="shrink-0 rounded-none border-b border-border bg-surface-overlay px-3 py-2 font-mono text-[11px] text-secondary">
			{log}
		</p>
	{/if}

	<div class="min-h-0 flex-1">
		<ResourceStudio
			class="h-full min-h-0 rounded-none border-0"
			{resources}
			bind:activeResourceId
			{records}
			totalRecords={records.length}
			loading={example === 'loading'}
			bind:page
			bind:query
			bind:selection
			bind:notes
			bind:formatRules
			modes={[...modes]}
			{layout}
			{labels}
			views={example === 'cms'
				? [
						{ id: 'all', label: 'All' },
						{ id: 'published', label: 'Published' },
						{ id: 'drafts', label: 'Drafts' }
					]
				: []}
			oninsert={mutateInsert}
			onupdate={mutateUpdate}
			ondelete={mutateDelete}
			oncelledit={(id, field, value) => mutateUpdate(id, { [field]: value })}
			onexport={(ids) => {
				log = `export ${ids === 'all' ? 'all' : ids.join(',')}`;
			}}
			onduplicate={(ids) => {
				log = `duplicate ${ids.join(',')}`;
			}}
			onsearch={(q) => {
				log = `search ${q}`;
			}}
		>
			{#snippet queryPanel()}
				{#if example === 'sqlBrowser'}
					<div class="space-y-2">
						<p class="text-xs font-semibold text-secondary">SQL runner (slot)</p>
						<CodeEditor bind:value={sql} language="sql" class="min-h-32" />
						<Button
							size="sm"
							variant="primary"
							onclick={() => {
								log = `run sql: ${sql}`;
							}}>Run SQL</Button
						>
					</div>
				{:else}
					<div class="space-y-2">
						<p class="text-xs font-semibold text-secondary">GraphQL (custom slot)</p>
						<CodeEditor bind:value={gql} language="graphql" class="min-h-32" />
						<Button
							size="sm"
							variant="primary"
							onclick={() => {
								log = `run graphql`;
							}}>Execute</Button
						>
					</div>
				{/if}
			{/snippet}

			{#snippet detail(record)}
				{#if example === 'cms' && record}
					<div class="space-y-2">
						<p class="text-xs font-semibold">CMS preview</p>
						<h3 class="text-base font-semibold">{String(record.title ?? '')}</h3>
						{#if record.body}
							<p class="text-sm text-secondary whitespace-pre-wrap">{String(record.body)}</p>
						{/if}
						<Badge variant="secondary">{String(record.status ?? record.path ?? '')}</Badge>
					</div>
				{:else if record}
					<div class="space-y-3">
						<p class="text-xs font-semibold text-secondary">Record</p>
						<dl class="space-y-2">
							{#each Object.entries(record) as [key, value] (`${String(record.id ?? '')}:${key}`)}
								<div>
									<dt class="text-[10px] font-semibold tracking-wide text-muted uppercase">{key}</dt>
									<dd class="mt-0.5 break-all text-sm text-primary">
										{value == null ? '—' : String(value)}
									</dd>
								</div>
							{/each}
						</dl>
					</div>
				{:else}
					<p class="py-8 text-center text-xs text-muted">Select a row to inspect.</p>
				{/if}
			{/snippet}

			{#snippet cell(row, column)}
				{#if column.id === 'status'}
					<Badge
						variant={row.status === 'failed' || row.status === 'archived'
							? 'error'
							: row.status === 'pending' || row.status === 'draft'
								? 'warning'
								: 'success'}
					>
						{String(row.status ?? '')}
					</Badge>
				{:else if column.id === 'total' || column.id === 'price' || column.id === 'size'}
					<span class="tabular-nums">{Number(row[column.id] ?? 0).toLocaleString()}</span>
				{:else if column.id === 'active'}
					{row.active ? 'Yes' : 'No'}
				{:else}
					{row[column.id] == null ? '' : String(row[column.id])}
				{/if}
			{/snippet}
		</ResourceStudio>
	</div>
</div>
