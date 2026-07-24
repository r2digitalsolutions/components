<script lang="ts">
	import ContextMenu from './ContextMenu.svelte';
	import type { ContextMenuItem } from './ContextMenu.svelte';

	const items: ContextMenuItem[] = [
		{ id: 'open', label: 'Open', shortcut: '⏎' },
		{ id: 'copy', label: 'Copy', shortcut: '⌘C' },
		{ id: 'paste', label: 'Paste', shortcut: '⌘V' },
		{ id: 'sep1', label: '', separator: true },
		{ id: 'rename', label: 'Rename', shortcut: 'F2' },
		{ id: 'share', label: 'Share…' },
		{ id: 'sep2', label: '', separator: true },
		{ id: 'delete', label: 'Delete', destructive: true, shortcut: '⌫' }
	];

	let lastAction = $state<string | null>(null);
</script>

<div class="flex flex-col items-center gap-4 p-8">
	<p class="text-sm text-secondary">Right-click on the area below</p>

	<ContextMenu {items} onselect={(id) => (lastAction = id)}>
		<div class="flex h-40 w-80 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-elevated text-sm text-muted select-none">
			Right-click me
		</div>
	</ContextMenu>

	{#if lastAction}
		<p class="text-sm text-secondary">
			Action: <span class="font-semibold text-primary">{lastAction}</span>
		</p>
	{/if}
</div>
