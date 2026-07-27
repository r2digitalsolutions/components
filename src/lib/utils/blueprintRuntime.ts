/**
 * Lightweight Blueprint graph simulator — follows exec wires, resolves data pins
 * (literals + pure nodes), and emits Print String lines. Not a full UE VM.
 */
import {
	defaultValueForPinType,
	isExecPort,
	type BlueprintDocument,
	type BlueprintVariable,
	type GraphDocument,
	type GraphEdge,
	type GraphNode,
	type GraphPort,
	type PinDataType
} from './nodeGraph.js';

export type BlueprintLogLevel = 'system' | 'print' | 'warn' | 'error';

export interface BlueprintLogEntry {
	id: string;
	level: BlueprintLogLevel;
	text: string;
	nodeId?: string;
	at: number;
}

export interface SimulateBlueprintOptions {
	/** Entry node type (default: event_begin). */
	entryType?: string;
	signal?: AbortSignal;
	onLog?: (entry: BlueprintLogEntry) => void;
	/** Multiplier for Delay durations (1 = real seconds). */
	timeScale?: number;
	/** Cap Delay wait in ms (default 10_000). */
	maxDelayMs?: number;
}

export interface SimulateBlueprintResult {
	logs: BlueprintLogEntry[];
	/** Final variable values after Sets. */
	variables: BlueprintVariable[];
	aborted: boolean;
}

