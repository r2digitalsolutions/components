/** Advanced filter query tree: operators, value kinds, groups, serialize. */

export type FilterFieldType =
	| 'text'
	| 'number'
	| 'select'
	| 'multiselect'
	| 'date'
	| 'boolean';

export type FilterOperator =
	| 'eq'
	| 'neq'
	| 'in'
	| 'nin'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'contains'
	| 'not_contains'
	| 'starts_with'
	| 'ends_with'
	| 'between'
	| 'is_empty'
	| 'is_not_empty'
	| 'exists'
	| 'not_exists';

export type AdvancedFilterValue =
	| string
	| number
	| boolean
	| string[]
	| [number, number]
	| [string, string]
	| null
	| undefined;

export type FilterValueKind =
	| 'none'
	| 'text'
	| 'number'
	| 'date'
	| 'boolean'
	| 'select'
	| 'multiselect'
	| 'range-number'
	| 'range-date';

export type FilterCombinator = 'and' | 'or';

export interface FilterFieldOption {
	value: string;
	label: string;
}

export interface FilterFieldDef {
	id: string;
	label: string;
	type: FilterFieldType;
	operators?: FilterOperator[];
	options?: FilterFieldOption[];
}

export interface AdvancedFilterRule {
	id: string;
	type: 'rule';
	field: string;
	op: FilterOperator;
	value: AdvancedFilterValue;
}

export interface AdvancedFilterGroup {
	id: string;
	type: 'group';
	combinator: FilterCombinator;
	rules: AdvancedFilterNode[];
}

export type AdvancedFilterNode = AdvancedFilterRule | AdvancedFilterGroup;

/** @deprecated Flat clause — prefer AdvancedFilterRule inside a group */
export type AdvancedFilterClause = {
	id: string;
	field: string;
	op: FilterOperator;
	value: AdvancedFilterValue;
};

export const FILTER_OPERATORS: FilterOperator[] = [
	'eq',
	'neq',
	'in',
	'nin',
	'gt',
	'gte',
	'lt',
	'lte',
	'contains',
	'not_contains',
	'starts_with',
	'ends_with',
	'between',
	'is_empty',
	'is_not_empty',
	'exists',
	'not_exists'
];

export const OP_LABELS: Record<FilterOperator, string> = {
	eq: 'is',
	neq: 'is not',
	in: 'is one of',
	nin: 'is not one of',
	gt: '>',
	gte: '≥',
	lt: '<',
	lte: '≤',
	contains: 'contains',
	not_contains: 'does not contain',
	starts_with: 'starts with',
	ends_with: 'ends with',
	between: 'between',
	is_empty: 'is empty',
	is_not_empty: 'is not empty',
	exists: 'exists',
	not_exists: 'does not exist'
};

export const DEFAULT_OPS: Record<FilterFieldType, FilterOperator[]> = {
	text: ['eq', 'neq', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
	number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'is_empty', 'is_not_empty'],
	select: ['eq', 'neq', 'in', 'nin', 'is_empty', 'is_not_empty'],
	multiselect: ['in', 'nin', 'is_empty', 'is_not_empty'],
	date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'is_empty', 'is_not_empty'],
	boolean: ['eq', 'exists', 'not_exists']
};

const NO_VALUE_OPS: FilterOperator[] = [
	'is_empty',
	'is_not_empty',
	'exists',
	'not_exists'
];

export function isFilterOperator(v: string): v is FilterOperator {
	return (FILTER_OPERATORS as string[]).includes(v);
}

export function operatorsForField(field: FilterFieldDef): FilterOperator[] {
	return field.operators ?? DEFAULT_OPS[field.type] ?? ['eq'];
}

export function resolveValueKind(field: FilterFieldDef, op: FilterOperator): FilterValueKind {
	if (NO_VALUE_OPS.includes(op)) return 'none';

	if (op === 'between') {
		return field.type === 'date' ? 'range-date' : 'range-number';
	}

	if (op === 'in' || op === 'nin') {
		if (field.options?.length) return 'multiselect';
		return 'text';
	}

	switch (field.type) {
		case 'number':
			return 'number';
		case 'date':
			return 'date';
		case 'boolean':
			return 'boolean';
		case 'select':
			return field.options?.length ? 'select' : 'text';
		case 'multiselect':
			return field.options?.length ? 'multiselect' : 'text';
		default:
			return 'text';
	}
}

export function emptyFilterGroup(combinator: FilterCombinator = 'and'): AdvancedFilterGroup {
	return {
		id: uid('g'),
		type: 'group',
		combinator,
		rules: []
	};
}

export function emptyFilterRule(fieldId = '', op: FilterOperator = 'eq'): AdvancedFilterRule {
	return {
		id: uid('r'),
		type: 'rule',
		field: fieldId,
		op,
		value: null
	};
}

