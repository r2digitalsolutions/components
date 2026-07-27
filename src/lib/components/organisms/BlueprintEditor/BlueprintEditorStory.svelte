<script lang="ts">
	import BlueprintEditor from './BlueprintEditor.svelte';
	import {
		createGraphEdge,
		createGraphNode,
		createVarGetNode,
		emptyBlueprintDocument,
		DEFAULT_BLUEPRINT_NODE_TYPES,
		type BlueprintDocument
	} from '$lib/utils/nodeGraph.js';

	const begin = createGraphNode(
		{ type: 'event_begin', x: 48, y: 160, data: { label: 'Event BeginPlay' } },
		DEFAULT_BLUEPRINT_NODE_TYPES
	);
	const branch = createGraphNode(
		{ type: 'branch', x: 320, y: 140 },
		DEFAULT_BLUEPRINT_NODE_TYPES
	);
	const print = createGraphNode(
		{ type: 'print_string', x: 600, y: 60, data: { label: 'Print String' } },
		DEFAULT_BLUEPRINT_NODE_TYPES
	);
	const delay = createGraphNode(
		{ type: 'delay_bp', x: 600, y: 260 },
		DEFAULT_BLUEPRINT_NODE_TYPES
	);
	const literal = createGraphNode(
		{ type: 'make_string', x: 320, y: 320, data: { label: '"Ready"' } },
		DEFAULT_BLUEPRINT_NODE_TYPES
	);
	const getFlag = createVarGetNode(
		{ id: 'v1', name: 'bReady', dataType: 'bool', defaultValue: true },
		{ x: 80, y: 320 }
	);

	let value = $state<BlueprintDocument>({
		...emptyBlueprintDocument('PlayerController_BP'),
		variables: [
			{ id: 'v1', name: 'bReady', dataType: 'bool', defaultValue: true },
			{ id: 'v2', name: 'DisplayName', dataType: 'string', defaultValue: 'Hero' }
		],
		graph: {
			version: 1,
			nodes: [begin, branch, print, delay, literal, getFlag],
			edges: [
				createGraphEdge(begin.id, branch.id, {
					sourceHandle: 'exec',
					targetHandle: 'exec_in'
				}),
				createGraphEdge(getFlag.id, branch.id, {
					sourceHandle: 'value',
					targetHandle: 'condition'
				}),
				createGraphEdge(branch.id, print.id, {
					sourceHandle: 'true',
					targetHandle: 'exec_in',
					label: 'True'
				}),
				createGraphEdge(branch.id, delay.id, {
					sourceHandle: 'false',
					targetHandle: 'exec_in',
					label: 'False'
				}),
				createGraphEdge(literal.id, print.id, {
					sourceHandle: 'value',
					targetHandle: 'in_string'
				})
			]
		}
	});
</script>

<div class="h-[100dvh] w-full min-h-0">
	<BlueprintEditor bind:value class="h-full" />
</div>