function logId(): string {
	return `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function pushLog(
	logs: BlueprintLogEntry[],
	onLog: ((e: BlueprintLogEntry) => void) | undefined,
	level: BlueprintLogLevel,
	text: string,
	nodeId?: string
): BlueprintLogEntry {
	const entry: BlueprintLogEntry = { id: logId(), level, text, nodeId, at: Date.now() };
	logs.push(entry);
	onLog?.(entry);
	return entry;
}

function throwIfAborted(signal?: AbortSignal) {
	if (signal?.aborted) {
		const err = new Error('aborted');
		err.name = 'AbortError';
		throw err;
	}
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
			return;
		}
		const t = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(t);
			reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
		};
		signal?.addEventListener('abort', onAbort, { once: true });
	});
}

function findPort(node: GraphNode, handle: string | undefined, side: 'input' | 'output') {
	const list = side === 'input' ? (node.inputs ?? []) : (node.outputs ?? []);
	if (!handle) return list[0];
	return list.find((p) => p.id === handle);
}

function outgoing(
	edges: GraphEdge[],
	nodeId: string,
	sourceHandle?: string
): GraphEdge | undefined {
	return edges.find(
		(e) =>
			e.source === nodeId &&
			(sourceHandle == null || e.sourceHandle === sourceHandle || (!e.sourceHandle && !sourceHandle))
	);
}

function incomingDataEdge(
	edges: GraphEdge[],
	nodeId: string,
	targetHandle: string
): GraphEdge | undefined {
	return edges.find((e) => e.target === nodeId && e.targetHandle === targetHandle);
}

function stripLiteralQuotes(raw: string): string {
	const t = raw.trim();
	if (
		(t.startsWith('"') && t.endsWith('"')) ||
		(t.startsWith("'") && t.endsWith("'"))
	) {
		return t.slice(1, -1);
	}
	return t;
}

function coerceBool(v: unknown): boolean {
	if (typeof v === 'boolean') return v;
	if (typeof v === 'number') return v !== 0;
	if (typeof v === 'string') {
		const s = v.trim().toLowerCase();
		if (s === 'true' || s === '1' || s === 'yes') return true;
		if (s === 'false' || s === '0' || s === 'no' || s === '') return false;
		return Boolean(s);
	}
	return Boolean(v);
}

function coerceNumber(v: unknown, fallback = 0): number {
	if (typeof v === 'number' && Number.isFinite(v)) return v;
	if (typeof v === 'string') {
		const n = parseFloat(v);
		return Number.isFinite(n) ? n : fallback;
	}
	return fallback;
}

function coerceString(v: unknown): string {
	if (v == null) return '';
	return String(v);
}

type VarState = Map<string, unknown>;

function initVars(variables: BlueprintVariable[] | undefined): VarState {
	const map: VarState = new Map();
	for (const v of variables ?? []) {
		map.set(
			v.id,
			v.defaultValue !== undefined ? v.defaultValue : defaultValueForPinType(v.dataType)
		);
	}
	return map;
}

function varsToArray(variables: BlueprintVariable[] | undefined, state: VarState): BlueprintVariable[] {
	return (variables ?? []).map((v) => ({
		...v,
		defaultValue: state.has(v.id) ? state.get(v.id) : v.defaultValue
	}));
}

/**
 * Resolve a data output of a (usually pure) node.
 */
function evaluateNodeOutput(
	doc: GraphDocument,
	node: GraphNode,
	outputId: string | undefined,
	vars: VarState,
	stack: Set<string>
): unknown {
	if (stack.has(node.id)) return undefined;
	stack.add(node.id);
	try {
		switch (node.type) {
			case 'var_get': {
				const vid = String(node.data?.variableId ?? '');
				return vars.has(vid) ? vars.get(vid) : undefined;
			}
			case 'make_string': {
				const label = String(node.data?.label ?? '');
				return stripLiteralQuotes(label);
			}
			case 'var_set': {
				const vid = String(node.data?.variableId ?? '');
				return vars.has(vid) ? vars.get(vid) : undefined;
			}
			case 'event_tick': {
				if (outputId === 'delta') return 0.016;
				return undefined;
			}
			default: {
				const out = findPort(node, outputId, 'output');
				if (out && !isExecPort(out) && out.value !== undefined) return out.value;
				return undefined;
			}
		}
	} finally {
		stack.delete(node.id);
	}
}

function resolveInputValue(
	doc: GraphDocument,
	node: GraphNode,
	port: GraphPort,
	vars: VarState,
	stack: Set<string>
): unknown {
	const edge = incomingDataEdge(doc.edges, node.id, port.id);
	if (edge) {
		const src = doc.nodes.find((n) => n.id === edge.source);
		if (!src) return port.value ?? defaultForPort(port);
		return evaluateNodeOutput(doc, src, edge.sourceHandle, vars, stack);
	}
	if (port.value !== undefined) return port.value;
	return defaultForPort(port);
}

function defaultForPort(port: GraphPort): unknown {
	const dt = (port.dataType ?? 'any') as PinDataType;
	return defaultValueForPinType(dt);
}

async function followExec(
	doc: GraphDocument,
	fromNodeId: string,
	fromHandle: string | undefined,
	ctx: {
		vars: VarState;
		logs: BlueprintLogEntry[];
		onLog?: (e: BlueprintLogEntry) => void;
		signal?: AbortSignal;
		timeScale: number;
		maxDelayMs: number;
		variables: BlueprintVariable[] | undefined;
	}
): Promise<void> {
	throwIfAborted(ctx.signal);
	const edge = outgoing(doc.edges, fromNodeId, fromHandle);
	if (!edge) return;
	const node = doc.nodes.find((n) => n.id === edge.target);
	if (!node) return;
	await executeNode(doc, node, ctx);
}

async function executeNode(
	doc: GraphDocument,
	node: GraphNode,
	ctx: {
		vars: VarState;
		logs: BlueprintLogEntry[];
		onLog?: (e: BlueprintLogEntry) => void;
		signal?: AbortSignal;
		timeScale: number;
		maxDelayMs: number;
		variables: BlueprintVariable[] | undefined;
	}
): Promise<void> {
	throwIfAborted(ctx.signal);
	const stack = new Set<string>();
	const label = String(node.data?.label ?? node.type);

	switch (node.type) {
		case 'event_begin':
		case 'event_tick':
		case 'trigger': {
			pushLog(ctx.logs, ctx.onLog, 'system', `→ ${label}`, node.id);
			await followExec(doc, node.id, 'exec', ctx);
			return;
		}
		case 'branch': {
			const condPort = findPort(node, 'condition', 'input');
			const cond = condPort
				? coerceBool(resolveInputValue(doc, node, condPort, ctx.vars, stack))
				: false;
			pushLog(
				ctx.logs,
				ctx.onLog,
				'system',
				`Branch → ${cond ? 'True' : 'False'}`,
				node.id
			);
			await followExec(doc, node.id, cond ? 'true' : 'false', ctx);
			return;
		}
		case 'print_string': {
			const strPort = findPort(node, 'in_string', 'input');
			const durPort = findPort(node, 'duration', 'input');
			const text = strPort
				? coerceString(resolveInputValue(doc, node, strPort, ctx.vars, stack))
				: '';
			const duration = durPort
				? coerceNumber(resolveInputValue(doc, node, durPort, ctx.vars, stack), 2)
				: 2;
			pushLog(
				ctx.logs,
				ctx.onLog,
				'print',
				text.length ? text : '(empty string)',
				node.id
			);
			if (duration > 0) {
				pushLog(
					ctx.logs,
					ctx.onLog,
					'system',
					`Print duration ${duration}s (display only)`,
					node.id
				);
			}
			await followExec(doc, node.id, 'exec', ctx);
			return;
		}
		case 'delay_bp':
		case 'delay': {
			const durPort = findPort(node, 'duration', 'input');
			const seconds = durPort
				? coerceNumber(resolveInputValue(doc, node, durPort, ctx.vars, stack), 0)
				: 0;
			const ms = Math.min(
				ctx.maxDelayMs,
				Math.max(0, seconds * 1000 * ctx.timeScale)
			);
			pushLog(ctx.logs, ctx.onLog, 'system', `Delay ${seconds}s…`, node.id);
			await sleep(ms, ctx.signal);
			throwIfAborted(ctx.signal);
			pushLog(ctx.logs, ctx.onLog, 'system', 'Delay completed', node.id);
			await followExec(doc, node.id, 'completed', ctx);
			return;
		}
		case 'var_set': {
			const vid = String(node.data?.variableId ?? '');
			const valuePort = findPort(node, 'value', 'input');
			const next = valuePort
				? resolveInputValue(doc, node, valuePort, ctx.vars, stack)
				: undefined;
			if (vid) ctx.vars.set(vid, next);
			const name = String(node.data?.variableName ?? vid);
			pushLog(ctx.logs, ctx.onLog, 'system', `Set ${name} = ${String(next)}`, node.id);
			await followExec(doc, node.id, 'exec', ctx);
			return;
		}
		case 'return_node': {
			pushLog(ctx.logs, ctx.onLog, 'system', 'Return', node.id);
			return;
		}
		case 'action':
		case 'construction_add': {
			pushLog(ctx.logs, ctx.onLog, 'system', `Run ${label}`, node.id);
			await followExec(doc, node.id, 'exec', ctx);
			return;
		}
		default: {
			// Generic: if it has an exec out named exec / Then, follow it.
			const execOut =
				(node.outputs ?? []).find((p) => isExecPort(p) && p.id === 'exec') ??
				(node.outputs ?? []).find((p) => isExecPort(p));
			pushLog(ctx.logs, ctx.onLog, 'warn', `Unhandled node type "${node.type}"`, node.id);
			if (execOut) await followExec(doc, node.id, execOut.id, ctx);
		}
	}
}

/**
 * Run the graph from Event BeginPlay (or `entryType`).
 * Print String lines use level `print`; flow uses `system`.
 */
export async function simulateBlueprint(
	doc: BlueprintDocument,
	opts: SimulateBlueprintOptions = {}
): Promise<SimulateBlueprintResult> {
	const logs: BlueprintLogEntry[] = [];
	const vars = initVars(doc.variables);
	const entryType = opts.entryType ?? 'event_begin';
	const timeScale = opts.timeScale ?? 1;
	const maxDelayMs = opts.maxDelayMs ?? 10_000;

	const entry = doc.graph.nodes.find((n) => n.type === entryType);
	if (!entry) {
		pushLog(logs, opts.onLog, 'error', `No entry node of type "${entryType}"`);
		return { logs, variables: varsToArray(doc.variables, vars), aborted: false };
	}

	pushLog(logs, opts.onLog, 'system', '—— Simulate BeginPlay ——');

	try {
		await executeNode(doc.graph, entry, {
			vars,
			logs,
			onLog: opts.onLog,
			signal: opts.signal,
			timeScale,
			maxDelayMs,
			variables: doc.variables
		});
		pushLog(logs, opts.onLog, 'system', '—— Finished ——');
		return { logs, variables: varsToArray(doc.variables, vars), aborted: false };
	} catch (e) {
		const aborted = e instanceof Error && e.name === 'AbortError';
		if (aborted) {
			pushLog(logs, opts.onLog, 'warn', '—— Stopped ——');
		} else {
			pushLog(
				logs,
				opts.onLog,
				'error',
				e instanceof Error ? e.message : 'Simulation failed'
			);
		}
		return { logs, variables: varsToArray(doc.variables, vars), aborted };
	}
}
