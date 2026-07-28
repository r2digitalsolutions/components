<script lang="ts">
	import VideoTransitionsPanel from './VideoTransitionsPanel.svelte';
</script>

<div class="h-96 w-72 rounded-lg border border-border bg-surface">
	<VideoTransitionsPanel onapply={(d) => console.log('trans', d)} />
</div>
