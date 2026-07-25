<script lang="ts">
	import RoleCard from './RoleCard.svelte';

	let selected = $state('admin');
</script>

<div class="mx-auto grid max-w-2xl gap-3 p-4 sm:grid-cols-2">
	<RoleCard
		id="owner"
		name="Owner"
		description="Full control including billing and destructive actions."
		memberCount={1}
		system
		selected={selected === 'owner'}
		permissions={[
			{ resource: 'Projects', levels: ['read', 'write', 'admin'] },
			{ resource: 'Billing', levels: ['read', 'write', 'admin'] },
			{ resource: 'Members', levels: ['read', 'write', 'admin'] }
		]}
		onclick={() => (selected = 'owner')}
	/>
	<RoleCard
		id="admin"
		name="Admin"
		description="Manage workspace content and members."
		memberCount={3}
		selected={selected === 'admin'}
		permissions={[
			{ resource: 'Projects', levels: ['read', 'write'] },
			{ resource: 'Billing', levels: ['read'] },
			{ resource: 'Members', levels: ['read', 'write'] },
			{ resource: 'API keys', levels: ['read', 'write'] },
			{ resource: 'Settings', levels: ['read'] }
		]}
		onclick={() => (selected = 'admin')}
		onedit={() => (selected = 'admin')}
	/>
</div>
