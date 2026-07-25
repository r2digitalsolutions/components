<script lang="ts">
	import LiveBadge from './LiveBadge.svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
	<LiveBadge />
	<LiveBadge size="md" label="On air" />
	<LiveBadge live={false} />
	<LiveBadge pulse={false} label="Recording" />
</div>
