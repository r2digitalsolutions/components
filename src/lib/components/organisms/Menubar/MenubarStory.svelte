<script lang="ts">
	import Menubar, { type MenubarItem } from './Menubar.svelte';

	const items: MenubarItem[] = [
		{
			id: 'file',
			label: 'File',
			items: [
				{ id: 'new', label: 'New File', shortcut: '⌘N' },
				{ id: 'open', label: 'Open...', shortcut: '⌘O' },
				{ id: 'save', label: 'Save', shortcut: '⌘S' },
				{ id: 'saveas', label: 'Save As...', shortcut: '⌘⇧S' },
				{ id: 'sep1', label: '', separator: true },
				{ id: 'close', label: 'Close', shortcut: '⌘W' },
				{ id: 'quit', label: 'Quit', shortcut: '⌘Q', destructive: true }
			]
		},
		{
			id: 'edit',
			label: 'Edit',
			items: [
				{ id: 'undo', label: 'Undo', shortcut: '⌘Z' },
				{ id: 'redo', label: 'Redo', shortcut: '⌘⇧Z' },
				{ id: 'sep2', label: '', separator: true },
				{ id: 'cut', label: 'Cut', shortcut: '⌘X' },
				{ id: 'copy', label: 'Copy', shortcut: '⌘C' },
				{ id: 'paste', label: 'Paste', shortcut: '⌘V' },
				{ id: 'sep3', label: '', separator: true },
				{ id: 'selectall', label: 'Select All', shortcut: '⌘A' }
			]
		},
		{
			id: 'view',
			label: 'View',
			items: [
				{ id: 'sidebar', label: 'Toggle Sidebar', shortcut: '⌘B' },
				{ id: 'terminal', label: 'Toggle Terminal', shortcut: '⌘`' },
				{ id: 'zen', label: 'Zen Mode', shortcut: '⌘K Z', disabled: true },
				{ id: 'sep4', label: '', separator: true },
				{ id: 'zoomin', label: 'Zoom In', shortcut: '⌘+' },
				{ id: 'zoomout', label: 'Zoom Out', shortcut: '⌘-' },
				{ id: 'zoomreset', label: 'Reset Zoom', shortcut: '⌘0' }
			]
		},
		{
			id: 'help',
			label: 'Help',
			items: [
				{ id: 'docs', label: 'Documentation' },
				{ id: 'shortcuts', label: 'Keyboard Shortcuts', shortcut: '⌘K ⌘S' },
				{ id: 'sep5', label: '', separator: true },
				{ id: 'about', label: 'About' }
			]
		}
	];

	let lastAction = $state('');
</script>

<div class="space-y-4">
	<Menubar {items} onselect={(id, parent) => (lastAction = `${parent} > ${id}`)} />
	{#if lastAction}
		<p class="text-xs text-muted">
			Acción: <span class="text-primary font-medium">{lastAction}</span>
		</p>
	{/if}
</div>
