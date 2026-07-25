import type { FilterValues } from './filterSchema.js';
import { parseFilterValues, serializeFilterValues } from './filterSchema.js';
import {
	asFilterGroup,
	emptyFilterGroup,
	parseAdvancedGroup,
	serializeAdvancedGroup,
	type AdvancedFilterClause,
	type AdvancedFilterGroup,
	type AdvancedFilterValue,
	type FilterOperator
} from './advancedFilters.js';

export type {
	AdvancedFilterClause,
	AdvancedFilterGroup,
	AdvancedFilterNode,
	AdvancedFilterRule,
	AdvancedFilterValue,
	FilterCombinator,
	FilterFieldDef,
	FilterFieldOption,
	FilterFieldType,
	FilterOperator,
	FilterValueKind
} from './advancedFilters.js';

export {
	OP_LABELS,
	DEFAULT_OPS,
	FILTER_OPERATORS,
	clausesToGroup,
	groupToClauses,
	emptyFilterGroup,
	emptyFilterRule,
	flattenRules,
	countRules,
	matchGroup,
	matchRuleValue,
	resolveValueKind,
	operatorsForField,
	formatRuleLabel,
	asFilterGroup
} from './advancedFilters.js';

/** Serializable catalog / ecommerce filter state (UI + URL). */

export interface CatalogPriceRange {
	min?: number;
	max?: number;
}

export interface CatalogFilterState {
	q: string;
	/** @deprecated Prefer `values` (schema-driven bag) */
	facets: Record<string, string[]>;
	/** Advanced query tree (AND/OR groups + rules) */
	advanced: AdvancedFilterGroup | AdvancedFilterClause[];
	sort?: string;
	page?: number;
	/** @deprecated Prefer `values.price` as [min,max] */
	price?: CatalogPriceRange;
	/** Preferred: one bag for all filter fields */
	values?: FilterValues;
}

export const EMPTY_FILTER_STATE: CatalogFilterState = {
	q: '',
	facets: {},
	advanced: emptyFilterGroup(),
	values: {}
};

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
	const price = parsePrice(params.get('price'));
	const fromFacets: FilterValues = Object.fromEntries(
		Object.entries(facets).map(([k, v]) => [k, v])
	);
	if (price?.min !== undefined || price?.max !== undefined) {
		fromFacets.price = [price?.min ?? 0, price?.max ?? 0];
	}

	return {
		q: params.get('q') ?? '',
		facets,
		advanced: parseAdvancedGroup(params.get('a')),
		sort: params.get('sort') || undefined,
		page: page !== undefined && !Number.isNaN(page) && page > 0 ? page : undefined,
		price,
		values: { ...fromFacets, ...parseFilterValues(params) }
	};
}

/** Serialize catalog filter state to URLSearchParams (omit empty keys). */
export function serializeFilterParams(state: CatalogFilterState): URLSearchParams {
	const params = new URLSearchParams();

	if (state.q.trim()) params.set('q', state.q.trim());

	const advanced = serializeAdvancedGroup(asFilterGroup(state.advanced));
	if (advanced) params.set('a', advanced);

	if (state.sort) params.set('sort', state.sort);
	if (state.page !== undefined && state.page > 1) params.set('page', String(state.page));

	const hasValues =
		state.values &&
		Object.values(state.values).some(
			(v) =>
				v !== undefined &&
				v !== null &&
				v !== false &&
				v !== '' &&
				!(Array.isArray(v) && v.length === 0)
		);

	if (hasValues && state.values) {
		const vParams = serializeFilterValues(state.values);
		for (const [k, v] of vParams.entries()) params.set(k, v);
	} else {
		for (const [facetId, values] of Object.entries(state.facets)) {
			if (!values?.length) continue;
			params.set(`f.${facetId}`, values.map(encodeURIComponent).join(','));
		}
		const price = serializePrice(state.price);
		if (price) params.set('price', price);
	}

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
		advanced: asFilterGroup(partial?.advanced),
		sort: partial?.sort,
		page: partial?.page,
		price: partial?.price ? { ...partial.price } : undefined,
		values: { ...(partial?.values ?? {}) }
	};
}
