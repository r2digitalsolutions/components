<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppBar from '$lib/components/molecules/AppBar/AppBar.svelte';
	import type { AppBarVariant } from '$lib/components/molecules/AppBar/AppBar.svelte';
	import BottomNav from '$lib/components/organisms/BottomNav/BottomNav.svelte';
	import type { BottomNavItem } from '$lib/components/organisms/BottomNav/BottomNav.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';

	interface MobileShellProps {
		title?: string;
		subtitle?: string;
		navItems?: BottomNavItem[];
		activeNav?: string;
		showMenu?: boolean;
		showBack?: boolean;
		appBarVariant?: AppBarVariant;
		class?: string;
		children?: Snippet;
		trailing?: Snippet;
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
		showMenu = true,
		showBack = false,
		appBarVariant = 'blur',
		class: className = '',
		children,
		trailing,
		onnav,
		onback,
		onmenu
	}: MobileShellProps = $props();
</script>

<div class={['flex min-h-[28rem] flex-col bg-surface', className]}>
	<AppBar
		{title}
		{subtitle}
		variant={appBarVariant}
		{showMenu}
		{showBack}
		{onback}
		{onmenu}
		{trailing}
	/>
	<main class="min-h-0 flex-1 overflow-y-auto">
		<SafeArea top={false} bottom={false} class="px-4 py-4">
			{@render children?.()}
		</SafeArea>
	</main>
	<div class="sticky bottom-0 mt-auto">
		<BottomNav
			bind:value={activeNav}
			items={navItems}
			variant="default"
			onchange={(id) => onnav?.(id)}
		/>
	</div>
</div>
