<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import EditorShell from '$lib/components/organisms/EditorShell/EditorShell.svelte';
	import NodeGraph from '$lib/components/molecules/NodeGraph/NodeGraph.svelte';
	import NodePalette from '$lib/components/molecules/NodePalette/NodePalette.svelte';
	import PropertyGroup from '$lib/components/molecules/PropertyGroup/PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import JSONViewer from '$lib/components/molecules/JSONViewer/JSONViewer.svelte';
	import SplitPane from '$lib/components/molecules/SplitPane/SplitPane.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';
	import Boxes from '@lucide/svelte/icons/boxes';
	import Play from '@lucide/svelte/icons/play';
	import Square from '@lucide/svelte/icons/square';
	import Braces from '@lucide/svelte/icons/braces';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';
	import PanelBottom from '@lucide/svelte/icons/panel-bottom';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import {
		DEFAULT_BLUEPRINT_NODE_TYPES,
		alignGraphNodes,
		collapseSelectionToFunction,
		createCommentFromSelection,
		createGraphNode,
		createVarGetNode,
		createVarSetNode,
		defaultValueForPinType,
		distributeGraphNodes,
		emptyBlueprintDocument,
		expandCollapsedGraph,
		filterNodeTypesForGraph,
		pinColor,
		snap,
		validateGraph,
		variablePinColor,
		type BlueprintDocument,
		type BlueprintVariable,
		type GraphNode,
		type GraphNodeContext,
		type GraphNodeTypeDef,
		type GraphValidationIssue,
		type PinDataType
	} from '$lib/utils/nodeGraph.js';
	import {
		simulateBlueprint,
		type BlueprintLogEntry
	} from '$lib/utils/blueprintRuntime.js';

	export type { BlueprintDocument, BlueprintVariable };

	interface BlueprintEditorProps {
		value?: BlueprintDocument;
		nodeTypes?: GraphNodeTypeDef[];
		/** Active graph kind — filters palette / place menu like Unreal BP classes. */
		graphContext?: GraphNodeContext;
		class?: string;
		onchange?: (doc: BlueprintDocument) => void;
		oncompile?: (issues: GraphValidationIssue[]) => void;
	}

	let {
		value = $bindable(emptyBlueprintDocument()),
		nodeTypes = DEFAULT_BLUEPRINT_NODE_TYPES,
		graphContext = 'event_graph' as GraphNodeContext,
		class: className = '',
		onchange,
		oncompile
	}: BlueprintEditorProps = $props();

	let selectedId = $state<string | null>(null);
	let selectedIds = $state<string[]>([]);
	let selectedVarId = $state<string | null>(null);
	let issues = $state<GraphValidationIssue[]>([]);
	let showJson = $state(false);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let showBottom = $state(true);
	let sidebarSize = $state(300);
	let inspectorSize = $state(300);
	let bottomSize = $state(200);
	let varsSize = $state(220);
	let varsCollapsed = $state(false);
	let paletteCollapsed = $state(false);
	let compiledOnce = $state(false);
	let bottomTab = $state<'compiler' | 'output'>('compiler');
	let simulating = $state(false);
	let simAbort: AbortController | null = null;
	let outputLog = $state<BlueprintLogEntry[]>([]);
	let outputScroller = $state<HTMLUListElement | null>(null);
	let outputHovered = $state(false);

	function scrollOutputToBottom() {
		if (!outputScroller || outputHovered) return;
		outputScroller.scrollTop = outputScroller.scrollHeight;
	}

	$effect(() => {
		outputLog;
		queueMicrotask(scrollOutputToBottom);
	});

	const selectedNode = $derived(value.graph.nodes.find((n) => n.id === selectedId) ?? null);
	const selectedGraphNodes = $derived(
		value.graph.nodes.filter((n) => selectedIds.includes(n.id))
	);
	const multiNodeSelection = $derived(selectedGraphNodes.length > 1);
	const selectedVar = $derived(
		(value.variables ?? []).find((v) => v.id === selectedVarId) ?? null
	);
	const paletteTypes = $derived(
		filterNodeTypesForGraph(nodeTypes, { context: graphContext, includeHidden: false })
	);
	const errorCount = $derived(issues.filter((i) => i.level === 'error').length);
	const warnCount = $derived(issues.filter((i) => i.level === 'warning').length);
	const statusOk = $derived(compiledOnce && issues.length === 0);

	function emit(next: BlueprintDocument) {
		value = next;
		onchange?.(next);
	}

	function onGraphChange(graph: BlueprintDocument['graph']) {
		emit({ ...value, graph });
	}

	function onSelect(id: string | null) {
		selectedId = id;
	}

	function onSelectMany(ids: string[]) {
		selectedIds = ids;
		if (ids.length) selectedVarId = null;
	}

	function deleteSelectedNodes() {
		if (!selectedGraphNodes.length) return;
		const del = new Set(selectedGraphNodes.map((n) => n.id));
		emit({
			...value,
			graph: {
				...value.graph,
				nodes: value.graph.nodes.filter((n) => !del.has(n.id)),
				edges: value.graph.edges.filter((e) => !del.has(e.source) && !del.has(e.target))
			}
		});
		selectedId = null;
		selectedIds = [];
	}

	function commentSelectedNodes() {
		const ids = selectedGraphNodes.map((n) => n.id);
		const result = createCommentFromSelection(value.graph, ids);
		if (!result) return;
		emit({ ...value, graph: result.doc });
		selectedId = result.commentId;
		selectedIds = [result.commentId, ...ids];
	}

	function collapseSelectedNodes() {
		const ids = selectedGraphNodes
			.filter((n) => n.type !== 'comment' && n.type !== 'collapsed_graph')
			.map((n) => n.id);
		const result = collapseSelectionToFunction(value.graph, ids);
		if (!result) return;
		emit({ ...value, graph: result.doc });
		selectedId = result.collapsedId;
		selectedIds = [result.collapsedId];
	}

	function expandSelectedNode() {
		if (!selectedNode || selectedNode.type !== 'collapsed_graph') return;
		const result = expandCollapsedGraph(value.graph, selectedNode.id);
		if (!result) return;
		emit({ ...value, graph: result.doc });
		selectedIds = result.newNodeIds;
		selectedId = result.newNodeIds[0] ?? null;
	}

	function alignSelected(align: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY') {
		const ids = selectedGraphNodes.map((n) => n.id);
		emit({ ...value, graph: alignGraphNodes(value.graph, ids, align) });
	}

	function distributeSelected(axis: 'horizontal' | 'vertical') {
		const ids = selectedGraphNodes.map((n) => n.id);
		emit({ ...value, graph: distributeGraphNodes(value.graph, ids, axis) });
	}

	function addFromPalette(nt: GraphNodeTypeDef) {
		const nodes = value.graph.nodes;
		const x = snap(80 + (nodes.length % 5) * 40, 16);
		const y = snap(80 + Math.floor(nodes.length / 5) * 40, 16);
		const n = createGraphNode({ type: nt.type, x, y }, nodeTypes);
		emit({ ...value, graph: { ...value.graph, nodes: [...nodes, n] } });
		selectedId = n.id;
	}

	function placeVariableOnGraph(variable: BlueprintVariable, kind: 'get' | 'set') {
		const nodes = value.graph.nodes;
		const x = snap(120 + (nodes.length % 4) * 36, 16);
		const y = snap(120 + Math.floor(nodes.length / 4) * 36, 16);
		const n =
			kind === 'get' ? createVarGetNode(variable, { x, y }) : createVarSetNode(variable, { x, y });
		emit({ ...value, graph: { ...value.graph, nodes: [...nodes, n] } });
		selectedId = n.id;
	}

	function updateSelected(patch: Partial<GraphNode> & { data?: GraphNode['data'] }) {
		if (!selectedNode) return;
		emit({
			...value,
			graph: {
				...value.graph,
				nodes: value.graph.nodes.map((n) =>
					n.id === selectedNode.id
						? {
								...n,
								...patch,
								data: { ...n.data, ...patch.data }
							}
						: n
				)
			}
		});
	}

	function compile() {
		const next = validateGraph(value.graph);
		issues = next;
		compiledOnce = true;
		showBottom = true;
		bottomTab = 'compiler';
		oncompile?.(next);
	}

	function stopSimulate() {
		simAbort?.abort();
		simAbort = null;
		simulating = false;
	}

	async function playSimulate() {
		if (simulating) {
			stopSimulate();
			return;
		}
		showBottom = true;
		bottomTab = 'output';
		const ctrl = new AbortController();
		simAbort = ctrl;
		simulating = true;
		try {
			const result = await simulateBlueprint(value, {
				signal: ctrl.signal,
				onLog: (entry) => {
					outputLog = [...outputLog, entry];
				}
			});
			if (result.variables.length) {
				emit({ ...value, variables: result.variables });
			}
		} finally {
			if (simAbort === ctrl) simAbort = null;
			simulating = false;
		}
	}

	function addVariable() {
		const vars = value.variables ?? [];
		const v: BlueprintVariable = {
			id: `var_${vars.length + 1}`,
			name: `NewVar${vars.length + 1}`,
			dataType: 'bool',
			defaultValue: defaultValueForPinType('bool')
		};
		emit({ ...value, variables: [...vars, v] });
		selectedVarId = v.id;
	}

	function updateVariable(id: string, patch: Partial<BlueprintVariable>) {
		emit({
			...value,
			variables: (value.variables ?? []).map((v) => {
				if (v.id !== id) return v;
				const next = { ...v, ...patch };
				if (patch.dataType && patch.dataType !== v.dataType && patch.defaultValue === undefined) {
					next.defaultValue = defaultValueForPinType(patch.dataType);
				}
				return next;
			})
		});
	}

	function removeVariable(id: string) {
		if (selectedVarId === id) selectedVarId = null;
		emit({
			...value,
			variables: (value.variables ?? []).filter((v) => v.id !== id)
		});
	}

	function onVarDragStart(event: DragEvent, v: BlueprintVariable) {
		event.dataTransfer?.setData(
			'application/x-blueprint-var',
			JSON.stringify({ id: v.id, name: v.name, dataType: v.dataType, defaultValue: v.defaultValue })
		);
		event.dataTransfer?.setData('text/plain', v.name);
		if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
	}

	function formatDefaultInput(v: BlueprintVariable): string {
		if (v.defaultValue == null) return '';
		return String(v.defaultValue);
	}
