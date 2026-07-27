<script lang="ts">
	import type { Snippet } from 'svelte';
	import ResourceStudio from '$lib/components/organisms/ResourceStudio/ResourceStudio.svelte';
	import type {
		ResourceDefinition,
		ResourceStudioLabels,
		ResourceStudioLayout,
		ResourceStudioMode,
		ResourceStudioView
	} from '$lib/components/organisms/ResourceStudio/types.js';
	import type {
		CellNote,
		ConditionalFormatRule,
		GridSelection
	} from '$lib/components/organisms/DataGrid/types.js';
	import { EMPTY_SELECTION } from '$lib/components/organisms/DataGrid/types.js';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';

	interface ResourceStudioTemplateProps {
		title?: string;
		description?: string;
		resources?: ResourceDefinition[];
		activeResourceId?: string;
		records?: Record<string, unknown>[];
		totalRecords?: number;
		loading?: boolean;
		page?: number;
		pageSize?: number;
		query?: string;
		selection?: GridSelection;
		notes?: CellNote[];
		formatRules?: ConditionalFormatRule[];
		modes?: ResourceStudioMode[];
		activeMode?: ResourceStudioMode;
		layout?: ResourceStudioLayout;
		labels?: ResourceStudioLabels;
		views?: ResourceStudioView[];
		activeViewId?: string;
		showHeader?: boolean;
		class?: string;
		headerActions?: Snippet;
		toolbar?: Snippet;
		sidebarItem?: Snippet<[ResourceDefinition, boolean]>;
		sidebarFooter?: Snippet;
		detail?: Snippet<[record: Record<string, unknown> | null]>;
		schemaPanel?: Snippet<[ResourceDefinition]>;
		queryPanel?: Snippet;
		activityPanel?: Snippet;
		recordForm?: Snippet<[mode: 'create' | 'edit', record: Record<string, unknown> | null]>;
		empty?: Snippet;
		dockExtra?: Snippet;
		cell?: Snippet<[Record<string, unknown>, { id: string; header: string }]>;
		onresourcechange?: (id: string) => void;
		onsearch?: (q: string) => void;
		onpagechange?: (page: number, pageSize: number) => void;
		onsort?: (columnId: string, dir: 'asc' | 'desc') => void;
		oncreate?: () => void;
		oninsert?: (record: Record<string, unknown>) => void;
		onupdate?: (id: string, patch: Record<string, unknown>) => void;
		ondelete?: (ids: string[]) => void;
		onduplicate?: (ids: string[]) => void;
		onexport?: (ids: string[] | 'all') => void;
		onimport?: (file: File) => void;
		oncelledit?: (id: string, fieldId: string, value: unknown) => void;
		onselectionchange?: (s: GridSelection) => void;
		onnoteschange?: (notes: CellNote[]) => void;
		onformatruleschange?: (rules: ConditionalFormatRule[]) => void;
		onmodechange?: (mode: ResourceStudioMode) => void;
		onviewchange?: (viewId: string) => void;
		onrefresh?: () => void;
	}

	let {
		title = 'Resource Studio',
		description = 'Browse and edit collections with a moldable CRUD shell.',
		resources = [],
		activeResourceId = $bindable(''),
		records = [],
		totalRecords,
		loading = false,
		page = $bindable(1),
		pageSize = 25,
		query = $bindable(''),
		selection = $bindable<GridSelection>(EMPTY_SELECTION),
		notes = $bindable<CellNote[]>([]),
		formatRules = $bindable<ConditionalFormatRule[]>([]),
		modes,
		activeMode = $bindable<ResourceStudioMode>('browse'),
		layout = 'sidebar-main-detail',
		labels,
		views = [],
		activeViewId = $bindable(''),
		showHeader = true,
		class: className = '',
		headerActions,
		toolbar,
		sidebarItem,
		sidebarFooter,
		detail,
		schemaPanel,
		queryPanel,
		activityPanel,
		recordForm,
		empty,
		dockExtra,
		cell,
		onresourcechange,
		onsearch,
		onpagechange,
		onsort,
		oncreate,
		oninsert,
		onupdate,
		ondelete,
		onduplicate,
		onexport,
		onimport,
		oncelledit,
		onselectionchange,
		onnoteschange,
		onformatruleschange,
		onmodechange,
		onviewchange,
		onrefresh
	}: ResourceStudioTemplateProps = $props();
</script>

<div class={['flex h-svh min-h-0 w-full flex-col bg-surface', className]}>
	{#if showHeader}
		<div class="shrink-0 border-b border-border px-4 py-3 sm:px-6">
			<PageHeader {title} {description}>
				{#snippet actions()}
					{#if headerActions}
						{@render headerActions()}
					{/if}
				{/snippet}
			</PageHeader>
		</div>
	{/if}

	<div class="min-h-0 flex-1 p-3 sm:p-4">
		<ResourceStudio
			{resources}
			bind:activeResourceId
			{records}
			{totalRecords}
			{loading}
			bind:page
			{pageSize}
			bind:query
			bind:selection
			bind:notes
			bind:formatRules
			{modes}
			bind:activeMode
			{layout}
			{labels}
			{views}
			bind:activeViewId
			class="h-full min-h-0"
			{toolbar}
			{sidebarItem}
			{sidebarFooter}
			{detail}
			{schemaPanel}
			{queryPanel}
			{activityPanel}
			{recordForm}
			{empty}
			{dockExtra}
			{cell}
			{onresourcechange}
			{onsearch}
			{onpagechange}
			{onsort}
			{oncreate}
			{oninsert}
			{onupdate}
			{ondelete}
			{onduplicate}
			{onexport}
			{onimport}
			{oncelledit}
			{onselectionchange}
			{onnoteschange}
			{onformatruleschange}
			{onmodechange}
			{onviewchange}
			{onrefresh}
		/>
	</div>
</div>
