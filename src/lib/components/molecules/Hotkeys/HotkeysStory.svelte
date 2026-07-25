<script lang="ts">
	import Hotkeys from './Hotkeys.svelte';
</script>

<div class="max-w-md">
	<Hotkeys
		items={[
			{ keys: ['⌘', 'K'], description: 'Open command palette' },
			{ keys: ['⌘', 'S'], description: 'Save document' },
			{ keys: ['⌘', '⇧', 'P'], description: 'Toggle preview' },
			{ keys: ['Esc'], description: 'Close dialog' }
		]}
	/>
</div>
