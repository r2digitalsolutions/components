<script lang="ts">
	import { useSvelteFlow } from '@xyflow/svelte';

	interface Props {
		onready?: (api: {
			fitView: (opts?: {
				padding?: number;
				duration?: number;
				maxZoom?: number;
				nodes?: { id: string }[];
			}) => void;
			screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
		}) => void;
	}

	let { onready }: Props = $props();

	const api = useSvelteFlow();

	$effect(() => {
		onready?.({
			fitView: (opts) => api.fitView(opts),
			screenToFlowPosition: (pos) => api.screenToFlowPosition(pos)
		});
	});
</script>
