<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

	export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

	export interface PresenceUser {
		id: string;
		name: string;
		avatar?: string;
		status?: PresenceStatus;
	}

	interface PresenceListProps {
		users?: PresenceUser[];
		max?: number;
		class?: string;
	}

	const {
		users = [],
		max = 5,
		class: className = ''
	}: PresenceListProps = $props();

	const visible = $derived(users.slice(0, max));
	const overflow = $derived(Math.max(0, users.length - max));
</script>

<div class={['flex flex-col gap-2', className]} role="list" aria-label="Online users">
	{#each visible as user (user.id)}
		<div class="flex items-center gap-2.5 rounded-lg px-1 py-0.5" role="listitem">
			<Avatar
				src={user.avatar}
				name={user.name}
				size="sm"
				status={user.status ?? 'offline'}
				ringed={false}
			/>
			<span class="min-w-0 flex-1 truncate text-sm font-medium text-primary">{user.name}</span>
			{#if user.status}
				<StatusDot status={user.status} size="sm" showLabel />
			{/if}
		</div>
	{/each}

	{#if overflow > 0}
		<p class="px-1 text-xs text-muted">+{overflow} more</p>
	{/if}
</div>
