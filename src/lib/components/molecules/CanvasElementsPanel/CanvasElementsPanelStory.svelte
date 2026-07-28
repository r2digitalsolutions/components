<script lang="ts">
	import CanvasElementsPanel from './CanvasElementsPanel.svelte';
</script>

<div class="h-[420px] w-72 rounded-xl border border-border bg-surface-elevated">
	<CanvasElementsPanel onadd={(d) => console.log('add', d)} />
</div>
