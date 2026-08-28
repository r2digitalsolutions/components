<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar, { type SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import Navbar, { type NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import NavRail, { type NavRailItem } from '$lib/components/organisms/NavRail/NavRail.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import {
		AppChrome,
		getAppChrome,
		setAppChrome,
		type AppShellContextual
	} from '$lib/components/organisms/AppShell/app-chrome.svelte.js';

	interface AppShellProps {
		brand?: string;
		sidebarGroups?: SidebarGroup[];
		navLinks?: NavbarLink[];
		sidebarValue?: string;
		navValue?: string;
		collapsed?: boolean;
		showSidebar?: boolean;
		showNavbar?: boolean;
		/** Icon rail. Shown when the list is non-empty. */
		rail?: NavRailItem[];
		railFooter?: NavRailItem[];
		railValue?: string;
		railBrand?: Snippet;
		onrailchange?: (id: string) => void;
		/** Storybook / explicit contextual nav. Nested layouts can also set this via `getAppChrome()`. */
		contextualGroups?: SidebarGroup[];
		contextualValue?: string;
		contextualBrand?: string;
		contextualHeader?: Snippet;
		oncontextualchange?: (id: string) => void;
		onsidebarchange?: (id: string) => void;
		sidebarFooter?: Snippet;
		/**
		 * Fill the viewport. Use `false` + `framed` for compact Storybook previews.
		 */
		fullHeight?: boolean;
		/** Card chrome (border/radius) — typical for demos, not production apps. */
		framed?: boolean;
		/** Extra classes for the main content region (e.g. `p-0` for flush panels). */
		mainClass?: string;
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
		rail = [],
		railFooter = [],
		railValue = $bindable(''),
		railBrand,
		onrailchange,
		contextualGroups = [],
		contextualValue = $bindable(''),
		contextualBrand = '',
		contextualHeader,
		oncontextualchange,
		onsidebarchange,
		sidebarFooter,
		fullHeight = true,
		framed = false,
		mainClass = '',
		class: className = '',
		actions: actionsSlot,
		children
	}: AppShellProps = $props();

	const chrome = (() => {
		try {
			return getAppChrome();
		} catch {
			const created = new AppChrome();
			setAppChrome(created);
			return created;
		}
	})();

	const propContextual = $derived.by((): AppShellContextual | null => {
		if (contextualGroups.length === 0) return null;
		return {
			groups: contextualGroups,
			value: contextualValue,
			brand: contextualBrand,
			header: contextualHeader,
			onchange: oncontextualchange
		};
	});

	const resolvedContextual = $derived(chrome.source?.() ?? propContextual);
	const contextualKey = $derived(
		resolvedContextual
			? `${resolvedContextual.parentHref ?? ''}:${resolvedContextual.brand ?? ''}:${resolvedContextual.description ?? ''}`
			: ''
	);
	const showRail = $derived(rail.length > 0 || railFooter.length > 0);
	let mobileOpen = $state(false);

	const mobileShowsContextual = $derived(Boolean(resolvedContextual));

	function closeMobile() {
		mobileOpen = false;
	}

	function onPrimaryChange(id: string) {
		onsidebarchange?.(id);
		closeMobile();
	}

	function onContextualNav(id: string) {
		contextualValue = id;
		resolvedContextual?.onchange?.(id);
		closeMobile();
	}
</script>

<div
	class={[
		'bg-surface relative flex w-full overflow-hidden',
		fullHeight && 'h-dvh',
		!fullHeight && framed && 'min-h-0 h-full',
		!fullHeight && !framed && 'h-[min(36rem,80vh)]',
		framed && 'rounded-2xl border-border shadow-sm border',
		className
	]}
>
	{#snippet contextualHeaderDefault()}
		{#if resolvedContextual}
			<div class="min-w-0 space-y-1">
				{#if resolvedContextual.parentHref && resolvedContextual.parentLabel}
					<a
						href={resolvedContextual.parentHref}
						class="text-muted hover:text-primary block truncate text-[11px]"
					>
						{resolvedContextual.parentLabel}
					</a>
				{/if}
				<p class="text-sm font-semibold text-primary truncate">{resolvedContextual.brand}</p>
				<div class="gap-1.5 flex flex-wrap items-center">
					{#if resolvedContextual.status}
						<Badge variant="secondary" size="sm">{resolvedContextual.status}</Badge>
					{/if}
					{#if resolvedContextual.description}
						<span class="text-muted truncate text-[11px]">{resolvedContextual.description}</span>
					{/if}
				</div>
			</div>
		{/if}
	{/snippet}

	{#if showRail}
		<NavRail
			items={rail}
			footerItems={railFooter}
			bind:value={railValue}
			brand={railBrand}
			onchange={onrailchange}
		/>
	{/if}

	{#if mobileOpen}
		<button
			type="button"
			class="inset-0 bg-black/40 md:hidden fixed z-30"
			aria-label="Cerrar menú"
			onclick={closeMobile}
		></button>
	{/if}

	{#if showSidebar}
		<div
			class={[
				'z-40 h-full shrink-0',
				mobileShowsContextual && 'max-md:hidden',
				!mobileOpen && 'max-md:hidden',
				mobileOpen &&
					!mobileShowsContextual &&
					'max-md:fixed max-md:inset-y-0 max-md:z-40 max-md:shadow-xl',
				mobileOpen && !mobileShowsContextual && showRail && 'max-md:left-14',
				mobileOpen && !mobileShowsContextual && !showRail && 'max-md:left-0'
			]}
		>
			<Sidebar
				{brand}
				groups={sidebarGroups}
				bind:value={sidebarValue}
				bind:collapsed
				footer={sidebarFooter}
				onchange={onPrimaryChange}
			/>
		</div>
	{/if}

	{#if resolvedContextual}
		{#key contextualKey}
			<div
				class={[
					'z-40 h-full shrink-0',
					!mobileOpen && 'max-md:hidden',
					mobileOpen &&
						mobileShowsContextual &&
						'max-md:fixed max-md:inset-y-0 max-md:z-40 max-md:shadow-xl',
					mobileOpen && mobileShowsContextual && showRail && 'max-md:left-14',
					mobileOpen && mobileShowsContextual && !showRail && 'max-md:left-0'
				]}
			>
				<Sidebar
					brand={resolvedContextual.brand ?? brand}
					groups={resolvedContextual.groups}
					value={resolvedContextual.value}
					collapsible={false}
					header={resolvedContextual.header ?? contextualHeaderDefault}
					onchange={onContextualNav}
				/>
			</div>
		{/key}
	{/if}

	<div class="min-h-0 min-w-0 flex flex-1 flex-col">
		{#if showNavbar}
			<Navbar
				{brand}
				links={navLinks}
				bind:value={navValue}
				showBrand={!showSidebar && !showRail}
				variant="pills"
				size="sm"
				bordered
				maxWidth="full"
			>
				{#snippet leading()}
					<div class="md:hidden">
						<IconButton
							label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
							size="sm"
							onclick={() => (mobileOpen = !mobileOpen)}
						>
							<svg
								class="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								{#if mobileOpen}
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								{:else}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								{/if}
							</svg>
						</IconButton>
					</div>
				{/snippet}
				{#snippet actions()}
					{#if actionsSlot}{@render actionsSlot()}{/if}
				{/snippet}
			</Navbar>
		{/if}
		<main class={['min-h-0 p-6 flex-1 overflow-auto', mainClass]}>
			{#if children}{@render children()}{/if}
		</main>
	</div>
</div>
