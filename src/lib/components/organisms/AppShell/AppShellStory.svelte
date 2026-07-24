<script lang="ts">
	import AppShell from './AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	let {
		fullHeight = true,
		framed = false
	}: {
		fullHeight?: boolean;
		framed?: boolean;
	} = $props();

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

<AppShell
	{sidebarGroups}
	{navLinks}
	{fullHeight}
	{framed}
	bind:sidebarValue
	bind:navValue
>
	{#snippet actions()}
		<Button size="sm">New</Button>
		<Avatar name="Rafa" size="sm" />
	{/snippet}
	<div class="space-y-2">
		<h1 class="text-xl font-semibold capitalize text-primary">{navValue}</h1>
		<p class="text-sm text-secondary">
			Sidebar: <span class="font-medium text-primary">{sidebarValue}</span>
		</p>
		<p class="max-w-lg text-sm text-muted">
			Scrollable content area. The shell fills the viewport so sidebar and main column reach the
			bottom.
		</p>
		{#each Array.from({ length: 12 }, (_, i) => i + 1) as n (n)}
			<div class="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-secondary">
				Content block {n}
			</div>
		{/each}
	</div>
</AppShell>
