/** Query bar tokenization, validation, and suggestion helpers. */

import type { FilterFieldDef } from './advancedFilters.js';

export type QueryTokenKind =
	| 'field'
	| 'operator'
	| 'value'
	| 'keyword'
	| 'text'
	| 'paren'
	| 'error';

export interface QueryToken {
	text: string;
	kind: QueryTokenKind;
}

export interface QueryExample {
	label: string;
	query: string;
	description?: string;
}

export const KEYWORDS = ['AND', 'OR', 'NOT'] as const;
export const OPS = [':', '=', '!=', '>=', '<=', '>', '<', '~'] as const;

export const DEFAULT_QUERY_EXAMPLES: QueryExample[] = [
	{
		label: 'Brand + price',
		query: 'brand:nike AND price>=100',
		description: 'Field filters with boolean AND'
	},
	{
		label: 'Grouped OR',
		query: '(brand:nike OR brand:adidas) AND color:black',
		description: 'Parentheses for precedence'
	},
	{
		label: 'Free text',
		query: 'ultraboost',
		description: 'Plain search terms'
	},
	{
		label: 'Quoted value',
		query: 'name:"Air Zoom"',
		description: 'Values with spaces'
	},
	{
		label: 'Range-ish',
		query: 'price>=50 AND price<=200 AND status:active',
		description: 'Numeric comparisons'
	},
	{
		label: 'Tags',
		query: 'tags:sale AND NOT status:archived',
		description: 'Negation with NOT'
	},
	{
		label: 'Contains',
		query: 'name~boost OR subtitle~cushion',
		description: '~ soft contains match'
	}
];

export function tokenizeQuery(query: string, fieldIds: string[]): QueryToken[] {
	if (!query) return [];
	const tokens: QueryToken[] = [];
	const re =
		/("([^"\\]|\\.)*")|(\bAND\b|\bOR\b|\bNOT\b)|(!=|>=|<=|:|=|>|<|~)|([()])|([A-Za-z_][\w.-]*)|(\S+)/g;
	let match: RegExpExecArray | null;
	while ((match = re.exec(query)) !== null) {
		const text = match[0];
		let kind: QueryTokenKind = 'text';
		if ((KEYWORDS as readonly string[]).includes(text)) kind = 'keyword';
		else if ((OPS as readonly string[]).includes(text)) kind = 'operator';
		else if (text === '(' || text === ')') kind = 'paren';
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

	const quotes = (trimmed.match(/"/g) ?? []).length;
	if (quotes % 2 !== 0) return 'Unclosed quote';

	if (/\(\s*\)/.test(trimmed)) return 'Empty parentheses';
	if (/^\s*(AND|OR)\b/i.test(trimmed)) return 'Query starts with a dangling operator';
	if (/\b(AND|OR)\s*$/i.test(trimmed)) return 'Query ends with a dangling operator';
	if (/\bNOT\s*$/i.test(trimmed)) return 'Query ends with a dangling NOT';
	if (/\b(AND|OR)\s+(AND|OR)\b/i.test(trimmed)) return 'Two operators in a row';
	if (/\(\s*(AND|OR)\b/i.test(trimmed)) return 'Group starts with an operator';
	if (/\b(AND|OR)\s*\)/i.test(trimmed)) return 'Group ends with an operator';
	if (/(:|=|!=|>=|<=|>|<|~)\s*$/.test(trimmed)) return 'Operator is missing a value';
	if (/\b(AND|OR)\s+NOT\s+(AND|OR)\b/i.test(trimmed)) return 'Invalid NOT placement';

	return null;
}

/** Parse trivial `field:value` / `field=value` clauses (no full KQL). */
export function parseSimpleClauses(
	query: string
): { field: string; op: string; value: string }[] {
	const out: { field: string; op: string; value: string }[] = [];
	const re =
		/([A-Za-z_][\w.-]*)\s*(:|=|!=|>=|<=|>|<|~)\s*("([^"\\]|\\.)*"|[^\sANDOR()]+)/g;
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

/** Operators suggested right after typing `field` */
export function operatorSuggestionsForField(field?: FilterFieldDef): string[] {
	if (!field) return [':', '='];
	switch (field.type) {
		case 'number':
		case 'date':
			return [':', '=', '>=', '<=', '>', '<'];
		case 'text':
			return [':', '=', '~'];
		default:
			return [':', '='];
	}
}