function uid(prefix: string): string {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isGroup(node: AdvancedFilterNode): node is AdvancedFilterGroup {
	return node.type === 'group';
}

export function isRule(node: AdvancedFilterNode): node is AdvancedFilterRule {
	return node.type === 'rule';
}

/** Flatten rules (ignore group structure) — useful for chips / legacy. */
export function flattenRules(node: AdvancedFilterNode): AdvancedFilterRule[] {
	if (isRule(node)) return [node];
	return node.rules.flatMap(flattenRules);
}

export function countRules(node: AdvancedFilterNode): number {
	return flattenRules(node).length;
}

/** Convert legacy flat clauses → root AND group */
export function clausesToGroup(clauses: AdvancedFilterClause[]): AdvancedFilterGroup {
	return {
		id: uid('g'),
		type: 'group',
		combinator: 'and',
		rules: clauses.map((c) => ({
			id: c.id,
			type: 'rule' as const,
			field: c.field,
			op: c.op,
			value: c.value
		}))
	};
}

export function groupToClauses(group: AdvancedFilterGroup): AdvancedFilterClause[] {
	return flattenRules(group).map((r) => ({
		id: r.id,
		field: r.field,
		op: r.op,
		value: r.value
	}));
}

export function formatRuleLabel(
	rule: AdvancedFilterRule,
	fields: FilterFieldDef[] = []
): string {
	const field = fields.find((f) => f.id === rule.field);
	const name = field?.label ?? rule.field;
	const op = OP_LABELS[rule.op] ?? rule.op;
	if (NO_VALUE_OPS.includes(rule.op)) return `${name} ${op}`;
	const val = formatValue(rule.value, rule.op);
	return `${name} ${op} ${val}`;
}

function formatValue(value: AdvancedFilterValue, op: FilterOperator): string {
	if (value === null || value === undefined) return '…';
	if (Array.isArray(value)) {
		return value.join(op === 'between' ? ' – ' : ', ');
	}
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	return String(value);
}

export function encodeFilterValue(value: AdvancedFilterValue): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'boolean') return value ? '1' : '0';
	if (Array.isArray(value)) {
		if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
			return `${value[0]}~${value[1]}`;
		}
		if (value.length === 2 && typeof value[0] === 'string' && typeof value[1] === 'string') {
			return `${encodeURIComponent(value[0])}~${encodeURIComponent(value[1])}`;
		}
		return (value as string[]).map(encodeURIComponent).join(',');
	}
	return encodeURIComponent(String(value));
}

export function decodeFilterValue(op: FilterOperator, raw: string): AdvancedFilterValue {
	if (!raw && NO_VALUE_OPS.includes(op)) return null;
	if (op === 'between') {
		const [a, b] = raw.split('~');
		const n1 = Number(a);
		const n2 = Number(b);
		if (!Number.isNaN(n1) && !Number.isNaN(n2) && a !== '' && !Number.isNaN(Number(a))) {
			return [n1, n2];
		}
		return [decodeURIComponent(a ?? ''), decodeURIComponent(b ?? '')];
	}
	if (op === 'in' || op === 'nin') {
		if (!raw) return [];
		return raw.split(',').map((v) => decodeURIComponent(v));
	}
	if (raw === '1' || raw === '0') {
		// boolean-ish; callers may coerce
	}
	return decodeURIComponent(raw);
}

/**
 * Serialize group tree.
 * Flat AND of rules → legacy `field:op:value;field:op:value`
 * Nested → `and(rule,or(rule,rule),rule)`
 */
export function serializeAdvancedGroup(group: AdvancedFilterGroup): string | null {
	if (!countRules(group)) return null;
	if (canUseLegacyFlat(group)) {
		return group.rules
			.filter(isRule)
			.map((r) => serializeRule(r))
			.join(';');
	}
	return serializeNode(group);
}

function canUseLegacyFlat(group: AdvancedFilterGroup): boolean {
	return group.combinator === 'and' && group.rules.every(isRule);
}

function serializeRule(rule: AdvancedFilterRule): string {
	if (NO_VALUE_OPS.includes(rule.op)) return `${rule.field}:${rule.op}:`;
	return `${rule.field}:${rule.op}:${encodeFilterValue(rule.value)}`;
}

function serializeNode(node: AdvancedFilterNode): string {
	if (isRule(node)) return serializeRule(node);
	const inner = node.rules.map(serializeNode).join(',');
	return `${node.combinator}(${inner})`;
}

