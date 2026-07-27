<script lang="ts">
	import PresenceList from './PresenceList.svelte';
	import type { PresenceUser } from './PresenceList.svelte';

	const users: PresenceUser[] = [
		{ id: '1', name: 'Maya Chen', avatar: 'https://i.pravatar.cc/80?img=5', status: 'online' },
		{ id: '2', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/80?img=12', status: 'away' },
		{ id: '3', name: 'Jordan Lee', status: 'busy' },
		{ id: '4', name: 'Sam Ortiz', status: 'online' },
		{ id: '5', name: 'Taylor Kim', status: 'offline' },
		{ id: '6', name: 'Chris Park', status: 'online' }
	];
</script>

<div class="max-w-xs space-y-3">
	<p class="text-sm font-semibold text-primary">Presence</p>
	<div class="rounded-xl border border-border bg-surface-elevated p-3">
		<PresenceList {users} max={4} />
	</div>
</div>
