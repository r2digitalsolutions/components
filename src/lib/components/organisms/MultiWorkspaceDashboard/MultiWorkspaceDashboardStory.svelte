<script lang="ts">
	import MultiWorkspaceDashboard from './MultiWorkspaceDashboard.svelte';
	import type { WorkspaceCard } from './MultiWorkspaceDashboard.svelte';

	const workspaces: WorkspaceCard[] = [
		{
			id: 'ws1',
			name: 'Acme Corp',
			plan: 'Business',
			members: 24,
			role: 'Owner',
			seats: { current: 24, target: 30 },
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
			role: 'Admin',
			seats: { current: 8, target: 10 },
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
			role: 'Member',
			seats: { current: 3, target: 5 }
		},
		{
			id: 'ws4',
			name: 'Client — Northwind',
			plan: 'Enterprise',
			members: 56,
			role: 'Guest',
			seats: { current: 56, target: 50 },
			usage: [
				{ id: 'storage', label: 'Storage', value: 890, max: 1000 },
				{ id: 'bandwidth', label: 'Bandwidth', value: 210, max: 500 },
				{ id: 'api', label: 'API calls', value: 45, max: 100 },
				{ id: 'seats', label: 'Extra seats', value: 6, max: 10 }
			]
		}
	];
</script>

<div class="p-4 sm:p-6">
	<MultiWorkspaceDashboard {workspaces} />
</div>
