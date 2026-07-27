/**
 * Node graph helpers — Blueprint-style typed pins, edges, validation.
 */

export type GraphPortSide = 'left' | 'right' | 'top' | 'bottom';
export type PinKind = 'exec' | 'data';
export type PinDataType = 'bool' | 'int' | 'float' | 'string' | 'object' | 'exec' | 'any';

export interface GraphPort {
	id: string;
	label?: string;
	side?: GraphPortSide;
	/** 0–1 along the side (0.5 = center). */
	offset?: number;
	kind?: PinKind;
	dataType?: PinDataType;
	/** Inline literal when the pin is not wired (Blueprint-style). */
	value?: unknown;
}

export interface GraphNodeData {
	label?: string;
	description?: string;
	color?: string;
	/** Comment box fill */
	commentColor?: string;
	[key: string]: unknown;
}

export interface GraphNode {
	id: string;
	type: string;
	x: number;
	y: number;
	width?: number;
	height?: number;
	data?: GraphNodeData;
	inputs?: GraphPort[];
	outputs?: GraphPort[];
}

export interface GraphEdge {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string;
	targetHandle?: string;
	label?: string;
}

export interface GraphDocument {
	version: 1;
	nodes: GraphNode[];
	edges: GraphEdge[];
}

/**
 * Graph kind / “class context” — like Unreal Blueprint graphs.
 * Nodes without `contexts` are available in every graph.
 */
export type GraphNodeContext =
	| 'event_graph'
	| 'function_graph'
	| 'macro_graph'
	| 'construction_script';

export interface GraphNodeTypeDef {
	type: string;
	label: string;
	description?: string;
	category?: string;
	color?: string;
	inputs?: GraphPort[];
	outputs?: GraphPort[];
	defaultData?: GraphNodeData;
	width?: number;
	height?: number;
	/** If set, node only appears in these graph contexts (Unreal-style). */
	contexts?: GraphNodeContext[];
	/** Hide from palette (still creatable via API / variable menu). */
	hidden?: boolean;
}

export const DEFAULT_NODE_WIDTH = 220;
export const DEFAULT_NODE_HEIGHT = 80;
export const PORT_SIZE = 12;
/** Half of the pin glyph — wire starts/ends at the rim of the circle/play icon. */
export const EDGE_PORT_PAD = PORT_SIZE / 2;
/** SVG marker tip length (viewBox units ≈ user units with markerWidth 8). */
export const EDGE_ARROW_LENGTH = 8;

export const PIN_TYPE_COLORS: Record<PinDataType, string> = {
	exec: '#e2e8f0',
	bool: '#ef4444',
	int: '#22c55e',
	float: '#86efac',
	string: '#a855f7',
	object: '#38bdf8',
	any: '#94a3b8'
};

export function pinColor(port: GraphPort): string {
	const dt = port.dataType ?? (port.kind === 'exec' ? 'exec' : 'any');
	return PIN_TYPE_COLORS[dt] ?? PIN_TYPE_COLORS.any;
}

function execPort(id: string, label: string, side: GraphPortSide, offset?: number): GraphPort {
	return { id, label, side, offset, kind: 'exec', dataType: 'exec' };
}

function dataPort(
	id: string,
	label: string,
	dataType: PinDataType,
	side: GraphPortSide,
	offset?: number
): GraphPort {
	return { id, label, side, offset, kind: 'data', dataType };
}

export const DEFAULT_NODE_TYPES: GraphNodeTypeDef[] = [
	{
		type: 'trigger',
		label: 'Trigger',
		category: 'Events',
		description: 'Starts the flow',
		color: '#10b981',
		inputs: [],
		outputs: [execPort('exec', 'Then', 'right')]
	},
	{
		type: 'action',
		label: 'Action',
		category: 'Actions',
		description: 'Do something',
		color: '#3b82f6',
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: [execPort('exec', 'Then', 'right')]
	},
	{
		type: 'condition',
		label: 'Branch',
		category: 'Flow',
		description: 'Branch on a boolean',
		color: '#f59e0b',
		height: 96,
		inputs: [
			execPort('exec_in', 'Exec', 'left', 0.28),
			dataPort('condition', 'Condition', 'bool', 'left', 0.72)
		],
		outputs: [
			execPort('true', 'True', 'right', 0.32),
			execPort('false', 'False', 'right', 0.68)
		]
	},
	{
		type: 'transform',
		label: 'Transform',
		category: 'Actions',
		description: 'Map data then continue',
		color: '#8b5cf6',
		height: 96,
		inputs: [
			execPort('exec_in', 'Exec', 'left', 0.28),
			dataPort('in', 'In', 'any', 'left', 0.72)
		],
		outputs: [
			execPort('exec', 'Then', 'right', 0.28),
			dataPort('out', 'Out', 'any', 'right', 0.72)
		]
	},
	{
		type: 'delay',
		label: 'Delay',
		category: 'Flow',
		description: 'Wait before continuing',
		color: '#64748b',
		inputs: [
			execPort('exec_in', 'Exec', 'left', 0.3),
			dataPort('seconds', 'Seconds', 'float', 'left', 0.7)
		],
		outputs: [execPort('exec', 'Then', 'right')]
	},
	{
		type: 'end',
		label: 'End',
		category: 'Flow',
		description: 'Terminal step',
		color: '#ef4444',
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: []
	},
	{
		type: 'get_string',
		label: 'Get String',
		category: 'Functions',
		description: 'Pure data — no exec pins',
		color: '#a855f7',
		width: 168,
		height: 56,
		inputs: [],
		outputs: [dataPort('value', 'Return', 'string', 'right')],
		defaultData: { label: '"Hello"' }
	},
	{
		type: 'format_string',
		label: 'Format String',
		category: 'Functions',
		description: 'Pure function — data in/out only',
		color: '#a855f7',
		height: 88,
		inputs: [
			dataPort('template', 'Template', 'string', 'left', 0.35),
			dataPort('value', 'Value', 'any', 'left', 0.7)
		],
		outputs: [dataPort('out', 'Result', 'string', 'right')]
	},
	{
		type: 'to_bool',
		label: 'To Bool',
		category: 'Functions',
		description: 'Cast / coerce to boolean',
		color: '#ef4444',
		width: 160,
		height: 56,
		inputs: [dataPort('in', 'In', 'any', 'left')],
		outputs: [dataPort('out', 'Out', 'bool', 'right')]
	},
	{
		type: 'comment',
		label: 'Comment',
		category: 'Utility',
		description: 'Annotation box',
		color: '#fbbf24',
		width: 220,
		height: 100,
		inputs: [],
		outputs: [],
		defaultData: { label: 'Comment', commentColor: 'rgba(251, 191, 36, 0.25)' }
	},
	{
		type: 'reroute',
		label: 'Reroute',
		category: 'Utility',
		description: 'Wire knot / pass-through',
		color: '#94a3b8',
		width: 16,
		height: 16,
		hidden: true,
		inputs: [dataPort('in', '', 'any', 'left')],
		outputs: [dataPort('out', '', 'any', 'right')]
	},
	{
		type: 'collapsed_graph',
		label: 'Collapsed Graph',
		category: 'Utility',
		description: 'Collapsed selection (expand with E)',
		color: '#7c3aed',
		width: 220,
		height: 72,
		hidden: true,
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: [execPort('exec', 'Then', 'right')],
		defaultData: { label: 'Collapsed Graph' }
	}
];

