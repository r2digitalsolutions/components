<script lang="ts">
	import UserChip, {
		type UserChipLabel,
		type UserChipSize,
		type UserChipStatus,
		type UserChipVariant
	} from './UserChip.svelte';

	type Example = 'playground' | 'assignees' | 'filters' | 'mentions' | 'sizes' | 'variants';

	let props = $props<{
		example?: Example;
		name?: string;
		description?: string;
		avatar?: string;
		status?: UserChipStatus;
		size?: UserChipSize;
		variant?: UserChipVariant;
		label?: UserChipLabel;
		selected?: boolean;
		disabled?: boolean;
		removable?: boolean;
	}>();

	let selectedId = $state<string | null>('2');
	let last = $state('—');

	let assignees = $state([
		{
			id: '1',
			name: 'Ada Lovelace',
			avatar: 'https://i.pravatar.cc/80?img=5',
			status: 'online' as const,
			description: 'Math'
		},
		{
			id: '2',
			name: 'Grace Hopper',
			avatar: 'https://i.pravatar.cc/80?img=9',
			status: 'away' as const,
			description: 'Eng'
		},
		{
			id: '3',
			name: 'Alan Turing',
			avatar: 'https://i.pravatar.cc/80?img=12',
			status: 'busy' as const,
			description: 'Research'
		},
		{
			id: '4',
			name: 'Katherine Johnson',
			avatar: 'https://i.pravatar.cc/80?img=20',
			status: 'online' as const,
			description: 'NASA'
		}
	]);

	const filters = [
		{ id: 'me', name: 'Assigned to me', avatar: 'https://i.pravatar.cc/80?img=3' },
		{ id: 'review', name: 'Needs review', avatar: 'https://i.pravatar.cc/80?img=15' },
		{ id: 'blocked', name: 'Blocked by', avatar: 'https://i.pravatar.cc/80?img=32' }
	];

	const example = $derived(props.example ?? 'playground');

	function remove(id: string) {
		assignees = assignees.filter((a) => a.id !== id);
		last = `removed ${id}`;
	}
</script>

<div class="w-full max-w-lg space-y-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">User chip</p>
		<p class="text-xs text-secondary">
			Last interaction: <span class="font-medium text-primary">{last}</span>
		</p>
	</div>

	{#if example === 'playground'}
		<div class="flex flex-wrap items-center gap-2">
			<UserChip
				name={props.name ?? 'Ada Lovelace'}
				avatar={props.avatar ?? 'https://i.pravatar.cc/80?img=5'}
				description={props.description}
				status={props.status}
				size={props.size ?? 'md'}
				variant={props.variant ?? 'default'}
				label={props.label ?? 'first'}
				selected={props.selected ?? false}
				disabled={props.disabled ?? false}
				removable={props.removable ?? true}
				onclick={() => (last = 'clicked chip')}
				onremove={() => (last = 'removed chip')}
			/>
		</div>
	{:else if example === 'assignees'}
		<div class="flex flex-wrap gap-2">
			{#each assignees as user (user.id)}
				<UserChip
					name={user.name}
					avatar={user.avatar}
					status={user.status}
					description={user.description}
					size={props.size ?? 'md'}
					variant={props.variant ?? 'default'}
					removable
					onclick={() => (last = user.name)}
					onremove={() => remove(user.id)}
				/>
			{/each}
			{#if assignees.length === 0}
				<p class="text-xs text-muted">No assignees — remount the story to reset.</p>
			{/if}
		</div>
	{:else if example === 'filters'}
		<div class="flex flex-wrap gap-2">
			{#each filters as f (f.id)}
				<UserChip
					name={f.name}
					avatar={f.avatar}
					label="full"
					size="sm"
					variant="soft"
					selected={selectedId === f.id}
					onclick={() => {
						selectedId = selectedId === f.id ? null : f.id;
						last = f.name;
					}}
				/>
			{/each}
		</div>
	{:else if example === 'mentions'}
		<p class="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-primary">
			Can you review this with
			<UserChip
				name="Grace Hopper"
				avatar="https://i.pravatar.cc/80?img=9"
				status="online"
				size="sm"
				variant="brand"
				class="mx-0.5 align-middle"
				onclick={() => (last = 'mention Grace')}
			/>
			and
			<UserChip
				name="Alan Turing"
				avatar="https://i.pravatar.cc/80?img=12"
				status="busy"
				size="sm"
				variant="brand"
				class="mx-0.5 align-middle"
				onclick={() => (last = 'mention Alan')}
			/>
			before Friday?
		</p>
	{:else if example === 'sizes'}
		<div class="flex flex-wrap items-end gap-2">
			{#each (['xs', 'sm', 'md', 'lg'] as UserChipSize[]) as s}
				<UserChip
					name="Ada Lovelace"
					avatar="https://i.pravatar.cc/80?img=5"
					status="online"
					description={s === 'lg' || s === 'md' ? 'Engineer' : undefined}
					size={s}
					removable
				/>
			{/each}
		</div>
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each (['default', 'soft', 'outline', 'brand'] as UserChipVariant[]) as v}
				<UserChip
					name="Grace Hopper"
					avatar="https://i.pravatar.cc/80?img=9"
					status="away"
					variant={v}
					label="full"
					description={v}
				/>
			{/each}
		</div>
	{/if}
</div>
