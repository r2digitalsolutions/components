<script lang="ts">
	import NodePalette from './NodePalette.svelte';
	import { DEFAULT_BLUEPRINT_NODE_TYPES } from '$lib/utils/nodeGraph.js';
</script>

<div class="h-[420px] w-72 rounded-xl border border-border bg-surface-elevated">
	<NodePalette
		nodeTypes={DEFAULT_BLUEPRINT_NODE_TYPES}
		onselect={(t) => console.log('select', t.type)}
	/>
</div>
