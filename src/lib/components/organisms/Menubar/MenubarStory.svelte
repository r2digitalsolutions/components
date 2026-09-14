<script lang="ts">
	import Menubar, { type MenubarItem } from './Menubar.svelte';

	const items: MenubarItem[] = [
		{
			id: 'file',
			label: 'File',
			items: [
				{ id: 'new-file', label: 'New Text File', shortcut: '⌘N' },
				{ id: 'new-window', label: 'New Window', shortcut: '⇧⌘N' },
				{
					id: 'new-profile',
					label: 'New Window with Profile',
					children: [
						{ id: 'profile-default', label: 'Default' },
						{ id: 'profile-work', label: 'Work' },
						{ id: 'sep-profiles', label: '', separator: true },
						{ id: 'profile-manage', label: 'Manage Profiles…' }
					]
				},
				{ id: 'sep1', label: '', separator: true },
				{ id: 'open', label: 'Open…', shortcut: '⌘O' },
				{ id: 'open-folder', label: 'Open Folder…', shortcut: '⌘K ⌘O' },
				{
					id: 'open-recent',
					label: 'Open Recent',
					children: [
						{ id: 'recent-1', label: 'crm' },
						{ id: 'recent-2', label: 'components' },
						{ id: 'sep-recent', label: '', separator: true },
						{ id: 'recent-clear', label: 'Clear Recently Opened' }
					]
				},
				{ id: 'sep2', label: '', separator: true },
				{ id: 'save', label: 'Save', shortcut: '⌘S' },
				{ id: 'save-as', label: 'Save As…', shortcut: '⇧⌘S' },
				{ id: 'save-all', label: 'Save All', shortcut: '⌥⌘S', disabled: true },
				{ id: 'sep3', label: '', separator: true },
				{ id: 'auto-save', label: 'Auto Save', checked: true },
				{ id: 'sep4', label: '', separator: true },
				{ id: 'close-editor', label: 'Close Editor', shortcut: '⌘W' },
				{ id: 'close-window', label: 'Close Window', shortcut: '⇧⌘W', destructive: true }
			]
		},
		{
			id: 'edit',
			label: 'Edit',
			items: [
				{ id: 'undo', label: 'Undo', shortcut: '⌘Z' },
				{ id: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
				{ id: 'sep-e1', label: '', separator: true },
				{ id: 'cut', label: 'Cut', shortcut: '⌘X' },
				{ id: 'copy', label: 'Copy', shortcut: '⌘C' },
				{ id: 'paste', label: 'Paste', shortcut: '⌘V' },
				{ id: 'sep-e2', label: '', separator: true },
				{ id: 'select-all', label: 'Select All', shortcut: '⌘A' }
			]
		},
		{
			id: 'view',
			label: 'View',
			items: [
				{ id: 'sidebar', label: 'Toggle Sidebar', shortcut: '⌘B', checked: true },
				{ id: 'inspector', label: 'Toggle Inspector', shortcut: '⌘I', checked: true },
				{ id: 'sep-v1', label: '', separator: true },
				{ id: 'zoom-in', label: 'Zoom In', shortcut: '⌘+' },
				{ id: 'zoom-out', label: 'Zoom Out', shortcut: '⌘-' },
				{ id: 'zoom-reset', label: 'Reset Zoom', shortcut: '⌘0' }
			]
		},
		{
			id: 'help',
			label: 'Help',
			items: [
				{ id: 'docs', label: 'Documentation' },
				{ id: 'shortcuts', label: 'Keyboard Shortcuts', shortcut: '⌘K ⌘S' },
				{ id: 'sep-h', label: '', separator: true },
				{ id: 'about', label: 'About' }
			]
		}
	];

	let lastAction = $state('');
</script>

<div class="space-y-4 rounded-xl border border-border bg-surface p-4 dark:bg-neutral-950">
	<div
		class="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated/90 px-2 py-1 backdrop-blur"
	>
		<span class="px-1 text-xs font-semibold tracking-tight text-primary">App</span>
		<div class="h-3.5 w-px bg-border" aria-hidden="true"></div>
		<Menubar {items} class="min-w-0 flex-1" onselect={(id, parent) => (lastAction = `${parent} › ${id}`)} />
	</div>
	{#if lastAction}
		<p class="text-xs text-muted">
			Acción: <span class="font-medium text-primary">{lastAction}</span>
		</p>
	{/if}
</div>
