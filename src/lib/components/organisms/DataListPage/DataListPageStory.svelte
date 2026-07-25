<script lang="ts">
	import DataListPage from './DataListPage.svelte';
	import DataTable from '$lib/components/organisms/DataTable/DataTable.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';

	let props = $props<{ empty?: boolean; loading?: boolean }>();

	let query = $state('');
	let filters = $state<FilterChip[]>([
		{ id: 'active', label: 'Active' },
		{ id: 'team', label: 'Team A' }
	]);
	let page = $state(1);

	const rows = [
		{ id: '1', name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
		{ id: '2', name: 'Alan Turing', role: 'Research', status: 'Active' },
		{ id: '3', name: 'Grace Hopper', role: 'Lead', status: 'Away' }
	];

	const columns = [
		{ id: 'name', header: 'Name', accessor: 'name' as const, sortable: true },
		{ id: 'role', header: 'Role', accessor: 'role' as const },
		{ id: 'status', header: 'Status', accessor: 'status' as const }
	];
</script>

<div class="mx-auto max-w-4xl p-4">
	<DataListPage
		title="Team members"
		description="Manage people with access to this workspace."
		breadcrumbs={[
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'settings', label: 'Settings' },
			{ id: 'members', label: 'Members' }
		]}
		bind:query
		bind:filters
		bind:page
		totalPages={5}
		empty={props.empty ?? false}
		loading={props.loading ?? false}
	>
		{#snippet actions()}
			<Button size="sm">Invite</Button>
		{/snippet}

		{#snippet emptyAction()}
			<Button size="sm">Invite member</Button>
		{/snippet}

		<div class="overflow-hidden rounded-2xl border border-border">
			<DataTable {columns} {rows} rowKey="id" hoverable striped />
		</div>
	</DataListPage>
</div>
