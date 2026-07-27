<script lang="ts">
	import NodeGraph from './NodeGraph.svelte';
	import {
		createGraphEdge,
		createGraphNode,
		emptyGraphDocument,
		type GraphDocument
	} from '$lib/utils/nodeGraph.js';

	const begin = createGraphNode({
		type: 'trigger',
		x: 40,
		y: 160,
		data: { label: 'On Start' }
	});
	const branch = createGraphNode({
		type: 'condition',
		x: 300,
		y: 140,
		data: { label: 'Is Valid?' }
	});
	const action = createGraphNode({
		type: 'action',
		x: 560,
		y: 40,
		data: { label: 'Notify' }
	});
	const transform = createGraphNode({
		type: 'transform',
		x: 560,
		y: 240,
		data: { label: 'Normalize' }
	});
	const literal = createGraphNode({
		type: 'get_string',
		x: 300,
		y: 320,
		data: { label: '"ok"' }
	});
	const toBool = createGraphNode({
		type: 'to_bool',
		x: 40,
		y: 300,
		data: { label: 'To Bool' }
	});
	const end = createGraphNode({
		type: 'end',
		x: 820,
		y: 140,
		data: { label: 'Done' }
	});
	const note = createGraphNode({
		type: 'comment',
		x: 40,
		y: 40,
		data: { label: 'Exec = play · Functions = data-only' }
	});

	let value = $state<GraphDocument>({
		...emptyGraphDocument(),
		nodes: [begin, branch, action, transform, literal, toBool, end, note],
		edges: [
			createGraphEdge(begin.id, branch.id, { sourceHandle: 'exec', targetHandle: 'exec_in' }),
			createGraphEdge(toBool.id, branch.id, {
				sourceHandle: 'out',
				targetHandle: 'condition'
			}),
			createGraphEdge(branch.id, action.id, {
				label: 'True',
				sourceHandle: 'true',
				targetHandle: 'exec_in'
			}),
			createGraphEdge(branch.id, transform.id, {
				label: 'False',
				sourceHandle: 'false',
				targetHandle: 'exec_in'
			}),
			createGraphEdge(literal.id, transform.id, {
				sourceHandle: 'value',
				targetHandle: 'in'
			}),
			createGraphEdge(action.id, end.id, { sourceHandle: 'exec', targetHandle: 'exec_in' }),
			createGraphEdge(transform.id, end.id, { sourceHandle: 'exec', targetHandle: 'exec_in' })
		]
	});
</script>

<div class="flex h-[640px] flex-col p-4">
	<NodeGraph bind:value class="min-h-0 flex-1" />
</div>
