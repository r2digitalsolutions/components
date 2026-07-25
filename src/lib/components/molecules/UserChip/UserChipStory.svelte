<script lang="ts">
	import UserChip from './UserChip.svelte';

	let assignees = $state([
		{ id: '1', name: 'Ada Lovelace', avatar: 'https://i.pravatar.cc/80?img=5', status: 'online' as const },
		{ id: '2', name: 'Grace Hopper', avatar: 'https://i.pravatar.cc/80?img=9', status: 'away' as const },
		{ id: '3', name: 'Alan Turing', avatar: 'https://i.pravatar.cc/80?img=12', status: 'busy' as const }
	]);

	function remove(id: string) {
		assignees = assignees.filter((a) => a.id !== id);
	}
</script>

<div class="w-full max-w-lg space-y-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">User chip</p>
		<p class="text-xs text-secondary">Pills compactas para assignees, filtros y menciones.</p>
	</div>

	<div class="space-y-2">
		<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Assignees</p>
		<div class="flex flex-wrap gap-2">
			{#each assignees as user (user.id)}
				<UserChip
					name={user.name}
					avatar={user.avatar}
					status={user.status}
					removable
					onremove={() => remove(user.id)}
				/>
			{/each}
			{#if assignees.length === 0}
				<p class="text-xs text-muted">No assignees — refresh the story to reset.</p>
			{/if}
		</div>
	</div>

	<div class="space-y-2">
		<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Sizes</p>
		<div class="flex flex-wrap items-center gap-2">
			<UserChip name="Ada Lovelace" avatar="https://i.pravatar.cc/80?img=5" size="sm" />
			<UserChip name="Grace Hopper" avatar="https://i.pravatar.cc/80?img=9" size="md" status="online" />
		</div>
	</div>
</div>
