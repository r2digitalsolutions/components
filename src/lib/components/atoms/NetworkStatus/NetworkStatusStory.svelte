<script lang="ts">
	import NetworkStatus from './NetworkStatus.svelte';

	let props = $props<{ forced?: boolean | null }>();
</script>

<NetworkStatus forced={props.forced ?? null} />