/** Unreal-inspired blueprint catalog */
export const DEFAULT_BLUEPRINT_NODE_TYPES: GraphNodeTypeDef[] = [
	{
		type: 'event_begin',
		label: 'Event BeginPlay',
		category: 'Events',
		color: '#dc2626',
		contexts: ['event_graph'],
		inputs: [],
		outputs: [execPort('exec', 'Then', 'right')],
		defaultData: { label: 'Event BeginPlay' }
	},
	{
		type: 'event_tick',
		label: 'Event Tick',
		category: 'Events',
		color: '#dc2626',
		contexts: ['event_graph'],
		height: 88,
		inputs: [],
		outputs: [
			execPort('exec', 'Then', 'right'),
			dataPort('delta', 'Delta Seconds', 'float', 'right')
		],
		defaultData: { label: 'Event Tick' }
	},
	{
		type: 'branch',
		label: 'Branch',
		category: 'Flow Control',
		color: '#64748b',
		contexts: ['event_graph', 'function_graph', 'macro_graph'],
		width: 240,
		height: 88,
		inputs: [
			execPort('exec_in', 'Exec', 'left'),
			dataPort('condition', 'Condition', 'bool', 'left')
		],
		outputs: [execPort('true', 'True', 'right'), execPort('false', 'False', 'right')]
	},
	{
		type: 'delay_bp',
		label: 'Delay',
		category: 'Flow Control',
		color: '#64748b',
		contexts: ['event_graph', 'function_graph'],
		width: 240,
		height: 88,
		inputs: [
			execPort('exec_in', 'Exec', 'left'),
			dataPort('duration', 'Duration', 'float', 'left')
		],
		outputs: [
			execPort('completed', 'Completed', 'right'),
			execPort('aborted', 'Aborted', 'right')
		]
	},
	{
		type: 'print_string',
		label: 'Print String',
		category: 'Utilities',
		color: '#0ea5e9',
		contexts: ['event_graph', 'function_graph', 'macro_graph'],
		width: 250,
		height: 110,
		inputs: [
			execPort('exec_in', 'Exec', 'left'),
			dataPort('in_string', 'In String', 'string', 'left'),
			dataPort('duration', 'Duration', 'float', 'left')
		],
		outputs: [execPort('exec', 'Then', 'right')]
	},
	{
		type: 'make_string',
		label: 'Make Literal String',
		category: 'Utilities',
		color: '#a855f7',
		contexts: ['event_graph', 'function_graph', 'macro_graph', 'construction_script'],
		width: 180,
		height: 56,
		inputs: [],
		outputs: [dataPort('value', 'Return', 'string', 'right')],
		defaultData: { label: '"Hello"' }
	},
	{
		type: 'return_node',
		label: 'Return Node',
		category: 'Flow Control',
		color: '#dc2626',
		contexts: ['function_graph'],
		description: 'Only available inside function graphs',
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: []
	},
	{
		type: 'construction_add',
		label: 'Add Component',
		category: 'Components',
		color: '#f97316',
		contexts: ['construction_script'],
		description: 'Only available in Construction Script',
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: [execPort('exec', 'Then', 'right'), dataPort('component', 'Component', 'object', 'right')]
	},
	{
		type: 'comment',
		label: 'Comment',
		category: 'Utility',
		color: '#fbbf24',
		width: 240,
		height: 110,
		inputs: [],
		outputs: [],
		defaultData: { label: 'Comment', commentColor: 'rgba(251, 191, 36, 0.28)' }
	},
	{
		type: 'reroute',
		label: 'Reroute',
		category: 'Utility',
		description: 'Wire knot / pass-through',
		color: '#94a3b8',
		width: 16,
		height: 16,
		hidden: true,
		inputs: [dataPort('in', '', 'any', 'left')],
		outputs: [dataPort('out', '', 'any', 'right')]
	},
	{
		type: 'collapsed_graph',
		label: 'Collapsed Graph',
		category: 'Utility',
		description: 'Collapsed selection (expand with E)',
		color: '#7c3aed',
		width: 220,
		height: 72,
		hidden: true,
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: [execPort('exec', 'Then', 'right')],
		defaultData: { label: 'Collapsed Graph' }
	},
	/** Templates for dynamic variable nodes (hidden from palette). */
	{
		type: 'var_get',
		label: 'Get',
		category: 'Variables',
		hidden: true,
		width: 160,
		height: 52,
		inputs: [],
		outputs: [dataPort('value', '', 'any', 'right')]
	},
	{
		type: 'var_set',
		label: 'Set',
		category: 'Variables',
		hidden: true,
		height: 72,
		inputs: [execPort('exec_in', 'Exec', 'left'), dataPort('value', '', 'any', 'left')],
		outputs: [execPort('exec', 'Then', 'right'), dataPort('out', '', 'any', 'right')]
	}
];

export function emptyGraphDocument(): GraphDocument {
	return { version: 1, nodes: [], edges: [] };
}

