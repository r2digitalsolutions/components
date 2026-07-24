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
		/**
		 * Fill the viewport. Use `false` + `framed` for compact Storybook previews.
		 */
		fullHeight?: boolean;
		/** Card chrome (border/radius) — typical for demos, not production apps. */
		framed?: boolean;
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
		fullHeight = true,
		framed = false,
		class: className = '',
		actions,
		children
	}: AppShellProps = $props();
</script>

<div
	class={[
		'flex w-full overflow-hidden bg-surface',
		fullHeight ? 'h-dvh' : 'h-[min(36rem,80vh)]',
		framed && 'rounded-xl border border-border',
		className
	]}
>
	{#if showSidebar}
		<Sidebar
			{brand}
			groups={sidebarGroups}
			bind:value={sidebarValue}
			bind:collapsed
		/>
	{/if}
	<div class="flex min-h-0 min-w-0 flex-1 flex-col">
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