/** Parse `a` param — supports legacy `;` and nested `and(...)` / `or(...)`. */
export function parseAdvancedGroup(raw: string | null): AdvancedFilterGroup {
	if (!raw?.trim()) return emptyFilterGroup();
	const trimmed = raw.trim();
	if (/^(and|or)\(/i.test(trimmed)) {
		const node = parseNode(trimmed);
		if (node && isGroup(node)) return node;
		return { ...emptyFilterGroup(), rules: node ? [node] : [] };
	}
	// legacy flat
	const rules = trimmed
		.split(';')
		.map((part) => part.trim())
		.filter(Boolean)
		.map(parseRuleToken)
		.filter((r): r is AdvancedFilterRule => r !== null);
	return { id: uid('g'), type: 'group', combinator: 'and', rules };
}

function parseRuleToken(part: string): AdvancedFilterRule | null {
	const [field, op, ...rest] = part.split(':');
	const valueRaw = rest.join(':');
	if (!field || !op || !isFilterOperator(op)) return null;
	return {
		id: uid('r'),
		type: 'rule',
		field,
		op,
		value: decodeFilterValue(op, valueRaw)
	};
}

function parseNode(input: string): AdvancedFilterNode | null {
	const s = input.trim();
	const groupMatch = /^(and|or)\((.*)\)$/is.exec(s);
	if (groupMatch) {
		const combinator = groupMatch[1].toLowerCase() as FilterCombinator;
		const inner = groupMatch[2];
		const parts = splitTopLevel(inner);
		return {
			id: uid('g'),
			type: 'group',
			combinator,
			rules: parts.map(parseNode).filter((n): n is AdvancedFilterNode => n !== null)
		};
	}
	return parseRuleToken(s);
}

/** Split by commas not inside parentheses */
function splitTopLevel(input: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let current = '';
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch === '(') depth++;
		if (ch === ')') depth--;
		if (ch === ',' && depth === 0) {
			if (current.trim()) parts.push(current.trim());
			current = '';
			continue;
		}
		current += ch;
	}
	if (current.trim()) parts.push(current.trim());
	return parts;
}

export function matchRuleValue(
	raw: string | number | string[] | boolean | undefined | null,
	op: FilterOperator,
	value: AdvancedFilterValue
): boolean {
	if (op === 'exists') return raw !== undefined && raw !== null && raw !== '';
	if (op === 'not_exists') return raw === undefined || raw === null || raw === '';
	if (op === 'is_empty') {
		if (Array.isArray(raw)) return raw.length === 0;
		return raw === undefined || raw === null || raw === '';
	}
	if (op === 'is_not_empty') {
		if (Array.isArray(raw)) return raw.length > 0;
		return !(raw === undefined || raw === null || raw === '');
	}

	if (op === 'between' && Array.isArray(value) && value.length === 2) {
		if (typeof value[0] === 'number' && typeof value[1] === 'number') {
			const n = Number(raw);
			return n >= value[0] && n <= value[1];
		}
		const left = String(raw ?? '');
		return left >= String(value[0]) && left <= String(value[1]);
	}

	if ((op === 'in' || op === 'nin') && Array.isArray(value)) {
		const list = value.map(String);
		let hit: boolean;
		if (Array.isArray(raw)) hit = raw.some((v) => list.includes(String(v)));
		else hit = list.includes(String(raw));
		return op === 'in' ? hit : !hit;
	}

	const left = String(raw ?? '').toLowerCase();
	const right = String(value ?? '').toLowerCase();

	if (op === 'eq') {
		if (typeof value === 'boolean' || typeof raw === 'boolean') {
			return Boolean(raw) === (value === true || value === '1' || value === 'true');
		}
		return left === right;
	}
	if (op === 'neq') return left !== right;
	if (op === 'contains') return left.includes(right);
	if (op === 'not_contains') return !left.includes(right);
	if (op === 'starts_with') return left.startsWith(right);
	if (op === 'ends_with') return left.endsWith(right);

	const ln = Number(raw);
	const rn = Number(value);
	if (op === 'gt') return ln > rn;
	if (op === 'gte') return ln >= rn;
	if (op === 'lt') return ln < rn;
	if (op === 'lte') return ln <= rn;
	return true;
}

export function matchGroup(
	group: AdvancedFilterGroup,
	getField: (fieldId: string) => string | number | string[] | boolean | undefined | null
): boolean {
	if (!group.rules.length) return true;
	const results = group.rules.map((node) => {
		if (isGroup(node)) return matchGroup(node, getField);
		return matchRuleValue(getField(node.field), node.op, node.value);
	});
	return group.combinator === 'and' ? results.every(Boolean) : results.some(Boolean);
}

/** Normalize CatalogFilterState.advanced which may be clauses[] or a group */
export function asFilterGroup(
	advanced: AdvancedFilterGroup | AdvancedFilterClause[] | undefined
): AdvancedFilterGroup {
	if (!advanced) return emptyFilterGroup();
	if (Array.isArray(advanced)) return clausesToGroup(advanced);
	if (advanced.type === 'group') return advanced;
	return emptyFilterGroup();
}