</script>

<div class={['flex h-full min-h-0 flex-col bg-surface', className]} data-blueprint-editor>
	<header
		class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface-elevated px-2 py-1.5"
	>
		<div
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-500/15 dark:bg-brand-950/40 dark:text-brand-300"
		>
			<Boxes class="h-4 w-4" strokeWidth={2} />
		</div>

		<div class="min-w-0 flex-1 sm:max-w-xs">
			<Input
				value={value.name ?? ''}
				placeholder="Blueprint name"
				size="sm"
				class="font-medium"
				oninput={(e) => emit({ ...value, name: (e.currentTarget as HTMLInputElement).value })}
			/>
		</div>

		<div class="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true"></div>

		<Button size="sm" onclick={compile}>
			Compile
		</Button>

		<Button
			size="sm"
			variant={simulating ? 'secondary' : 'primary'}
			onclick={playSimulate}
			title="Simulate Event BeginPlay"
		>
			{#if simulating}
				<Square class="h-3.5 w-3.5" strokeWidth={2.25} />
				Stop
			{:else}
				<Play class="h-3.5 w-3.5" strokeWidth={2.25} />
				Play
			{/if}
		</Button>

		{#if statusOk}
			<span
				class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
			>
				<CircleCheck class="h-3.5 w-3.5" strokeWidth={2.25} />
				Ready
			</span>
		{:else if issues.length}
			<span
				class="inline-flex items-center gap-1.5 rounded-md bg-surface-overlay px-2 py-1 text-[11px] font-medium text-secondary"
			>
				<CircleAlert class="h-3.5 w-3.5 text-amber-500" strokeWidth={2.25} />
				<span class="text-red-600">{errorCount} err</span>
				<span class="text-muted">·</span>
				<span class="text-amber-600">{warnCount} warn</span>
			</span>
		{:else}
			<span class="text-[11px] text-muted">Not compiled</span>
		{/if}

		<div class="ml-auto flex items-center gap-0.5">
			<IconButton
				size="sm"
				variant={showSidebar ? 'secondary' : 'ghost'}
				label="Toggle palette"
				onclick={() => (showSidebar = !showSidebar)}
			>
				<PanelLeft class="h-4 w-4" />
			</IconButton>
			<IconButton
				size="sm"
				variant={showBottom ? 'secondary' : 'ghost'}
				label="Toggle compiler panel"
				onclick={() => (showBottom = !showBottom)}
			>
				<PanelBottom class="h-4 w-4" />
			</IconButton>
			<IconButton
				size="sm"
				variant={showInspector ? 'secondary' : 'ghost'}
				label="Toggle details"
				onclick={() => (showInspector = !showInspector)}
			>
				<PanelRight class="h-4 w-4" />
			</IconButton>
			<div class="mx-1 h-5 w-px bg-border" aria-hidden="true"></div>
			<IconButton
				size="sm"
				variant={showJson ? 'secondary' : 'ghost'}
				label="Toggle JSON"
				onclick={() => {
					showJson = !showJson;
					if (showJson) showBottom = true;
				}}
			>
				<Braces class="h-4 w-4" />
			</IconButton>
		</div>
	</header>

	<div class="min-h-0 flex-1">
		<EditorShell
			inspectorTitle="Details"
			workspaceTitle="Event Graph"
			bottomTitle={showJson ? 'JSON' : 'Compiler Results'}
			sizeUnit="px"
			bind:sidebarSize
			bind:inspectorSize
			bind:bottomSize
			sidebarMin={220}
			sidebarMax={420}
			inspectorMin={240}
			inspectorMax={420}
			bottomMin={120}
			bottomMax={360}
			{showSidebar}
			{showInspector}
			{showBottom}
			wrapSidebar={false}
			collapsiblePanels
			revealResizeOnHover
			fullHeight
			class="h-full"
		>
			{#snippet sidebar()}
				<SplitPane
					orientation="vertical"
					bind:size={varsSize}
					sizePane="end"
					unit="px"
					minSize={96}
					maxSize={320}
					startCollapsed={paletteCollapsed}
					endCollapsed={varsCollapsed}
					revealOnHover
					class="h-full"
				>
					{#snippet start()}
						<Panel
							title="Palette"
							collapsible
							bind:collapsed={paletteCollapsed}
							padding="none"
							headerSize="sm"
						>
							<NodePalette
								nodeTypes={paletteTypes}
								title=""
								onselect={addFromPalette}
								class="h-full"
							/>
						</Panel>
					{/snippet}
					{#snippet end()}
						<Panel
							title="Variables"
							collapsible
							bind:collapsed={varsCollapsed}
							padding="none"
							headerSize="sm"
						>
							{#snippet actions()}
								<Button size="sm" variant="ghost" onclick={addVariable}>+</Button>
							{/snippet}
							<ul class="space-y-0.5 p-1.5">
								{#each value.variables ?? [] as v (v.id)}
									<li>
										<button
											type="button"
											class={[
												'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left',
												selectedVarId === v.id
													? 'bg-brand-50 ring-1 ring-brand-500/30 dark:bg-brand-950/30'
													: 'hover:bg-surface-overlay'
											]}
											draggable="true"
											ondragstart={(e) => onVarDragStart(e, v)}
											onclick={() => {
												selectedVarId = v.id;
												selectedId = null;
											}}
											title="Click to edit in Details · drag onto graph"
										>
											<span
												class="h-2.5 w-2.5 shrink-0 rounded-full"
												style={`background:${variablePinColor(v.dataType)}`}
											></span>
											<span class="min-w-0 flex-1 truncate text-xs font-medium text-primary"
												>{v.name}</span
											>
											<span class="shrink-0 font-mono text-[10px] text-muted">{v.dataType}</span>
										</button>
									</li>
								{:else}
									<li class="px-2 py-3 text-center text-[11px] text-muted">
										No variables — add one, then edit in Details
									</li>
								{/each}
							</ul>
						</Panel>
					{/snippet}
				</SplitPane>
			{/snippet}

			{#snippet workspace()}
				<NodeGraph
					value={value.graph}
					{nodeTypes}
					variables={value.variables ?? []}
					{graphContext}
					showToolbar={false}
					showMinimap
					class="h-full min-h-0 rounded-none border-0"
					onchange={onGraphChange}
					onselect={(id) => {
						onSelect(id);
						if (id) selectedVarId = null;
					}}
					onselectmany={onSelectMany}
					onvalidate={(i) => {
						issues = i;
						compiledOnce = true;
					}}
				/>
			{/snippet}

			{#snippet inspector()}
				{#if multiNodeSelection}
					<div class="space-y-1 p-1">
						<PropertyGroup title="Selection" open>
							{#snippet children()}
								<PropertyField label="Nodes">
									{#snippet children()}
										<span class="text-xs font-medium text-primary">
											{selectedGraphNodes.length} selected
										</span>
									{/snippet}
								</PropertyField>
								<PropertyField label="Types">
									{#snippet children()}
										<span class="text-xs text-muted">
											{[...new Set(selectedGraphNodes.map((n) => n.type))].join(', ')}
										</span>
									{/snippet}
								</PropertyField>
								<div class="flex flex-wrap gap-2 px-1 pt-2">
									<Button size="sm" variant="secondary" onclick={deleteSelectedNodes}>
										Delete
									</Button>
									<Button size="sm" variant="secondary" onclick={commentSelectedNodes}>
										Comment
									</Button>
									<Button size="sm" variant="secondary" onclick={collapseSelectedNodes}>
										Collapse
									</Button>
									<Button size="sm" variant="ghost" onclick={() => alignSelected('left')}>
										Align L
									</Button>
									<Button size="sm" variant="ghost" onclick={() => alignSelected('top')}>
										Align T
									</Button>
									{#if selectedGraphNodes.length >= 3}
										<Button
											size="sm"
											variant="ghost"
											onclick={() => distributeSelected('horizontal')}
										>
											Dist X
										</Button>
									{/if}
								</div>
								<p class="px-1 pt-2 text-[11px] text-muted">
									⌘C/X/V · ⌘Z/Y · F frame · C comment · ⌘G collapse · Alt+drag pin breaks link
								</p>
							{/snippet}
						</PropertyGroup>
					</div>
				{:else if selectedNode}
					<div class="space-y-1 p-1">
						<PropertyGroup title="Node" open>
							{#snippet children()}
								<PropertyField label="Name">
									{#snippet children()}
										<Input
											size="sm"
											value={String(selectedNode.data?.label ?? '')}
											oninput={(e) =>
												updateSelected({
													data: { label: (e.currentTarget as HTMLInputElement).value }
												})}
										/>
									{/snippet}
								</PropertyField>
								<PropertyField label="Type">
									{#snippet children()}
										<span class="font-mono text-xs text-muted">{selectedNode.type}</span>
									{/snippet}
								</PropertyField>
								{#if selectedNode.type === 'collapsed_graph'}
									<div class="px-1 pt-1">
										<Button size="sm" variant="secondary" onclick={expandSelectedNode}>
											Expand graph
										</Button>
									</div>
								{/if}
								{#if selectedNode.data?.variableName}
									<PropertyField label="Variable">
										{#snippet children()}
											<span
												class="text-xs font-medium"
												style={`color:${variablePinColor(
													(value.variables ?? []).find(
														(x) => x.id === selectedNode.data?.variableId
													)?.dataType ?? 'any'
												)}`}
											>
												{String(selectedNode.data?.variableName)}
											</span>
										{/snippet}
									</PropertyField>
								{/if}
								<PropertyField label="Description">
									{#snippet children()}
										<Input
											size="sm"
											value={String(selectedNode.data?.description ?? '')}
											oninput={(e) =>
												updateSelected({
													data: { description: (e.currentTarget as HTMLInputElement).value }
												})}
										/>
									{/snippet}
								</PropertyField>
							{/snippet}
						</PropertyGroup>
						<PropertyGroup title="Inputs" open>
							{#snippet children()}
								{#each selectedNode.inputs ?? [] as port (port.id)}
									{@const wired = value.graph.edges.some(
										(e) => e.target === selectedNode.id && (e.targetHandle ?? '') === port.id
									)}
									<PropertyField label={port.label ?? port.id}>
										{#snippet children()}
											<span class="flex w-full flex-col gap-1">
												<span class="flex items-center gap-1.5 text-xs text-muted">
													<span
														class="inline-block h-2.5 w-2.5 border border-border"
														class:rounded-full={port.kind !== 'exec'}
														class:rounded-sm={port.kind === 'exec'}
														style={`background:${pinColor(port)}`}
													></span>
													{port.dataType ?? port.kind ?? 'any'}
													{#if wired}
														<span class="text-[10px] text-muted">· wired</span>
													{/if}
												</span>
												{#if port.kind !== 'exec' && port.dataType !== 'exec' && !wired}
													{#if port.dataType === 'bool'}
														<label class="flex items-center gap-2 text-xs text-secondary">
															<input
																type="checkbox"
																checked={Boolean(port.value)}
																onchange={(e) =>
																	updateSelected({
																		inputs: (selectedNode.inputs ?? []).map((p) =>
																			p.id === port.id
																				? {
																						...p,
																						value: (e.currentTarget as HTMLInputElement)
																							.checked
																					}
																				: p
																		)
																	})}
															/>
															{port.value ? 'true' : 'false'}
														</label>
													{:else if port.dataType === 'int' || port.dataType === 'float'}
														<Input
															size="sm"
															type="number"
															value={port.value == null ? '' : String(port.value)}
															oninput={(e) => {
																const raw = (e.currentTarget as HTMLInputElement).value;
																const num =
																	port.dataType === 'int'
																		? parseInt(raw, 10)
																		: parseFloat(raw);
																updateSelected({
																	inputs: (selectedNode.inputs ?? []).map((p) =>
																		p.id === port.id
																			? {
																					...p,
																					value: Number.isFinite(num) ? num : 0
																				}
																			: p
																	)
																});
															}}
														/>
													{:else}
														<Input
															size="sm"
															value={port.value == null ? '' : String(port.value)}
															placeholder="Literal…"
															oninput={(e) =>
																updateSelected({
																	inputs: (selectedNode.inputs ?? []).map((p) =>
																		p.id === port.id
																			? {
																					...p,
																					value: (e.currentTarget as HTMLInputElement).value
																				}
																			: p
																	)
																})}
														/>
													{/if}
												{/if}
											</span>
										{/snippet}
									</PropertyField>
								{:else}
									<p class="px-2 py-2 text-xs text-muted">No inputs</p>
								{/each}
							{/snippet}
						</PropertyGroup>
						<PropertyGroup title="Outputs" open>
							{#snippet children()}
								{#each selectedNode.outputs ?? [] as port (port.id)}
									<PropertyField label={port.label ?? port.id}>
										{#snippet children()}
											<span class="flex items-center gap-1.5 text-xs text-muted">
												<span
													class="inline-block h-2.5 w-2.5 border border-border"
													class:rounded-full={port.kind !== 'exec'}
													class:rounded-sm={port.kind === 'exec'}
													style={`background:${pinColor(port)}`}
												></span>
												{port.dataType ?? port.kind ?? 'any'}
											</span>
										{/snippet}
									</PropertyField>
								{:else}
									<p class="px-2 py-2 text-xs text-muted">No outputs</p>
								{/each}
							{/snippet}
						</PropertyGroup>
					</div>
				{:else if selectedVar}
					<div class="space-y-1 p-1">
						<PropertyGroup title="Variable" open>
							{#snippet children()}
								<PropertyField label="Name">
									{#snippet children()}
										<Input
											size="sm"
											value={selectedVar.name}
											oninput={(e) =>
												updateVariable(selectedVar.id, {
													name: (e.currentTarget as HTMLInputElement).value
												})}
										/>
									{/snippet}
								</PropertyField>
								<PropertyField label="Type">
									{#snippet children()}
										<select
											class="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-primary"
											value={selectedVar.dataType}
											onchange={(e) =>
												updateVariable(selectedVar.id, {
													dataType: (e.currentTarget as HTMLSelectElement).value as PinDataType
												})}
										>
											<option value="bool">bool</option>
											<option value="int">int</option>
											<option value="float">float</option>
											<option value="string">string</option>
											<option value="object">object</option>
										</select>
									{/snippet}
								</PropertyField>
								<PropertyField label="Default">
									{#snippet children()}
										{#if selectedVar.dataType === 'bool'}
											<label class="flex items-center gap-2 text-xs text-secondary">
												<input
													type="checkbox"
													checked={Boolean(selectedVar.defaultValue)}
													onchange={(e) =>
														updateVariable(selectedVar.id, {
															defaultValue: (e.currentTarget as HTMLInputElement).checked
														})}
												/>
												{selectedVar.defaultValue ? 'true' : 'false'}
											</label>
										{:else if selectedVar.dataType === 'string'}
											<Input
												size="sm"
												value={formatDefaultInput(selectedVar)}
												oninput={(e) =>
													updateVariable(selectedVar.id, {
														defaultValue: (e.currentTarget as HTMLInputElement).value
													})}
											/>
										{:else if selectedVar.dataType === 'int' || selectedVar.dataType === 'float'}
											<Input
												size="sm"
												type="number"
												value={formatDefaultInput(selectedVar)}
												oninput={(e) => {
													const raw = (e.currentTarget as HTMLInputElement).value;
													const num =
														selectedVar.dataType === 'int'
															? parseInt(raw, 10)
															: parseFloat(raw);
													updateVariable(selectedVar.id, {
														defaultValue: Number.isFinite(num) ? num : 0
													});
												}}
											/>
										{:else}
											<span class="text-xs text-muted">null</span>
										{/if}
									{/snippet}
								</PropertyField>
							{/snippet}
						</PropertyGroup>
						<div class="flex flex-wrap gap-2 px-2 py-2">
							<Button
								size="sm"
								variant="secondary"
								onclick={() => placeVariableOnGraph(selectedVar, 'get')}
							>
								Get {selectedVar.name}
							</Button>
							<Button
								size="sm"
								variant="secondary"
								onclick={() => placeVariableOnGraph(selectedVar, 'set')}
							>
								Set {selectedVar.name}
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onclick={() => removeVariable(selectedVar.id)}
							>
								Delete
							</Button>
						</div>
						<p class="px-2 pb-2 text-[11px] text-muted">
							Drag from the Variables list onto the graph, or use Get / Set here.
						</p>
					</div>
				{:else}
					<p class="p-4 text-sm text-muted">Select a node or variable to inspect details.</p>
				{/if}
			{/snippet}

			{#snippet bottom()}
				{#if showJson}
					<div class="h-full min-h-0 overflow-auto p-2">
						<JSONViewer data={value} />
					</div>
				{:else}
					<div class="flex h-full min-h-0 flex-col">
						<div
							class="flex shrink-0 items-center gap-1 border-b border-border px-2 py-1"
							role="tablist"
						>
							<button
								type="button"
								role="tab"
								aria-selected={bottomTab === 'compiler'}
								class={[
									'rounded px-2 py-1 text-[11px] font-medium',
									bottomTab === 'compiler'
										? 'bg-surface-overlay text-primary'
										: 'text-muted hover:text-secondary'
								]}
								onclick={() => (bottomTab = 'compiler')}
							>
								Compiler
								{#if issues.length}
									<span class="ml-1 text-amber-600">{issues.length}</span>
								{/if}
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={bottomTab === 'output'}
								class={[
									'rounded px-2 py-1 text-[11px] font-medium',
									bottomTab === 'output'
										? 'bg-surface-overlay text-primary'
										: 'text-muted hover:text-secondary'
								]}
								onclick={() => (bottomTab = 'output')}
							>
								Output
							</button>
						</div>
						<div class="min-h-0 flex-1 overflow-hidden">
							{#if bottomTab === 'compiler'}
								{#if !issues.length}
									<p class="p-3 text-xs text-muted">
										{#if compiledOnce}
											Graph is valid. Use <strong class="font-semibold text-primary">Play</strong> to
											simulate BeginPlay and see Print String in Output.
										{:else}
											Click <strong class="font-semibold text-primary">Compile</strong> to validate
											pin types and orphan wires.
										{/if}
									</p>
								{:else}
									<ul class="h-full min-h-0 space-y-1 overflow-auto p-2">
										{#each issues as issue (issue.id)}
											<li
												class={[
													'rounded-md px-2 py-1.5 text-xs',
													issue.level === 'error'
														? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
														: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
												]}
											>
												<span class="font-semibold uppercase">{issue.level}</span>
												— {issue.message}
											</li>
										{/each}
									</ul>
								{/if}
							{:else}
								<div class="flex h-full min-h-0 flex-col bg-surface-elevated text-primary">
									<div
										class="flex shrink-0 items-center justify-between border-b border-border bg-surface-overlay px-3 py-1"
									>
										<span class="text-[10px] font-semibold uppercase tracking-wide text-muted"
											>Output Log</span
										>
										<button
											type="button"
											class="text-[11px] text-muted hover:text-primary"
											onclick={() => (outputLog = [])}
										>
											Clear
										</button>
									</div>
									<ul
										bind:this={outputScroller}
										class="min-h-0 flex-1 space-y-0.5 overflow-auto px-3 py-2 font-mono text-xs leading-relaxed"
										onmouseenter={() => (outputHovered = true)}
										onmouseleave={() => {
											outputHovered = false;
											queueMicrotask(scrollOutputToBottom);
										}}
									>
										{#if !outputLog.length}
											<li class="text-muted">Press Play to simulate Event BeginPlay.</li>
										{:else}
											{#each outputLog as entry (entry.id)}
												<li
													class={[
														'whitespace-pre-wrap break-all',
														entry.level === 'print'
															? 'font-medium text-sky-700 dark:text-sky-300'
															: entry.level === 'error'
																? 'text-red-600 dark:text-red-400'
																: entry.level === 'warn'
																	? 'text-amber-700 dark:text-amber-300'
																	: 'text-muted'
													]}
												>
													{#if entry.level === 'print'}
														<span class="text-muted">Print: </span>{entry.text}
													{:else}
														{entry.text}
													{/if}
												</li>
											{/each}
										{/if}
									</ul>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/snippet}
		</EditorShell>
	</div>
</div>
