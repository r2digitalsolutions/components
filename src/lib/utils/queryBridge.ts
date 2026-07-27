/**
 * Bridge between QueryBar DSL strings and AdvancedFilterGroup trees.
 */

import {
	emptyFilterGroup,
	emptyFilterRule,
	flattenRules,
	formatRuleLabel,
	type AdvancedFilterGroup,
	type AdvancedFilterRule,
	type FilterFieldDef,
	type FilterOperator
} from './advancedFilters.js';
import { parseSimpleClauses } from './queryBar.js';

const OP_FROM_DSL: Record<string, FilterOperator> = {
	':': 'eq',
	'=': 'eq',
	'!=': 'neq',
	'>': 'gt',
	'>=': 'gte',
	'<': 'lt',
	'<=': 'lte',
	'~': 'contains'
};

const DSL_FROM_OP: Partial<Record<FilterOperator, string>> = {
	eq: ':',
	neq: '!=',
	gt: '>',
	gte: '>=',
	lt: '<',
	lte: '<=',
	contains: '~',
	not_contains: '~',
	starts_with: ':',
	ends_with: ':',
	in: ':',
	nin: '!=',
	between: ':',
	is_empty: ':',
	is_not_empty: ':',
	exists: ':',
	not_exists: ':'
};

function quoteValue(value: string): string {
	if (/[\s()]/.test(value) || value.includes('"')) {
		return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
	}
	return value;
}

function ruleValueToString(rule: AdvancedFilterRule): string {
	const v = rule.value;
	if (v === null || v === undefined) return '';
	if (Array.isArray(v)) return v.join(',');
	return String(v);
}

/** Parse a QueryBar-style string into a flat AND AdvancedFilterGroup. */
export function queryStringToGroup(
	query: string,
	fields: FilterFieldDef[] = []
): AdvancedFilterGroup {
	const group = emptyFilterGroup('and');
	const clauses = parseSimpleClauses(query);
	const fieldIds = new Set(fields.map((f) => f.id));

	for (const c of clauses) {
		if (fields.length && !fieldIds.has(c.field)) continue;
		const op = OP_FROM_DSL[c.op] ?? 'eq';
		const field = fields.find((f) => f.id === c.field);
		let value: AdvancedFilterRule['value'] = c.value;
		if (field?.type === 'number') {
			const n = Number(c.value);
			if (!Number.isNaN(n)) value = n;
		} else if (field?.type === 'boolean') {
			value = c.value === 'true' || c.value === '1';
		}
		const rule = emptyFilterRule(c.field, op);
		rule.value = value;
		group.rules.push(rule);
	}

	return group;
}

/** Serialize flat rules to a QueryBar-ish AND string (ignores nested groups). */
export function groupToQueryString(
	group: AdvancedFilterGroup,
	fields: FilterFieldDef[] = []
): string {
	const rules = flattenRules(group).filter((r) => r.field);
	if (!rules.length) return '';

	return rules
		.map((r) => {
			const dslOp = DSL_FROM_OP[r.op] ?? ':';
			const raw = ruleValueToString(r);
			if (
				r.op === 'is_empty' ||
				r.op === 'is_not_empty' ||
				r.op === 'exists' ||
				r.op === 'not_exists'
			) {
				return `${r.field}${dslOp}${r.op}`;
			}
			return `${r.field}${dslOp}${quoteValue(raw)}`;
		})
		.join(' AND ');
}

/** Active filter chips derived from a group. */
export function groupToFilterItems(
	group: AdvancedFilterGroup,
	fields: FilterFieldDef[] = []
): { id: string; label: string; rule: AdvancedFilterRule }[] {
	return flattenRules(group).map((rule) => ({
		id: rule.id,
		label: formatRuleLabel(rule, fields),
		rule
	}));
}

/** Remove a rule by id from a (possibly nested) group; returns a new tree. */
export function removeRuleFromGroup(
	group: AdvancedFilterGroup,
	ruleId: string
): AdvancedFilterGroup {
	return {
		...group,
		rules: group.rules
			.filter((n) => !(n.type === 'rule' && n.id === ruleId))
			.map((n) => (n.type === 'group' ? removeRuleFromGroup(n, ruleId) : n))
	};
}

/** Replace root rules with a flat AND list (drops nesting). */
export function setFlatRules(
	rules: AdvancedFilterRule[],
	combinator: 'and' | 'or' = 'and'
): AdvancedFilterGroup {
	return {
		id: `g-${Date.now().toString(36)}`,
		type: 'group',
		combinator,
		rules: rules.map((r) => ({ ...r, type: 'rule' as const }))
	};
}
