<script lang="ts">
	import EditorShell from '$lib/components/organisms/EditorShell/EditorShell.svelte';
	import MediaAssetBrowser from '$lib/components/molecules/MediaAssetBrowser/MediaAssetBrowser.svelte';
	import MediaLayerList from '$lib/components/molecules/MediaLayerList/MediaLayerList.svelte';
	import MediaStage from '$lib/components/molecules/MediaStage/MediaStage.svelte';
	import CanvasInspector from '$lib/components/molecules/CanvasInspector/CanvasInspector.svelte';
	import CanvasElementsPanel, {
		type CanvasElementDef
	} from '$lib/components/molecules/CanvasElementsPanel/CanvasElementsPanel.svelte';
	import ContextMenu from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import type { ContextMenuItem } from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';
	import SplitPane from '$lib/components/molecules/SplitPane/SplitPane.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import DropdownMenu, {
		type DropdownItem
	} from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import {
		CANVAS_PRESETS,
		alignLayerRect,
		createCanvasGuide,
		createCanvasLayer,
		emptyCanvasDocument,
		presetIdForSize,
		reorderCanvasLayers,
		updateCanvasLayer,
		updateCanvasLayers,
		type CanvasAlign,
		type CanvasDocument,
		type CanvasLayer
	} from '$lib/utils/canvasDocument.js';
	import {
		downloadBlob,
		exportCanvasBlob,
		type CanvasExportFormat
	} from '$lib/utils/canvasExport.js';
	import type { MediaAsset } from '$lib/utils/mediaTracks.js';
	import Download from '@lucide/svelte/icons/download';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import Grid3x3 from '@lucide/svelte/icons/grid-3x3';
	import Magnet from '@lucide/svelte/icons/magnet';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Lock from '@lucide/svelte/icons/lock';
	import Unlock from '@lucide/svelte/icons/unlock';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import BringToFront from '@lucide/svelte/icons/bring-to-front';
	import ArrowDownToLine from '@lucide/svelte/icons/arrow-down-to-line';
	import AlignHorizontalJustifyCenter from '@lucide/svelte/icons/align-horizontal-justify-center';
	import AlignStartVertical from '@lucide/svelte/icons/align-start-vertical';
	import AlignCenterVertical from '@lucide/svelte/icons/align-center-vertical';
	import AlignEndVertical from '@lucide/svelte/icons/align-end-vertical';
	import AlignStartHorizontal from '@lucide/svelte/icons/align-start-horizontal';
	import AlignCenterHorizontal from '@lucide/svelte/icons/align-center-horizontal';
	import AlignEndHorizontal from '@lucide/svelte/icons/align-end-horizontal';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import Maximize2 from '@lucide/svelte/icons/maximize-2';
	import FileJson from '@lucide/svelte/icons/file-json';
	import ImageIcon from '@lucide/svelte/icons/image';
	import FileImage from '@lucide/svelte/icons/file-image';
	import SeparatorVertical from '@lucide/svelte/icons/separator-vertical';
	import SeparatorHorizontal from '@lucide/svelte/icons/separator-horizontal';
	import Eye from '@lucide/svelte/icons/eye';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';

	interface CanvasEditorProps {
		value?: CanvasDocument;
		assets?: MediaAsset[];
		class?: string;
		onchange?: (doc: CanvasDocument) => void;
		onassetschange?: (assets: MediaAsset[]) => void;
		onexport?: (payload: {
			format: CanvasExportFormat;
			document: CanvasDocument;
			blob?: Blob;
		}) => void;
	}

	let {
		value = $bindable(emptyCanvasDocument()),
		assets = $bindable<MediaAsset[]>([]),
		class: className = '',
		onchange,
		onassetschange,
		onexport
	}: CanvasEditorProps = $props();

	let selectedIds = $state<string[]>([]);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let assetsSize = $state(58);
	let sidebarTab = $state<'elements' | 'uploads'>('elements');
	let zoom = $state(1);
	let showGrid = $state(false);
	let showGuides = $state(true);
	let snap = $state(true);
	let cellSize = $state(8);
	let ctxOpen = $state(false);
	let ctxAnchor = $state<{ x: number; y: number } | null>(null);
	let ctxLayerId = $state<string | null>(null);
	let exporting = $state(false);

	const gridSizeOptions = [
		{ value: '4', label: '4px' },
		{ value: '8', label: '8px' },
		{ value: '16', label: '16px' },
		{ value: '24', label: '24px' },
		{ value: '32', label: '32px' },
		{ value: '48', label: '48px' }
	];

	const selectedLayer = $derived(
		selectedIds.length === 1 ? (value.layers.find((l) => l.id === selectedIds[0]) ?? null) : null
	);
	const zoomLabel = $derived(zoom === 1 ? 'Fit' : `${Math.round(zoom * 100)}%`);
	const presetValue = $derived(presetIdForSize(value.width, value.height));
	const presetOptions = $derived([
		...CANVAS_PRESETS.map((p) => ({ value: p.id, label: p.label })),
		...(presetValue === 'custom'
			? [{ value: 'custom', label: `${value.width}×${value.height}` }]
			: [])
	]);

	const alignItems: DropdownItem[] = [
		{ id: 'left', label: 'Align left', icon: AlignStartVertical },
		{ id: 'center-h', label: 'Align center', icon: AlignCenterVertical },
		{ id: 'right', label: 'Align right', icon: AlignEndVertical },
		{ id: 'sep-a', label: '', separator: true },
		{ id: 'top', label: 'Align top', icon: AlignStartHorizontal },
		{ id: 'center-v', label: 'Align middle', icon: AlignCenterHorizontal },
		{ id: 'bottom', label: 'Align bottom', icon: AlignEndHorizontal },
		{ id: 'sep-b', label: '', separator: true },
		{ id: 'center', label: 'Center on canvas', icon: AlignCenter },
		{ id: 'full', label: 'Fill canvas', icon: Maximize2 }
	];

	const exportItems: DropdownItem[] = [
		{ id: 'png', label: 'PNG image', icon: ImageIcon, description: 'Lossless · transparent ok' },
		{ id: 'jpeg', label: 'JPEG image', icon: FileImage, description: 'Smaller file size' },
		{ id: 'sep-e', label: '', separator: true },
		{ id: 'json', label: 'JSON document', icon: FileJson, description: 'Editable project data' }
	];

	const ctxItems: ContextMenuItem[] = [
		{ id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
		{ id: 'bring-front', label: 'Bring to front' },
		{ id: 'send-back', label: 'Send to back' },
		{ id: 'sep1', label: '', separator: true },
		{ id: 'lock', label: 'Lock / Unlock' },
		{ id: 'hide', label: 'Hide' },
		{ id: 'sep2', label: '', separator: true },
		{ id: 'delete', label: 'Delete', destructive: true, shortcut: '⌫' }
	];

	function emit(next: CanvasDocument) {
		value = next;
		onchange?.(next);
	}

	function patchLayer(layer: CanvasLayer) {
		emit(updateCanvasLayer(value, layer.id, () => layer));
	}

	function addLayer(layer: CanvasLayer) {
		emit({ ...value, layers: [...value.layers, layer] });
		selectedIds = [layer.id];
	}

	function nextOffset() {
		const n = value.layers.length;
		return { x: 80 + (n % 8) * 24, y: 80 + (n % 8) * 24 };
	}

	function addFromAsset(asset: MediaAsset) {
		const kind = asset.kind === 'audio' ? 'image' : asset.kind;
		const offset = nextOffset();
		addLayer(
			createCanvasLayer(kind, {
				name: asset.name,
				src: asset.src,
				text: asset.kind === 'text' ? 'Text' : undefined,
				zIndex: value.layers.length,
				rect: {
					x: offset.x,
					y: offset.y,
					w: asset.kind === 'text' ? 280 : 320,
					h: asset.kind === 'text' ? 80 : 240
				}
			})
		);
	}

	function addElement(def: CanvasElementDef, at?: { x: number; y: number }) {
		const base = def.partial ?? {};
		const defaults = { w: 240, h: 160 };
		const rectSize = base.rect ?? defaults;
		const w = rectSize.w;
		const h = rectSize.h;
		let x: number;
		let y: number;
		if (at) {
			x = Math.min(Math.max(0, Math.round(at.x - w / 2)), Math.max(0, value.width - w));
			y = Math.min(Math.max(0, Math.round(at.y - h / 2)), Math.max(0, value.height - h));
			if (snap) {
				x = Math.round(x / cellSize) * cellSize;
				y = Math.round(y / cellSize) * cellSize;
			}
		} else {
			const offset = nextOffset();
			x = offset.x;
			y = offset.y;
		}
		addLayer(
			createCanvasLayer(def.kind, {
				...base,
				zIndex: value.layers.length,
				rect: { x, y, w, h }
			})
		);
	}

	function setZoom(next: number) {
		zoom = Math.min(3, Math.max(0.25, Math.round(next * 100) / 100));
	}

	function addGuide(orientation: 'horizontal' | 'vertical') {
		const position =
			orientation === 'vertical' ? Math.round(value.width / 2) : Math.round(value.height / 2);
		emit({
			...value,
			guides: [...(value.guides ?? []), createCanvasGuide(orientation, position)]
		});
		showGuides = true;
	}

	function toggleGuidesLocked() {
		emit({ ...value, guidesLocked: !value.guidesLocked });
	}

	function nudgeSelected(dx: number, dy: number) {
		if (!selectedIds.length) return;
		emit(
			updateCanvasLayers(value, selectedIds, (l) => {
				if (l.locked) return l;
				const x = Math.min(
					Math.max(0, l.rect.x + dx),
					Math.max(0, value.width - l.rect.w)
				);
				const y = Math.min(
					Math.max(0, l.rect.y + dy),
					Math.max(0, value.height - l.rect.h)
				);
				return { ...l, rect: { ...l.rect, x, y } };
			})
		);
	}

	function applyPreset(id: string) {
		const preset = CANVAS_PRESETS.find((p) => p.id === id);
		if (!preset) return;
		emit({ ...value, width: preset.width, height: preset.height });
		zoom = 1;
	}

	function alignSelected(align: CanvasAlign) {
		if (!selectedIds.length) return;
		const bounds = { width: value.width, height: value.height };
		emit(
			updateCanvasLayers(value, selectedIds, (l) => ({
				...l,
				rect: alignLayerRect(l.rect, bounds, align)
			}))
		);
	}

	function deleteSelected() {
		if (!selectedIds.length) return;
		const set = new Set(selectedIds);
		emit({ ...value, layers: value.layers.filter((l) => !set.has(l.id)) });
		selectedIds = [];
	}

	function duplicateSelected() {
		const set = new Set(selectedIds);
		const clones: CanvasLayer[] = [];
		for (const layer of value.layers) {
			if (!set.has(layer.id)) continue;
			const { id: _id, ...rest } = layer;
			clones.push(
				createCanvasLayer(layer.kind, {
					...rest,
					name: `${layer.name} copy`,
					zIndex: value.layers.length + clones.length,
					rect: { ...layer.rect, x: layer.rect.x + 24, y: layer.rect.y + 24 }
				})
			);
		}
		if (!clones.length) return;
		emit({ ...value, layers: [...value.layers, ...clones] });
		selectedIds = clones.map((c) => c.id);
	}

	function bringFront() {
		const set = new Set(selectedIds);
		const rest = value.layers.filter((l) => !set.has(l.id));
		const selected = value.layers.filter((l) => set.has(l.id));
		emit({
			...value,
			layers: reorderCanvasLayers(
				[...rest, ...selected],
				[...rest, ...selected].map((l) => l.id)
			)
		});
	}

	function sendBack() {
		const set = new Set(selectedIds);
		const rest = value.layers.filter((l) => !set.has(l.id));
		const selected = value.layers.filter((l) => set.has(l.id));
		emit({
			...value,
			layers: reorderCanvasLayers(
				[...selected, ...rest],
				[...selected, ...rest].map((l) => l.id)
			)
		});
	}

	function handleCtx(id: string) {
		const targetId = ctxLayerId;
		if (targetId && !selectedIds.includes(targetId)) selectedIds = [targetId];
		if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
		else if (id === 'bring-front') bringFront();
		else if (id === 'send-back') sendBack();
		else if (id === 'lock') {
			emit(updateCanvasLayers(value, selectedIds, (l) => ({ ...l, locked: !l.locked })));
		} else if (id === 'hide') {
			emit(updateCanvasLayers(value, selectedIds, (l) => ({ ...l, visible: false })));
			selectedIds = [];
		}
	}

	function handleBulk(id: string) {
		if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
		else if (id === 'lock') {
			emit(updateCanvasLayers(value, selectedIds, (l) => ({ ...l, locked: true })));
		} else if (id === 'hide') {
			emit(updateCanvasLayers(value, selectedIds, (l) => ({ ...l, visible: false })));
			selectedIds = [];
		} else if (id === 'front') bringFront();
		else if (id === 'back') sendBack();
	}

	function selectFromList(id: string, e?: MouseEvent) {
		if (e?.shiftKey || e?.metaKey || e?.ctrlKey) {
			const set = new Set(selectedIds);
			if (set.has(id)) set.delete(id);
			else set.add(id);
			selectedIds = [...set];
		} else {
			selectedIds = [id];
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		const t = e.target as HTMLElement | null;
		if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return;

		if (e.key === 'Delete' || e.key === 'Backspace') {
			if (!selectedIds.length) return;
			e.preventDefault();
			deleteSelected();
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
			e.preventDefault();
			duplicateSelected();
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
			e.preventDefault();
			selectedIds = value.layers.map((l) => l.id);
		}
		if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
			e.preventDefault();
			setZoom(zoom + 0.1);
		}
		if ((e.metaKey || e.ctrlKey) && e.key === '-') {
			e.preventDefault();
			setZoom(zoom - 0.1);
		}
		if ((e.metaKey || e.ctrlKey) && e.key === '0') {
			e.preventDefault();
			setZoom(1);
		}
		if (e.key === 'Escape') selectedIds = [];

		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			if (!selectedIds.length) return;
			e.preventDefault();
			const step = e.shiftKey ? (snap ? cellSize * 2 : 10) : snap ? cellSize : 1;
			if (e.key === 'ArrowLeft') nudgeSelected(-step, 0);
			else if (e.key === 'ArrowRight') nudgeSelected(step, 0);
			else if (e.key === 'ArrowUp') nudgeSelected(0, -step);
			else nudgeSelected(0, step);
		}
	}

	async function handleExport(format: CanvasExportFormat) {
		if (exporting) return;
		exporting = true;
		try {
			if (format === 'json') {
				const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
				onexport?.({ format: 'json', document: value, blob });
				downloadBlob(blob, 'canvas-document.json');
				return;
			}
			const blob = await exportCanvasBlob(value, format);
			onexport?.({ format, document: value, blob });
			downloadBlob(blob, format === 'jpeg' ? 'canvas.jpg' : 'canvas.png');
		} catch (err) {
			console.error('Canvas export failed', err);
		} finally {
			exporting = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={['relative flex h-full min-h-0 flex-col', className]}>
	<header
		class="flex shrink-0 items-center gap-3 border-b border-border bg-surface-elevated px-3 py-2"
	>
		<div class="flex min-w-0 items-center gap-2">
			<span class="hidden text-sm font-semibold text-primary sm:inline">Canvas</span>
			<Select
				size="sm"
				class="w-44"
				options={presetOptions}
				value={presetValue}
				onchange={(id) => {
					if (id !== 'custom') applyPreset(id);
				}}
			/>
		</div>

		<div class="hidden h-5 w-px bg-border sm:block"></div>

		<div class="flex items-center rounded-lg border border-border bg-surface p-0.5">
			<IconButton label="Zoom out" size="sm" onclick={() => setZoom(zoom - 0.1)}>
				<ZoomOut class="h-3.5 w-3.5" />
			</IconButton>
			<button
				type="button"
				class="min-w-11 rounded-md px-1 py-1 font-mono text-[11px] tabular-nums text-secondary hover:bg-surface-overlay"
				onclick={() => setZoom(1)}
				title="Fit to view"
			>
				{zoomLabel}
			</button>
			<IconButton label="Zoom in" size="sm" onclick={() => setZoom(zoom + 0.1)}>
				<ZoomIn class="h-3.5 w-3.5" />
			</IconButton>
		</div>

		<div class="flex items-center gap-0.5">
			<Tooltip content="Toggle grid">
				<IconButton
					label="Toggle grid"
					size="sm"
					onclick={() => (showGrid = !showGrid)}
					class={showGrid ? 'bg-brand-500/10 text-brand-600' : undefined}
				>
					<Grid3x3 class="h-3.5 w-3.5" />
				</IconButton>
			</Tooltip>
			{#if showGrid}
				<Select
					size="sm"
					class="w-18"
					options={gridSizeOptions}
					value={String(cellSize)}
					onchange={(v) => (cellSize = Number(v))}
				/>
			{/if}
			<Tooltip content="Snap to grid & guides">
				<IconButton
					label="Toggle snap"
					size="sm"
					onclick={() => (snap = !snap)}
					class={snap ? 'bg-brand-500/10 text-brand-600' : undefined}
				>
					<Magnet class="h-3.5 w-3.5" />
				</IconButton>
			</Tooltip>
		</div>

		<div class="hidden h-5 w-px bg-border sm:block"></div>

		<div class="flex items-center gap-0.5">
			<Tooltip content={showGuides ? 'Hide guides' : 'Show guides'}>
				<IconButton
					label="Toggle guides"
					size="sm"
					onclick={() => (showGuides = !showGuides)}
					class={showGuides ? 'bg-brand-500/10 text-brand-600' : undefined}
				>
					<Eye class="h-3.5 w-3.5" />
				</IconButton>
			</Tooltip>
			<Tooltip content="Add vertical guide">
				<IconButton label="Add vertical guide" size="sm" onclick={() => addGuide('vertical')}>
					<SeparatorVertical class="h-3.5 w-3.5" />
				</IconButton>
			</Tooltip>
			<Tooltip content="Add horizontal guide">
				<IconButton label="Add horizontal guide" size="sm" onclick={() => addGuide('horizontal')}>
					<SeparatorHorizontal class="h-3.5 w-3.5" />
				</IconButton>
			</Tooltip>
			<Tooltip content={value.guidesLocked ? 'Unlock guides' : 'Lock guides'}>
				<IconButton
					label={value.guidesLocked ? 'Unlock guides' : 'Lock guides'}
					size="sm"
					onclick={toggleGuidesLocked}
					class={value.guidesLocked ? 'bg-brand-500/10 text-brand-600' : undefined}
				>
					{#if value.guidesLocked}
						<Lock class="h-3.5 w-3.5" />
					{:else}
						<Unlock class="h-3.5 w-3.5" />
					{/if}
				</IconButton>
			</Tooltip>
		</div>

		{#if selectedIds.length}
			<div class="hidden h-5 w-px bg-border md:block"></div>
			<div class="hidden md:block">
				<DropdownMenu
					size="sm"
					align="start"
					label="Align"
					items={alignItems}
					onselect={(id) => alignSelected(id as CanvasAlign)}
				>
					{#snippet trigger()}
						<span
							class="inline-flex items-center gap-1.5 text-xs font-medium text-secondary"
						>
							<AlignHorizontalJustifyCenter class="h-3.5 w-3.5" />
							Align
						</span>
					{/snippet}
				</DropdownMenu>
			</div>
		{/if}

		<div class="ml-auto flex items-center gap-1">
			<IconButton
				label="Toggle sidebar"
				size="sm"
				onclick={() => (showSidebar = !showSidebar)}
				class={!showSidebar ? 'text-muted' : undefined}
			>
				<PanelLeft class="h-3.5 w-3.5" />
			</IconButton>
			<IconButton
				label="Toggle inspector"
				size="sm"
				onclick={() => (showInspector = !showInspector)}
				class={!showInspector ? 'text-muted' : undefined}
			>
				<PanelRight class="h-3.5 w-3.5" />
			</IconButton>

			<DropdownMenu
				size="sm"
				align="end"
				label="Export"
				items={exportItems}
				disabled={exporting}
				onselect={(id) => handleExport(id as CanvasExportFormat)}
			>
				{#snippet trigger()}
					<span class="inline-flex items-center gap-1.5 px-1 text-xs font-medium">
						<Download class="h-3.5 w-3.5" />
						{exporting ? 'Exporting…' : 'Export'}
					</span>
				{/snippet}
			</DropdownMenu>
		</div>
	</header>

	<div class="relative min-h-0 flex-1">
		<EditorShell
			sidebarTitle="Assets"
			inspectorTitle="Inspector"
			workspaceTitle="Artboard"
			showBottom={false}
			{showSidebar}
			{showInspector}
			wrapSidebar={false}
			wrapInspector={true}
			wrapWorkspace={false}
			collapsiblePanels={false}
			sidebarSize={300}
			inspectorSize={300}
			sizeUnit="px"
			sidebarMin={220}
			sidebarMax={480}
			inspectorMin={240}
			inspectorMax={420}
			fullHeight
			class="rounded-none"
		>
			{#snippet sidebar()}
				<SplitPane
					orientation="vertical"
					bind:size={assetsSize}
					unit="percent"
					minSize={28}
					maxSize={78}
					class="h-full"
				>
					{#snippet start()}
						<div class="flex h-full min-h-0 flex-col bg-surface-elevated">
							<div class="flex shrink-0 gap-1 border-b border-border p-2">
								<button
									type="button"
									class={[
										'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										sidebarTab === 'elements'
											? 'bg-brand-500 text-white'
											: 'text-secondary hover:bg-surface-overlay'
									]}
									onclick={() => (sidebarTab = 'elements')}
								>
									Elements
								</button>
								<button
									type="button"
									class={[
										'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										sidebarTab === 'uploads'
											? 'bg-brand-500 text-white'
											: 'text-secondary hover:bg-surface-overlay'
									]}
									onclick={() => (sidebarTab = 'uploads')}
								>
									Uploads
								</button>
							</div>
							<div class="min-h-0 flex-1 overflow-auto">
								{#if sidebarTab === 'elements'}
									<CanvasElementsPanel onadd={addElement} />
								{:else}
									<MediaAssetBrowser
										bind:assets
										selectedId={null}
										accept="image/*,video/*"
										helperText="Images or video"
										allowText={false}
										onassetschange={onassetschange}
										onselect={(id) => {
											const asset = assets.find((a) => a.id === id);
											if (asset) addFromAsset(asset);
										}}
									/>
								{/if}
							</div>
						</div>
					{/snippet}
					{#snippet end()}
						<Panel title="Layers" collapsible={false} class="h-full border-0 shadow-none">
							<MediaLayerList
								layers={value.layers}
								{selectedIds}
								onselect={selectFromList}
								ontogglevisible={(id) =>
									emit(updateCanvasLayer(value, id, (l) => ({ ...l, visible: !l.visible })))}
								ontogglelocked={(id) =>
									emit(updateCanvasLayer(value, id, (l) => ({ ...l, locked: !l.locked })))}
								onreorder={(ids) => emit({ ...value, layers: reorderCanvasLayers(value.layers, ids) })}
							/>
						</Panel>
					{/snippet}
				</SplitPane>
			{/snippet}

			{#snippet workspace()}
				<div class="h-full min-h-0">
					<MediaStage
						document={value}
						{selectedIds}
						{zoom}
						{showGrid}
						{showGuides}
						{snap}
						{cellSize}
						onselect={(ids) => (selectedIds = ids)}
						onzoom={setZoom}
						onlayerchange={patchLayer}
						ondocumentchange={(doc) => {
							emit(doc);
							if ((doc.guides?.length ?? 0) > 0) showGuides = true;
						}}
						oncontextlayer={({ id, x, y }) => {
							ctxLayerId = id;
							ctxAnchor = { x, y };
							ctxOpen = true;
						}}
						ondropelement={({ def, x, y }) => addElement(def, { x, y })}
					/>
				</div>
			{/snippet}

			{#snippet inspector()}
				<CanvasInspector
					document={value}
					layer={selectedLayer}
					selectionCount={selectedIds.length}
					ondocumentchange={emit}
					onchange={patchLayer}
					onalign={alignSelected}
				/>
			{/snippet}
		</EditorShell>

		{#if selectedIds.length > 1}
			<div class="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
				<div class="pointer-events-auto w-full max-w-xl">
					<BulkActionBar
						count={selectedIds.length}
						total={value.layers.length}
						itemLabel="layer"
						itemLabelPlural="layers"
						placement="dock"
						showSelectAll={false}
						actions={[
							{ id: 'duplicate', label: 'Duplicate', icon: Copy, variant: 'secondary' },
							{ id: 'front', label: 'Front', icon: BringToFront, variant: 'secondary' },
							{ id: 'back', label: 'Back', icon: ArrowDownToLine, variant: 'secondary' },
							{ id: 'lock', label: 'Lock', icon: Lock, variant: 'secondary' },
							{ id: 'hide', label: 'Hide', icon: EyeOff, variant: 'secondary' },
							{ id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive', confirm: true }
						]}
						onaction={handleBulk}
						onclear={() => (selectedIds = [])}
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

<ContextMenu
	items={ctxItems}
	bind:open={ctxOpen}
	bind:anchor={ctxAnchor}
	onselect={handleCtx}
/>
