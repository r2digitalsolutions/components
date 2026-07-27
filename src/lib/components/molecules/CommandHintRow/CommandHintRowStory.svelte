<script lang="ts">
	import CommandHintRow from './CommandHintRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Command hints</p>
	<Stack gap="sm">
		<CommandHintRow label="Open command palette" keys={['⌘', 'K']} />
		<CommandHintRow label="Save changes" keys={['⌘', 'S']} />
		<CommandHintRow label="Search in page" keys={['⌘', 'F']} />
	</Stack>
</div>