function uid(prefix: string): string {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function resolveNodeType(
	type: string,
	catalog: GraphNodeTypeDef[] = DEFAULT_NODE_TYPES
): GraphNodeTypeDef | undefined {
	return catalog.find((t) => t.type === type);
}

export function defaultPortsForType(
	type: string,
	catalog: GraphNodeTypeDef[] = DEFAULT_NODE_TYPES
): { inputs: GraphPort[]; outputs: GraphPort[] } {
	const def = resolveNodeType(type, catalog);
	if (def) {
		return {
			inputs: (def.inputs ?? []).map((p) => ({ ...p })),
			outputs: (def.outputs ?? []).map((p) => ({ ...p }))
		};
	}
	return {
		inputs: [execPort('exec_in', 'Exec', 'left')],
		outputs: [execPort('exec', 'Then', 'right')]
	};
}

export function createGraphNode(
	partial: Partial<GraphNode> & { type: string; x: number; y: number },
	catalog: GraphNodeTypeDef[] = DEFAULT_NODE_TYPES
): GraphNode {
	const def = resolveNodeType(partial.type, catalog);
	const ports = defaultPortsForType(partial.type, catalog);
	return {
		id: partial.id ?? uid('n'),
		type: partial.type,
		x: partial.x,
		y: partial.y,
		width: partial.width ?? def?.width ?? DEFAULT_NODE_WIDTH,
		height: partial.height ?? def?.height ?? DEFAULT_NODE_HEIGHT,
		data: {
			label: def?.label ?? partial.type,
			color: def?.color,
			...(def?.defaultData ?? {}),
			...(partial.data ?? {})
		},
		inputs: partial.inputs ?? ports.inputs,
		outputs: partial.outputs ?? ports.outputs
	};
}

/** Duplicate nodes (+ internal edges), like UE Blueprint Ctrl+W / duplicate. */
export function duplicateGraphSelection(
	doc: GraphDocument,
	nodeIds: string[],
	opts?: { offsetX?: number; offsetY?: number }
): { doc: GraphDocument; newNodeIds: string[] } {
	const idSet = new Set(nodeIds);
	const sources = doc.nodes.filter((n) => idSet.has(n.id));
	if (!sources.length) return { doc, newNodeIds: [] };

	const dx = opts?.offsetX ?? 32;
	const dy = opts?.offsetY ?? 32;
	const idMap = new Map<string, string>();
	const clones: GraphNode[] = sources.map((n) => {
		const id = uid('n');
		idMap.set(n.id, id);
		return {
			...n,
			id,
			x: n.x + dx,
			y: n.y + dy,
			inputs: n.inputs?.map((p) => ({ ...p })),
			outputs: n.outputs?.map((p) => ({ ...p })),
			data: n.data ? { ...n.data } : undefined
		};
	});

	const edgeClones: GraphEdge[] = doc.edges
		.filter((e) => idSet.has(e.source) && idSet.has(e.target))
		.map((e) => ({
			...e,
			id: uid('e'),
			source: idMap.get(e.source)!,
			target: idMap.get(e.target)!
		}));

	return {
		doc: {
			...doc,
			nodes: [...doc.nodes, ...clones],
			edges: [...doc.edges, ...edgeClones]
		},
		newNodeIds: clones.map((n) => n.id)
	};
}

export function cloneGraphDocument(doc: GraphDocument): GraphDocument {
	return JSON.parse(JSON.stringify(doc)) as GraphDocument;
}

export const GRAPH_CLIPBOARD_MIME = 'application/x-r2-graph-fragment';

export type GraphClipboardPayload = {
	mime: typeof GRAPH_CLIPBOARD_MIME;
	version: 1;
	fragment: GraphDocument;
};

export function extractGraphSelection(doc: GraphDocument, nodeIds: string[]): GraphDocument {
	const idSet = new Set(nodeIds);
	const nodes = doc.nodes
		.filter((n) => idSet.has(n.id))
		.map((n) => ({
			...n,
			inputs: n.inputs?.map((p) => ({ ...p })),
			outputs: n.outputs?.map((p) => ({ ...p })),
			data: n.data ? { ...n.data } : undefined
		}));
	const edges = doc.edges
		.filter((e) => idSet.has(e.source) && idSet.has(e.target))
		.map((e) => ({ ...e }));
	return { version: 1, nodes, edges };
}

export function encodeGraphClipboard(fragment: GraphDocument): string {
	const payload: GraphClipboardPayload = {
		mime: GRAPH_CLIPBOARD_MIME,
		version: 1,
		fragment: cloneGraphDocument(fragment)
	};
	return JSON.stringify(payload);
}

export function decodeGraphClipboard(raw: string): GraphDocument | null {
	try {
		const parsed = JSON.parse(raw) as GraphClipboardPayload | GraphDocument;
		if (
			parsed &&
			typeof parsed === 'object' &&
			'mime' in parsed &&
			parsed.mime === GRAPH_CLIPBOARD_MIME &&
			parsed.fragment
		) {
			return cloneGraphDocument(parsed.fragment);
		}
		if (parsed && typeof parsed === 'object' && 'nodes' in parsed && Array.isArray(parsed.nodes)) {
			return cloneGraphDocument(parsed as GraphDocument);
		}
	} catch {
		/* ignore */
	}
	return null;
}

export function pasteGraphSelection(
	doc: GraphDocument,
	fragment: GraphDocument,
	opts?: { offsetX?: number; offsetY?: number; origin?: { x: number; y: number } }
): { doc: GraphDocument; newNodeIds: string[] } {
	if (!fragment.nodes.length) return { doc, newNodeIds: [] };
	const dx = opts?.offsetX ?? 40;
	const dy = opts?.offsetY ?? 40;
	let ox = 0;
	let oy = 0;
	if (opts?.origin) {
		const minX = Math.min(...fragment.nodes.map((n) => n.x));
		const minY = Math.min(...fragment.nodes.map((n) => n.y));
		ox = opts.origin.x - minX;
		oy = opts.origin.y - minY;
	} else {
		ox = dx;
		oy = dy;
	}
	const idMap = new Map<string, string>();
	const clones = fragment.nodes.map((n) => {
		const id = uid('n');
		idMap.set(n.id, id);
		return {
			...n,
			id,
			x: n.x + ox,
			y: n.y + oy,
			inputs: n.inputs?.map((p) => ({ ...p })),
			outputs: n.outputs?.map((p) => ({ ...p })),
			data: n.data ? { ...n.data } : undefined
		};
	});
	const edgeClones = fragment.edges
		.filter((e) => idMap.has(e.source) && idMap.has(e.target))
		.map((e) => ({
			...e,
			id: uid('e'),
			source: idMap.get(e.source)!,
			target: idMap.get(e.target)!
		}));
	return {
		doc: {
			...doc,
			nodes: [...doc.nodes, ...clones],
			edges: [...doc.edges, ...edgeClones]
		},
		newNodeIds: clones.map((n) => n.id)
	};
}

export type AlignAxis = 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';
export type DistributeAxis = 'horizontal' | 'vertical';

export function alignGraphNodes(
	doc: GraphDocument,
	nodeIds: string[],
	align: AlignAxis
): GraphDocument {
	const idSet = new Set(nodeIds);
	const targets = doc.nodes.filter((n) => idSet.has(n.id) && n.type !== 'comment');
	if (targets.length < 2) return doc;

	const boxes = targets.map((n) => {
		const { w, h } = nodeSize(n);
		return { n, w, h, cx: n.x + w / 2, cy: n.y + h / 2, r: n.x + w, b: n.y + h };
	});

	let anchor = 0;
	switch (align) {
		case 'left':
			anchor = Math.min(...boxes.map((b) => b.n.x));
			break;
		case 'right':
			anchor = Math.max(...boxes.map((b) => b.r));
			break;
		case 'top':
			anchor = Math.min(...boxes.map((b) => b.n.y));
			break;
		case 'bottom':
			anchor = Math.max(...boxes.map((b) => b.b));
			break;
		case 'centerX':
			anchor = boxes.reduce((s, b) => s + b.cx, 0) / boxes.length;
			break;
		case 'centerY':
			anchor = boxes.reduce((s, b) => s + b.cy, 0) / boxes.length;
			break;
	}

	const nextPos = new Map<string, { x: number; y: number }>();
	for (const b of boxes) {
		let x = b.n.x;
		let y = b.n.y;
		if (align === 'left') x = anchor;
		else if (align === 'right') x = anchor - b.w;
		else if (align === 'centerX') x = anchor - b.w / 2;
		else if (align === 'top') y = anchor;
		else if (align === 'bottom') y = anchor - b.h;
		else if (align === 'centerY') y = anchor - b.h / 2;
		nextPos.set(b.n.id, { x, y });
	}

	return {
		...doc,
		nodes: doc.nodes.map((n) => {
			const p = nextPos.get(n.id);
			return p ? { ...n, x: p.x, y: p.y } : n;
		})
	};
}

export function distributeGraphNodes(
	doc: GraphDocument,
	nodeIds: string[],
	axis: DistributeAxis
): GraphDocument {
	const idSet = new Set(nodeIds);
	const targets = doc.nodes.filter((n) => idSet.has(n.id) && n.type !== 'comment');
	if (targets.length < 3) return doc;

	const sorted = [...targets].sort((a, b) => (axis === 'horizontal' ? a.x - b.x : a.y - b.y));
	const first = sorted[0];
	const last = sorted[sorted.length - 1];
	const { w: lw, h: lh } = nodeSize(last);
	const start = axis === 'horizontal' ? first.x : first.y;
	const end = axis === 'horizontal' ? last.x + lw : last.y + lh;
	const totalSize = sorted.reduce((s, n) => {
		const { w, h } = nodeSize(n);
		return s + (axis === 'horizontal' ? w : h);
	}, 0);
	const gap = (end - start - totalSize) / (sorted.length - 1);
	const nextPos = new Map<string, { x: number; y: number }>();
	let cursor = start;
	for (const n of sorted) {
		const { w, h } = nodeSize(n);
		if (axis === 'horizontal') nextPos.set(n.id, { x: cursor, y: n.y });
		else nextPos.set(n.id, { x: n.x, y: cursor });
		cursor += (axis === 'horizontal' ? w : h) + gap;
	}
	return {
		...doc,
		nodes: doc.nodes.map((n) => {
			const p = nextPos.get(n.id);
			return p ? { ...n, x: p.x, y: p.y } : n;
		})
	};
}

export function selectionBounds(
	doc: GraphDocument,
	nodeIds: string[],
	padding = 24
): { x: number; y: number; width: number; height: number } | null {
	const idSet = new Set(nodeIds);
	const nodes = doc.nodes.filter((n) => idSet.has(n.id));
	if (!nodes.length) return null;
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const n of nodes) {
		const { w, h } = nodeSize(n);
		minX = Math.min(minX, n.x);
		minY = Math.min(minY, n.y);
		maxX = Math.max(maxX, n.x + w);
		maxY = Math.max(maxY, n.y + h);
	}
	return {
		x: minX - padding,
		y: minY - padding,
		width: maxX - minX + padding * 2,
		height: maxY - minY + padding * 2
	};
}

