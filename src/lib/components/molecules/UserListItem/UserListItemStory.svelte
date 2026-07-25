<script lang="ts">
	import UserListItem from './UserListItem.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';

	let selected = $state('2');

	const members = [
		{
			id: '1',
			name: 'Ada Lovelace',
			description: 'ada@analytical.engines',
			avatar: 'https://i.pravatar.cc/80?img=5',
			status: 'online' as const,
			badge: 'Admin',
			meta: 'Owner'
		},
		{
			id: '2',
			name: 'Grace Hopper',
			description: 'grace@navy.dev',
			avatar: 'https://i.pravatar.cc/80?img=9',
			status: 'away' as const,
			meta: 'Editor'
		},
		{
			id: '3',
			name: 'Alan Turing',
			description: 'alan@bletchley.io',
			avatar: 'https://i.pravatar.cc/80?img=12',
			status: 'busy' as const,
			meta: 'Viewer'
		},
		{
			id: '4',
			name: 'Katherine Johnson',
			description: 'kate@nasa.gov',
			avatar: 'https://i.pravatar.cc/80?img=20',
			status: 'offline' as const,
			meta: 'Guest',
			disabled: true
		}
	];

	let notified = $state(true);
</script>

<div class="w-full max-w-md space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">User list item</p>
		<p class="text-xs text-secondary">Filas seleccionables para teams, menciones y sidebars.</p>
	</div>

	<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
		<div class="border-b border-border px-3 py-2.5">
			<p class="text-xs font-semibold text-primary">Team members</p>
		</div>
		<div class="space-y-0.5 p-1.5">
			{#each members as member}
				<UserListItem
					name={member.name}
					description={member.description}
					avatar={member.avatar}
					status={member.status}
					badge={member.badge}
					meta={member.meta}
					disabled={member.disabled}
					selected={selected === member.id}
					onclick={() => (selected = member.id)}
				/>
			{/each}
		</div>
	</div>

	<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-sm">
		<UserListItem
			name="Ada Lovelace"
			description="Notify on mentions"
			avatar="https://i.pravatar.cc/80?img=5"
			status="online"
		>
			{#snippet trailing()}
				<Toggle bind:checked={notified} size="sm" />
			{/snippet}
		</UserListItem>
	</div>
</div>
