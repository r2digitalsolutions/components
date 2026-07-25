<script lang="ts">
	import UserCard from './UserCard.svelte';

	let props = $props<{ name?: string; role?: string; badge?: string }>();
</script>

<div class="max-w-xs">
	<UserCard
		name={props.name ?? 'Ada Lovelace'}
		email="ada@example.com"
		role={props.role ?? 'Staff Engineer'}
		avatar="https://i.pravatar.cc/120?img=5"
		status="online"
		badge={props.badge ?? 'Admin'}
	/>
</div>
