<script lang="ts">
	import WorkspaceCard from './WorkspaceCard.svelte';
	import type { WorkspaceItem } from './WorkspaceCard.svelte';

	interface Props {
		example?: 'card' | 'row' | 'favorites' | 'statuses';
	}

	let { example = 'card' }: Props = $props();

	let items = $state<WorkspaceItem[]>([
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
				{ id: 'a', name: 'Ana' },
				{ id: 'b', name: 'Ben' },
				{ id: 'c', name: 'Cora' },
				{ id: 'd', name: 'Dan' }
			],
			usage: [
				{ id: 'storage', label: 'Storage', value: 42, max: 100 },
				{ id: 'bandwidth', label: 'Bandwidth', value: 18, max: 50 }
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
			usage: [{ id: 'storage', label: 'Storage', value: 12, max: 50 }]
		},
		{
			id: 'ws3',
			name: 'Northwind Client',
			plan: 'Enterprise',
			members: 56,
			role: 'member',
			tone: 'rose',
			status: 'archived',
			seats: { current: 56, target: 50 },
			lastActive: '3 weeks ago'
		},
		{
			id: 'ws4',
			name: 'Side Project',
			plan: 'Free',
			members: 3,
			role: 'viewer',
			tone: 'emerald',
			favorite: true,
			lastActive: 'Just now',
			seats: { current: 3, target: 5 }
		}
	]);

	const shown = $derived(
		example === 'favorites'
			? items.filter((w) => w.favorite)
			: example === 'statuses'
				? items
				: items.slice(0, 2)
	);

	const layout = $derived(example === 'row' ? 'row' : 'card');

	function onfavorite(id: string, favorite: boolean) {
		items = items.map((w) => (w.id === id ? { ...w, favorite } : w));
	}
</script>

<div class="mx-auto max-w-4xl space-y-4 p-4">
	{#if layout === 'card'}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each shown as ws (ws.id)}
				<WorkspaceCard workspace={ws} {onfavorite} onopen={() => {}} />
			{/each}
		</div>
	{:else}
		<div class="space-y-2">
			{#each shown as ws (ws.id)}
				<WorkspaceCard workspace={ws} layout="row" {onfavorite} onopen={() => {}} />
			{/each}
		</div>
	{/if}
</div>
