<script lang="ts">
	import DataListPage from './DataListPage.svelte';
	import DataTable from '$lib/components/organisms/DataTable/DataTable.svelte';
	import type { DataTableColumn } from '$lib/components/organisms/DataTable/DataTable.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';

	type Member = {
		id: string;
		name: string;
		email: string;
		role: string;
		status: 'Active' | 'Away' | 'Invited';
		lastActive: string;
	};

	let {
		empty = false,
		loading = false
	}: {
		empty?: boolean;
		loading?: boolean;
	} = $props();

	let query = $state('');
	let filters = $state<FilterChip[]>([
		{ id: 'active', label: 'Active' },
		{ id: 'eng', label: 'Engineering' }
	]);
	let page = $state(1);

	const rows: Member[] = [
		{
			id: '1',
			name: 'Ada Lovelace',
			email: 'ada@r2digi.com',
			role: 'Engineer',
			status: 'Active',
			lastActive: '2m ago'
		},
		{
			id: '2',
			name: 'Alan Turing',
			email: 'alan@r2digi.com',
			role: 'Research',
			status: 'Active',
			lastActive: '1h ago'
		},
		{
			id: '3',
			name: 'Grace Hopper',
			email: 'grace@r2digi.com',
			role: 'Lead',
			status: 'Away',
			lastActive: 'Yesterday'
		},
		{
			id: '4',
			name: 'Katherine Johnson',
			email: 'kathy@r2digi.com',
			role: 'Analyst',
			status: 'Active',
			lastActive: '4h ago'
		},
		{
			id: '5',
			name: 'Margaret Hamilton',
			email: 'margaret@r2digi.com',
			role: 'Engineer',
			status: 'Invited',
			lastActive: '—'
		},
		{
			id: '6',
			name: 'Barbara Liskov',
			email: 'barbara@r2digi.com',
			role: 'Architect',
			status: 'Active',
			lastActive: '12m ago'
		}
	];

	const columns: DataTableColumn<Member>[] = [
		{ id: 'name', header: 'Member', accessor: 'name', sortable: true },
		{ id: 'role', header: 'Role', accessor: 'role', sortable: true },
		{ id: 'status', header: 'Status', accessor: 'status' },
		{ id: 'lastActive', header: 'Last active', accessor: 'lastActive' },
		{ id: 'actions', header: '', align: 'right', width: '3rem' }
	];

	const statusTone: Record<Member['status'], 'success' | 'warning' | 'info'> = {
		Active: 'success',
		Away: 'warning',
		Invited: 'info'
	};

	const filtered = $derived(
		rows.filter((r) => {
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return (
				r.name.toLowerCase().includes(q) ||
				r.email.toLowerCase().includes(q) ||
				r.role.toLowerCase().includes(q)
			);
		})
	);
</script>

<div class="min-h-[36rem] w-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
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
		totalPages={4}
		totalItems={128}
		pageSize={6}
		searchPlaceholder="Search by name, email, or role…"
		stats={[
			{ id: 'total', label: 'Members', value: 128, hint: '+6 this month' },
			{ id: 'active', label: 'Active', value: 104, hint: '81%' },
			{ id: 'invited', label: 'Pending', value: 9, hint: 'Awaiting join' },
			{ id: 'seats', label: 'Seats left', value: 22, hint: 'Pro plan' }
		]}
		empty={empty}
		{loading}
		emptyTitle="No members found"
		emptyDescription="Invite teammates or clear filters to see everyone again."
	>
		{#snippet actions()}
			<Button size="sm" variant="secondary">Export</Button>
			<Button size="sm">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
				</svg>
				Invite
			</Button>
		{/snippet}

		{#snippet toolbar()}
			<Button size="sm" variant="ghost">Filters</Button>
		{/snippet}

		{#snippet emptyAction()}
			<Button size="sm">Invite member</Button>
		{/snippet}

		<DataTable
			columns={columns}
			rows={filtered}
			rowKey="id"
			hoverable
			stickyHeader
			class="rounded-none border-0 shadow-none"
		>
			{#snippet cell(row, column)}
				{#if column.id === 'name'}
					<div class="flex items-center gap-3 py-0.5">
						<Avatar name={row.name} size="sm" status={row.status === 'Active' ? 'online' : row.status === 'Away' ? 'away' : null} />
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-primary">{row.name}</p>
							<p class="truncate text-xs text-muted">{row.email}</p>
						</div>
					</div>
				{:else if column.id === 'role'}
					<span class="text-sm text-secondary">{row.role}</span>
				{:else if column.id === 'status'}
					<Badge variant={statusTone[row.status]} size="sm" rounded dot>{row.status}</Badge>
				{:else if column.id === 'lastActive'}
					<span class="tabular-nums text-xs text-muted">{row.lastActive}</span>
				{:else if column.id === 'actions'}
					<IconButton label="More actions" size="xs" variant="ghost">
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<circle cx="5" cy="12" r="1.5" />
							<circle cx="12" cy="12" r="1.5" />
							<circle cx="19" cy="12" r="1.5" />
						</svg>
					</IconButton>
				{:else}
					{row[column.id as keyof Member]}
				{/if}
			{/snippet}
		</DataTable>
	</DataListPage>
</div>
