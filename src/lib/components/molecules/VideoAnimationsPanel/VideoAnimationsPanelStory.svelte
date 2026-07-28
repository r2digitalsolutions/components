<script lang="ts">
	import VideoAnimationsPanel from './VideoAnimationsPanel.svelte';
</script>

<div class="h-96 w-72 rounded-lg border border-border bg-surface">
	<VideoAnimationsPanel onapply={(d) => console.log('anim', d)} />
</div>