export function createCommentFromSelection(
	doc: GraphDocument,
	nodeIds: string[],
	opts?: { label?: string }
): { doc: GraphDocument; commentId: string } | null {
	const bounds = selectionBounds(doc, nodeIds, 28);
	if (!bounds) return null;
	const comment: GraphNode = {
		id: uid('n'),
		type: 'comment',
		x: bounds.x,
		y: bounds.y,
		width: Math.max(180, bounds.width),
		height: Math.max(80, bounds.height),
		data: {
			label: opts?.label ?? 'Comment',
			commentColor: 'rgba(251, 191, 36, 0.18)',
			memberIds: [...nodeIds]
		},
		inputs: [],
		outputs: []
	};
	return {
		doc: { ...doc, nodes: [comment, ...doc.nodes] },
		commentId: comment.id
	};
}

export function createRerouteNode(
	pos: { x: number; y: number },
	port: Pick<GraphPort, 'kind' | 'dataType'>
): GraphNode {
	const kind = port.kind ?? (port.dataType === 'exec' ? 'exec' : 'data');
	const dataType = (port.dataType ?? (kind === 'exec' ? 'exec' : 'any')) as PinDataType;
	return {
		id: uid('n'),
		type: 'reroute',
		x: pos.x - 8,
		y: pos.y - 8,
		width: 16,
		height: 16,
		data: {
			label: 'Reroute',
			pinKind: kind,
			pinDataType: dataType,
			color: kind === 'exec' ? '#94a3b8' : pinColor({ id: 'p', kind, dataType })
		},
		inputs: [{ id: 'in', label: '', side: 'left', kind, dataType }],
		outputs: [{ id: 'out', label: '', side: 'right', kind, dataType }]
	};
}

export function insertRerouteOnEdge(
	doc: GraphDocument,
	edgeId: string,
	pos: { x: number; y: number }
): { doc: GraphDocument; rerouteId: string } | null {
	const edge = doc.edges.find((e) => e.id === edgeId);
	if (!edge) return null;
	const source = doc.nodes.find((n) => n.id === edge.source);
	const out = source?.outputs?.find((p) => p.id === (edge.sourceHandle ?? p.id)) ??
		source?.outputs?.[0];
	const port = out ?? { kind: 'data' as const, dataType: 'any' as PinDataType };
	const reroute = createRerouteNode(pos, port);
	const left: GraphEdge = {
		id: uid('e'),
		source: edge.source,
		target: reroute.id,
		sourceHandle: edge.sourceHandle,
		targetHandle: 'in',
		label: edge.label
	};
	const right: GraphEdge = {
		id: uid('e'),
		source: reroute.id,
		target: edge.target,
		sourceHandle: 'out',
		targetHandle: edge.targetHandle
	};
	return {
		doc: {
			...doc,
			nodes: [...doc.nodes, reroute],
			edges: [...doc.edges.filter((e) => e.id !== edgeId), left, right]
		},
		rerouteId: reroute.id
	};
}

export function breakLinksAtHandle(
	doc: GraphDocument,
	nodeId: string,
	handleId: string | null | undefined,
	handleType: 'source' | 'target' | null | undefined
): GraphDocument {
	if (!handleId) {
		return {
			...doc,
			edges: doc.edges.filter((e) =>
				handleType === 'source'
					? e.source !== nodeId
					: handleType === 'target'
						? e.target !== nodeId
						: e.source !== nodeId && e.target !== nodeId
			)
		};
	}
	return {
		...doc,
		edges: doc.edges.filter((e) => {
			if (handleType === 'source' || handleType == null) {
				if (e.source === nodeId && (e.sourceHandle ?? '') === handleId) return false;
			}
			if (handleType === 'target' || handleType == null) {
				if (e.target === nodeId && (e.targetHandle ?? '') === handleId) return false;
			}
			return true;
		})
	};
}

