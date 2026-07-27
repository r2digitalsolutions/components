import type { DataGridColumn } from '../DataGrid/types.js';
import type { ResourceField } from './types.js';

/** Map ResourceField[] → DataGrid columns (skips hidden fields). */
export function fieldsToColumns<Row extends Record<string, unknown> = Record<string, unknown>>(
	fields: ResourceField[]
): DataGridColumn<Row>[] {
	return fields
		.filter((f) => !f.hidden)
		.map((f) => ({
			id: f.id,
			header: f.label,
			accessor: f.id,
			sortable: true,
			editable: !f.readonly,
			align: f.type === 'number' ? 'right' : 'left',
			meta: {
				fieldType: f.type,
				options: f.options,
				relation: f.relation,
				required: f.required,
				...f.meta
			}
		}));
}
