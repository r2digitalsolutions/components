<script lang="ts">
	import BottomNav, { type BottomNavItem } from './BottomNav.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'floating' | 'pill' | 'notch';
		showLabels?: boolean;
		blur?: boolean;
		elevated?: boolean;
		example?: 'social' | 'commerce' | 'workspace' | 'iconsOnly' | 'music';
		fabClass?: string;
	}>();

	const examples: Record<string, BottomNavItem[]> = {
		social: [
			{ id: 'dashboard', label: 'Dashboard', icon: 'grid' },
			{ id: 'chats', label: 'Chats', icon: 'chat', badge: 3 },
			{ id: 'create', label: 'Create', icon: 'plus', primary: true },
			{ id: 'profile', label: 'Profile', icon: 'user' },
			{ id: 'settings', label: 'Settings', icon: 'settings' }
		],
		commerce: [
			{ id: 'shop', label: 'Shop', icon: 'grid' },
			{ id: 'explore', label: 'Explore', icon: 'compass' },
			{ id: 'saved', label: 'Saved', icon: 'bookmark', badge: 12 },
			{ id: 'account', label: 'Account', icon: 'user' }
		],
		workspace: [
			{ id: 'home', label: 'Home', icon: 'home' },
			{ id: 'search', label: 'Search', icon: 'search' },
			{ id: 'alerts', label: 'Alerts', icon: 'bell', badge: '9+' },
			{ id: 'profile', label: 'Me', icon: 'user' }
		],
		iconsOnly: [
			{ id: 'home', label: 'Home', icon: 'home' },
			{ id: 'heart', label: 'Likes', icon: 'heart', badge: 2 },
			{ id: 'plus', label: 'New', icon: 'plus', primary: true },
			{ id: 'inbox', label: 'Inbox', icon: 'inbox' },
			{ id: 'user', label: 'Profile', icon: 'user' }
		],
		music: [
			{ id: 'home', label: 'Home', icon: 'home' },
			{ id: 'search', label: 'Search', icon: 'search' },
			{ id: 'library', label: 'Library', icon: 'music' },
			{ id: 'settings', label: 'Settings', icon: 'settings' }
		]
	};

	const items = $derived(examples[props.example ?? 'social']);
	let value = $state('dashboard');

	$effect(() => {
		const first = items.find((i) => !i.disabled && !i.primary)?.id ?? items[0]?.id;
		if (first && !items.some((i) => i.id === value)) value = first;
	});
</script>

<div
	class="mx-auto flex w-[22rem] max-w-full flex-col overflow-visible rounded-[1.75rem] border border-border bg-gradient-to-b from-brand-200/70 via-sky-100/40 to-surface shadow-xl dark:from-brand-950/50 dark:via-surface dark:to-surface"
>
	<div class="flex flex-1 flex-col overflow-hidden rounded-t-[1.75rem] px-5 pb-8 pt-6">
		<div class="mb-4 h-3 w-24 rounded-full bg-surface-elevated/70"></div>
		<div class="space-y-2">
			<div class="h-28 rounded-2xl bg-surface-elevated/60"></div>
			<div class="h-16 rounded-2xl bg-surface-elevated/40"></div>
		</div>
		<p class="mt-5 text-center text-xs text-secondary">
			Active: <span class="font-medium text-primary">{value}</span>
		</p>
	</div>

	<div class="overflow-visible pb-3">
		<BottomNav
			{items}
			bind:value
			size={props.size ?? 'md'}
			variant={props.variant ?? 'notch'}
			showLabels={props.showLabels ?? props.example !== 'iconsOnly'}
			blur={props.blur ?? false}
			elevated={props.elevated ?? true}
			fabClass={props.fabClass ?? 'bg-brand-500 hover:bg-brand-600'}
		/>
	</div>
</div>
