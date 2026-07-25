<script lang="ts">
	import OfflineBanner from './OfflineBanner.svelte';

	let props = $props<{ forced?: boolean | null }>();
</script>

<div class="w-full max-w-lg space-y-3">
	<OfflineBanner forced={props.forced ?? false} />
	<p class="text-xs text-muted">Set forced=true in controls to hide the banner.</p>
</div>
