<script lang="ts">
	import MultiWorkspaceDashboard from './MultiWorkspaceDashboard.svelte';
	import type { WorkspaceInvite } from './MultiWorkspaceDashboard.svelte';
	import type { WorkspaceItem } from '$lib/components/molecules/WorkspaceCard/WorkspaceCard.svelte';

	interface Props {
		example?:
			| 'default'
			| 'list'
			| 'filtered'
			| 'empty'
			| 'loading'
			| 'invites'
			| 'at-capacity'
			| 'favorites'
			| 'compact';
	}

	let { example = 'default' }: Props = $props();

	const base: WorkspaceItem[] = [
		{
			id: 'ws1',
			name: 'Acme Corp',
			plan: 'Business',
			members: 24,
			role: 'owner',
			favorite: true,
			lastActive: '2h ago',
			tone: 'brand',
			seats: { current: 24, target: 30 },
			memberAvatars: [
				{ id: 'a', name: 'Ana Ruiz' },
				{ id: 'b', name: 'Ben Cole' },
				{ id: 'c', name: 'Cora Lee' },
				{ id: 'd', name: 'Dan Park' },
				{ id: 'e', name: 'Eve Kim' }
			],
			usage: [
				{ id: 'storage', label: 'Storage', value: 42, max: 100 },
				{ id: 'bandwidth', label: 'Bandwidth', value: 18, max: 50 },
				{ id: 'api', label: 'API calls', value: 8, max: 20 }
			]
		},
		{
			id: 'ws2',
			name: 'Design Studio',
			plan: 'Pro',
			members: 8,
			role: 'admin',
			lastActive: 'Yesterday',
			tone: 'sky',
			status: 'trial',
			seats: { current: 8, target: 10 },
			memberAvatars: [
				{ id: 'f', name: 'Fay' },
				{ id: 'g', name: 'Gus' }
			],
			usage: [
				{ id: 'storage', label: 'Storage', value: 12, max: 50 },
				{ id: 'bandwidth', label: 'Bandwidth', value: 4, max: 25 }
			]
		},
		{
			id: 'ws3',
			name: 'Side Project',
			plan: 'Free',
			members: 3,
			role: 'member',
			favorite: true,
			lastActive: 'Just now',
			tone: 'emerald',
			seats: { current: 3, target: 5 }
		},
		{
			id: 'ws4',
			name: 'Client — Northwind',
			plan: 'Enterprise',
			members: 56,
			role: 'viewer',
			lastActive: '4d ago',
			tone: 'rose',
			seats: { current: 56, target: 50 },
			usage: [
				{ id: 'storage', label: 'Storage', value: 890, max: 1000 },
				{ id: 'bandwidth', label: 'Bandwidth', value: 210, max: 500 },
				{ id: 'api', label: 'API calls', value: 45, max: 100 },
				{ id: 'seats', label: 'Extra seats', value: 6, max: 10 }
			]
		},
		{
			id: 'ws5',
			name: 'Globex Labs',
			plan: 'Team',
			members: 18,
			role: 'admin',
			lastActive: '1w ago',
			tone: 'amber',
			seats: { current: 18, target: 20 },
			usage: [{ id: 'storage', label: 'Storage', value: 28, max: 100 }]
		},
		{
			id: 'ws6',
			name: 'Archive — Q1 Pilot',
			plan: 'Pro',
			members: 6,
			role: 'owner',
			status: 'archived',
			lastActive: '3 months ago',
			tone: 'sky',
			seats: { current: 0, target: 10 }
		}
	];

	let workspaces = $state<WorkspaceItem[]>([...base]);
	let query = $state('');
	let filter = $state<'all' | 'favorites' | 'owner' | 'admin' | 'member' | 'at-capacity' | 'trial' | 'archived'>('all');
	let view = $state<'grid' | 'list'>('grid');
	let invites = $state<WorkspaceInvite[]>([]);
	let last = $state('');

	$effect(() => {
		if (example === 'list') {
			workspaces = [...base];
			view = 'list';
			filter = 'all';
			query = '';
			invites = [];
		} else if (example === 'filtered') {
			workspaces = [...base];
			view = 'grid';
			filter = 'owner';
			query = '';
			invites = [];
		} else if (example === 'empty') {
			workspaces = [];
			view = 'grid';
			filter = 'all';
			query = '';
			invites = [];
		} else if (example === 'loading') {
			workspaces = [...base];
			view = 'grid';
			filter = 'all';
			query = '';
			invites = [];
		} else if (example === 'invites') {
			workspaces = [...base].slice(0, 3);
			view = 'grid';
			filter = 'all';
			query = '';
			invites = [
				{
					id: 'inv1',
					workspaceName: 'Orbit Media',
					from: 'maya@orbit.io',
					plan: 'Business'
				},
				{
					id: 'inv2',
					workspaceName: 'Harbor Finance',
					from: 'ops@harbor.co',
					plan: 'Enterprise'
				}
			];
		} else if (example === 'at-capacity') {
			workspaces = [...base];
			view = 'grid';
			filter = 'at-capacity';
			query = '';
			invites = [];
		} else if (example === 'favorites') {
			workspaces = [...base];
			view = 'grid';
			filter = 'favorites';
			query = '';
			invites = [];
		} else if (example === 'compact') {
			workspaces = [...base].slice(0, 2);
			view = 'list';
			filter = 'all';
			query = '';
			invites = [];
		} else {
			workspaces = [...base];
			view = 'grid';
			filter = 'all';
			query = '';
			invites = [];
		}
	});

	function onfavorite(id: string, favorite: boolean) {
		workspaces = workspaces.map((w) => (w.id === id ? { ...w, favorite } : w));
		last = `${favorite ? 'Favorited' : 'Unfavorited'} ${id}`;
	}

	function onacceptinvite(id: string) {
		const inv = invites.find((i) => i.id === id);
		invites = invites.filter((i) => i.id !== id);
		if (inv) {
			workspaces = [
				{
					id: `from-${id}`,
					name: inv.workspaceName,
					plan: inv.plan,
					role: 'member',
					members: 1,
					tone: 'brand',
					lastActive: 'Just now',
					seats: { current: 1, target: 10 }
				},
				...workspaces
			];
		}
		last = `Accepted ${id}`;
	}

	function ondeclineinvite(id: string) {
		invites = invites.filter((i) => i.id !== id);
		last = `Declined ${id}`;
	}
</script>

<div class="p-4 sm:p-6">
	{#if last}
		<p class="mb-3 text-xs text-muted">Last action: {last}</p>
	{/if}
	<MultiWorkspaceDashboard
		{workspaces}
		{invites}
		bind:query
		bind:filter
		bind:view
		loading={example === 'loading'}
		showStats={example !== 'compact' && example !== 'empty'}
		showCreateTile={example !== 'compact'}
		onopen={(id) => (last = `Opened ${id}`)}
		oncreate={() => (last = 'Create workspace')}
		{onfavorite}
		onupgrade={(id) => (last = `Upgrade ${id}`)}
		{onacceptinvite}
		{ondeclineinvite}
	/>
</div>
