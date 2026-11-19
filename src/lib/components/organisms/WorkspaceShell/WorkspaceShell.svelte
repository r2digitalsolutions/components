<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Two-level workspace layout (rail + section menu) that turns into
	 * header + bottom bar on phones. Every region is a snippet so any app
	 * can plug its own NavRail, SectionNav, search, BottomNav…
	 *
	 * Desktop (≥ lg):  rail | secondary | (topbar / content)
	 * Tablet (md):     rail | (topbar / content)         — secondary hidden
	 * Phone:           mobileHeader / content / bottomNav
	 */
	interface WorkspaceShellProps {
		/** Narrow icon rail (NavRail variant="solid" showLabels). */
		rail?: Snippet;
		/** Section menu next to the rail (SectionNav). */
		secondary?: Snippet;
		/** Top bar over the content on tablet/desktop (breadcrumb, search, actions). */
		topbar?: Snippet;
		/** Header on phones (switcher, search button, section tabs). */
		mobileHeader?: Snippet;
		/** Bottom bar on phones (BottomNav). */
		bottomNav?: Snippet;
		children?: Snippet;
		/** Max width of the content column. */
		contentWidth?: 'full' | 'xl' | '2xl';
		class?: string;
		contentClass?: string;
	}

	const {
		rail,
		secondary,
		topbar,
		mobileHeader,
		bottomNav,
		children,
		contentWidth = 'full',
		class: className = '',
		contentClass = ''
	}: WorkspaceShellProps = $props();

	const WIDTH = { full: '', xl: 'max-w-7xl', '2xl': 'max-w-[96rem]' } as const;
</script>

<div class={['bg-surface text-primary flex min-h-dvh', className]}>
	{#if rail}
		<div class="top-0 md:flex sticky hidden h-dvh">{@render rail()}</div>
	{/if}
	{#if secondary}
		<div class="top-0 lg:flex sticky hidden h-dvh">{@render secondary()}</div>
	{/if}
	<div class="min-w-0 flex flex-1 flex-col">
		{#if mobileHeader}
			<div class="top-0 md:hidden sticky z-30">{@render mobileHeader()}</div>
		{/if}
		{#if topbar}
			<div class="top-0 bg-surface/90 backdrop-blur md:block sticky z-30 hidden">
				{@render topbar()}
			</div>
		{/if}
		<main
			class={[
				'min-w-0 px-4 pb-28 pt-4 md:px-6 md:pb-10 md:pt-2 mx-auto w-full flex-1',
				WIDTH[contentWidth],
				contentClass
			]}
		>
			{@render children?.()}
		</main>
	</div>
	{#if bottomNav}
		<div class="inset-x-0 bottom-0 md:hidden fixed z-40">{@render bottomNav()}</div>
	{/if}
</div>
