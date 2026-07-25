<script lang="ts">
	import PulseDot from './PulseDot.svelte';
</script>

<div class="flex items-center gap-4">
	<PulseDot tone="brand" />
	<PulseDot tone="success" />
	<PulseDot tone="warning" />
	<PulseDot tone="danger" size="lg" />
	<PulseDot tone="info" pulse={false} />
</div>
