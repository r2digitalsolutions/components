/** Serializable catalog / ecommerce filter state (UI + URL). */

export type FilterOperator =
	| 'eq'
	| 'neq'
	| 'in'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'contains'
	| 'between';

export type AdvancedFilterValue = string | string[] | [number, number];

export interface AdvancedFilterClause {
	id: string;
	field: string;
	op: FilterOperator;
	value: AdvancedFilterValue;
}

export interface CatalogPriceRange {
	min?: number;
	max?: number;
}

export interface CatalogFilterState {
	q: string;
	facets: Record<string, string[]>;
	advanced: AdvancedFilterClause[];
	sort?: string;
	page?: number;
	price?: CatalogPriceRange;
}

export const EMPTY_FILTER_STATE: CatalogFilterState = {
	q: '',
	facets: {},
	advanced: []
};

const OPS: FilterOperator[] = [
	'eq',
	'neq',
	'in',
	'gt',
	'gte',
	'lt',
	'lte',
	'contains',
	'between'
];

function isOp(v: string): v is FilterOperator {
	return (OPS as string[]).includes(v);
}

function encodeValue(value: AdvancedFilterValue): string {
	if (Array.isArray(value)) {
		if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
			return `${value[0]}~${value[1]}`;
		}
		return (value as string[]).map(encodeURIComponent).join(',');
	}
	return encodeURIComponent(String(value));
}

function decodeValue(op: FilterOperator, raw: string): AdvancedFilterValue {
	if (op === 'between') {
		const [a, b] = raw.split('~');
		const min = Number(a);
		const max = Number(b);
		if (!Number.isNaN(min) && !Number.isNaN(max)) return [min, max];
		return [0, 0];
	}
	if (op === 'in') {
		if (!raw) return [];
		return raw.split(',').map((v) => decodeURIComponent(v));
	}
	return decodeURIComponent(raw);
}

function parseAdvanced(raw: string | null): AdvancedFilterClause[] {
	if (!raw?.trim()) return [];
	return raw
		.split(';')
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part, index) => {
			const [field, op, ...rest] = part.split(':');
			const valueRaw = rest.join(':');
			if (!field || !op || !isOp(op)) return null;
			return {
				id: `a-${index}-${field}-${op}`,
				field,
				op,
				value: decodeValue(op, valueRaw)
			} satisfies AdvancedFilterClause;
		})
		.filter((c): c is AdvancedFilterClause => c !== null);
}

function serializeAdvanced(clauses: AdvancedFilterClause[]): string | null {
	if (!clauses.length) return null;
	return clauses.map((c) => `${c.field}:${c.op}:${encodeValue(c.value)}`).join(';');
}

function parsePrice(raw: string | null): CatalogPriceRange | undefined {
	if (!raw?.trim()) return undefined;
	const [minRaw, maxRaw] = raw.split('-');
	const min = minRaw === '' || minRaw === undefined ? undefined : Number(minRaw);
	const max = maxRaw === '' || maxRaw === undefined ? undefined : Number(maxRaw);
	const range: CatalogPriceRange = {};
	if (min !== undefined && !Number.isNaN(min)) range.min = min;
	if (max !== undefined && !Number.isNaN(max)) range.max = max;
	return range.min !== undefined || range.max !== undefined ? range : undefined;
}

function serializePrice(price?: CatalogPriceRange): string | null {
	if (!price || (price.min === undefined && price.max === undefined)) return null;
	const min = price.min ?? '';
	const max = price.max ?? '';
	return `${min}-${max}`;
}

/** Parse catalog filter state from a query string or URLSearchParams. */
export function parseFilterParams(search: string | URLSearchParams): CatalogFilterState {
	const params =
		typeof search === 'string'
			? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
			: search;

	const facets: Record<string, string[]> = {};
	for (const [key, value] of params.entries()) {
		if (!key.startsWith('f.') || !value) continue;
		const facetId = key.slice(2);
		facets[facetId] = value
			.split(',')
			.map((v) => decodeURIComponent(v.trim()))
			.filter(Boolean);
	}

	const pageRaw = params.get('page');
	const page = pageRaw ? Number(pageRaw) : undefined;

	return {
		q: params.get('q') ?? '',
		facets,
		advanced: parseAdvanced(params.get('a')),
		sort: params.get('sort') || undefined,
		page: page !== undefined && !Number.isNaN(page) && page > 0 ? page : undefined,
		price: parsePrice(params.get('price'))
	};
}

/** Serialize catalog filter state to URLSearchParams (omit empty keys). */
export function serializeFilterParams(state: CatalogFilterState): URLSearchParams {
	const params = new URLSearchParams();

	if (state.q.trim()) params.set('q', state.q.trim());

	for (const [facetId, values] of Object.entries(state.facets)) {
		if (!values?.length) continue;
		params.set(`f.${facetId}`, values.map(encodeURIComponent).join(','));
	}

	const advanced = serializeAdvanced(state.advanced);
	if (advanced) params.set('a', advanced);

	if (state.sort) params.set('sort', state.sort);
	if (state.page !== undefined && state.page > 1) params.set('page', String(state.page));

	const price = serializePrice(state.price);
	if (price) params.set('price', price);

	return params;
}

/** Convenience: state → `?q=...&f.brand=...` string (empty string when no params). */
export function filterParamsToSearch(state: CatalogFilterState): string {
	const params = serializeFilterParams(state);
	const s = params.toString();
	return s ? `?${s}` : '';
}

export function createEmptyFilterState(
	partial?: Partial<CatalogFilterState>
): CatalogFilterState {
	return {
		q: partial?.q ?? '',
		facets: { ...(partial?.facets ?? {}) },
		advanced: [...(partial?.advanced ?? [])],
		sort: partial?.sort,
		page: partial?.page,
		price: partial?.price ? { ...partial.price } : undefined
	};
}
