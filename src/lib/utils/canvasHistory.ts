import type { CanvasDocument } from './canvasDocument.js';

const HISTORY_LIMIT = 80;

export function serializeCanvasDoc(doc: CanvasDocument): string {
	return JSON.stringify(doc);
}

export function parseCanvasDoc(raw: string): CanvasDocument {
	return JSON.parse(raw) as CanvasDocument;
}

export type CanvasHistoryState = {
	past: string[];
	future: string[];
	last: string;
};

export function createCanvasHistory(doc: CanvasDocument): CanvasHistoryState {
	const last = serializeCanvasDoc(doc);
	return { past: [], future: [], last };
}

/** Push current `last` to past when document changes (skips no-ops). */
export function pushCanvasHistory(
	state: CanvasHistoryState,
	nextDoc: CanvasDocument
): CanvasHistoryState {
	const next = serializeCanvasDoc(nextDoc);
	if (next === state.last) return state;
	return {
		past: [...state.past, state.last].slice(-HISTORY_LIMIT),
		future: [],
		last: next
	};
}

export function undoCanvasHistory(
	state: CanvasHistoryState
): { state: CanvasHistoryState; doc: CanvasDocument } | null {
	if (!state.past.length) return null;
	const prev = state.past[state.past.length - 1];
	return {
		state: {
			past: state.past.slice(0, -1),
			future: [state.last, ...state.future].slice(0, HISTORY_LIMIT),
			last: prev
		},
		doc: parseCanvasDoc(prev)
	};
}

export function redoCanvasHistory(
	state: CanvasHistoryState
): { state: CanvasHistoryState; doc: CanvasDocument } | null {
	if (!state.future.length) return null;
	const next = state.future[0];
	return {
		state: {
			past: [...state.past, state.last].slice(-HISTORY_LIMIT),
			future: state.future.slice(1),
			last: next
		},
		doc: parseCanvasDoc(next)
	};
}