export function collapseSelectionToFunction(
	doc: GraphDocument,
	nodeIds: string[],
	opts?: { label?: string }
): { doc: GraphDocument; collapsedId: string } | null {
	const idSet = new Set(nodeIds.filter((id) => doc.nodes.some((n) => n.id === id)));
	const members = doc.nodes.filter(
		(n) => idSet.has(n.id) && n.type !== 'comment' && n.type !== 'collapsed_graph'
	);
	if (members.length < 1) return null;
	const memberIds = new Set(members.map((n) => n.id));
	const internalEdges = doc.edges.filter(
		(e) => memberIds.has(e.source) && memberIds.has(e.target)
	);
	const incoming = doc.edges.filter(
		(e) => memberIds.has(e.target) && !memberIds.has(e.source)
	);
	const outgoing = doc.edges.filter(
		(e) => memberIds.has(e.source) && !memberIds.has(e.target)
	);

	const inputs: GraphPort[] = [];
	const outputs: GraphPort[] = [];
	const inMap: { edge: GraphEdge; pinId: string }[] = [];
	const outMap: { edge: GraphEdge; pinId: string }[] = [];

	incoming.forEach((edge, i) => {
		const target = members.find((n) => n.id === edge.target);
		const port =
			target?.inputs?.find((p) => p.id === (edge.targetHandle ?? p.id)) ??
			target?.inputs?.[0];
		const pinId = `in_${i}`;
		inputs.push({
			id: pinId,
			label: port?.label ?? `In ${i + 1}`,
			side: 'left',
			kind: port?.kind ?? 'data',
			dataType: port?.dataType ?? 'any'
		});
		inMap.push({ edge, pinId });
	});
	outgoing.forEach((edge, i) => {
		const source = members.find((n) => n.id === edge.source);
		const port =
			source?.outputs?.find((p) => p.id === (edge.sourceHandle ?? p.id)) ??
			source?.outputs?.[0];
		const pinId = `out_${i}`;
		outputs.push({
			id: pinId,
			label: port?.label ?? `Out ${i + 1}`,
			side: 'right',
			kind: port?.kind ?? 'data',
			dataType: port?.dataType ?? 'any'
		});
		outMap.push({ edge, pinId });
	});

	if (!inputs.length) inputs.push(execPort('exec_in', 'Exec', 'left'));
	if (!outputs.length) outputs.push(execPort('exec', 'Then', 'right'));

	const bounds = selectionBounds(doc, [...memberIds], 0);
	const collapsed: GraphNode = {
		id: uid('n'),
		type: 'collapsed_graph',
		x: bounds ? bounds.x + bounds.width / 2 - 110 : members[0].x,
		y: bounds ? bounds.y + bounds.height / 2 - 36 : members[0].y,
		width: 220,
		height: Math.max(72, 40 + Math.max(inputs.length, outputs.length) * 22),
		data: {
			label: opts?.label ?? `Collapsed (${members.length})`,
			color: '#7c3aed',
			collapsedGraph: {
				version: 1 as const,
				nodes: members.map((n) => ({
					...n,
					inputs: n.inputs?.map((p) => ({ ...p })),
					outputs: n.outputs?.map((p) => ({ ...p })),
					data: n.data ? { ...n.data } : undefined
				})),
				edges: internalEdges.map((e) => ({ ...e }))
			},
			boundaryIn: inMap.map(({ edge, pinId }) => ({
				pinId,
				innerNodeId: edge.target,
				innerHandle: edge.targetHandle
			})),
			boundaryOut: outMap.map(({ edge, pinId }) => ({
				pinId,
				innerNodeId: edge.source,
				innerHandle: edge.sourceHandle
			}))
		},
		inputs,
		outputs
	};

	const rewired: GraphEdge[] = [
		...inMap.map(({ edge, pinId }) => ({
			id: uid('e'),
			source: edge.source,
			target: collapsed.id,
			sourceHandle: edge.sourceHandle,
			targetHandle: pinId
		})),
		...outMap.map(({ edge, pinId }) => ({
			id: uid('e'),
			source: collapsed.id,
			target: edge.target,
			sourceHandle: pinId,
			targetHandle: edge.targetHandle
		}))
	];

	const keepEdges = doc.edges.filter(
		(e) => !memberIds.has(e.source) && !memberIds.has(e.target)
	);

	return {
		doc: {
			...doc,
			nodes: [...doc.nodes.filter((n) => !memberIds.has(n.id)), collapsed],
			edges: [...keepEdges, ...rewired]
		},
		collapsedId: collapsed.id
	};
}

export function expandCollapsedGraph(
	doc: GraphDocument,
	nodeId: string
): { doc: GraphDocument; newNodeIds: string[] } | null {
	const node = doc.nodes.find((n) => n.id === nodeId && n.type === 'collapsed_graph');
	if (!node) return null;
	const subgraph = node.data?.collapsedGraph as GraphDocument | undefined;
	if (!subgraph?.nodes?.length) return null;

	const idMap = new Map<string, string>();
	const clones = subgraph.nodes.map((n) => {
		const id = uid('n');
		idMap.set(n.id, id);
		return {
			...n,
			id,
			x: n.x,
			y: n.y,
			inputs: n.inputs?.map((p) => ({ ...p })),
			outputs: n.outputs?.map((p) => ({ ...p })),
			data: n.data ? { ...n.data } : undefined
		};
	});
	const internal = (subgraph.edges ?? []).map((e) => ({
		...e,
		id: uid('e'),
		source: idMap.get(e.source)!,
		target: idMap.get(e.target)!
	}));

	type Boundary = { pinId: string; innerNodeId: string; innerHandle?: string };
	const boundaryIn = (node.data?.boundaryIn as Boundary[] | undefined) ?? [];
	const boundaryOut = (node.data?.boundaryOut as Boundary[] | undefined) ?? [];

	const external = doc.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
	const restoredIn = doc.edges
		.filter((e) => e.target === nodeId)
		.map((e) => {
			const b = boundaryIn.find((x) => x.pinId === (e.targetHandle ?? x.pinId));
			const inner = b ? idMap.get(b.innerNodeId) : clones[0]?.id;
			if (!inner) return null;
			return {
				id: uid('e'),
				source: e.source,
				target: inner,
				sourceHandle: e.sourceHandle,
				targetHandle: b?.innerHandle
			} as GraphEdge;
		})
		.filter(Boolean) as GraphEdge[];

	const restoredOut = doc.edges
		.filter((e) => e.source === nodeId)
		.map((e) => {
			const b = boundaryOut.find((x) => x.pinId === (e.sourceHandle ?? x.pinId));
			const inner = b ? idMap.get(b.innerNodeId) : clones[clones.length - 1]?.id;
			if (!inner) return null;
			return {
				id: uid('e'),
				source: inner,
				target: e.target,
				sourceHandle: b?.innerHandle,
				targetHandle: e.targetHandle
			} as GraphEdge;
		})
		.filter(Boolean) as GraphEdge[];

	return {
		doc: {
			...doc,
			nodes: [...doc.nodes.filter((n) => n.id !== nodeId), ...clones],
			edges: [...external, ...internal, ...restoredIn, ...restoredOut]
		},
		newNodeIds: clones.map((n) => n.id)
	};
}

export function createGraphEdge(
	source: string,
	target: string,
	opts?: { label?: string; sourceHandle?: string; targetHandle?: string; id?: string }
): GraphEdge {
	return {
		id: opts?.id ?? uid('e'),
		source,
		target,
		label: opts?.label,
		sourceHandle: opts?.sourceHandle ?? 'exec',
		targetHandle: opts?.targetHandle ?? 'exec_in'
	};
}

export function serializeGraphDocument(doc: GraphDocument): string {
	return JSON.stringify(doc, null, 2);
}

export function parseGraphDocument(raw: string | GraphDocument): GraphDocument {
	if (typeof raw !== 'string') return normalizeGraph(raw);
	try {
		return normalizeGraph(JSON.parse(raw));
	} catch {
		return emptyGraphDocument();
	}
}

function normalizeGraph(input: unknown): GraphDocument {
	if (!input || typeof input !== 'object') return emptyGraphDocument();
	const obj = input as Record<string, unknown>;
	const nodes = Array.isArray(obj.nodes)
		? obj.nodes.filter(
				(n): n is GraphNode =>
					!!n &&
					typeof n === 'object' &&
					typeof (n as GraphNode).id === 'string' &&
					typeof (n as GraphNode).type === 'string'
			)
		: [];
	const edges = Array.isArray(obj.edges)
		? obj.edges.filter(
				(e): e is GraphEdge =>
					!!e &&
					typeof e === 'object' &&
					typeof (e as GraphEdge).id === 'string' &&
					typeof (e as GraphEdge).source === 'string' &&
					typeof (e as GraphEdge).target === 'string'
			)
		: [];
	return { version: 1, nodes, edges };
}

