<script lang="ts">
	import {
		SvelteFlow,
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
		MarkerType,
		type Connection,
		type Edge,
		type NodeTypes
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import GraphBlueprintNode from './GraphBlueprintNode.svelte';
	import GraphFlowBridge from './GraphFlowBridge.svelte';
	import {
		DEFAULT_NODE_TYPES,
		alignGraphNodes,
		breakLinksAtHandle,
		collapseSelectionToFunction,
		createCommentFromSelection,
		createGraphEdge,
		createGraphNode,
		createVarGetNode,
		createVarSetNode,
		decodeGraphClipboard,
		distributeGraphNodes,
		duplicateGraphSelection,
		emptyGraphDocument,
		encodeGraphClipboard,
		expandCollapsedGraph,
		extractGraphSelection,
		filterNodeTypesForGraph,
		flowDocumentFromFlow,
		flowPortOnNode,
		groupNodeTypesByCategory,
		insertRerouteOnEdge,
		isExecPort,
		nodeTypeAcceptsPort,
		pasteGraphSelection,
		pinColor,
		pinsCompatible,
		toFlowEdges,
		toFlowNodes,
		validateGraph,
		variablePlaceItems,
		variablePinColor,
		wiredInputIdsByNode,
		type AlignAxis,
		type BlueprintFlowEdge,
		type BlueprintFlowNode,
		type BlueprintVariable,
		type DistributeAxis,
		type GraphDocument,
		type GraphEdge,
		type GraphNode,
		type GraphNodeContext,
		type GraphNodeTypeDef,
		type GraphPort,
		type GraphValidationIssue
	} from '$lib/utils/nodeGraph.js';

	export type { GraphDocument, GraphNode, GraphEdge, GraphNodeTypeDef, GraphPort };

	const MIME_NODE_TYPE = 'application/x-node-type';
	const MIME_BP_VAR = 'application/x-blueprint-var';
	const HISTORY_LIMIT = 80;

	interface NodeGraphProps {
		value?: GraphDocument;
		nodeTypes?: GraphNodeTypeDef[];
		/** Blueprint variables → Get/Set in place menu + drop targets. */
		variables?: BlueprintVariable[];
		/** Graph kind filter (Events only on event_graph, etc.). */
		graphContext?: GraphNodeContext | null;
		readonly?: boolean;
		showMinimap?: boolean;
		showToolbar?: boolean;
		showGrid?: boolean;
		snapToGrid?: boolean;
		gridSize?: number;
		class?: string;
		selectedIds?: string[];
		onchange?: (doc: GraphDocument) => void;
		onselect?: (id: string | null) => void;
		onselectmany?: (ids: string[]) => void;
		onconnect?: (edge: GraphEdge) => void;
		onvalidate?: (issues: GraphValidationIssue[]) => void;
		onplace?: (type: string, x: number, y: number) => void;
	}

	let {
		value = $bindable(emptyGraphDocument()),
		nodeTypes = DEFAULT_NODE_TYPES,
		variables = [],
		graphContext = null,
		readonly = false,
		showMinimap = true,
		showToolbar = true,
		showGrid = $bindable(true),
		snapToGrid = $bindable(true),
		gridSize = 16,
		class: className = '',
		selectedIds = $bindable<string[]>([]),
		onchange,
		onselect,
		onselectmany,
		onconnect,
		onvalidate,
		onplace
	}: NodeGraphProps = $props();

	const flowNodeTypes = {
		blueprint: GraphBlueprintNode
	} as unknown as NodeTypes;

	let nodes = $state.raw<BlueprintFlowNode[]>([]);
	let edges = $state.raw<BlueprintFlowEdge[]>([]);
	let selectedId = $state<string | null>(null);
	let labelDraft = $state('');
	let issues = $state<GraphValidationIssue[]>([]);
	let addOpen = $state(false);
	let alignOpen = $state(false);
	let lastSerialized = $state('');
	let historyPast = $state<string[]>([]);
	let historyFuture = $state<string[]>([]);
	let memoryClipboard = $state<string | null>(null);
	let lastEdgeClick = $state<{ id: string; at: number } | null>(null);
	let commentDrag = $state<{
		commentId: string;
		startPos: { x: number; y: number };
		memberStarts: Map<string, { x: number; y: number }>;
	} | null>(null);
	let flowApi = $state<{
		fitView: (opts?: {
			padding?: number;
			duration?: number;
			maxZoom?: number;
			nodes?: { id: string }[];
		}) => void;
		screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
	} | null>(null);

	let pendingLink = $state<{
		nodeId: string;
		handleId: string;
		port: GraphPort;
	} | null>(null);
	let placeMenuPos = $state({ x: 0, y: 0 });
	let placeAt = $state<{ x: number; y: number } | null>(null);
	let placeMenuQuery = $state('');
	let placeMenuEl = $state<HTMLDivElement | null>(null);

	const selectedNodeIds = $derived(
		selectedIds.filter((id) => value.nodes.some((n) => n.id === id))
	);
	const selectedEdgeIds = $derived(
		selectedIds.filter((id) => value.edges.some((e) => e.id === id))
	);
	const selectedNode = $derived(value.nodes.find((n) => n.id === selectedId) ?? null);
	const selectedEdge = $derived(value.edges.find((e) => e.id === selectedId) ?? null);
	const hasSelection = $derived(selectedIds.length > 0);
	const canAlign = $derived(selectedNodeIds.length >= 2);
	const canDistribute = $derived(selectedNodeIds.length >= 3);
	const canCollapse = $derived(
		selectedNodeIds.filter((id) => {
			const n = value.nodes.find((x) => x.id === id);
			return n && n.type !== 'comment' && n.type !== 'collapsed_graph';
		}).length >= 1
	);
	const selectedCollapsed = $derived(
		selectedNodeIds.length === 1
			? (value.nodes.find((n) => n.id === selectedNodeIds[0] && n.type === 'collapsed_graph') ??
					null)
			: null
	);
	const canUndo = $derived(historyPast.length > 0);
	const canRedo = $derived(historyFuture.length > 0);
	const menuSourcePort = $derived(pendingLink?.port ?? null);

	const catalogTypes = $derived(
		filterNodeTypesForGraph(nodeTypes, { context: graphContext, includeHidden: false })
	);

	const placeableTypes = $derived.by(() => {
		const base = catalogTypes.filter((t) => t.type !== 'comment');
		if (!menuSourcePort) return base;
		return base.filter((t) => nodeTypeAcceptsPort(t, menuSourcePort));
	});

	const placeMenuFiltered = $derived.by(() => {
		const q = placeMenuQuery.trim().toLowerCase();
		if (!q) return placeableTypes;
		return placeableTypes.filter(
			(t) =>
				t.label.toLowerCase().includes(q) ||
				t.type.toLowerCase().includes(q) ||
				t.category?.toLowerCase().includes(q) ||
				t.description?.toLowerCase().includes(q)
		);
	});

	const placeMenuGroups = $derived(groupNodeTypesByCategory(placeMenuFiltered));

	const variableMenuItems = $derived.by(() => {
		const items = variablePlaceItems(variables);
		const q = placeMenuQuery.trim().toLowerCase();
		const filtered = q
			? items.filter(
					(it) =>
						it.label.toLowerCase().includes(q) ||
						it.variable.name.toLowerCase().includes(q) ||
						it.variable.dataType.toLowerCase().includes(q)
				)
			: items;
		if (!menuSourcePort) return filtered;
		return filtered.filter((it) => {
			if (it.kind === 'get') return false;
			const probe = createVarSetNode(it.variable, { x: 0, y: 0 });
			return (probe.inputs ?? []).some((p) => pinsCompatible(menuSourcePort!, p));
		});
	});

	let pendingVarChooser = $state<BlueprintVariable | null>(null);

	const issueNodeIds = $derived(
		new Set(issues.filter((i) => i.nodeId).map((i) => i.nodeId as string))
	);

	function decorate(list: BlueprintFlowNode[]): BlueprintFlowNode[] {
		return list.map((n) => ({
			...n,
			data: { ...n.data, _alert: issueNodeIds.has(n.id) }
		}));
	}

	function styleEdges(list: BlueprintFlowEdge[], nodeList = nodes): BlueprintFlowEdge[] {
		return list.map((e) => {
			const src = nodeList.find((n) => n.id === e.source);
			const out = flowPortOnNode(src, e.sourceHandle, 'output');
			const color = !out ? '#94a3b8' : isExecPort(out) ? '#94a3b8' : pinColor(out);
			return {
				...e,
				style: `stroke:${color};stroke-width:2`,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 16,
					height: 16,
					color
				}
			} as BlueprintFlowEdge;
		});
	}

	function serializeDoc(doc: GraphDocument): string {
		return JSON.stringify({
			nodes: doc.nodes.map((n) => ({
				id: n.id,
				type: n.type,
				x: n.x,
				y: n.y,
				data: n.data,
				inputs: n.inputs,
				outputs: n.outputs
			})),
			edges: doc.edges
		});
	}

	function emitDoc(doc: GraphDocument, opts?: { recordHistory?: boolean }) {
		const record = opts?.recordHistory !== false;
		const nextSerial = serializeDoc(doc);
		if (record && lastSerialized && nextSerial !== lastSerialized) {
			historyPast = [...historyPast, lastSerialized].slice(-HISTORY_LIMIT);
			historyFuture = [];
		}
		lastSerialized = nextSerial;
		value = doc;
		onchange?.(doc);
	}

	function restoreSerialized(serial: string) {
		const doc = JSON.parse(serial) as GraphDocument;
		lastSerialized = serial;
		value = doc;
		onchange?.(doc);
		hydrateFromValue(doc);
	}

	function undo() {
		if (!historyPast.length) return;
		historyFuture = [lastSerialized || serializeDoc(value), ...historyFuture].slice(
			0,
			HISTORY_LIMIT
		);
		const prev = historyPast[historyPast.length - 1];
		historyPast = historyPast.slice(0, -1);
		restoreSerialized(prev);
		applySelection([]);
	}

	function redo() {
		if (!historyFuture.length) return;
		historyPast = [...historyPast, lastSerialized || serializeDoc(value)].slice(-HISTORY_LIMIT);
		const next = historyFuture[0];
		historyFuture = historyFuture.slice(1);
		restoreSerialized(next);
		applySelection([]);
	}

	function emitFromFlow(nextNodes = nodes, nextEdges = edges) {
		const doc = flowDocumentFromFlow(nextNodes, nextEdges);
		emitDoc(doc);
		hydrateFromValue(doc);
	}

	function updatePortLiteral(nodeId: string, portId: string, literal: unknown) {
		if (readonly) return;
		const next: GraphDocument = {
			...value,
			nodes: value.nodes.map((n) =>
				n.id !== nodeId
					? n
					: {
							...n,
							inputs: (n.inputs ?? []).map((p) =>
								p.id === portId ? { ...p, value: literal } : p
							)
						}
			)
		};
		emitDoc(next);
		hydrateFromValue(next);
	}

	function hydrateFromValue(doc: GraphDocument) {
		const wired = wiredInputIdsByNode(doc.edges);
		const flowNodes = decorate(toFlowNodes(doc, nodeTypes, selectedIds)).map((n) => ({
			...n,
			data: {
				...n.data,
				_wiredInputs: [...(wired.get(n.id) ?? [])],
				_onLiteral: readonly
					? undefined
					: (portId: string, literal: unknown) => updatePortLiteral(n.id, portId, literal)
			}
		}));
		nodes = flowNodes;
		edges = styleEdges(toFlowEdges(doc, selectedIds), flowNodes);
	}

	$effect(() => {
		const serialized = serializeDoc(value);
		if (serialized === lastSerialized) return;
		// External updates (inspector / parent) — keep undo stack in sync.
		if (lastSerialized) {
			historyPast = [...historyPast, lastSerialized].slice(-HISTORY_LIMIT);
			historyFuture = [];
		}
		lastSerialized = serialized;
		hydrateFromValue(value);
	});

	$effect(() => {
		if (selectedNode) labelDraft = String(selectedNode.data?.label ?? selectedNode.type);
		else if (selectedEdge) labelDraft = selectedEdge.label ?? '';
		else labelDraft = '';
	});

	function applySelection(ids: string[], primary?: string | null) {
		selectedIds = ids;
		selectedId = primary !== undefined ? primary : (ids[0] ?? null);
		onselect?.(selectedId);
		onselectmany?.(ids);
		const set = new Set(ids);
		nodes = nodes.map((n) => ({ ...n, selected: set.has(n.id) }));
		edges = edges.map((e) => ({ ...e, selected: set.has(e.id) }));
	}

	function select(id: string | null) {
		applySelection(id ? [id] : [], id);
	}

	function selectAll() {
		if (readonly) return;
		applySelection(value.nodes.map((n) => n.id));
	}

	function placeNode(type: string, at?: { x: number; y: number }) {
		if (readonly) return null;
		const origin = at ?? placeAt ?? { x: 120, y: 120 };
		const n = createGraphNode({ type, x: origin.x, y: origin.y }, nodeTypes);
		return commitPlacedNode(n, origin);
	}

	function placeVariableAccess(kind: 'get' | 'set', variable: BlueprintVariable, at?: { x: number; y: number }) {
		if (readonly) return null;
		const origin = at ?? placeAt ?? { x: 120, y: 120 };
		const n =
			kind === 'get' ? createVarGetNode(variable, origin) : createVarSetNode(variable, origin);
		return commitPlacedNode(n, origin);
	}

	function commitPlacedNode(n: GraphNode, origin: { x: number; y: number }) {
		let doc: GraphDocument = {
			...value,
			nodes: [...value.nodes, n]
		};
		if (pendingLink) {
			const inn = (n.inputs ?? []).find((p) => pinsCompatible(pendingLink!.port, p));
			if (inn) {
				const edge = createGraphEdge(pendingLink.nodeId, n.id, {
					sourceHandle: pendingLink.handleId,
					targetHandle: inn.id
				});
				doc = { ...doc, edges: [...doc.edges, edge] };
				onconnect?.(edge);
			}
			pendingLink = null;
		}
		emitDoc(doc);
		// Keep xyflow `nodes`/`edges` in sync — emitDoc alone skips hydrate ($effect sees same serial).
		hydrateFromValue(doc);
		select(n.id);
		onplace?.(n.type, origin.x, origin.y);
		addOpen = false;
		pendingVarChooser = null;
		closePlaceMenu(false);
		return n;
	}

	function duplicateSelected() {
		if (readonly || !selectedNodeIds.length) return;
		const { doc, newNodeIds } = duplicateGraphSelection(value, selectedNodeIds);
		if (!newNodeIds.length) return;
		emitDoc(doc);
		hydrateFromValue(doc);
		applySelection(newNodeIds);
	}

	function deleteSelected() {
		if (readonly || !hasSelection) return;
		const delNodes = new Set(selectedNodeIds);
		const delEdges = new Set(selectedEdgeIds);
		const next: GraphDocument = {
			...value,
			nodes: value.nodes.filter((n) => !delNodes.has(n.id)),
			edges: value.edges.filter(
				(e) =>
					!delEdges.has(e.id) && !delNodes.has(e.source) && !delNodes.has(e.target)
			)
		};
		emitDoc(next);
		hydrateFromValue(next);
		applySelection([]);
	}

	async function copySelected() {
		if (!selectedNodeIds.length) return;
		const fragment = extractGraphSelection(value, selectedNodeIds);
		const encoded = encodeGraphClipboard(fragment);
		memoryClipboard = encoded;
		try {
			await navigator.clipboard.writeText(encoded);
		} catch {
			/* memory clipboard fallback */
		}
	}

	async function cutSelected() {
		if (readonly || !selectedNodeIds.length) return;
		await copySelected();
		deleteSelected();
	}

	async function pasteClipboard(at?: { x: number; y: number }) {
		if (readonly) return;
		let raw = memoryClipboard;
		try {
			const fromNav = await navigator.clipboard.readText();
			if (fromNav) raw = fromNav;
		} catch {
			/* use memory */
		}
		if (!raw) return;
		const fragment = decodeGraphClipboard(raw);
		if (!fragment?.nodes.length) return;
		const { doc, newNodeIds } = pasteGraphSelection(value, fragment, {
			origin: at,
			offsetX: 40,
			offsetY: 40
		});
		emitDoc(doc);
		hydrateFromValue(doc);
		applySelection(newNodeIds);
	}

	function applyDoc(doc: GraphDocument, selectIds?: string[]) {
		emitDoc(doc);
		hydrateFromValue(doc);
		if (selectIds) applySelection(selectIds);
	}

	function alignSelected(align: AlignAxis) {
		if (readonly || !canAlign) return;
		applyDoc(alignGraphNodes(value, selectedNodeIds, align), selectedNodeIds);
		alignOpen = false;
	}

	function distributeSelected(axis: DistributeAxis) {
		if (readonly || !canDistribute) return;
		applyDoc(distributeGraphNodes(value, selectedNodeIds, axis), selectedNodeIds);
		alignOpen = false;
	}

	function commentFromSelection() {
		if (readonly || !selectedNodeIds.length) return;
		const result = createCommentFromSelection(value, selectedNodeIds);
		if (!result) return;
		applyDoc(result.doc, [result.commentId, ...selectedNodeIds]);
	}

	function collapseSelected() {
		if (readonly || !canCollapse) return;
		const result = collapseSelectionToFunction(value, selectedNodeIds);
		if (!result) return;
		applyDoc(result.doc, [result.collapsedId]);
	}

	function expandSelected() {
		if (readonly || !selectedCollapsed) return;
		const result = expandCollapsedGraph(value, selectedCollapsed.id);
		if (!result) return;
		applyDoc(result.doc, result.newNodeIds);
	}

	function insertRerouteOnSelectedEdge(at?: { x: number; y: number }) {
		if (readonly) return;
		const edgeId = selectedEdgeIds[0] ?? (selectedEdge?.id ?? null);
		if (!edgeId) return;
		const edge = value.edges.find((e) => e.id === edgeId);
		if (!edge) return;
		const source = value.nodes.find((n) => n.id === edge.source);
		const target = value.nodes.find((n) => n.id === edge.target);
		const mid = at ?? {
			x: ((source?.x ?? 0) + (target?.x ?? 0)) / 2,
			y: ((source?.y ?? 0) + (target?.y ?? 0)) / 2
		};
		const result = insertRerouteOnEdge(value, edgeId, mid);
		if (!result) return;
		applyDoc(result.doc, [result.rerouteId]);
	}

	function zoomToSelection() {
		if (selectedNodeIds.length) {
			flowApi?.fitView({
				padding: 0.25,
				duration: 200,
				maxZoom: 1,
				nodes: selectedNodeIds.map((id) => ({ id }))
			});
			return;
		}
		doFitView();
	}

	function applyLabel() {
		if (readonly || !selectedId) return;
		if (selectedNode) {
			emitDoc({
				...value,
				nodes: value.nodes.map((n) =>
					n.id === selectedId ? { ...n, data: { ...n.data, label: labelDraft } } : n
				)
			});
		} else if (selectedEdge) {
			emitDoc({
				...value,
				edges: value.edges.map((e) =>
					e.id === selectedId ? { ...e, label: labelDraft || undefined } : e
				)
			});
		}
	}

	function runValidate() {
		const next = validateGraph(value);
		issues = next;
		onvalidate?.(next);
		nodes = decorate(nodes);
		return next;
	}

	function isValidConnection(connection: Connection | Edge): boolean {
		const source = nodes.find((n) => n.id === connection.source);
		const target = nodes.find((n) => n.id === connection.target);
		const out = flowPortOnNode(source, connection.sourceHandle, 'output');
		const inn = flowPortOnNode(target, connection.targetHandle, 'input');
		if (!out || !inn) return false;
		return pinsCompatible(out, inn);
	}

	function onConnect(connection: Connection) {
		if (readonly) return;
		const edge = createGraphEdge(connection.source, connection.target, {
			sourceHandle: connection.sourceHandle ?? undefined,
			targetHandle: connection.targetHandle ?? undefined
		});
		// Replace existing wires into the same target handle (UE-style single pin link).
		const filtered = edges.filter(
			(e) =>
				!(
					e.target === edge.target &&
					(e.targetHandle ?? '') === (edge.targetHandle ?? '')
				)
		);
		const nextEdges = styleEdges([
			...filtered,
			{
				id: edge.id,
				source: edge.source,
				target: edge.target,
				sourceHandle: edge.sourceHandle ?? null,
				targetHandle: edge.targetHandle ?? null,
				label: edge.label
			}
		]);
		edges = nextEdges;
		emitFromFlow(nodes, nextEdges);
		onconnect?.(edge);
		select(edge.id);
	}

	function onConnectStart(
		_event: MouseEvent | TouchEvent,
		params: { nodeId: string | null; handleId: string | null; handleType: string | null }
	) {
		if (readonly) return;
		const ev = _event as MouseEvent;
		if (!ev.altKey || !params.nodeId) return;
		const next = breakLinksAtHandle(
			value,
			params.nodeId,
			params.handleId,
			params.handleType === 'source' || params.handleType === 'target'
				? params.handleType
				: null
		);
		if (next.edges.length === value.edges.length) return;
		emitDoc(next);
		hydrateFromValue(next);
	}

	function onEdgeClick({ edge, event }: { edge: BlueprintFlowEdge; event: MouseEvent }) {
		const now = performance.now();
		const dbl =
			lastEdgeClick && lastEdgeClick.id === edge.id && now - lastEdgeClick.at < 320;
		lastEdgeClick = { id: edge.id, at: now };
		if (!dbl || readonly) return;
		event.preventDefault();
		const flowPos = flowApi?.screenToFlowPosition({ x: event.clientX, y: event.clientY }) ?? {
			x: 0,
			y: 0
		};
		const result = insertRerouteOnEdge(value, edge.id, flowPos);
		if (!result) return;
		applyDoc(result.doc, [result.rerouteId]);
	}

	function onConnectEnd(
		event: MouseEvent | TouchEvent,
		state: {
			isValid: boolean | null;
			fromNode: BlueprintFlowNode | null;
			fromHandle: { id: string | null; type: string | null } | null;
		}
	) {
		if (readonly) return;
		if (state.isValid) return;
		if (!state.fromNode || !state.fromHandle || state.fromHandle.type !== 'source') return;
		const port = flowPortOnNode(state.fromNode, state.fromHandle.id, 'output');
		if (!port) return;
		const clientX = 'changedTouches' in event ? event.changedTouches[0]?.clientX : event.clientX;
		const clientY = 'changedTouches' in event ? event.changedTouches[0]?.clientY : event.clientY;
		if (clientX == null || clientY == null) return;
		pendingLink = {
			nodeId: state.fromNode.id,
			handleId: state.fromHandle.id ?? port.id,
			port
		};
		const flowPos = flowApi?.screenToFlowPosition({ x: clientX, y: clientY }) ?? {
			x: 120,
			y: 120
		};
		openPlaceMenu(clientX, clientY, flowPos);
	}

	function onNodeDragStart({
		targetNode
	}: {
		targetNode: BlueprintFlowNode | null;
	}) {
		if (!targetNode || targetNode.data?.graphType !== 'comment') {
			commentDrag = null;
			return;
		}
		const memberIds = Array.isArray(targetNode.data.memberIds)
			? (targetNode.data.memberIds as string[])
			: [];
		const memberStarts = new Map<string, { x: number; y: number }>();
		for (const id of memberIds) {
			const n = nodes.find((x) => x.id === id);
			if (n) memberStarts.set(id, { x: n.position.x, y: n.position.y });
		}
		commentDrag = {
			commentId: targetNode.id,
			startPos: { x: targetNode.position.x, y: targetNode.position.y },
			memberStarts
		};
	}

	function onNodeDrag({ targetNode }: { targetNode: BlueprintFlowNode | null }) {
		if (!commentDrag || !targetNode || targetNode.id !== commentDrag.commentId) return;
		if (!commentDrag.memberStarts.size) return;
		const dx = targetNode.position.x - commentDrag.startPos.x;
		const dy = targetNode.position.y - commentDrag.startPos.y;
		nodes = nodes.map((n) => {
			const start = commentDrag!.memberStarts.get(n.id);
			if (!start) return n;
			return {
				...n,
				position: { x: start.x + dx, y: start.y + dy }
			};
		});
	}

	function onNodeDragStop() {
		commentDrag = null;
		emitFromFlow();
	}

	function onSelectionChange({
		nodes: selNodes,
		edges: selEdges
	}: {
		nodes: BlueprintFlowNode[];
		edges: BlueprintFlowEdge[];
	}) {
		const ids = [...selNodes.map((n) => n.id), ...selEdges.map((e) => e.id)];
		selectedIds = ids;
		selectedId = selNodes[0]?.id ?? selEdges[0]?.id ?? null;
		onselect?.(selectedId);
		onselectmany?.(ids);
	}

	function onDelete({
		nodes: delNodes,
		edges: delEdges
	}: {
		nodes: BlueprintFlowNode[];
		edges: BlueprintFlowEdge[];
	}) {
		if (readonly) return;
		const delNodeIds = new Set(delNodes.map((n) => n.id));
		const delEdgeIds = new Set(delEdges.map((e) => e.id));
		const nextNodes = nodes.filter((n) => !delNodeIds.has(n.id));
		const nextEdges = edges.filter(
			(e) => !delEdgeIds.has(e.id) && !delNodeIds.has(e.source) && !delNodeIds.has(e.target)
		);
		nodes = nextNodes;
		edges = nextEdges;
		emitFromFlow(nextNodes, nextEdges);
		applySelection([]);
	}

	function openPlaceMenu(clientX: number, clientY: number, world: { x: number; y: number }) {
		placeAt = world;
		placeMenuPos = { x: clientX, y: clientY };
		placeMenuQuery = '';
		requestAnimationFrame(() => {
			if (!placeMenuEl) return;
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const { offsetWidth: mw, offsetHeight: mh } = placeMenuEl;
			placeMenuPos = {
				x: clientX + mw > vw - 8 ? Math.max(8, clientX - mw) : clientX,
				y: clientY + mh > vh - 8 ? Math.max(8, clientY - mh) : clientY
			};
			if (!placeMenuEl.matches(':popover-open')) placeMenuEl.showPopover();
			// Ignore the pointerup that follows contextmenu, then listen for outside dismiss.
			ignorePlaceMenuDismissUntil = performance.now() + 320;
			attachPlaceMenuOutsideClose();
		});
	}

	let ignorePlaceMenuDismissUntil = 0;
	let placeMenuOutsideCleanup: (() => void) | null = null;

	function attachPlaceMenuOutsideClose() {
		placeMenuOutsideCleanup?.();
		const onPointerDown = (event: PointerEvent) => {
			if (performance.now() < ignorePlaceMenuDismissUntil) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			const t = event.target as Node | null;
			if (placeMenuEl && t && placeMenuEl.contains(t)) return;
			closePlaceMenu(true);
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closePlaceMenu(true);
		};
		document.addEventListener('pointerdown', onPointerDown, true);
		document.addEventListener('keydown', onKey, true);
		placeMenuOutsideCleanup = () => {
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('keydown', onKey, true);
			placeMenuOutsideCleanup = null;
		};
	}

	function closePlaceMenu(clearPending = true) {
		placeMenuOutsideCleanup?.();
		if (placeMenuEl?.matches(':popover-open')) placeMenuEl.hidePopover();
		placeMenuQuery = '';
		pendingVarChooser = null;
		if (clearPending) pendingLink = null;
	}

	function onPlaceMenuToggle(event: ToggleEvent) {
		if (event.newState === 'open') return;
		placeMenuOutsideCleanup?.();
		placeMenuQuery = '';
		pendingVarChooser = null;
		pendingLink = null;
	}

	function onPlaceMenuSelect(type: string) {
		placeNode(type, placeAt ?? undefined);
	}

	function onPaneContextMenu({ event }: { event: MouseEvent }) {
		if (readonly) return;
		event.preventDefault();
		event.stopPropagation();
		pendingLink = null;
		pendingVarChooser = null;
		const clientX = event.clientX;
		const clientY = event.clientY;
		const flowPos = flowApi?.screenToFlowPosition({ x: clientX, y: clientY }) ?? {
			x: clientX,
			y: clientY
		};
		// Open after the contextmenu gesture ends — otherwise the following mouseup dismisses it.
		let opened = false;
		const open = () => {
			if (opened) return;
			opened = true;
			window.removeEventListener('pointerup', open);
			window.removeEventListener('mouseup', open);
			openPlaceMenu(clientX, clientY, flowPos);
		};
		window.addEventListener('pointerup', open, { once: true });
		window.addEventListener('mouseup', open, { once: true });
		setTimeout(open, 50);
	}

	function flowPosFromClient(clientX: number, clientY: number) {
		return (
			flowApi?.screenToFlowPosition({ x: clientX, y: clientY }) ?? {
				x: clientX,
				y: clientY
			}
		);
	}

	function onCanvasDragOver(event: DragEvent) {
		if (readonly) return;
		const types = event.dataTransfer?.types ?? [];
		if (
			[...types].includes(MIME_NODE_TYPE) ||
			[...types].includes(MIME_BP_VAR) ||
			[...types].includes('text/plain')
		) {
			event.preventDefault();
			if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
		}
	}

	function onCanvasDrop(event: DragEvent) {
		if (readonly) return;
		event.preventDefault();
		const flowPos = flowPosFromClient(event.clientX, event.clientY);
		const varRaw = event.dataTransfer?.getData(MIME_BP_VAR);
		if (varRaw) {
			try {
				const parsed = JSON.parse(varRaw) as BlueprintVariable;
				const variable = variables.find((v) => v.id === parsed.id) ?? parsed;
				pendingLink = null;
				pendingVarChooser = variable;
				openPlaceMenu(event.clientX, event.clientY, flowPos);
				return;
			} catch {
				/* ignore bad payload */
			}
		}
		const type =
			event.dataTransfer?.getData(MIME_NODE_TYPE) || event.dataTransfer?.getData('text/plain');
		if (type && catalogTypes.some((t) => t.type === type)) {
			placeNode(type, flowPos);
		}
	}

	function doFitView() {
		flowApi?.fitView({ padding: 0.2, duration: 200, maxZoom: 1 });
	}

	function onGraphKeyDown(event: KeyboardEvent) {
		if (readonly && !['f', 'F'].includes(event.key)) return;
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
		const mod = event.metaKey || event.ctrlKey;
		const key = event.key.toLowerCase();

		if (key === 'f' && !mod) {
			event.preventDefault();
			zoomToSelection();
			return;
		}

		if (readonly) return;

		if (mod && key === 'a') {
			event.preventDefault();
			selectAll();
			return;
		}
		if (mod && key === 'd') {
			event.preventDefault();
			duplicateSelected();
			return;
		}
		if (mod && key === 'c') {
			event.preventDefault();
			void copySelected();
			return;
		}
		if (mod && key === 'x') {
			event.preventDefault();
			void cutSelected();
			return;
		}
		if (mod && key === 'v') {
			event.preventDefault();
			void pasteClipboard(placeAt ?? undefined);
			return;
		}
		if (mod && key === 'z' && !event.shiftKey) {
			event.preventDefault();
			undo();
			return;
		}
		if ((mod && key === 'y') || (mod && event.shiftKey && key === 'z')) {
			event.preventDefault();
			redo();
			return;
		}
		if (key === 'c' && !mod && selectedNodeIds.length) {
			event.preventDefault();
			commentFromSelection();
			return;
		}
		if (key === 'r' && !mod && selectedEdgeIds.length) {
			event.preventDefault();
			insertRerouteOnSelectedEdge();
			return;
		}
		if (mod && key === 'g' && canCollapse) {
			event.preventDefault();
			collapseSelected();
			return;
		}
		if (key === 'e' && !mod && selectedCollapsed) {
			event.preventDefault();
			expandSelected();
		}
	}
