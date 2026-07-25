<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppShell from '$lib/components/organisms/AppShell/AppShell.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	interface DashboardTemplateProps {
		title?: string;
		description?: string;
		brand?: string;
		stats?: StatStripItem[];
		sidebarGroups?: SidebarGroup[];
		navLinks?: NavbarLink[];
		sidebarValue?: string;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		title = 'Dashboard',
		description = 'Overview of your workspace.',
		brand = 'R2 Digi',
		stats = [],
		sidebarGroups = [
			{
				id: 'main',
				label: 'Main',
				items: [
					{ id: 'dash', label: 'Dashboard' },
					{ id: 'projects', label: 'Projects' },
					{ id: 'team', label: 'Team' }
				]
			}
		],
		navLinks = [],
		sidebarValue = $bindable('dash'),
		class: className = '',
		actions,
		children
	}: DashboardTemplateProps = $props();
</script>

<AppShell
	{brand}
	{sidebarGroups}
	{navLinks}
	bind:sidebarValue
	fullHeight={false}
	framed
	class={className}
>
	<Container size="xl" class="space-y-6 py-6">
		<PageHeader {title} {description} {actions} />
		{#if stats.length}
			<StatStrip items={stats} />
		{/if}
		{@render children?.()}
	</Container>
</AppShell>
