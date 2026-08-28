<script lang="ts">
	import AppShell from './AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { NavRailItem } from '$lib/components/organisms/NavRail/NavRail.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';

	let {
		fullHeight = true,
		framed = false,
		showRail = true,
		showContextual = false
	}: {
		fullHeight?: boolean;
		framed?: boolean;
		showRail?: boolean;
		showContextual?: boolean;
	} = $props();

	const sidebarGroups: SidebarGroup[] = [
		{
			id: 'ops',
			label: 'Workspace',
			items: [
				{ id: 'home', label: 'Dashboard', href: '#' },
				{ id: 'projects', label: 'Projects', href: '#' },
				{ id: 'billing', label: 'Billing', href: '#' }
			]
		},
		{
			id: 'manage',
			label: 'Manage',
			items: [
				{ id: 'team', label: 'Team', href: '#' },
				{ id: 'settings', label: 'Settings', href: '#' }
			]
		}
	];

	const rail: NavRailItem[] = [
		{ id: 'home', label: 'Home', href: '#' },
		{ id: 'atom', label: 'Atom', href: '#' },
		{ id: 'crm', label: 'CRM', href: '#' }
	];

	const railFooter: NavRailItem[] = [{ id: 'settings', label: 'Settings', href: '#' }];

	const contextualGroups: SidebarGroup[] = [
		{
			id: 'general',
			label: 'General',
			items: [
				{ id: 'overview', label: 'Overview', href: '#' },
				{ id: 'datos', label: 'Details', href: '#' }
			]
		},
		{
			id: 'biz',
			label: 'Business',
			items: [
				{ id: 'contracts', label: 'Clients', href: '#' },
				{ id: 'plans', label: 'Plans', href: '#' }
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
	let railValue = $state('atom');
	let contextualValue = $state('overview');
</script>

<AppShell
	{sidebarGroups}
	{navLinks}
	{fullHeight}
	{framed}
	rail={showRail ? rail : []}
	railFooter={showRail ? railFooter : []}
	contextualGroups={showContextual ? contextualGroups : []}
	contextualBrand="Atom"
	bind:sidebarValue
	bind:navValue
	bind:railValue
	bind:contextualValue
>
	{#snippet railBrand()}
		<BrandMark mark="R2" size="sm" />
	{/snippet}
	{#snippet contextualHeader()}
		<div class="min-w-0">
			<p class="text-sm font-semibold text-primary truncate">Atom</p>
			<div class="mt-1 gap-1.5 flex items-center">
				<Badge variant="success" size="sm" dot>active</Badge>
			</div>
		</div>
	{/snippet}
	{#snippet actions()}
		<Button size="sm">New</Button>
		<Avatar name="Rafa" size="sm" />
	{/snippet}
	<div class="space-y-2">
		<h1 class="text-xl font-semibold text-primary capitalize">{navValue}</h1>
		<p class="text-sm text-secondary">
			Sidebar: <span class="font-medium text-primary">{sidebarValue}</span>
			{#if showRail}
				· Rail: <span class="font-medium text-primary">{railValue}</span>
			{/if}
			{#if showContextual}
				· Contextual: <span class="font-medium text-primary">{contextualValue}</span>
			{/if}
		</p>
		<p class="max-w-lg text-sm text-muted">
			Scrollable content area. The shell fills the viewport so sidebar and main column reach the
			bottom.
		</p>
		{#each Array.from({ length: 12 }, (_, i) => i + 1) as n (n)}
			<div class="rounded-xl border-border bg-surface-elevated p-4 text-sm text-secondary border">
				Content block {n}
			</div>
		{/each}
	</div>
</AppShell>