</script>

	<div
	class={['flex flex-col overflow-hidden border border-border bg-surface-elevated', className]}
	data-node-graph
	tabindex="0"
	onkeydown={onGraphKeyDown}
	role="application"
	aria-label="Node graph"
>
	{#if showToolbar}
		<div class="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
			{#if !readonly}
				<div class="relative">
					<Button size="sm" onclick={() => (addOpen = !addOpen)}>Add node</Button>
					{#if addOpen}
						<div
							class="absolute left-0 z-30 mt-1 max-h-72 w-60 overflow-auto rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
						>
							{#each catalogTypes as nt (nt.type)}
								<button
									type="button"
									class="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-surface-overlay"
									onclick={() => placeNode(nt.type)}
								>
									<span
										class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
										style={`background:${nt.color ?? '#64748b'}`}
									></span>
									<span class="min-w-0">
										<span class="block text-sm font-medium text-primary">{nt.label}</span>
										<span class="block text-[11px] text-muted">{nt.category ?? nt.description}</span>
									</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<Button
					size="sm"
					variant="secondary"
					disabled={!selectedNodeIds.length}
					onclick={duplicateSelected}
				>
					Duplicate
				</Button>
				<Button size="sm" variant="secondary" disabled={!hasSelection} onclick={deleteSelected}>
					Delete
				</Button>
				<Button size="sm" variant="ghost" disabled={!canUndo} onclick={undo}>Undo</Button>
				<Button size="sm" variant="ghost" disabled={!canRedo} onclick={redo}>Redo</Button>
				<div class="relative">
					<Button
						size="sm"
						variant="secondary"
						disabled={!canAlign}
						onclick={() => (alignOpen = !alignOpen)}
					>
						Align
					</Button>
					{#if alignOpen && canAlign}
						<div
							class="absolute left-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
						>
							{#each [
								['left', 'Align left'],
								['right', 'Align right'],
								['top', 'Align top'],
								['bottom', 'Align bottom'],
								['centerX', 'Align center X'],
								['centerY', 'Align center Y']
							] as [id, label] (id)}
								<button
									type="button"
									class="block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-overlay"
									onclick={() => alignSelected(id as AlignAxis)}
								>
									{label}
								</button>
							{/each}
							{#if canDistribute}
								<div class="my-1 h-px bg-border"></div>
								<button
									type="button"
									class="block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-overlay"
									onclick={() => distributeSelected('horizontal')}
								>
									Distribute X
								</button>
								<button
									type="button"
									class="block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-overlay"
									onclick={() => distributeSelected('vertical')}
								>
									Distribute Y
								</button>
							{/if}
						</div>
					{/if}
				</div>
				<Button
					size="sm"
					variant="secondary"
					disabled={!selectedNodeIds.length}
					onclick={commentFromSelection}
				>
					Comment
				</Button>
				{#if selectedCollapsed}
					<Button size="sm" variant="secondary" onclick={expandSelected}>Expand</Button>
				{:else}
					<Button
						size="sm"
						variant="secondary"
						disabled={!canCollapse}
						onclick={collapseSelected}
					>
						Collapse
					</Button>
				{/if}
				{#if selectedEdgeIds.length}
					<Button size="sm" variant="secondary" onclick={() => insertRerouteOnSelectedEdge()}>
						Reroute
					</Button>
				{/if}
			{/if}
			<Button size="sm" variant="ghost" onclick={zoomToSelection}>
				{selectedNodeIds.length ? 'Frame' : 'Fit'}
			</Button>
			<Button size="sm" variant="ghost" onclick={runValidate}>Validate</Button>
			<label class="flex items-center gap-1.5 text-xs text-muted">
				<input type="checkbox" bind:checked={showGrid} /> Grid
			</label>
			<label class="flex items-center gap-1.5 text-xs text-muted">
				<input type="checkbox" bind:checked={snapToGrid} disabled={readonly} /> Snap
			</label>
		</div>
	{/if}

	{#if (selectedNode || selectedEdge) && !readonly && showToolbar}
		<div class="flex flex-wrap items-center gap-2 border-b border-border bg-surface-overlay/40 px-3 py-2">
			<span class="text-[11px] font-semibold uppercase tracking-wide text-muted">
				{selectedNode ? 'Node' : 'Edge'}
			</span>
			<Input
				bind:value={labelDraft}
				placeholder={selectedNode ? 'Label' : 'Edge label'}
				class="max-w-xs"
				size="sm"
				onkeydown={(e) => {
					if (e.key === 'Enter') applyLabel();
				}}
			/>
			<Button size="sm" variant="secondary" onclick={applyLabel}>Save</Button>
		</div>
	{/if}

	{#if issues.length}
		<div
			class="flex flex-wrap gap-2 border-b border-amber-500/30 bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
		>
			{#each issues.slice(0, 3) as issue (issue.id)}
				<span>{issue.message}</span>
			{/each}
			{#if issues.length > 3}
				<span class="text-muted">+{issues.length - 3} more</span>
			{/if}
		</div>
	{/if}

	<div
		class="relative min-h-[320px] flex-1"
		ondragover={onCanvasDragOver}
		ondrop={onCanvasDrop}
		role="presentation"
	>
		<SvelteFlow
			bind:nodes
			bind:edges
			nodeTypes={flowNodeTypes}
			fitView
			fitViewOptions={{ padding: 0.2, maxZoom: 1, minZoom: 0.2 }}
			minZoom={0.25}
			maxZoom={1.25}
			nodesDraggable={!readonly}
			nodesConnectable={!readonly}
			elementsSelectable={!readonly}
			deleteKey={readonly ? null : ['Backspace', 'Delete']}
			multiSelectionKey={readonly ? null : 'Shift'}
			selectionKey={null}
			selectionOnDrag={!readonly}
			panOnDrag={[1]}
			selectionMode="partial"
			selectNodesOnDrag={false}
			snapGrid={snapToGrid ? ([gridSize, gridSize] as [number, number]) : undefined}
			isValidConnection={isValidConnection}
			onconnect={onConnect}
			onconnectstart={onConnectStart as never}
			onconnectend={onConnectEnd as never}
			onnodedragstart={onNodeDragStart as never}
			onnodedrag={onNodeDrag as never}
			onnodedragstop={onNodeDragStop}
			onselectionchange={onSelectionChange as never}
			ondelete={onDelete as never}
			onedgeclick={onEdgeClick as never}
			onpanecontextmenu={onPaneContextMenu}
			defaultEdgeOptions={{
				type: 'default',
				markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 }
			}}
			proOptions={{ hideAttribution: true }}
			colorMode="light"
			class="h-full w-full !bg-white"
		>
			{#if showGrid}
				<Background variant={BackgroundVariant.Dots} gap={gridSize} size={1} />
			{/if}
			<Controls showInteractive={!readonly} />
			{#if showMinimap}
				<MiniMap
					pannable
					zoomable
					class="!bg-surface-elevated !border-border"
					nodeColor={(n: BlueprintFlowNode) => {
						return n.data?.color ?? '#94a3b8';
					}}
				/>
			{/if}
			<GraphFlowBridge onready={(api) => (flowApi = api)} />
		</SvelteFlow>
	</div>
</div>

<div
	bind:this={placeMenuEl}
	popover="manual"
	role="menu"
	aria-label="Place node"
	data-place-menu
	ontoggle={onPlaceMenuToggle}
	style={`top:${placeMenuPos.y}px;left:${placeMenuPos.x}px;margin:0;`}
	class="node-place-menu flex max-h-[min(28rem,70vh)] w-64 flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-xl outline-none"
>
	<div class="border-b border-border p-2">
		<SearchInput
			bind:value={placeMenuQuery}
			placeholder={pendingVarChooser
				? `Place ${pendingVarChooser.name}…`
				: menuSourcePort
					? 'Search compatible nodes…'
					: 'Search nodes…'}
			size="sm"
		/>
	</div>
	<div class="min-h-0 flex-1 overflow-auto p-1.5">
		{#if pendingVarChooser}
			<p
				class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted"
				role="presentation"
			>
				Variable
			</p>
			{#each (['get', 'set'] as const) as kind (kind)}
				<button
					type="button"
					role="menuitem"
					class="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-surface-overlay"
					onclick={() => placeVariableAccess(kind, pendingVarChooser!)}
				>
					<span
						class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
						style={`background:${variablePinColor(pendingVarChooser.dataType)}`}
					></span>
					<span class="min-w-0">
						<span class="block truncate text-sm font-medium text-primary">
							{kind === 'get' ? 'Get' : 'Set'}
							{pendingVarChooser.name}
						</span>
						<span class="block truncate text-[11px] text-muted">{pendingVarChooser.dataType}</span>
					</span>
				</button>
			{/each}
		{:else}
			{#if variableMenuItems.length}
				<p
					class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted"
					role="presentation"
				>
					Variables
				</p>
				{#each variableMenuItems as item (item.id)}
					<button
						type="button"
						role="menuitem"
						class="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-surface-overlay"
						onclick={() => placeVariableAccess(item.kind, item.variable)}
					>
						<span
							class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
							style={`background:${item.color}`}
						></span>
						<span class="min-w-0">
							<span class="block truncate text-sm font-medium text-primary">{item.label}</span>
							<span class="block truncate text-[11px] text-muted">{item.variable.dataType}</span>
						</span>
					</button>
				{/each}
			{/if}

			{#each placeMenuGroups as group (group.category)}
				<p
					class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted"
					role="presentation"
				>
					{group.category}
				</p>
				{#each group.types as nt (nt.type)}
					<button
						type="button"
						role="menuitem"
						class="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-surface-overlay"
						onclick={() => onPlaceMenuSelect(nt.type)}
					>
						<span
							class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
							style={`background:${nt.color ?? '#64748b'}`}
						></span>
						<span class="min-w-0">
							<span class="block truncate text-sm font-medium text-primary">{nt.label}</span>
							{#if nt.description}
								<span class="block truncate text-[11px] text-muted">{nt.description}</span>
							{/if}
						</span>
					</button>
				{/each}
			{:else}
				{#if !variableMenuItems.length}
					<p class="px-3 py-6 text-center text-xs text-muted">No compatible nodes</p>
				{/if}
			{/each}
			{#if !menuSourcePort}
				<div class="my-1 h-px bg-border" role="separator"></div>
				<button
					type="button"
					role="menuitem"
					class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-primary hover:bg-surface-overlay"
					onclick={() => {
						doFitView();
						closePlaceMenu();
					}}
				>
					Fit view
					<kbd
						class="rounded border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] text-secondary"
					>
						F
					</kbd>
				</button>
			{/if}
		{/if}
	</div>
</div>

<style>
	/* Tailwind `flex` overrides UA popover display:none — hide until open */
	.node-place-menu {
		position: fixed;
	}
	.node-place-menu:not(:popover-open) {
		display: none !important;
	}
	.node-place-menu:popover-open {
		inset: unset;
		display: flex;
	}

	:global(.svelte-flow) {
		--xy-node-border-default: transparent;
		--xy-node-background-color-default: transparent;
	}
	:global(.svelte-flow__node-blueprint) {
		padding: 0 !important;
		border: none !important;
		background: transparent !important;
		box-shadow: none !important;
		overflow: visible !important;
	}
	:global(.svelte-flow__handle) {
		display: flex !important;
		align-items: center;
		justify-content: center;
	}
	:global(.svelte-flow__handle-left) {
		left: 0 !important;
	}
	:global(.svelte-flow__handle-right) {
		right: 0 !important;
		left: auto !important;
	}
	:global(.svelte-flow__minimap) {
		border-radius: 0.5rem;
		overflow: hidden;
	}
	:global(.svelte-flow__selection) {
		background: rgba(14, 165, 233, 0.1);
		border: 1px solid rgba(14, 165, 233, 0.65);
	}
	:global(.svelte-flow__nodesselection-rect) {
		border: 1px solid rgba(14, 165, 233, 0.75);
		background: rgba(14, 165, 233, 0.04);
	}
	/* Keep comment boxes under nodes even when selected / elevated */
	:global(.svelte-flow__node.bp-flow-comment),
	:global(.svelte-flow__node-blueprint.bp-flow-comment) {
		z-index: -1 !important;
	}
</style>
