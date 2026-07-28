<script lang="ts">
	import TransportControls from './TransportControls.svelte';

	let playing = $state(false);
	let t = $state(1250);
	let playbackRate = $state(1);
	let muted = $state(false);
	let volume = $state(1);
	const durationMs = 30000;
	const SKIP_MS = 5000;

	function seekBy(delta: number) {
		t = Math.max(0, Math.min(durationMs, t + delta));
	}
</script>

<div class="space-y-3 p-4">
	<TransportControls
		{playing}
		currentTimeMs={t}
		{durationMs}
		bind:playbackRate
		bind:muted
		bind:volume
		skipMs={SKIP_MS}
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onstop={() => {
			playing = false;
			t = 0;
		}}
		onseekstart={() => (t = 0)}
		onseekend={() => (t = durationMs)}
		onseekback={() => seekBy(-SKIP_MS)}
		onseekforward={() => seekBy(SKIP_MS)}
	/>
	<p class="text-xs text-muted">
		Rate {playbackRate}× · {muted ? 'Muted' : `Vol ${Math.round(volume * 100)}%`}
	</p>
</div>
