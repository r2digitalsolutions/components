<script lang="ts">
	import DropdownMenu, { type DropdownItem } from './DropdownMenu.svelte';
	import Pencil from './icons/Pencil.svelte';
	import Copy from './icons/Copy.svelte';
	import Share from './icons/Share.svelte';
	import Settings from './icons/Settings.svelte';
	import User from './icons/User.svelte';
	import Bell from './icons/Bell.svelte';
	import Trash from './icons/Trash.svelte';
	import Folder from './icons/Folder.svelte';
	import File from './icons/File.svelte';

	let props = $props<{
		example?: 'basic' | 'nested' | 'checked' | 'align-end' | 'small' | 'long';
		size?: 'sm' | 'md';
		side?: 'bottom' | 'top';
		align?: 'start' | 'end';
		closeOnSelect?: boolean;
		scrollable?: boolean;
		flyToSelected?: boolean;
	}>();

	const example = $derived(props.example ?? 'nested');

	const basicItems: DropdownItem[] = [
		{ id: 'edit', label: 'Edit', icon: Pencil, shortcut: '⌘E' },
		{ id: 'duplicate', label: 'Duplicate', icon: Copy, shortcut: '⌘D' },
		{ id: 'share', label: 'Share', icon: Share },
		{ id: 'sep', label: '', separator: true },
		{ id: 'delete', label: 'Delete', icon: Trash, destructive: true, shortcut: '⌫' }
	];

	const longItems: DropdownItem[] = Array.from({ length: 24 }, (_, i) => ({
		id: `item-${i + 1}`,
		label: `Action item ${i + 1}`,
		icon: i % 3 === 0 ? File : i % 3 === 1 ? Folder : Settings
	}));

	const nestedItems: DropdownItem[] = [
		{
			id: 'account',
			label: 'Account',
			icon: User,
			description: 'Profile and security',
			children: [
				{ id: 'profile', label: 'Profile', icon: User },
				{ id: 'notifications', label: 'Notifications', icon: Bell },
				{
					id: 'privacy',
					label: 'Privacy',
					icon: Settings,
					children: [
						{ id: 'privacy-public', label: 'Public profile' },
						{ id: 'privacy-private', label: 'Private profile' },
						{ id: 'privacy-custom', label: 'Custom…' }
					]
				}
			]
		},
		{
			id: 'files',
			label: 'Files',
			icon: Folder,
			children: [
				{ id: 'docs', label: 'Documents', icon: File },
				{ id: 'uploads', label: 'Uploads', icon: Folder },
				{ id: 'sep-f', label: '', separator: true },
				{ id: 'trash', label: 'Trash', icon: Trash, destructive: true }
			]
		},
		{ id: 'sep-1', label: '', separator: true },
		{ id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘,' },
		{ id: 'logout', label: 'Log out', destructive: true }
	];

	let checkedShare = $state(true);
	let checkedNotify = $state(false);

	const checkedItems = $derived<DropdownItem[]>([
		{ id: 'share-link', label: 'Share link', icon: Share, checked: checkedShare },
		{ id: 'notify', label: 'Notify team', icon: Bell, checked: checkedNotify },
		{ id: 'sep', label: '', separator: true },
		{ id: 'done', label: 'Done' }
	]);

	let last = $state('');

	function onselect(id: string) {
		last = id;
		if (id === 'share-link') checkedShare = !checkedShare;
		if (id === 'notify') checkedNotify = !checkedNotify;
	}

	const items = $derived(
		example === 'basic' || example === 'align-end' || example === 'small'
			? basicItems
			: example === 'checked'
				? checkedItems
				: example === 'long'
					? longItems
					: nestedItems
	);

	const scrollable = $derived(props.scrollable ?? example === 'long');
	const flyToSelected = $derived(props.flyToSelected ?? example === 'nested');
</script>

<div class="space-y-3">
	<p class="text-xs text-secondary">
		{#if example === 'nested'}
			Nested drill-down. With <code class="text-primary">flyToSelected</code>, reopen lands on the last pick.
		{:else if example === 'checked'}
			Toggleable checked items (`closeOnSelect=false`). Checks update live from props.
		{:else if example === 'long'}
			Long list with <code class="text-primary">scrollable</code> + <code class="text-primary">maxHeight</code>.
		{:else}
			Icons + shortcuts. Prefer <code class="text-primary">@lucide/svelte</code> in apps.
		{/if}
	</p>

	<DropdownMenu
		{items}
		label={example === 'nested' ? 'Workspace' : example === 'long' ? 'Many actions' : 'Actions'}
		size={props.size ?? (example === 'small' ? 'sm' : 'md')}
		side={props.side ?? 'bottom'}
		align={props.align ?? (example === 'align-end' ? 'end' : 'start')}
		closeOnSelect={props.closeOnSelect ?? example !== 'checked'}
		{scrollable}
		maxHeight={scrollable ? 240 : undefined}
		{flyToSelected}
		{onselect}
	/>

	<p class="min-h-4 text-xs text-secondary">
		{#if last}
			Selected: <span class="font-medium text-primary">{last}</span>
		{/if}
	</p>
</div>
