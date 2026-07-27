<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import WorkspaceCardComponent from '$lib/components/molecules/WorkspaceCard/WorkspaceCard.svelte';
	import type {
		WorkspaceItem,
		WorkspaceSeats
	} from '$lib/components/molecules/WorkspaceCard/WorkspaceCard.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SkeletonCard from '$lib/components/molecules/SkeletonCard/SkeletonCard.svelte';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Plus from '@lucide/svelte/icons/plus';
	import Mail from '@lucide/svelte/icons/mail';

	export type { WorkspaceItem, WorkspaceSeats };

	export type WorkspaceViewMode = 'grid' | 'list';
	export type WorkspaceFilterId =
		| 'all'
		| 'favorites'
		| 'owner'
		| 'admin'
		| 'member'
		| 'at-capacity'
		| 'trial'
		| 'archived';

	export interface WorkspaceInvite {
		id: string;
		workspaceName: string;
		from?: string;
		plan?: string;
	}

	interface MultiWorkspaceDashboardProps {
		title?: string;
		description?: string;
		workspaces?: WorkspaceItem[];
		invites?: WorkspaceInvite[];
		query?: string;
		filter?: WorkspaceFilterId;
		view?: WorkspaceViewMode;
		loading?: boolean;
		showStats?: boolean;
		showCreateTile?: boolean;
		emptyTitle?: string;
		emptyDescription?: string;
		class?: string;
		onopen?: (id: string) => void;
		oncreate?: () => void;
		onfavorite?: (id: string, favorite: boolean) => void;
		onupgrade?: (id: string) => void;
		onacceptinvite?: (id: string) => void;
		ondeclineinvite?: (id: string) => void;
	}

	let {
		title = 'Workspaces',
		description = 'Switch between teams or create a new workspace.',
		workspaces = [],
		invites = [],
		query = $bindable(''),
		filter = $bindable<WorkspaceFilterId>('all'),
		view = $bindable<WorkspaceViewMode>('grid'),
		loading = false,
		showStats = true,
		showCreateTile = true,
		emptyTitle = 'No workspaces yet',
		emptyDescription = 'Create your first workspace to collaborate with your team.',
		class: className = '',
		onopen,
		oncreate,
		onfavorite,
		onupgrade,
		onacceptinvite,
		ondeclineinvite
	}: MultiWorkspaceDashboardProps = $props();

	const filterItems = $derived.by((): ChipBarItem[] => {
		const counts = {
			all: workspaces.length,
			favorites: workspaces.filter((w) => w.favorite).length,
			owner: workspaces.filter((w) => w.role === 'owner').length,
			admin: workspaces.filter((w) => w.role === 'admin').length,
			member: workspaces.filter((w) => w.role === 'member' || w.role === 'viewer').length,
			'at-capacity': workspaces.filter(
				(w) => w.seats && w.seats.current >= w.seats.target
			).length,
			trial: workspaces.filter((w) => w.status === 'trial').length,
			archived: workspaces.filter((w) => w.status === 'archived').length
		};
		return [
			{ id: 'all', label: 'All', count: counts.all },
			{ id: 'favorites', label: 'Favorites', count: counts.favorites },
			{ id: 'owner', label: 'Owner', count: counts.owner },
			{ id: 'admin', label: 'Admin', count: counts.admin },
			{ id: 'member', label: 'Member', count: counts.member },
			{ id: 'at-capacity', label: 'At capacity', count: counts['at-capacity'] },
			{ id: 'trial', label: 'Trial', count: counts.trial },
			{ id: 'archived', label: 'Archived', count: counts.archived }
		].filter((item) => item.id === 'all' || (item.count ?? 0) > 0);
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return workspaces.filter((w) => {
			if (filter === 'favorites' && !w.favorite) return false;
			if (filter === 'owner' && w.role !== 'owner') return false;
			if (filter === 'admin' && w.role !== 'admin') return false;
			if (filter === 'member' && w.role !== 'member' && w.role !== 'viewer') return false;
			if (filter === 'trial' && w.status !== 'trial') return false;
			if (filter === 'archived' && w.status !== 'archived') return false;
			if (filter === 'at-capacity') {
				if (!w.seats || w.seats.current < w.seats.target) return false;
			} else if (w.status === 'archived' && filter === 'all') {
				/* keep archived in All */
			}
			if (!q) return true;
			const hay = [w.name, w.plan, w.role, w.status].filter(Boolean).join(' ').toLowerCase();
			return hay.includes(q);
		});
	});

	const stats = $derived.by((): StatStripItem[] => {
		const totalSeats = workspaces.reduce((s, w) => s + (w.seats?.current ?? 0), 0);
		const seatCap = workspaces.reduce((s, w) => s + (w.seats?.target ?? 0), 0);
		const atRisk = workspaces.filter(
			(w) => w.seats && w.seats.current >= w.seats.target * 0.8
		).length;
		const favs = workspaces.filter((w) => w.favorite).length;
		return [
			{ id: 'ws', label: 'Workspaces', value: workspaces.length },
			{
				id: 'seats',
				label: 'Seats used',
				value: seatCap ? `${totalSeats}/${seatCap}` : totalSeats,
				hint: seatCap ? undefined : undefined
			},
			{ id: 'risk', label: 'Near capacity', value: atRisk, hint: atRisk ? 'Review plans' : 'Healthy' },
			{ id: 'fav', label: 'Favorites', value: favs }
		];
	});

	function onFilterChange(id: string) {
		filter = id as WorkspaceFilterId;
	}
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			<Button size="sm" onclick={() => oncreate?.()}>
				<Plus class="h-4 w-4" strokeWidth={2} />
				New workspace
			</Button>
		{/snippet}
	</PageHeader>

	{#if invites.length}
		<div class="space-y-2">
			{#each invites as invite (invite.id)}
				<div
					class="flex flex-wrap items-center gap-3 rounded-xl border border-brand-500/25 bg-brand-50/40 px-4 py-3 dark:bg-brand-950/20"
				>
					<span
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400"
					>
						<Mail class="h-4 w-4" strokeWidth={2} />
					</span>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-primary">
							Invite to {invite.workspaceName}
						</p>
						<p class="text-xs text-muted">
							{#if invite.from}From {invite.from}{/if}
							{#if invite.plan}
								{#if invite.from} · {/if}{invite.plan} plan
							{/if}
						</p>
					</div>
					<div class="flex gap-2">
						<Button size="sm" variant="ghost" onclick={() => ondeclineinvite?.(invite.id)}>
							Decline
						</Button>
						<Button size="sm" onclick={() => onacceptinvite?.(invite.id)}>Accept</Button>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if showStats && !loading && workspaces.length}
		<StatStrip items={stats} />
	{/if}

	{#if !loading && workspaces.length}
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<SearchInput
				bind:value={query}
				placeholder="Search workspaces…"
				size="sm"
				class="w-full sm:max-w-xs"
			/>
			<div class="min-w-0 flex-1">
				<ChipBar
					items={filterItems}
					bind:value={filter}
					size="sm"
					onchange={onFilterChange}
				/>
			</div>
			<div
				class="flex shrink-0 self-end rounded-lg border border-border bg-surface-elevated p-0.5 sm:self-auto"
				role="group"
				aria-label="View mode"
			>
				<button
					type="button"
					class={[
						'rounded-md p-1.5 transition-colors',
						view === 'grid'
							? 'bg-surface-overlay text-primary'
							: 'text-muted hover:text-secondary'
					]}
					aria-pressed={view === 'grid'}
					aria-label="Grid view"
					onclick={() => (view = 'grid')}
				>
					<LayoutGrid class="h-4 w-4" strokeWidth={2} />
				</button>
				<button
					type="button"
					class={[
						'rounded-md p-1.5 transition-colors',
						view === 'list'
							? 'bg-surface-overlay text-primary'
							: 'text-muted hover:text-secondary'
					]}
					aria-pressed={view === 'list'}
					aria-label="List view"
					onclick={() => (view = 'list')}
				>
					<List class="h-4 w-4" strokeWidth={2} />
				</button>
			</div>
		</div>
	{/if}

	{#if loading}
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each [1, 2, 3] as i (i)}
				<SkeletonCard layout="article" media={false} lines={3} actions />
			{/each}
		</div>
	{:else if !workspaces.length}
		<EmptyState title={emptyTitle} description={emptyDescription}>
			{#snippet action()}
				<Button size="sm" onclick={() => oncreate?.()}>Create workspace</Button>
			{/snippet}
		</EmptyState>
	{:else if !filtered.length}
		<EmptyState
			title="No matches"
			description={query
				? `Nothing found for “${query}”. Try another search or filter.`
				: 'No workspaces match this filter.'}
		>
			{#snippet action()}
				<Button
					size="sm"
					variant="secondary"
					onclick={() => {
						query = '';
						filter = 'all';
					}}
				>
					Clear filters
				</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<div
			class={
				view === 'list'
					? 'space-y-2'
					: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
			}
		>
			{#each filtered as ws (ws.id)}
				<WorkspaceCardComponent
					workspace={ws}
					layout={view === 'list' ? 'row' : 'card'}
					{onopen}
					{onfavorite}
					{onupgrade}
				/>
			{/each}

			{#if showCreateTile && view === 'grid'}
				<button
					type="button"
					class="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-overlay/30 p-4 text-center transition-colors hover:border-brand-500/40 hover:bg-surface-overlay/60"
					onclick={() => oncreate?.()}
				>
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
					>
						<Plus class="h-5 w-5" strokeWidth={2} />
					</span>
					<span class="text-sm font-medium text-primary">Create workspace</span>
					<span class="text-xs text-muted">Start fresh with a new team</span>
				</button>
			{/if}
		</div>

		{#if showCreateTile && view === 'list'}
			<button
				type="button"
				class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-overlay/30 px-4 py-3 text-sm font-medium text-secondary transition-colors hover:border-brand-500/40 hover:text-primary"
				onclick={() => oncreate?.()}
			>
				<Plus class="h-4 w-4" strokeWidth={2} />
				Create workspace
			</button>
		{/if}
	{/if}
</div>
