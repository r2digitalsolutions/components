<script lang="ts">
	import CommentComposer from './CommentComposer.svelte';

	let value = $state('');
	let last = $state('');
</script>

<div class="max-w-lg space-y-3">
	<CommentComposer
		bind:value
		avatar="https://i.pravatar.cc/80?img=15"
		name="You"
		onsubmit={(v) => (last = v)}
	/>
	{#if last}
		<p class="text-xs text-muted">Posted: {last}</p>
	{/if}
</div>
