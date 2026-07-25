<script lang="ts">
	import DangerZone from './DangerZone.svelte';

	let deleted = $state(false);
</script>

<div class="max-w-xl space-y-3">
	<DangerZone onconfirm={() => (deleted = true)} />
	{#if deleted}
		<p class="text-xs text-muted">Confirmed destructive action</p>
	{/if}
</div>
