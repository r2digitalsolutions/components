<script lang="ts">
	import CommandPalette, { type CommandItem } from './CommandPalette.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	const items: CommandItem[] = [
		{ id: 'new', label: 'Create project', group: 'Actions', shortcut: ['⌘', 'N'] },
		{ id: 'search', label: 'Search files', group: 'Actions', shortcut: ['⌘', 'P'] },
		{ id: 'settings', label: 'Open settings', group: 'Navigation', shortcut: ['⌘', ','] },
		{ id: 'team', label: 'Invite teammate', group: 'Navigation' },
		{ id: 'billing', label: 'Billing', group: 'Navigation', disabled: true }
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

<div class="flex flex-col items-center gap-3">
	<Button size="sm" onclick={() => (open = true)}>
		Open palette
		<Kbd keys={['⌘', 'K']} size="sm" />
	</Button>
	{#if last}
		<p class="text-xs text-muted">Selected: {last}</p>
	{/if}
</div>

<CommandPalette
	bind:open
	{items}
	onselect={(item) => (last = item.label)}
/>
