<script lang="ts">
	import { FileText, FolderPlus, Search, Settings, UserPlus, Users } from '@lucide/svelte';
	import CommandPalette, { type CommandItem } from './CommandPalette.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	const items: CommandItem[] = [
		{
			id: 'new',
			label: 'Create project',
			group: 'Actions',
			shortcut: ['⌘', 'N'],
			icon: FolderPlus
		},
		{ id: 'search', label: 'Search files', group: 'Actions', shortcut: ['⌘', 'P'], icon: Search },
		{
			id: 'invoice',
			label: 'FAC-2026-0142',
			subtitle: 'Invoice · Acme S.L.',
			group: 'Documents',
			keywords: 'factura invoice',
			icon: FileText
		},
		{
			id: 'settings',
			label: 'Open settings',
			group: 'Navigation',
			shortcut: ['⌘', ','],
			href: '/settings',
			icon: Settings
		},
		{ id: 'team', label: 'Invite teammate', group: 'Navigation', icon: UserPlus },
		{ id: 'billing', label: 'Billing', group: 'Navigation', disabled: true, icon: Users }
	];

	let open = $state(false);
	let last = $state('');

	function onWindowKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			open = true;
		}
	}
</script>

<svelte:window onkeydown={onWindowKey} />

<div class="gap-3 flex flex-col items-center">
	<Button size="sm" onclick={() => (open = true)}>
		Open palette
		<Kbd keys={['⌘', 'K']} size="sm" />
	</Button>
	{#if last}
		<p class="text-xs text-muted">Selected: {last}</p>
	{/if}
</div>

<CommandPalette bind:open {items} onselect={(item) => (last = item.label)} />
