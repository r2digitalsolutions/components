<script lang="ts">
	import OrgChartNode from './OrgChartNode.svelte';
	import type { OrgNode } from './OrgChart.svelte';

	interface OrgChartTreeProps {
		root: OrgNode;
		onselect?: (node: OrgNode) => void;
	}

	let { root, onselect }: OrgChartTreeProps = $props();
	let selectedId = $state<string | null>(null);
</script>

<div class="flex min-w-max justify-center px-4 py-4" role="tree" aria-label="Organization chart">
	<OrgChartNode node={root} {onselect} bind:selectedId />
</div>
