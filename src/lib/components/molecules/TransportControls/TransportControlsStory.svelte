<script lang="ts">
	import TransportControls from './TransportControls.svelte';

	let playing = $state(false);
	let t = $state(1250);
</script>

<TransportControls
	{playing}
	currentTimeMs={t}
	durationMs={30000}
	onplay={() => (playing = true)}
	onpause={() => (playing = false)}
	onstop={() => {
		playing = false;
		t = 0;
	}}
/>
