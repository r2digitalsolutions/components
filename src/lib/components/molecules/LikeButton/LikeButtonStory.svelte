<script lang="ts">
	import LikeButton from './LikeButton.svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
	<LikeButton count={12} />
	<LikeButton liked count={128} size="lg" />
	<LikeButton showCount={false} size="sm" />
</div>
