<script lang="ts">
	import SpeedDial from './SpeedDial.svelte';
	import type { SpeedDialAction } from './SpeedDial.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let open = $state(false);
	let last = $state('—');

	const actions: SpeedDialAction[] = [
		{ id: 'note', label: 'New note', onclick: () => (last = 'note') },
		{ id: 'upload', label: 'Upload', onclick: () => (last = 'upload') },
		{ id: 'invite', label: 'Invite', onclick: () => (last = 'invite') }
	];
</script>

<div class="relative h-56 w-full max-w-sm rounded-xl border border-border bg-surface">
	<div class="p-4">
		<Text size="sm">Last action: {last}</Text>
	</div>
	<SpeedDial bind:open {actions} position="bottom-right" />
</div>
