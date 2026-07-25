<script lang="ts">
	import TimeAgo from './TimeAgo.svelte';
</script>

<div class="space-y-2 text-sm">
	<p><TimeAgo date={Date.now() - 30_000} /> — 30 seconds ago</p>
	<p><TimeAgo date={Date.now() - 3_600_000} /> — 1 hour ago</p>
	<p><TimeAgo date={Date.now() - 86_400_000 * 3} locale="es" /> — hace 3 días (es)</p>
</div>
