/** Schema-driven filter builder types & helpers. */

export type FilterControlType =
	| 'checkbox'
	| 'radio'
	| 'range'
	| 'toggle'
	| 'rating'
	| 'select';

export interface FilterOption {
	id: string;
	label: string;
	count?: number;
	disabled?: boolean;
}

export interface FilterFieldSchema {
	id: string;
	label: string;
	type: FilterControlType;
	/** Optional section / category heading for grouping fields */
	category?: string;
	options?: FilterOption[];
	/** range */
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	/** checkbox default true; ignored for radio */
	multiple?: boolean;
	/** show-more limit for option lists */
	limit?: number;
	/** rating max stars */
	maxRating?: number;
}

export type FilterValue =
	| string
	| string[]
	| number
	| boolean
	| [number, number]
	| undefined;

/** Single bag of values keyed by field id — one bind for everything. */
export type FilterValues = Record<string, FilterValue>;

export interface FilterCategoryGroup {
	category: string | null;
	fields: FilterFieldSchema[];
}

export function emptyFilterValues(schema: FilterFieldSchema[] = []): FilterValues {
	const values: FilterValues = {};
	for (const field of schema) {
		if (field.type === 'checkbox' || (field.type === 'select' && field.multiple !== false)) {
			values[field.id] = [];
		} else if (field.type === 'radio' || field.type === 'select') {
			values[field.id] = undefined;
		} else if (field.type === 'range') {
			values[field.id] = undefined;
		} else if (field.type === 'toggle') {
			values[field.id] = false;
		} else if (field.type === 'rating') {
			values[field.id] = undefined;
		}
	}
	return values;
}

export function groupFilterSchema(schema: FilterFieldSchema[]): FilterCategoryGroup[] {
	const map = new Map<string | null, FilterFieldSchema[]>();
	for (const field of schema) {
		const key = field.category?.trim() || null;
		const list = map.get(key) ?? [];
		list.push(field);
		map.set(key, list);
	}
	return [...map.entries()].map(([category, fields]) => ({ category, fields }));
}

export function isFilterValueActive(field: FilterFieldSchema, value: FilterValue): boolean {
	if (value === undefined || value === null || value === false || value === '') return false;
	if (Array.isArray(value)) {
		if (value.length === 0) return false;
		if (
			field.type === 'range' &&
			value.length === 2 &&
			typeof value[0] === 'number' &&
			typeof value[1] === 'number'
		) {
			const min = field.min ?? 0;
			const max = field.max ?? 100;
			return value[0] > min || value[1] < max;
		}
		return true;
	}
	return true;
}

export function countActiveFilters(schema: FilterFieldSchema[], values: FilterValues): number {
	return schema.reduce(
		(n, field) => n + (isFilterValueActive(field, values[field.id]) ? 1 : 0),
		0
	);
}

export function clearFilterValues(
	schema: FilterFieldSchema[],
	values: FilterValues = {}
): FilterValues {
	const next = { ...values };
	for (const field of schema) {
		if (field.type === 'checkbox' || (field.type === 'select' && field.multiple !== false)) {
			next[field.id] = [];
		} else if (field.type === 'toggle') {
			next[field.id] = false;
		} else {
			next[field.id] = undefined;
		}
	}
	return next;
}

/** Build schema from a plain JSON-like config (runtime-safe-ish). */
export function parseFilterSchema(input: unknown): FilterFieldSchema[] {
	if (!Array.isArray(input)) return [];
	return input
		.map((raw) => {
			if (!raw || typeof raw !== 'object') return null;
			const o = raw as Record<string, unknown>;
			if (typeof o.id !== 'string' || typeof o.label !== 'string' || typeof o.type !== 'string') {
				return null;
			}
			const type = o.type as FilterControlType;
			const field: FilterFieldSchema = {
				id: o.id,
				label: o.label,
				type,
				category: typeof o.category === 'string' ? o.category : undefined,
				min: typeof o.min === 'number' ? o.min : undefined,
				max: typeof o.max === 'number' ? o.max : undefined,
				step: typeof o.step === 'number' ? o.step : undefined,
				unit: typeof o.unit === 'string' ? o.unit : undefined,
				multiple: typeof o.multiple === 'boolean' ? o.multiple : undefined,
				limit: typeof o.limit === 'number' ? o.limit : undefined,
				maxRating: typeof o.maxRating === 'number' ? o.maxRating : undefined
			};
			if (Array.isArray(o.options)) {
				const options: FilterOption[] = [];
				for (const opt of o.options) {
					if (!opt || typeof opt !== 'object') continue;
					const x = opt as Record<string, unknown>;
					const id = typeof x.id === 'string' ? x.id : typeof x.value === 'string' ? x.value : null;
					const label = typeof x.label === 'string' ? x.label : id;
					if (!id || !label) continue;
					options.push({
						id,
						label,
						count: typeof x.count === 'number' ? x.count : undefined,
						disabled: Boolean(x.disabled)
					});
				}
				field.options = options;
			}
			return field;
		})
		.filter((f): f is FilterFieldSchema => f !== null);
}

/** Serialize filter values → compact query params (`v.brand=a,b`, `v.price=10~99`). */
export function serializeFilterValues(values: FilterValues): URLSearchParams {
	const params = new URLSearchParams();
	for (const [id, value] of Object.entries(values)) {
		if (value === undefined || value === null || value === false || value === '') continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
				params.set(`v.${id}`, `${value[0]}~${value[1]}`);
			} else {
				params.set(
					`v.${id}`,
					(value as string[]).map(encodeURIComponent).join(',')
				);
			}
		} else if (typeof value === 'boolean') {
			if (value) params.set(`v.${id}`, '1');
		} else {
			params.set(`v.${id}`, encodeURIComponent(String(value)));
		}
	}
	return params;
}

export function parseFilterValues(
	search: string | URLSearchParams,
	schema: FilterFieldSchema[] = []
): FilterValues {
	const params =
		typeof search === 'string'
			? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
			: search;

	const byId = new Map(schema.map((f) => [f.id, f]));
	const values = emptyFilterValues(schema);

	for (const [key, raw] of params.entries()) {
		if (!key.startsWith('v.') || !raw) continue;
		const id = key.slice(2);
		const field = byId.get(id);

		if (raw.includes('~') && (!field || field.type === 'range')) {
			const [a, b] = raw.split('~');
			const min = Number(a);
			const max = Number(b);
			if (!Number.isNaN(min) && !Number.isNaN(max)) values[id] = [min, max];
			continue;
		}

		if (field?.type === 'toggle') {
			values[id] = raw === '1' || raw === 'true';
			continue;
		}

		if (field?.type === 'rating' || field?.type === 'radio' || field?.type === 'select') {
			if (field.multiple) {
				values[id] = raw.split(',').map((v) => decodeURIComponent(v));
			} else if (field.type === 'rating') {
				const n = Number(raw);
				values[id] = Number.isNaN(n) ? undefined : n;
			} else {
				values[id] = decodeURIComponent(raw);
			}
			continue;
		}

		// checkbox / default multi
		if (raw.includes(',')) {
			values[id] = raw.split(',').map((v) => decodeURIComponent(v));
		} else if (field?.type === 'checkbox' || !field) {
			values[id] = [decodeURIComponent(raw)];
		} else {
			values[id] = decodeURIComponent(raw);
		}
	}

	return values;
}
