import type { FilterFieldDef } from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';

export type QueryTokenKind = 'field' | 'operator' | 'value' | 'keyword' | 'text' | 'error';

export interface QueryToken {
	text: string;
	kind: QueryTokenKind;
}

const KEYWORDS = ['AND', 'OR', 'NOT'];
const OPS = [':', '=', '>', '<', '>=', '<='];

export function tokenizeQuery(query: string, fieldIds: string[]): QueryToken[] {
	if (!query) return [];
	const tokens: QueryToken[] = [];
	const re =
		/("([^"\\]|\\.)*")|(\bAND\b|\bOR\b|\bNOT\b)|(>=|<=|:|=|>|<)|([A-Za-z_][\w.-]*)|(\S+)/g;
	let match: RegExpExecArray | null;
	while ((match = re.exec(query)) !== null) {
		const text = match[0];
		let kind: QueryTokenKind = 'text';
		if (KEYWORDS.includes(text)) kind = 'keyword';
		else if (OPS.includes(text)) kind = 'operator';
		else if (text.startsWith('"')) kind = 'value';
		else if (fieldIds.includes(text)) kind = 'field';
		else if (/^[\w.-]+$/.test(text) && query[match.index + text.length] === ':') kind = 'field';
		else if (/^[\w.*-]+$/.test(text)) kind = 'value';
		tokens.push({ text, kind });
	}
	return tokens;
}

export function validateQuery(query: string): string | null {
	const trimmed = query.trim();
	if (!trimmed) return null;
	const openParens = (trimmed.match(/\(/g) ?? []).length;
	const closeParens = (trimmed.match(/\)/g) ?? []).length;
	if (openParens !== closeParens) return 'Unbalanced parentheses';
	if (/\b(AND|OR)\s*$/i.test(trimmed)) return 'Query ends with a dangling operator';
	if (/^\s*(AND|OR)\b/i.test(trimmed)) return 'Query starts with a dangling operator';
	return null;
}

/** Parse trivial `field:value` / `field=value` clauses (no full KQL). */
export function parseSimpleClauses(
	query: string
): { field: string; op: string; value: string }[] {
	const out: { field: string; op: string; value: string }[] = [];
	const re = /([A-Za-z_][\w.-]*)\s*(:|=|>=|<=|>|<)\s*("([^"\\]|\\.)*"|[^\sANDOR()]+)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(query)) !== null) {
		const value = m[3].startsWith('"') ? m[3].slice(1, -1) : m[3];
		out.push({ field: m[1], op: m[2], value });
	}
	return out;
}

export function fieldIdsFromDefs(fields: FilterFieldDef[]): string[] {
	return fields.map((f) => f.id);
}

export { KEYWORDS, OPS };
