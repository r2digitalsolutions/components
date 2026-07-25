<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppBar from '$lib/components/molecules/AppBar/AppBar.svelte';
	import type { AppBarVariant } from '$lib/components/molecules/AppBar/AppBar.svelte';
	import BottomNav from '$lib/components/organisms/BottomNav/BottomNav.svelte';
	import type { BottomNavItem } from '$lib/components/organisms/BottomNav/BottomNav.svelte';

	export type MobileShellNavVariant = 'default' | 'floating' | 'pill' | 'notch';

	interface MobileShellProps {
		title?: string;
		subtitle?: string;
		navItems?: BottomNavItem[];
		activeNav?: string;
		showNav?: boolean;
		showMenu?: boolean;
		showBack?: boolean;
		appBarVariant?: AppBarVariant;
		appBarElevated?: boolean;
		navVariant?: MobileShellNavVariant;
		navBlur?: boolean;
		/** Fill parent height (use inside PhoneFrame) */
		fill?: boolean;
		class?: string;
		contentClass?: string;
		children?: Snippet;
		trailing?: Snippet;
		/** Replaces default AppBar entirely */
		header?: Snippet;
		/** Extra layer above BottomNav (e.g. sticky CTA) */
		dock?: Snippet;
		onnav?: (id: string) => void;
		onback?: () => void;
		onmenu?: (open: boolean) => void;
	}

	let {
		title = 'App',
		subtitle,
		navItems = [
			{ id: 'home', label: 'Home', icon: 'home' },
			{ id: 'search', label: 'Search', icon: 'search' },
			{ id: 'inbox', label: 'Inbox', icon: 'inbox' },
			{ id: 'user', label: 'Profile', icon: 'user' }
		],
		activeNav = $bindable('home'),
		showNav = true,
		showMenu = true,
		showBack = false,
		appBarVariant = 'blur',
		appBarElevated = false,
		navVariant = 'default',
		navBlur = true,
		fill = true,
		class: className = '',
		contentClass = '',
		children,
		trailing,
		header,
		dock,
		onnav,
		onback,
		onmenu
	}: MobileShellProps = $props();

	const floatingNav = $derived(navVariant === 'floating' || navVariant === 'pill' || navVariant === 'notch');
</script>

<div
	class={[
		'relative z-0 flex flex-col overflow-hidden bg-surface text-primary',
		fill ? 'h-full min-h-0' : 'min-h-[28rem] rounded-2xl',
		className
	]}
>
	{#if header}
		{@render header()}
	{:else}
		<AppBar
			{title}
			{subtitle}
			variant={appBarVariant}
			elevated={appBarElevated}
			sticky
			safeTop
			{showMenu}
			{showBack}
			{onback}
			{onmenu}
			{trailing}
			class="shrink-0 border-b border-border/50"
		/>
	{/if}

	<main
		class={[
			'min-h-0 flex-1 overflow-y-auto overscroll-y-contain',
			showNav && floatingNav ? 'pb-24' : showNav ? 'pb-3' : 'pb-4',
			contentClass
		]}
	>
		<div class="px-4 pt-3 pb-2">
			{@render children?.()}
		</div>
	</main>

	{#if dock}
		<div class="pointer-events-none absolute inset-x-0 bottom-[4.5rem] z-30 px-4">
			<div class="pointer-events-auto">
				{@render dock()}
			</div>
		</div>
	{/if}

	{#if showNav}
		<div
			class={[
				'z-40 shrink-0',
				floatingNav
					? 'pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px),var(--phone-safe-bottom,0px))]'
					: 'border-t border-border/50 bg-surface-elevated/92 backdrop-blur-xl pb-[max(0.35rem,env(safe-area-inset-bottom,0px),var(--phone-safe-bottom,0px))]'
			]}
		>
			<div class={floatingNav ? 'pointer-events-auto' : ''}>
				<BottomNav
					bind:value={activeNav}
					items={navItems}
					variant={navVariant}
					blur={navBlur}
					elevated={floatingNav}
					onchange={(id) => onnav?.(id)}
				/>
			</div>
		</div>
	{/if}
</div>
