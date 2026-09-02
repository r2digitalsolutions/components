<script lang="ts">
	import PanZoomViewport from '../PanZoomViewport/PanZoomViewport.svelte';
	import OrgChartTree from './OrgChartTree.svelte';

	export interface OrgNode {
		id: string;
		name: string;
		role?: string;
		avatarUrl?: string;
		assignees?: { id: string; name: string; avatarUrl?: string | null }[];
		children?: OrgNode[];
	}

	interface OrgChartProps {
		root?: OrgNode | null;
		class?: string;
		onselect?: (node: OrgNode) => void;
		/** Pan + wheel zoom viewport */
		interactive?: boolean;
		viewportHeight?: string;
		showControls?: boolean;
		/** Refit viewport when filter / data changes */
		contentKey?: string | number | null;
	}

	let {
		root = null,
		class: className = '',
		onselect,
		interactive = true,
		viewportHeight = 'min(70vh, 640px)',
		showControls = true,
		contentKey = null
	}: OrgChartProps = $props();

	const viewportKey = $derived(contentKey ?? root?.id ?? 'empty');
</script>

{#if interactive && root}
	<PanZoomViewport
		class={className}
		height={viewportHeight}
		{showControls}
		contentKey={viewportKey}
		initialFit
	>
		<OrgChartTree {root} {onselect} />
	</PanZoomViewport>
{:else if root}
	<div class={['overflow-x-auto py-4', className]} role="tree" aria-label="Organization chart">
		<OrgChartTree {root} {onselect} />
	</div>
{:else}
	<p class={['py-8 text-center text-sm text-muted', className]}>No organization data</p>
{/if}
