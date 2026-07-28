<script lang="ts">
	import PanKnob from './PanKnob.svelte';

	let value = $state(-0.2);
	let left = $state(-0.75);
	let center = $state(0);
	let right = $state(0.6);
</script>

<div class="flex flex-wrap items-end gap-8 p-4">
	<PanKnob bind:value size="md" />
	<PanKnob bind:value={left} size="sm" label="L" />
	<PanKnob bind:value={center} size="md" label="C" />
	<PanKnob bind:value={right} size="lg" label="R" />
</div>
