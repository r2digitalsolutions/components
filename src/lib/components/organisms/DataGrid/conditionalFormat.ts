import type {
	ConditionalFormatRule,
	ConditionalFormatStyle,
	FormatCondition
} from './types.js';

function getPathValue(row: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce<unknown>((acc, part) => {
		if (acc && typeof acc === 'object' && part in (acc as object)) {
			return (acc as Record<string, unknown>)[part];
		}
		return undefined;
	}, row);
}

function toNumber(value: unknown): number | null {
	if (typeof value === 'number' && !Number.isNaN(value)) return value;
	if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
		return Number(value);
	}
	return null;
}

export function evaluateCondition(
	row: Record<string, unknown>,
	when: FormatCondition
): boolean {
	const raw = getPathValue(row, when.columnId);

	switch (when.op) {
		case 'empty':
			return raw == null || raw === '';
		case 'notEmpty':
			return raw != null && raw !== '';
		case 'eq':
			return raw === when.value || String(raw) === String(when.value);
		case 'neq':
			return raw !== when.value && String(raw) !== String(when.value);
		case 'contains':
			return String(raw ?? '')
				.toLowerCase()
				.includes(String(when.value).toLowerCase());
		case 'startsWith':
			return String(raw ?? '')
				.toLowerCase()
				.startsWith(String(when.value).toLowerCase());
		case 'gt':
		case 'gte':
		case 'lt':
		case 'lte': {
			const n = toNumber(raw);
			const v = toNumber(when.value);
			if (n == null || v == null) return false;
			if (when.op === 'gt') return n > v;
			if (when.op === 'gte') return n >= v;
			if (when.op === 'lt') return n < v;
			return n <= v;
		}
		case 'between': {
			const n = toNumber(raw);
			if (n == null) return false;
			return n >= when.min && n <= when.max;
		}
		default:
			return false;
	}
}

export function styleToCss(style: ConditionalFormatStyle): string {
	const parts: string[] = [];
	if (style.background) parts.push(`background-color:${style.background}`);
	if (style.color) parts.push(`color:${style.color}`);
	if (style.fontWeight) parts.push(`font-weight:${style.fontWeight}`);
	if (style.border) parts.push(`box-shadow:inset 0 0 0 1px ${style.border}`);
	return parts.join(';');
}

/**
 * Returns merged styles for a row and per-column cell overrides.
 * Higher priority wins; among equals, later rules win.
 */
export function evaluateFormatRules(
	row: Record<string, unknown>,
	rules: ConditionalFormatRule[]
): { rowStyle: ConditionalFormatStyle; cellStyles: Record<string, ConditionalFormatStyle> } {
	const enabled = [...rules]
		.filter((r) => r.enabled)
		.sort((a, b) => a.priority - b.priority);

	let rowStyle: ConditionalFormatStyle = {};
	const cellStyles: Record<string, ConditionalFormatStyle> = {};

	for (const rule of enabled) {
		if (!evaluateCondition(row, rule.when)) continue;
		if (rule.target === 'row') {
			rowStyle = { ...rowStyle, ...rule.style };
		} else if (rule.columnId) {
			cellStyles[rule.columnId] = {
				...(cellStyles[rule.columnId] ?? {}),
				...rule.style
			};
		}
	}

	return { rowStyle, cellStyles };
}