export function removeNode(doc: GraphDocument, nodeId: string): GraphDocument {
	return {
		...doc,
		nodes: doc.nodes.filter((n) => n.id !== nodeId),
		edges: doc.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
	};
}

export function removeEdge(doc: GraphDocument, edgeId: string): GraphDocument {
	return { ...doc, edges: doc.edges.filter((e) => e.id !== edgeId) };
}

export function updateNodePosition(
	doc: GraphDocument,
	nodeId: string,
	x: number,
	y: number
): GraphDocument {
	return {
		...doc,
		nodes: doc.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
	};
}

export function nodeSize(
	node: GraphNode,
	fallbackW = DEFAULT_NODE_WIDTH,
	fallbackH = DEFAULT_NODE_HEIGHT
): { w: number; h: number } {
	return { w: node.width ?? fallbackW, h: node.height ?? fallbackH };
}

export function nodeCenter(
	node: GraphNode,
	width?: number,
	height?: number
): { x: number; y: number } {
	const { w, h } = nodeSize(node, width, height);
	return { x: node.x + w / 2, y: node.y + h / 2 };
}

function portOffset(port: GraphPort, index: number, total: number): number {
	if (typeof port.offset === 'number') return Math.min(1, Math.max(0, port.offset));
	if (total <= 1) return 0.5;
	return (index + 1) / (total + 1);
}

export function portPosition(
	node: GraphNode,
	port: GraphPort,
	kind: 'input' | 'output',
	index = 0,
	total = 1,
	fallbackW = DEFAULT_NODE_WIDTH,
	fallbackH = DEFAULT_NODE_HEIGHT
): { x: number; y: number } {
	const { w, h } = nodeSize(node, fallbackW, fallbackH);
	const side = port.side ?? (kind === 'input' ? 'left' : 'right');
	const t = portOffset(port, index, total);
	switch (side) {
		case 'left':
			return { x: node.x, y: node.y + h * t };
		case 'right':
			return { x: node.x + w, y: node.y + h * t };
		case 'top':
			return { x: node.x + w * t, y: node.y };
		case 'bottom':
			return { x: node.x + w * t, y: node.y + h };
		default:
			return { x: node.x + w, y: node.y + h / 2 };
	}
}

export function findPort(
	node: GraphNode,
	handleId: string | undefined,
	kind: 'input' | 'output'
): { port: GraphPort; index: number; total: number } | null {
	const list = kind === 'input' ? (node.inputs ?? []) : (node.outputs ?? []);
	if (!list.length) return null;
	const index = handleId ? list.findIndex((p) => p.id === handleId) : 0;
	const i = index >= 0 ? index : 0;
	return { port: list[i], index: i, total: list.length };
}

export function edgeEndpoints(
	doc: GraphDocument,
	edge: GraphEdge,
	fallbackW = DEFAULT_NODE_WIDTH,
	fallbackH = DEFAULT_NODE_HEIGHT
): { from: { x: number; y: number }; to: { x: number; y: number } } | null {
	const source = doc.nodes.find((n) => n.id === edge.source);
	const target = doc.nodes.find((n) => n.id === edge.target);
	if (!source || !target) return null;

	const out = findPort(source, edge.sourceHandle, 'output');
	const inn = findPort(target, edge.targetHandle, 'input');

	const from = out
		? portPosition(source, out.port, 'output', out.index, out.total, fallbackW, fallbackH)
		: {
				x: source.x + nodeSize(source, fallbackW, fallbackH).w,
				y: source.y + nodeSize(source, fallbackW, fallbackH).h / 2
			};
	const to = inn
		? portPosition(target, inn.port, 'input', inn.index, inn.total, fallbackW, fallbackH)
		: { x: target.x, y: target.y + nodeSize(target, fallbackW, fallbackH).h / 2 };

	return { from, to };
}

/** Offset a port-center point along its side normal (away from the node). */
export function offsetPortPoint(
	point: { x: number; y: number },
	side: GraphPortSide,
	distance: number
): { x: number; y: number } {
	switch (side) {
		case 'left':
			return { x: point.x - distance, y: point.y };
		case 'right':
			return { x: point.x + distance, y: point.y };
		case 'top':
			return { x: point.x, y: point.y - distance };
		case 'bottom':
			return { x: point.x, y: point.y + distance };
		default:
			return { x: point.x + distance, y: point.y };
	}
}

export function isExecPort(port: GraphPort): boolean {
	return (port.kind ?? port.dataType) === 'exec' || port.dataType === 'exec';
}

export function isDataPort(port: GraphPort): boolean {
	return !isExecPort(port);
}

export function formatPortLiteral(port: GraphPort): string {
	if (port.value == null) return '';
	if (typeof port.value === 'boolean') return port.value ? 'true' : 'false';
	return String(port.value);
}

export function parsePortLiteral(port: GraphPort, raw: string): unknown {
	const dt = port.dataType ?? 'any';
	if (dt === 'bool') {
		const v = raw.trim().toLowerCase();
		if (v === 'true' || v === '1' || v === 'yes') return true;
		if (v === 'false' || v === '0' || v === 'no' || v === '') return false;
		return Boolean(raw);
	}
	if (dt === 'int') {
		const n = parseInt(raw, 10);
		return Number.isFinite(n) ? n : 0;
	}
	if (dt === 'float') {
		const n = parseFloat(raw);
		return Number.isFinite(n) ? n : 0;
	}
	if (dt === 'object') {
		const t = raw.trim();
		if (!t || t === 'null') return null;
		try {
			return JSON.parse(t);
		} catch {
			return t;
		}
	}
	return raw;
}

export function defaultPortLiteral(port: GraphPort): unknown {
	if (port.value !== undefined) return port.value;
	const dt = port.dataType ?? 'any';
	switch (dt) {
		case 'bool':
			return false;
		case 'int':
			return 0;
		case 'float':
			return 0;
		case 'string':
			return '';
		case 'object':
			return null;
		default:
			return '';
	}
}

/** Map nodeId → input handle ids that have an incoming edge. */
export function wiredInputIdsByNode(edges: GraphEdge[]): Map<string, Set<string>> {
	const map = new Map<string, Set<string>>();
	for (const e of edges) {
		const handle = e.targetHandle ?? 'exec_in';
		if (!map.has(e.target)) map.set(e.target, new Set());
		map.get(e.target)!.add(handle);
	}
	return map;
}

/** Bezier with endpoints on the pin rim along the side normal (not the chord). */
export function edgePathForPorts(
	from: { x: number; y: number },
	to: { x: number; y: number },
	opts?: {
		padStart?: number;
		padEnd?: number;
		curvature?: number;
		fromSide?: GraphPortSide;
		toSide?: GraphPortSide;
	}
): string {
	const fromSide = opts?.fromSide ?? 'right';
	const toSide = opts?.toSide ?? 'left';
	const padStart = opts?.padStart ?? EDGE_PORT_PAD;
	/** Tip of the marker sits on the path end — stop at pin rim. */
	const padEnd = opts?.padEnd ?? EDGE_PORT_PAD;
	const curvature = opts?.curvature ?? 0.45;
	const a = offsetPortPoint(from, fromSide, padStart);
	const b = offsetPortPoint(to, toSide, padEnd);
	return edgePathFromPoints(a, b, curvature);
}

