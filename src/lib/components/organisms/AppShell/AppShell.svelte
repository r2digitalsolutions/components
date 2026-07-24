<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar, { type SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import Navbar, { type NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';

	interface AppShellProps {
		brand?: string;
		sidebarGroups?: SidebarGroup[];
		navLinks?: NavbarLink[];
		sidebarValue?: string;
		navValue?: string;
		collapsed?: boolean;
		showSidebar?: boolean;
		showNavbar?: boolean;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		brand = 'R2 Digi',
		sidebarGroups = [],
		navLinks = [],
		sidebarValue = $bindable(''),
		navValue = $bindable(''),
		collapsed = $bindable(false),
		showSidebar = true,
		showNavbar = true,
		class: className = '',
		actions,
		children
	}: AppShellProps = $props();
</script>

<div class={['flex h-[min(36rem,80vh)] w-full overflow-hidden rounded-xl border border-border bg-surface', className]}>
	{#if showSidebar}
		<Sidebar
			{brand}
			groups={sidebarGroups}
			bind:value={sidebarValue}
			bind:collapsed
		/>
	{/if}
	<div class="flex min-w-0 flex-1 flex-col">
		{#if showNavbar}
			<Navbar
				{brand}
				links={navLinks}
				bind:value={navValue}
				showBrand={!showSidebar}
				variant="pills"
				size="sm"
				bordered
				maxWidth="full"
			>
				{#snippet actions()}
					{#if actions}{@render actions()}{/if}
				{/snippet}
			</Navbar>
		{/if}
		<main class="min-h-0 flex-1 overflow-auto p-6">
			{#if children}{@render children()}{/if}
		</main>
	</div>
</div>
