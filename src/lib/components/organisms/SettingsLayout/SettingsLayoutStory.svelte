<script lang="ts">
	import SettingsLayout from './SettingsLayout.svelte';

	let value = $state('profile');
	const items = [
		{ id: 'profile', label: 'Profile', description: 'Name and avatar' },
		{ id: 'security', label: 'Security', description: 'Password and MFA' },
		{ id: 'billing', label: 'Billing', description: 'Plans and invoices' },
		{ id: 'team', label: 'Team', description: 'Members and roles' }
	];
</script>

<SettingsLayout bind:value {items} class="w-full max-w-3xl rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="text-sm text-secondary">
		Content for <strong class="text-primary">{value}</strong> settings goes here.
	</p>
</SettingsLayout>