/** True if the type exposes at least one input pin compatible with `source`. */
export function nodeTypeAcceptsPort(
	typeDef: GraphNodeTypeDef,
	source: GraphPort
): boolean {
	return (typeDef.inputs ?? []).some((p) => pinsCompatible(source, p));
}

export function firstCompatibleInput(
	node: GraphNode,
	source: GraphPort
): GraphPort | null {
	return (node.inputs ?? []).find((p) => pinsCompatible(source, p)) ?? null;
}

export function edgePathFromPoints(
	from: { x: number; y: number },
	to: { x: number; y: number },
	curvature = 0.45
): string {
	const dx = Math.abs(to.x - from.x);
	const dy = Math.abs(to.y - from.y);
	const offset = Math.max(40, Math.min(dx * curvature, 180));

	if (dx >= dy * 0.4) {
		const c1x = from.x + offset;
		const c2x = to.x - offset;
		return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
	}

	const c1y = from.y + offset;
	const c2y = to.y - offset;
	return `M ${from.x} ${from.y} C ${from.x} ${c1y}, ${to.x} ${c2y}, ${to.x} ${to.y}`;
}

export function pinsCompatible(source: GraphPort, target: GraphPort): boolean {
	const sk = source.kind ?? (source.dataType === 'exec' ? 'exec' : 'data');
	const tk = target.kind ?? (target.dataType === 'exec' ? 'exec' : 'data');
	if (sk !== tk) return false;
	if (sk === 'exec') return true;
	const st = source.dataType ?? 'any';
	const tt = target.dataType ?? 'any';
	if (st === 'any' || tt === 'any') return true;
	return st === tt;
}

export type GraphValidationIssue = {
	id: string;
	level: 'error' | 'warning';
	message: string;
	edgeId?: string;
	nodeId?: string;
};

export function validateGraph(doc: GraphDocument): GraphValidationIssue[] {
	const issues: GraphValidationIssue[] = [];
	for (const edge of doc.edges) {
		const source = doc.nodes.find((n) => n.id === edge.source);
		const target = doc.nodes.find((n) => n.id === edge.target);
		if (!source || !target) {
			issues.push({
				id: `missing-${edge.id}`,
				level: 'error',
				message: `Edge ${edge.id} references missing node`,
				edgeId: edge.id
			});
			continue;
		}
		const out = findPort(source, edge.sourceHandle, 'output');
		const inn = findPort(target, edge.targetHandle, 'input');
		if (!out || !inn) {
			issues.push({
				id: `port-${edge.id}`,
				level: 'error',
				message: `Edge ${edge.id} has invalid handles`,
				edgeId: edge.id
			});
			continue;
		}
		if (!pinsCompatible(out.port, inn.port)) {
			issues.push({
				id: `type-${edge.id}`,
				level: 'error',
				message: `Incompatible pins: ${out.port.dataType ?? out.port.kind} → ${inn.port.dataType ?? inn.port.kind}`,
				edgeId: edge.id
			});
		}
	}
	for (const node of doc.nodes) {
		if (node.type === 'comment' || node.type === 'reroute' || node.type === 'collapsed_graph')
			continue;
		const hasExecOut = (node.outputs ?? []).some(
			(p) => (p.kind ?? p.dataType) === 'exec' || p.dataType === 'exec'
		);
		const hasExecIn = (node.inputs ?? []).some(
			(p) => (p.kind ?? p.dataType) === 'exec' || p.dataType === 'exec'
		);
		// Entry/event nodes with no continuation — not sinks like Print/Delay (Then unused is fine).
		if (hasExecOut && !hasExecIn && !doc.edges.some((e) => e.source === node.id)) {
			issues.push({
				id: `orphan-out-${node.id}`,
				level: 'warning',
				message: `Node "${node.data?.label ?? node.type}" has no outgoing exec wire`,
				nodeId: node.id
			});
		}
		if (hasExecIn && !doc.edges.some((e) => e.target === node.id)) {
			issues.push({
				id: `orphan-in-${node.id}`,
				level: 'warning',
				message: `Node "${node.data?.label ?? node.type}" has no incoming wire`,
				nodeId: node.id
			});
		}
	}
	return issues;
}

export function snap(value: number, grid: number): number {
	if (grid <= 1) return value;
	return Math.round(value / grid) * grid;
}

export function fitView(
	nodes: GraphNode[],
	viewport: { width: number; height: number },
	padding = 48,
	fallbackW = DEFAULT_NODE_WIDTH,
	fallbackH = DEFAULT_NODE_HEIGHT
): { pan: { x: number; y: number }; scale: number } {
	if (!nodes.length) return { pan: { x: 0, y: 0 }, scale: 1 };

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const n of nodes) {
		const { w, h } = nodeSize(n, fallbackW, fallbackH);
		minX = Math.min(minX, n.x);
		minY = Math.min(minY, n.y);
		maxX = Math.max(maxX, n.x + w);
		maxY = Math.max(maxY, n.y + h);
	}

	const bw = maxX - minX || 1;
	const bh = maxY - minY || 1;
	const scale = Math.min(
		2,
		Math.max(
			0.35,
			Math.min((viewport.width - padding * 2) / bw, (viewport.height - padding * 2) / bh)
		)
	);
	return {
		pan: {
			x: (viewport.width - bw * scale) / 2 - minX * scale,
			y: (viewport.height - bh * scale) / 2 - minY * scale
		},
		scale
	};
}

export function groupNodeTypesByCategory(
	types: GraphNodeTypeDef[]
): { category: string; types: GraphNodeTypeDef[] }[] {
	const map = new Map<string, GraphNodeTypeDef[]>();
	for (const t of types) {
		const cat = t.category ?? 'Other';
		if (!map.has(cat)) map.set(cat, []);
		map.get(cat)!.push(t);
	}
	return [...map.entries()].map(([category, list]) => ({ category, types: list }));
}

export function nodeTypeAllowedInContext(
	type: GraphNodeTypeDef,
	context?: GraphNodeContext | null
): boolean {
	if (!context) return true;
	if (!type.contexts?.length) return true;
	return type.contexts.includes(context);
}

/** Palette / place-menu catalog: context + hide templates. */
export function filterNodeTypesForGraph(
	types: GraphNodeTypeDef[],
	opts?: { context?: GraphNodeContext | null; includeHidden?: boolean }
): GraphNodeTypeDef[] {
	return types.filter((t) => {
		if (!opts?.includeHidden && t.hidden) return false;
		return nodeTypeAllowedInContext(t, opts?.context);
	});
}

/** Blueprint document wrapper */
export interface BlueprintVariable {
	id: string;
	name: string;
	dataType: PinDataType;
	defaultValue?: unknown;
}

export function variablePinColor(dataType: PinDataType): string {
	return PIN_TYPE_COLORS[dataType] ?? PIN_TYPE_COLORS.any;
}

export function defaultValueForPinType(dataType: PinDataType): unknown {
	switch (dataType) {
		case 'bool':
			return false;
		case 'int':
			return 0;
		case 'float':
			return 0;
		case 'string':
			return '';
		case 'object':
			return null;
		default:
			return undefined;
	}
}

