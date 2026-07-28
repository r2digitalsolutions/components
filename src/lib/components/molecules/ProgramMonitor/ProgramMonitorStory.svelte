<script lang="ts">
	import ProgramMonitor from './ProgramMonitor.svelte';
	import { createDemoVideoSequence } from '$lib/utils/videoSequence.js';

	const seq = createDemoVideoSequence();
</script>

<div class="max-w-xl">
	<ProgramMonitor
		width={seq.width}
		height={seq.height}
		tracks={seq.tracks}
		currentTimeMs={5000}
		background={seq.background}
	/>
</div>
