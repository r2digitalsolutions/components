<script lang="ts">
	import ResourceStudioTemplate from './ResourceStudioTemplate.svelte';
	import type { ResourceDefinition } from '$lib/components/organisms/ResourceStudio/types.js';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CodeEditor from '$lib/components/molecules/CodeEditor/CodeEditor.svelte';

	type Example = 'crud' | 'sql' | 'mainOnly';

	let { example = 'crud' }: { example?: Example } = $props();

	const resources = $derived.by((): ResourceDefinition[] => {
		const sql = example === 'sql';
		return [
			{
				id: 'users',
				name: sql ? 'users' : 'Users',
				group: sql ? 'public' : 'Auth',
				recordCount: 3,
				fields: [
					{ id: 'id', label: 'ID', type: 'string', readonly: true },
					{ id: 'name', label: 'Name', type: 'string', required: true },
					{ id: 'email', label: 'Email', type: 'string', required: true },
					{
						id: 'role',
						label: 'Role',
						type: 'enum',
						options: [
							{ value: 'admin', label: 'Admin' },
							{ value: 'editor', label: 'Editor' }
						]
					}
				]
			},
			{
				id: 'orders',
				name: sql ? 'orders' : 'Orders',
				group: sql ? 'public' : 'Commerce',
				recordCount: 3,
				fields: [
					{ id: 'id', label: 'ID', type: 'string', readonly: true },
					{
						id: 'status',
						label: 'Status',
						type: 'enum',
						options: [
							{ value: 'paid', label: 'Paid' },
							{ value: 'pending', label: 'Pending' }
						]
					},
					{ id: 'total', label: 'Total', type: 'number' }
				]
			}
		];
	});

	let activeResourceId = $state('users');
	let records = $state<Record<string, unknown>[]>([
		{ id: '1', name: 'Ana', email: 'ana@r2.dev', role: 'admin' },
		{ id: '2', name: 'Carlos', email: 'carlos@r2.dev', role: 'editor' },
		{ id: '3', name: 'Maya', email: 'maya@r2.dev', role: 'editor' }
	]);
	let orderRecords = $state<Record<string, unknown>[]>([
		{ id: 'o1', status: 'paid', total: 120 },
		{ id: 'o2', status: 'pending', total: 80 },
		{ id: 'o3', status: 'paid', total: 440 }
	]);
	let sqlText = $state('select * from users;');

	$effect(() => {
		// Only seed when the Storybook example changes.
		activeResourceId = example === 'mainOnly' ? 'orders' : 'users';
	});

	const activeRecords = $derived(
		activeResourceId === 'orders' ? orderRecords : records
	);
</script>

<ResourceStudioTemplate
	title={example === 'sql' ? 'Database Studio' : 'Admin'}
	description={example === 'sql'
		? 'Drizzle-like browse UI built on ResourceStudio.'
		: 'Full-page CRUD shell for your collections.'}
	{resources}
	bind:activeResourceId
	records={activeRecords}
	totalRecords={activeRecords.length}
	layout={example === 'mainOnly' ? 'main-only' : 'sidebar-main-detail'}
	modes={example === 'sql' ? ['browse', 'schema', 'query', 'detail'] : ['browse', 'detail', 'schema']}
	labels={example === 'sql'
		? { resources: 'Tables', records: 'rows', addRecord: 'Insert row', query: 'SQL' }
		: undefined}
	oninsert={(row) => {
		if (activeResourceId === 'orders') orderRecords = [row, ...orderRecords];
		else records = [row, ...records];
	}}
	onupdate={(id, patch) => {
		const apply = (list: Record<string, unknown>[]) =>
			list.map((r) => (String(r.id) === id ? { ...r, ...patch } : r));
		if (activeResourceId === 'orders') orderRecords = apply(orderRecords);
		else records = apply(records);
	}}
	ondelete={(ids) => {
		const filter = (list: Record<string, unknown>[]) =>
			list.filter((r) => !ids.includes(String(r.id)));
		if (activeResourceId === 'orders') orderRecords = filter(orderRecords);
		else records = filter(records);
	}}
>
	{#snippet headerActions()}
		<Button size="sm" variant="secondary">Docs</Button>
	{/snippet}

	{#snippet queryPanel()}
		<div class="space-y-2">
			<CodeEditor bind:value={sqlText} class="min-h-28" />
			<Button size="sm" variant="primary">Run SQL</Button>
		</div>
	{/snippet}

	{#snippet cell(row, column)}
		{#if column.id === 'status' || column.id === 'role'}
			<Badge variant="secondary">{String(row[column.id] ?? '')}</Badge>
		{:else}
			{row[column.id] == null ? '' : String(row[column.id])}
		{/if}
	{/snippet}
</ResourceStudioTemplate>
