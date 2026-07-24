<script lang="ts">
	import Kbd from './Kbd.svelte';

	let props = $props<{
		keys?: string[];
		size?: 'sm' | 'md';
	}>();
</script>

<div class="flex flex-wrap items-center gap-3">
	<Kbd keys={props.keys ?? ['⌘', 'K']} size={props.size ?? 'md'} />
	<Kbd keys={['Ctrl', 'Shift', 'P']} size={props.size ?? 'md'} />
	<Kbd size={props.size ?? 'md'}>Esc</Kbd>
</div>
