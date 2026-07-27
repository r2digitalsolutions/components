<script lang="ts">
	import WaveBars from './WaveBars.svelte';

	let live = $state(Array.from({ length: 32 }, () => 0.2));
	let progress = $state(0);

	$effect(() => {
		const id = setInterval(() => {
			live = live.map((v) => v * 0.45 + (0.15 + Math.random() * 0.85) * 0.55);
			progress = (progress + 0.008) % 1;
		}, 32);
		return () => clearInterval(id);
	});
</script>

<div class="flex flex-col gap-6">
	<div class="space-y-2 rounded-xl border border-border bg-surface-elevated p-4">
		<p class="text-xs font-medium text-muted">Live levels</p>
		<WaveBars bars={live} active tone="danger" height={40} />
	</div>

	<div class="space-y-2 rounded-xl border border-border bg-surface-elevated p-4">
		<p class="text-xs font-medium text-muted">Smooth playback progress</p>
		<WaveBars
			bars={[0.2, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.6, 0.85, 0.5, 0.2, 0.55, 0.75, 0.35, 0.9]}
			{progress}
			height={40}
		/>
	</div>
</div>
