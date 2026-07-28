<script lang="ts">
	import VideoComponentsPanel from './VideoComponentsPanel.svelte';
</script>

<div class="h-96 w-72 rounded-lg border border-border bg-surface">
	<VideoComponentsPanel onadd={(d) => console.log('add', d)} />
</div>
