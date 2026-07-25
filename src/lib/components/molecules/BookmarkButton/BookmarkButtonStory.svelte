<script lang="ts">
	import BookmarkButton from './BookmarkButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let active = $state(false);
</script>

<div class="flex items-center gap-2">
	<BookmarkButton bind:active />
	<Text size="sm">{active ? 'Saved' : 'Save for later'}</Text>
</div>