export function createVarGetNode(
	variable: BlueprintVariable,
	pos: { x: number; y: number }
): GraphNode {
	const color = variablePinColor(variable.dataType);
	const w = Math.max(148, variable.name.length * 8 + 56);
	return {
		id: uid('n'),
		type: 'var_get',
		x: pos.x,
		y: pos.y,
		width: w,
		height: 52,
		data: {
			label: variable.name,
			color,
			variableId: variable.id,
			variableName: variable.name,
			access: 'get'
		},
		inputs: [],
		outputs: [dataPort('value', '', variable.dataType, 'right')]
	};
}

export function createVarSetNode(
	variable: BlueprintVariable,
	pos: { x: number; y: number }
): GraphNode {
	const color = variablePinColor(variable.dataType);
	const w = Math.max(168, variable.name.length * 8 + 72);
	return {
		id: uid('n'),
		type: 'var_set',
		x: pos.x,
		y: pos.y,
		width: w,
		height: 72,
		data: {
			label: `Set ${variable.name}`,
			color,
			variableId: variable.id,
			variableName: variable.name,
			access: 'set'
		},
		inputs: [
			execPort('exec_in', 'Exec', 'left'),
			dataPort('value', variable.name, variable.dataType, 'left')
		],
		outputs: [
			execPort('exec', 'Then', 'right'),
			dataPort('out', '', variable.dataType, 'right')
		]
	};
}

/** Place-menu entries for Get/Set of each blueprint variable. */
export function variablePlaceItems(variables: BlueprintVariable[]): {
	id: string;
	kind: 'get' | 'set';
	variable: BlueprintVariable;
	label: string;
	color: string;
}[] {
	const items: {
		id: string;
		kind: 'get' | 'set';
		variable: BlueprintVariable;
		label: string;
		color: string;
	}[] = [];
	for (const v of variables) {
		const color = variablePinColor(v.dataType);
		items.push({
			id: `get:${v.id}`,
			kind: 'get',
			variable: v,
			label: `Get ${v.name}`,
			color
		});
		items.push({
			id: `set:${v.id}`,
			kind: 'set',
			variable: v,
			label: `Set ${v.name}`,
			color
		});
	}
	return items;
}

export interface BlueprintDocument {
	version: 1;
	name?: string;
	graph: GraphDocument;
	variables?: BlueprintVariable[];
}

export function emptyBlueprintDocument(name = 'New Blueprint'): BlueprintDocument {
	return { version: 1, name, graph: emptyGraphDocument(), variables: [] };
}

/** Data payload carried by xyflow custom blueprint nodes. */
export type BlueprintFlowNodeData = {
	graphType: string;
	label?: string;
	description?: string;
	color?: string;
	commentColor?: string;
	inputs: GraphPort[];
	outputs: GraphPort[];
	width?: number;
	height?: number;
	/** Input handle ids that currently have a wire. */
	_wiredInputs?: string[];
	/** Set a literal on an unwired data input. */
	_onLiteral?: (portId: string, value: unknown) => void;
	[key: string]: unknown;
};

export type BlueprintFlowNode = {
	id: string;
	type: 'blueprint';
	position: { x: number; y: number };
	data: BlueprintFlowNodeData;
	selected?: boolean;
	draggable?: boolean;
	width?: number;
	height?: number;
	zIndex?: number;
	class?: string;
};

export type BlueprintFlowEdge = {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string | null;
	targetHandle?: string | null;
	label?: string;
	selected?: boolean;
	style?: string;
	markerEnd?: {
		type: string;
		width?: number;
		height?: number;
		color?: string;
	};
};

export function toFlowNodes(
	doc: GraphDocument,
	catalog: GraphNodeTypeDef[] = DEFAULT_NODE_TYPES,
	selectedIds: string[] = []
): BlueprintFlowNode[] {
	const selected = new Set(selectedIds);
	// Comments first so they paint under other nodes when z-index ties.
	const ordered = [
		...doc.nodes.filter((n) => n.type === 'comment'),
		...doc.nodes.filter((n) => n.type !== 'comment')
	];
	return ordered.map((n) => {
		const def = resolveNodeType(n.type, catalog);
		const { w, h } = nodeSize(n);
		const isComment = n.type === 'comment';
		return {
			id: n.id,
			type: 'blueprint' as const,
			position: { x: n.x, y: n.y },
			selected: selected.has(n.id),
			width: w,
			height: h,
			zIndex: isComment ? -1 : 1,
			class: isComment ? 'bp-flow-comment' : undefined,
			data: {
				...(n.data ?? {}),
				graphType: n.type,
				label: (n.data?.label as string) ?? def?.label ?? n.type,
				description: n.data?.description as string | undefined,
				color: (n.data?.color as string) ?? def?.color,
				commentColor: n.data?.commentColor as string | undefined,
				memberIds: Array.isArray(n.data?.memberIds)
					? [...(n.data!.memberIds as string[])]
					: undefined,
				inputs: (n.inputs ?? []).map((p) => ({ ...p })),
				outputs: (n.outputs ?? []).map((p) => ({ ...p })),
				width: n.width ?? def?.width,
				height: n.height ?? def?.height
			}
		};
	});
}

export function toFlowEdges(doc: GraphDocument, selectedIds: string[] = []): BlueprintFlowEdge[] {
	const selected = new Set(selectedIds);
	return doc.edges.map((e) => ({
		id: e.id,
		source: e.source,
		target: e.target,
		sourceHandle: e.sourceHandle ?? null,
		targetHandle: e.targetHandle ?? null,
		label: e.label,
		selected: selected.has(e.id)
	}));
}

export function fromFlowNodes(nodes: BlueprintFlowNode[]): GraphNode[] {
	return nodes.map((n) => {
		const {
			graphType,
			inputs,
			outputs,
			width,
			height,
			_alert: _a,
			_wiredInputs: _w,
			_onLiteral: _o,
			...rest
		} = n.data;
		return {
			id: n.id,
			type: graphType,
			x: n.position.x,
			y: n.position.y,
			width: width ?? n.width,
			height: height ?? n.height,
			data: { ...rest },
			inputs: (inputs ?? []).map((p) => ({ ...p })),
			outputs: (outputs ?? []).map((p) => ({ ...p }))
		};
	});
}

export function fromFlowEdges(edges: BlueprintFlowEdge[]): GraphEdge[] {
	return edges.map((e) => ({
		id: e.id,
		source: e.source,
		target: e.target,
		sourceHandle: e.sourceHandle ?? undefined,
		targetHandle: e.targetHandle ?? undefined,
		label: typeof e.label === 'string' ? e.label : undefined
	}));
}

export function flowDocumentFromFlow(
	nodes: BlueprintFlowNode[],
	edges: BlueprintFlowEdge[]
): GraphDocument {
	return {
		version: 1,
		nodes: fromFlowNodes(nodes),
		edges: fromFlowEdges(edges)
	};
}

/** Resolve a port on a flow node by handle id + direction. */
export function flowPortOnNode(
	node: BlueprintFlowNode | undefined,
	handleId: string | null | undefined,
	kind: 'input' | 'output'
): GraphPort | null {
	if (!node) return null;
	const list = kind === 'input' ? node.data.inputs : node.data.outputs;
	if (!list?.length) return null;
	if (!handleId) return list[0] ?? null;
	return list.find((p) => p.id === handleId) ?? null;
}
