<script lang="ts">
	import TeamPage from './TeamPage.svelte';
	import type { TeamMember } from './TeamPage.svelte';

	let query = $state('');

	const members: TeamMember[] = [
		{
			id: '1',
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			role: 'Staff Engineer',
			avatar: 'https://i.pravatar.cc/120?img=5',
			status: 'online',
			badge: 'Admin'
		},
		{
			id: '2',
			name: 'Alan Turing',
			email: 'alan@example.com',
			role: 'Research',
			avatar: 'https://i.pravatar.cc/120?img=12',
			status: 'away'
		},
		{
			id: '3',
			name: 'Grace Hopper',
			email: 'grace@example.com',
			role: 'Engineering Lead',
			avatar: 'https://i.pravatar.cc/120?img=32',
			status: 'busy',
			badge: 'Owner'
		}
	];
</script>

<div class="mx-auto max-w-4xl p-4">
	<TeamPage
		bind:query
		{members}
		breadcrumbs={[
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'team', label: 'Team' }
		]}
	/>
</div>
