<script lang="ts">
	import AppShell from './AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	const sidebarGroups: SidebarGroup[] = [
		{
			id: 'main',
			label: 'Workspace',
			items: [
				{ id: 'home', label: 'Home' },
				{ id: 'projects', label: 'Projects' },
				{ id: 'billing', label: 'Billing' }
			]
		}
	];

	const navLinks: NavbarLink[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'activity', label: 'Activity' },
		{ id: 'settings', label: 'Settings' }
	];

	let sidebarValue = $state('projects');
	let navValue = $state('overview');
</script>

<div class="w-full max-w-5xl">
	<AppShell {sidebarGroups} {navLinks} bind:sidebarValue bind:navValue>
		{#snippet actions()}
			<Button size="sm">New</Button>
			<Avatar name="Rafa" size="sm" />
		{/snippet}
		<div class="space-y-2">
			<h1 class="text-xl font-semibold text-primary capitalize">{navValue}</h1>
			<p class="text-sm text-secondary">
				Sidebar: <span class="font-medium text-primary">{sidebarValue}</span>
			</p>
		</div>
	</AppShell>
</div>
