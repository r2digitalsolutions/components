import type { ConditionalFormatRule } from '../DataGrid/types.js';

export type FieldType =
	| 'string'
	| 'text'
	| 'number'
	| 'boolean'
	| 'date'
	| 'datetime'
	| 'enum'
	| 'json'
	| 'relation'
	| 'file'
	| 'custom';

export interface ResourceField {
	id: string;
	label: string;
	type: FieldType;
	description?: string;
	required?: boolean;
	unique?: boolean;
	readonly?: boolean;
	hidden?: boolean;
	defaultValue?: unknown;
	options?: { value: string; label: string }[];
	relation?: { resourceId: string; fieldId: string; displayField?: string };
	meta?: Record<string, unknown>;
}

export interface ResourceCapabilities {
	create?: boolean;
	update?: boolean;
	delete?: boolean;
	duplicate?: boolean;
	export?: boolean;
	import?: boolean;
	bulkEdit?: boolean;
	notes?: boolean;
	conditionalFormat?: boolean;
	editable?: boolean;
}

export interface ResourceDefinition {
	id: string;
	name: string;
	description?: string;
	group?: string;
	icon?: string;
	fields: ResourceField[];
	primaryKey?: string;
	recordCount?: number;
	capabilities?: ResourceCapabilities;
	defaultFormatRules?: ConditionalFormatRule[];
}

export type ResourceStudioMode = 'browse' | 'detail' | 'schema' | 'query' | 'activity';
export type ResourceStudioLayout = 'sidebar-main' | 'sidebar-main-detail' | 'main-only';

export interface ResourceStudioLabels {
	resources?: string;
	records?: string;
	addRecord?: string;
	schema?: string;
	runQuery?: string;
	searchPlaceholder?: string;
	detail?: string;
	activity?: string;
	query?: string;
}

export interface ResourceStudioView {
	id: string;
	label: string;
	resourceId?: string;
	query?: string;
	formatRuleIds?: string[];
}

export const DEFAULT_CAPABILITIES: Required<ResourceCapabilities> = {
	create: true,
	update: true,
	delete: true,
	duplicate: false,
	export: true,
	import: false,
	bulkEdit: false,
	notes: true,
	conditionalFormat: true,
	editable: true
};

export function resolveCapabilities(
	caps?: ResourceCapabilities
): Required<ResourceCapabilities> {
	return { ...DEFAULT_CAPABILITIES, ...caps };
}
