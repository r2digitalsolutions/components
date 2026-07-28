<script lang="ts">
	import MixerChannel from './MixerChannel.svelte';

	let channel = $state({
		trackId: 't1',
		volume: 0.75,
		pan: -0.2,
		muted: false,
		solo: false
	});
</script>

<MixerChannel {channel} name="Drums" color="#3b82f6" onchange={(c) => (channel = c)} />
