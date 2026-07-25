<script lang="ts">
	import CommentComposer from './CommentComposer.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let value = $state('');
	let last = $state('');
</script>

<div class="max-w-lg space-y-4">
	<CommentComposer
		bind:value
		avatar="https://i.pravatar.cc/80?img=15"
		name="You"
		maxLength={280}
		onsubmit={(v) => (last = v)}
	>
		{#snippet toolbar()}
			<IconButton label="Add emoji" size="xs" variant="ghost">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</IconButton>
			<IconButton label="Attach file" size="xs" variant="ghost">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
					/>
				</svg>
			</IconButton>
		{/snippet}
	</CommentComposer>

	{#if last}
		<Text size="xs" tone="muted">Posted: {last}</Text>
	{/if}
</div>
