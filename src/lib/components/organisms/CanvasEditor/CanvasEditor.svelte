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
		createPathFromDocPoints,
		defaultSlotFromRect,
		emptyCanvasDocument,
		migrateCanvasDocument,
		presetIdForSize,
		type CanvasAlign,
		type CanvasDocument,
		type CanvasLayer,
		type CanvasLayerKind
	} from '$lib/utils/canvasDocument.js';
	import {
		deleteSubtree,
		duplicateSubtree,
		groupLayers,
		isContainerKind,
		computeAbsoluteRects,
		contentPadding,
		reparentLayer,
		reorderSiblings,
		ungroupLayers,
		wrapSelection,
		slotFromLocalRect
	} from '$lib/utils/canvasHierarchy.js';
	import {
		breakWidgetInstance,
		createWidgetFromSelection,
		deleteWidgetDefinition,
		duplicateWidgetDefinition,
		placeWidgetInstance,
		renameWidgetDefinition,
		setExposedProp,
		setInstanceOverride,
		syncInstanceSizesToDefinition,
		updateWidgetDefinition
	} from '$lib/utils/canvasWidget.js';
	import {
		createCanvasHistory,
		pushCanvasHistory,
		redoCanvasHistory,
		undoCanvasHistory,
		type CanvasHistoryState
	} from '$lib/utils/canvasHistory.js';
	import {
		downloadBlob,
		exportCanvasBlob,
		type CanvasExportFormat
	} from '$lib/utils/canvasExport.js';
	import { toast } from '$lib/components/organisms/Toast/toast.svelte.js';
	import type { MediaAsset } from '$lib/utils/mediaTracks.js';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import Redo2 from '@lucide/svelte/icons/redo-2';
	import CopyPlus from '@lucide/svelte/icons/copy-plus';
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
	import Pencil from '@lucide/svelte/icons/pencil';
	import TextCursorInput from '@lucide/svelte/icons/text-cursor-input';
	import Group from '@lucide/svelte/icons/group';
	import Ungroup from '@lucide/svelte/icons/ungroup';
	import Component from '@lucide/svelte/icons/component';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
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

	// Ensure v2 document shape
	$effect.pre(() => {
		if (value.version !== 2 || !value.widgets) {
			value = migrateCanvasDocument(value);
		}
	});

	let selectedIds = $state<string[]>([]);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let assetsSize = $state(58);
	let sidebarTab = $state<'elements' | 'uploads' | 'widgets'>('elements');
	let zoom = $state(1);
	let showGrid = $state(false);
	let showGuides = $state(true);
	let snap = $state(true);
	let cellSize = $state(8);
	let drawMode = $state(false);
	let ctxOpen = $state(false);
	let ctxAnchor = $state<{ x: number; y: number } | null>(null);
	let ctxLayerId = $state<string | null>(null);
	let exporting = $state(false);
	/** When set, stage edits this widget definition instead of the scene. */
	let editingWidgetId = $state<string | null>(null);
	let history = $state<CanvasHistoryState>(createCanvasHistory(value));
	let applyingHistory = false;
	let syncInstanceSizes = $state(true);

	const gridSizeOptions = [
		{ value: '4', label: '4px' },
		{ value: '8', label: '8px' },
		{ value: '16', label: '16px' },
		{ value: '24', label: '24px' },
		{ value: '32', label: '32px' },
		{ value: '48', label: '48px' }
	];

	const editingWidget = $derived(
		editingWidgetId
			? ((value.widgets ?? []).find((w) => w.id === editingWidgetId) ?? null)
			: null
	);

	const stageDoc = $derived.by((): CanvasDocument => {
		if (!editingWidget) return value;
		return {
			...value,
			width: editingWidget.width,
			height: editingWidget.height,
			background: editingWidget.background ?? '#ffffff',
			layers: editingWidget.layers,
			guides: [],
			widgets: value.widgets
		};
	});

	const selectedLayer = $derived(
		selectedIds.length === 1
			? (stageDoc.layers.find((l) => l.id === selectedIds[0]) ?? null)
			: null
	);
	const zoomLabel = $derived(zoom === 1 ? 'Fit' : `${Math.round(zoom * 100)}%`);
	const presetValue = $derived(presetIdForSize(value.width, value.height));
	const presetOptions = $derived([
		...CANVAS_PRESETS.map((p) => ({ value: p.id, label: p.label })),
		...(presetValue === 'custom'
			? [{ value: 'custom', label: `${value.width}×${value.height}` }]
			: [])
	]);

	const wrapItems: DropdownItem[] = [
		{
			id: 'group',
			label: 'Group',
			icon: Group,
			description: 'Logical folder — no layout'
		},
		{
			id: 'border',
			label: 'Border',
			description: 'Background panel that can clip children'
		},
		{
			id: 'overlay',
			label: 'Overlay',
			description: 'Stack children on top of each other'
		},
		{
			id: 'canvasPanel',
			label: 'Canvas Panel',
			description: 'Absolute-positioned children (UMG canvas)'
		},
		{
			id: 'hBox',
			label: 'Horizontal Box',
			description: 'Lay out children in a row'
		},
		{
			id: 'vBox',
			label: 'Vertical Box',
			description: 'Lay out children in a column'
		},
		{
			id: 'scrollBox',
			label: 'Scroll Box',
			description: 'Scrollable container'
		},
		{
			id: 'wrapBox',
			label: 'Wrap Box',
			description: 'Flow children and wrap to next line'
		},
		{
			id: 'uniformGrid',
			label: 'Uniform Grid',
			description: 'Fixed columns grid'
		},
		{
			id: 'sizeBox',
			label: 'Size Box',
			description: 'Constrain child size'
		},
		{ id: 'sep-w', label: '', separator: true },
		{
			id: 'widget',
			label: 'Create Widget',
			icon: Component,
			description: 'Reusable User Widget from selection'
		},
		{ id: 'sep-u', label: '', separator: true },
		{
			id: 'detach',
			label: 'Remove from parent',
			description: 'Move out of group / wrapper (keep parent)'
		},
		{
			id: 'ungroup',
			label: 'Ungroup / unwrap',
			description: 'Dissolve selected group and keep children'
		}
	];

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

	const ctxItems = $derived.by((): ContextMenuItem[] => {
		const focusIds =
			ctxLayerId && !selectedIds.includes(ctxLayerId) ? [ctxLayerId] : selectedIds;
		const hasParent = focusIds.some((id) => {
			const l = stageDoc.layers.find((x) => x.id === id);
			return !!l?.parentId;
		});
		const canUngroup = focusIds.some((id) => {
			const l = stageDoc.layers.find((x) => x.id === id);
			return !!l && (l.kind === 'group' || isContainerKind(l.kind));
		});
		return [
			{ id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
			{ id: 'bring-front', label: 'Bring to front' },
			{ id: 'send-back', label: 'Send to back' },
			{ id: 'sep-wrap', label: '', separator: true },
			{ id: 'hdr-wrap', label: 'Add parent', header: true },
			{
				id: 'group',
				label: 'Group',
				shortcut: '⌘G',
				description: 'Logical folder — no layout'
			},
			{
				id: 'wrap-border',
				label: 'Border',
				description: 'Background panel that can clip children'
			},
			{
				id: 'wrap-overlay',
				label: 'Overlay',
				description: 'Stack children on top of each other'
			},
			{
				id: 'wrap-canvasPanel',
				label: 'Canvas Panel',
				description: 'Absolute-positioned children'
			},
			{
				id: 'wrap-hBox',
				label: 'Horizontal Box',
				description: 'Lay out children in a row'
			},
			{
				id: 'wrap-vBox',
				label: 'Vertical Box',
				description: 'Lay out children in a column'
			},
			{
				id: 'wrap-scrollBox',
				label: 'Scroll Box',
				description: 'Scrollable container'
			},
			{
				id: 'wrap-wrapBox',
				label: 'Wrap Box',
				description: 'Flow children and wrap lines'
			},
			{
				id: 'wrap-uniformGrid',
				label: 'Uniform Grid',
				description: 'Fixed columns grid'
			},
			{
				id: 'create-widget',
				label: 'Create Widget',
				description: 'Reusable User Widget from selection'
			},
			{ id: 'sep-detach', label: '', separator: true },
			{
				id: 'detach',
				label: 'Remove from parent',
				disabled: !hasParent,
				description: 'Move out of group / wrapper'
			},
			{
				id: 'ungroup',
				label: 'Ungroup / unwrap',
				shortcut: '⇧⌘G',
				disabled: !canUngroup,
				description: 'Dissolve selected container'
			},
			{ id: 'sep1', label: '', separator: true },
			{ id: 'lock', label: 'Lock / Unlock' },
			{ id: 'hide', label: 'Hide' },
			{ id: 'sep2', label: '', separator: true },
			{ id: 'delete', label: 'Delete', destructive: true, shortcut: '⌫' }
		];
	});

	function emit(next: CanvasDocument) {
		const migrated = migrateCanvasDocument(next);
		if (!applyingHistory) {
			history = pushCanvasHistory(history, migrated);
		} else {
			history = { ...history, last: JSON.stringify(migrated) };
		}
		value = migrated;
		onchange?.(value);
	}

	function undo() {
		const result = undoCanvasHistory(history);
		if (!result) return;
		applyingHistory = true;
		history = result.state;
		value = migrateCanvasDocument(result.doc);
		applyingHistory = false;
		onchange?.(value);
		selectedIds = selectedIds.filter((id) => stageDoc.layers.some((l) => l.id === id));
	}

	function redo() {
		const result = redoCanvasHistory(history);
		if (!result) return;
		applyingHistory = true;
		history = result.state;
		value = migrateCanvasDocument(result.doc);
		applyingHistory = false;
		onchange?.(value);
		selectedIds = selectedIds.filter((id) => stageDoc.layers.some((l) => l.id === id));
	}

	function emitStageLayers(layers: CanvasLayer[], extra?: Partial<CanvasDocument>) {
		if (editingWidgetId) {
			let next = updateWidgetDefinition(value, editingWidgetId, (d) => ({
				...d,
				layers,
				width: extra?.width ?? d.width,
				height: extra?.height ?? d.height,
				background: extra?.background ?? d.background
			}));
			const sizeChanged =
				extra?.width != null || extra?.height != null;
			if (sizeChanged && syncInstanceSizes) {
				next = syncInstanceSizesToDefinition(next, editingWidgetId);
			}
			emit(next);
			return;
		}
		emit({ ...value, ...extra, layers });
	}

	function patchLayer(layer: CanvasLayer) {
		emitStageLayers(stageDoc.layers.map((l) => (l.id === layer.id ? layer : l)));
	}

	function addLayer(layer: CanvasLayer, opts?: { parentId?: string | null }) {
		let parentId: string | null = null;
		if (opts?.parentId !== undefined) {
			if (opts.parentId) {
				const candidate = stageDoc.layers.find((l) => l.id === opts.parentId);
				if (candidate && isContainerKind(candidate.kind)) parentId = candidate.id;
			}
		} else if (selectedIds.length === 1) {
			const candidate = stageDoc.layers.find((l) => l.id === selectedIds[0]);
			if (candidate && isContainerKind(candidate.kind)) parentId = candidate.id;
		}

		let nextLayers = [...stageDoc.layers, layer];
		if (parentId) {
			nextLayers = reparentLayer(nextLayers, layer.id, parentId, {
				width: stageDoc.width,
				height: stageDoc.height
			});
		}
		emitStageLayers(nextLayers);
		selectedIds = [layer.id];
	}

	function nextOffset() {
		const n = stageDoc.layers.length;
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
				zIndex: stageDoc.layers.length,
				rect: {
					x: offset.x,
					y: offset.y,
					w: asset.kind === 'text' ? 280 : 320,
					h: asset.kind === 'text' ? 80 : 240
				}
			})
		);
	}

	function addElement(
		def: CanvasElementDef,
		at?: { x?: number; y?: number; parentId?: string | null }
	) {
		if (def.tool === 'pen') {
			drawMode = true;
			return;
		}
		const base = def.partial ?? {};
		const defaults = { w: 240, h: 160 };
		const rectSize = base.rect ?? defaults;
		let w = rectSize.w;
		let h = rectSize.h;
		let x: number;
		let y: number;

		// Resolve nest target the same way addLayer does (selected container or explicit parentId).
		let nestParentId: string | null | undefined = at?.parentId;
		if (nestParentId === undefined && selectedIds.length === 1) {
			const candidate = stageDoc.layers.find((l) => l.id === selectedIds[0]);
			if (candidate && isContainerKind(candidate.kind)) nestParentId = candidate.id;
		}
		const nesting =
			nestParentId !== undefined ? { parentId: nestParentId } : undefined;

		const fillRootCanvas =
			def.kind === 'canvasPanel' &&
			!nestParentId &&
			at?.x == null &&
			!stageDoc.layers.some((l) => (l.parentId ?? null) === null && l.kind === 'canvasPanel');

		if (fillRootCanvas) {
			x = 0;
			y = 0;
			w = stageDoc.width;
			h = stageDoc.height;
		} else if (at?.x != null && at?.y != null) {
			x = Math.min(Math.max(0, Math.round(at.x - w / 2)), Math.max(0, stageDoc.width - w));
			y = Math.min(Math.max(0, Math.round(at.y - h / 2)), Math.max(0, stageDoc.height - h));
			if (snap) {
				x = Math.round(x / cellSize) * cellSize;
				y = Math.round(y / cellSize) * cellSize;
			}
		} else if (nestParentId) {
			// Spawn in absolute coords inside the parent so reparent doesn't create negative locals (e.g. -20).
			const absMap = computeAbsoluteRects(stageDoc.layers, {
				width: stageDoc.width,
				height: stageDoc.height
			});
			const pa = absMap.get(nestParentId);
			const parent = stageDoc.layers.find((l) => l.id === nestParentId);
			if (pa) {
				const pad = parent ? contentPadding(parent) : { left: 0, top: 0, right: 0, bottom: 0 };
				const cw = Math.max(1, pa.w - pad.left - pad.right);
				const ch = Math.max(1, pa.h - pad.top - pad.bottom);
				x = Math.round(pa.x + pad.left + Math.max(0, (cw - w) / 2));
				y = Math.round(pa.y + pad.top + Math.max(0, (ch - h) / 2));
			} else {
				const offset = nextOffset();
				x = offset.x;
				y = offset.y;
			}
		} else {
			const offset = nextOffset();
			x = offset.x;
			y = offset.y;
		}
		addLayer(
			createCanvasLayer(def.kind, {
				...base,
				name: fillRootCanvas ? (base.name ?? 'Root Canvas') : base.name,
				zIndex: stageDoc.layers.length,
				rect: { x, y, w, h },
				slot: fillRootCanvas
					? {
							anchors: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
							offsets: { left: 0, top: 0, right: 0, bottom: 0 }
						}
					: defaultSlotFromRect({ x, y, w, h }),
				slotName: base.slotName,
				columns: base.columns,
				gap: base.gap,
				clipChildren: base.clipChildren
			}),
			nesting
		);
	}

	function setZoom(next: number) {
		zoom = Math.min(3, Math.max(0.25, Math.round(next * 100) / 100));
	}

	function addGuide(orientation: 'horizontal' | 'vertical') {
		const position =
			orientation === 'vertical'
				? Math.round(stageDoc.width / 2)
				: Math.round(stageDoc.height / 2);
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
		const set = new Set(selectedIds);
		emitStageLayers(
			stageDoc.layers.map((l) => {
				if (!set.has(l.id) || l.locked) return l;
				const x = l.rect.x + dx;
				const y = l.rect.y + dy;
				const rect = { ...l.rect, x, y };
				return {
					...l,
					rect,
					slot: l.slot
						? {
								...l.slot,
								offsets: {
									...l.slot.offsets,
									left: l.slot.offsets.left + dx,
									top: l.slot.offsets.top + dy
								}
							}
						: defaultSlotFromRect(rect)
				};
			})
		);
	}

	function applyPreset(id: string) {
		if (editingWidgetId) return;
		const preset = CANVAS_PRESETS.find((p) => p.id === id);
		if (!preset) return;
		emit({ ...value, width: preset.width, height: preset.height });
		zoom = 1;
	}

	function alignSelected(align: CanvasAlign) {
		if (!selectedIds.length) return;
		const set = new Set(selectedIds);
		const absMap = computeAbsoluteRects(stageDoc.layers, {
			width: stageDoc.width,
			height: stageDoc.height
		});
		emitStageLayers(
			stageDoc.layers.map((l) => {
				if (!set.has(l.id)) return l;
				const parentId = l.parentId ?? null;
				let bounds = { width: stageDoc.width, height: stageDoc.height };
				if (parentId) {
					const parent = stageDoc.layers.find((p) => p.id === parentId);
					const parentAbs = absMap.get(parentId);
					if (parent && parentAbs) {
						const pad = contentPadding(parent);
						bounds = {
							width: Math.max(1, parentAbs.w - pad.left - pad.right),
							height: Math.max(1, parentAbs.h - pad.top - pad.bottom)
						};
					}
				}
				const rect = alignLayerRect(l.rect, bounds, align);
				const anchors = l.slot?.anchors ?? { minX: 0, minY: 0, maxX: 0, maxY: 0 };
				const slot = {
					...slotFromLocalRect(bounds, rect, anchors),
					padding: l.slot?.padding,
					sizeRule: l.slot?.sizeRule,
					alignment: l.slot?.alignment,
					order: l.slot?.order
				};
				return { ...l, rect, slot };
			})
		);
	}

	function deleteSelected() {
		if (!selectedIds.length) return;
		const next = deleteSubtree(
			{ ...stageDoc, widgets: value.widgets },
			selectedIds
		);
		emitStageLayers(next.layers);
		selectedIds = [];
	}

	function duplicateSelected() {
		const result = duplicateSubtree(
			{ ...stageDoc, widgets: value.widgets },
			selectedIds
		);
		emitStageLayers(result.doc.layers);
		selectedIds = result.newIds;
	}

	function bringFront() {
		const set = new Set(selectedIds);
		const byParent = new Map<string | null, string[]>();
		for (const l of stageDoc.layers) {
			if (!set.has(l.id)) continue;
			const pid = l.parentId ?? null;
			const list = byParent.get(pid) ?? [];
			list.push(l.id);
			byParent.set(pid, list);
		}
		let layers = stageDoc.layers;
		for (const [pid, ids] of byParent) {
			const siblings = layers
				.filter((l) => (l.parentId ?? null) === pid)
				.sort((a, b) => a.zIndex - b.zIndex)
				.map((l) => l.id);
			const rest = siblings.filter((id) => !set.has(id));
			const selected = siblings.filter((id) => set.has(id));
			layers = reorderSiblings(layers, pid, [...rest, ...selected]);
		}
		emitStageLayers(layers);
	}

	function sendBack() {
		const set = new Set(selectedIds);
		let layers = stageDoc.layers;
		const parents = new Set(stageDoc.layers.filter((l) => set.has(l.id)).map((l) => l.parentId ?? null));
		for (const pid of parents) {
			const siblings = layers
				.filter((l) => (l.parentId ?? null) === pid)
				.sort((a, b) => a.zIndex - b.zIndex)
				.map((l) => l.id);
			const rest = siblings.filter((id) => !set.has(id));
			const selected = siblings.filter((id) => set.has(id));
			layers = reorderSiblings(layers, pid, [...selected, ...rest]);
		}
		emitStageLayers(layers);
	}

	function wrapSelected(kind: CanvasLayerKind) {
		const result = wrapSelection(
			{ ...stageDoc, version: 2, widgets: value.widgets ?? [] },
			selectedIds,
			kind
		);
		if (!result) return;
		emitStageLayers(result.doc.layers);
		selectedIds = [result.wrapperId];
	}

	function groupSelected() {
		const result = groupLayers(
			{ ...stageDoc, version: 2, widgets: value.widgets ?? [] },
			selectedIds
		);
		if (!result) return;
		emitStageLayers(result.doc.layers);
		selectedIds = [result.wrapperId];
	}

	function ungroupSelected() {
		if (selectedIds.length !== 1) return;
		const id = selectedIds[0];
		const layer = stageDoc.layers.find((l) => l.id === id);
		if (!layer || (layer.kind !== 'group' && !isContainerKind(layer.kind))) return;
		const kids = stageDoc.layers.filter((l) => (l.parentId ?? null) === id).map((l) => l.id);
		const next = ungroupLayers({ ...stageDoc, version: 2, widgets: value.widgets ?? [] }, id);
		emitStageLayers(next.layers);
		selectedIds = kids;
	}

	/** Move selected layers out of their current parent (grandparent or root). */
	function detachSelected() {
		const rootSize = { width: stageDoc.width, height: stageDoc.height };
		let layers = stageDoc.layers;
		let changed = false;
		for (const id of selectedIds) {
			const layer = layers.find((l) => l.id === id);
			if (!layer?.parentId) continue;
			const parent = layers.find((l) => l.id === layer.parentId);
			const newParentId = parent?.parentId ?? null;
			layers = reparentLayer(layers, id, newParentId, rootSize);
			changed = true;
		}
		if (changed) emitStageLayers(layers);
	}

	function createWidgetSelected() {
		if (editingWidgetId) return;
		if (!selectedIds.length) {
			toast.warning('Select one or more layers to create a widget');
			return;
		}
		const result = createWidgetFromSelection(value, selectedIds, 'Widget');
		if (!result) {
			toast.warning('Create Widget failed', 'Layers must share the same parent');
			return;
		}
		emit(result.doc);
		selectedIds = [result.instanceId];
		toast.success('Widget created');
	}

	function handleWrapMenu(id: string) {
		if (id === 'group') groupSelected();
		else if (id === 'widget') createWidgetSelected();
		else if (id === 'detach') detachSelected();
		else if (id === 'ungroup') ungroupSelected();
		else wrapSelected(id as CanvasLayerKind);
	}

	function handleCtx(id: string) {
		const targetId = ctxLayerId;
		if (targetId && !selectedIds.includes(targetId)) selectedIds = [targetId];
		if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
		else if (id === 'bring-front') bringFront();
		else if (id === 'send-back') sendBack();
		else if (id === 'group') groupSelected();
		else if (id === 'ungroup') ungroupSelected();
		else if (id === 'detach') detachSelected();
		else if (id.startsWith('wrap-')) wrapSelected(id.slice(5) as CanvasLayerKind);
		else if (id === 'create-widget') createWidgetSelected();
		else if (id === 'lock') {
			const set = new Set(selectedIds);
			emitStageLayers(
				stageDoc.layers.map((l) => (set.has(l.id) ? { ...l, locked: !l.locked } : l))
			);
		} else if (id === 'hide') {
			const set = new Set(selectedIds);
			emitStageLayers(
				stageDoc.layers.map((l) => (set.has(l.id) ? { ...l, visible: false } : l))
			);
			selectedIds = [];
		}
	}

	function handleBulk(id: string) {
		if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
		else if (id === 'lock') {
			const set = new Set(selectedIds);
			emitStageLayers(
				stageDoc.layers.map((l) => (set.has(l.id) ? { ...l, locked: true } : l))
			);
		} else if (id === 'hide') {
			const set = new Set(selectedIds);
			emitStageLayers(
				stageDoc.layers.map((l) => (set.has(l.id) ? { ...l, visible: false } : l))
			);
			selectedIds = [];
		} else if (id === 'front') bringFront();
		else if (id === 'back') sendBack();
		else if (id === 'group') groupSelected();
		else if (id === 'detach') detachSelected();
		else if (id === 'ungroup') ungroupSelected();
		else if (id === 'widget') createWidgetSelected();
		else if (
			[
				'border',
				'overlay',
				'canvasPanel',
				'hBox',
				'vBox',
				'scrollBox',
				'wrapBox',
				'uniformGrid',
				'sizeBox'
			].includes(id)
		) {
			wrapSelected(id as CanvasLayerKind);
		}
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

		if (drawMode) {
			if (e.key === 'Escape') drawMode = false;
			return;
		}

		if (e.key === 'Delete' || e.key === 'Backspace') {
			if (!selectedIds.length) return;
			e.preventDefault();
			deleteSelected();
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
			e.preventDefault();
			duplicateSelected();
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
			e.preventDefault();
			if (e.shiftKey) ungroupSelected();
			else groupSelected();
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
			e.preventDefault();
			if (e.shiftKey) redo();
			else undo();
			return;
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
			e.preventDefault();
			redo();
			return;
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
			e.preventDefault();
			// Contextual select: siblings under shared parent, or root layers
			if (selectedIds.length === 1) {
				const cur = stageDoc.layers.find((l) => l.id === selectedIds[0]);
				const pid = cur?.parentId ?? null;
				selectedIds = stageDoc.layers
					.filter((l) => (l.parentId ?? null) === pid)
					.map((l) => l.id);
			} else if (selectedIds.length > 1) {
				const parents = new Set(
					selectedIds.map((id) => stageDoc.layers.find((l) => l.id === id)?.parentId ?? null)
				);
				if (parents.size === 1) {
					const pid = [...parents][0];
					selectedIds = stageDoc.layers
						.filter((l) => (l.parentId ?? null) === pid)
						.map((l) => l.id);
				} else {
					selectedIds = stageDoc.layers
						.filter((l) => (l.parentId ?? null) === null)
						.map((l) => l.id);
				}
			} else {
				selectedIds = stageDoc.layers
					.filter((l) => (l.parentId ?? null) === null)
					.map((l) => l.id);
			}
			return;
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
		if (e.key === 'Escape') {
			if (drawMode) {
				drawMode = false;
				return;
			}
			if (selectedIds.length) {
				selectedIds = [];
				return;
			}
			if (editingWidgetId) {
				exitWidgetEdit();
				return;
			}
		}

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

	function exitWidgetEdit() {
		if (!editingWidgetId) return;
		editingWidgetId = null;
		history = createCanvasHistory(value);
		selectedIds = selectedIds.filter((id) => value.layers.some((l) => l.id === id));
	}

	function enterWidgetEdit(definitionId: string) {
		const def = (value.widgets ?? []).find((w) => w.id === definitionId);
		if (!def) return;
		editingWidgetId = definitionId;
		history = createCanvasHistory(value);
		const roots = def.layers.filter((l) => (l.parentId ?? null) === null);
		selectedIds = roots.length ? [roots.sort((a, b) => a.zIndex - b.zIndex)[0].id] : [];
		zoom = 1;
		sidebarTab = 'elements';
	}

	function deleteWidget(definitionId: string) {
		const next = deleteWidgetDefinition(value, definitionId);
		if (editingWidgetId === definitionId) {
			exitWidgetEdit();
			selectedIds = [];
		} else {
			selectedIds = selectedIds.filter((id) => next.layers.some((l) => l.id === id));
		}
		emit(next);
	}

	function renameWidget(definitionId: string) {
		const def = (value.widgets ?? []).find((w) => w.id === definitionId);
		if (!def) return;
		const name = window.prompt('Widget name', def.name);
		if (name == null) return;
		emit(renameWidgetDefinition(value, definitionId, name));
	}

	function duplicateWidget(definitionId: string) {
		const result = duplicateWidgetDefinition(value, definitionId);
		if (!result) return;
		emit(result.doc);
		toast.success('Widget duplicated');
	}

	function enterLayer(id: string) {
		const layer = stageDoc.layers.find((l) => l.id === id);
		if (!layer) return;
		if (layer.kind === 'widget' && layer.definitionId && !editingWidgetId) {
			enterWidgetEdit(layer.definitionId);
			return;
		}
		// Double-click a scene child that lives under a widget instance → enter that blueprint
		if (!editingWidgetId && layer.parentId) {
			const parent = stageDoc.layers.find((l) => l.id === layer.parentId);
			if (parent?.kind === 'widget' && parent.definitionId) {
				enterWidgetEdit(parent.definitionId);
				return;
			}
		}
		selectedIds = [id];
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={['relative flex h-full min-h-0 flex-col', className]}>
	<header
		class="flex shrink-0 items-center gap-3 border-b border-border bg-surface-elevated px-3 py-2"
	>
		<div class="flex min-w-0 items-center gap-2">
			{#if editingWidget}
				<button
					type="button"
					class="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-secondary hover:bg-surface-overlay"
					onclick={() => {
						exitWidgetEdit();
						selectedIds = [];
					}}
				>
					<ChevronLeft class="h-3.5 w-3.5" />
					Scene
				</button>
				<span class="text-muted">/</span>
				<span class="truncate text-sm font-semibold text-primary">{editingWidget.name}</span>
			{:else}
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
			{/if}
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

		<div class="flex items-center rounded-lg border border-border bg-surface p-0.5">
			<IconButton
				label="Undo"
				size="sm"
				disabled={!history.past.length}
				onclick={undo}
			>
				<Undo2 class="h-3.5 w-3.5" />
			</IconButton>
			<IconButton
				label="Redo"
				size="sm"
				disabled={!history.future.length}
				onclick={redo}
			>
				<Redo2 class="h-3.5 w-3.5" />
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
			<Tooltip content={drawMode ? 'Exit pen tool (Esc)' : 'Pen — draw path / shape'}>
				<IconButton
					label="Pen tool"
					size="sm"
					onclick={() => (drawMode = !drawMode)}
					class={drawMode ? 'bg-brand-500/10 text-brand-600' : undefined}
				>
					<Pencil class="h-3.5 w-3.5" />
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
			<div class="hidden items-center gap-1 md:flex">
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
				<DropdownMenu
					size="sm"
					align="start"
					label="Group"
					items={wrapItems}
					onselect={handleWrapMenu}
				>
					{#snippet trigger()}
						<span class="inline-flex items-center gap-1.5 text-xs font-medium text-secondary">
							<Group class="h-3.5 w-3.5" />
							Group
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
					revealOnHover
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
										sidebarTab === 'widgets'
											? 'bg-brand-500 text-white'
											: 'text-secondary hover:bg-surface-overlay'
									]}
									onclick={() => (sidebarTab = 'widgets')}
								>
									Widgets
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
								{:else if sidebarTab === 'widgets'}
									<div class="flex flex-col gap-2 p-3">
										<p class="text-[11px] text-muted">
											Click to place · pencil to edit · dblclick name to rename
										</p>
										<label class="flex items-center gap-2 text-[11px] text-secondary">
											<input
												type="checkbox"
												class="rounded border-border"
												bind:checked={syncInstanceSizes}
											/>
											Match instance size when blueprint size changes
										</label>
										{#each value.widgets ?? [] as w (w.id)}
											<div
												class={[
													'flex items-center gap-0.5 rounded-lg border bg-surface px-1 py-1 text-xs',
													editingWidgetId === w.id
														? 'border-brand-500 ring-1 ring-brand-500/30'
														: 'border-border'
												]}
											>
												<button
													type="button"
													class="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-left hover:bg-surface-overlay"
													title="Place instance on canvas"
													onclick={() => {
														if (editingWidgetId) {
															enterWidgetEdit(w.id);
															return;
														}
														const next = placeWidgetInstance(value, w.id);
														if (next) {
															emit(next);
															const inst = next.layers[next.layers.length - 1];
															selectedIds = [inst.id];
														}
													}}
												>
													<Component class="h-4 w-4 shrink-0 text-brand-600" />
													<span class="min-w-0 flex-1 truncate font-medium" title={w.name}>
														{w.name}
													</span>
													<span class="shrink-0 text-[10px] text-muted"
														>{w.width}×{w.height}</span
													>
												</button>
												<IconButton
													label="Rename widget"
													size="xs"
													onclick={(e) => {
														e.stopPropagation();
														renameWidget(w.id);
													}}
												>
													<TextCursorInput class="h-3.5 w-3.5" />
												</IconButton>
												<IconButton
													label="Edit widget"
													size="xs"
													onclick={(e) => {
														e.stopPropagation();
														enterWidgetEdit(w.id);
													}}
												>
													<Pencil class="h-3.5 w-3.5" />
												</IconButton>
												<IconButton
													label="Duplicate widget"
													size="xs"
													onclick={(e) => {
														e.stopPropagation();
														duplicateWidget(w.id);
													}}
												>
													<CopyPlus class="h-3.5 w-3.5" />
												</IconButton>
												<IconButton
													label="Delete widget"
													size="xs"
													onclick={(e) => {
														e.stopPropagation();
														deleteWidget(w.id);
													}}
												>
													<Trash2 class="h-3.5 w-3.5" />
												</IconButton>
											</div>
										{:else}
											<p class="py-6 text-center text-xs text-muted">
												Select layers and Create Widget, or Group → Create Widget
											</p>
										{/each}
									</div>
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
								layers={stageDoc.layers.map((l) => {
									if (l.kind !== 'widget' || !l.definitionId) return l;
									const def = (value.widgets ?? []).find((w) => w.id === l.definitionId);
									const namedSlotCount = def
										? def.layers.filter((x) => x.kind === 'namedSlot').length
										: 0;
									return { ...l, namedSlotCount };
								})}
								{selectedIds}
								onselect={selectFromList}
								ontogglevisible={(id) =>
									emitStageLayers(
										stageDoc.layers.map((l) =>
											l.id === id ? { ...l, visible: !l.visible } : l
										)
									)}
								ontogglelocked={(id) =>
									emitStageLayers(
										stageDoc.layers.map((l) =>
											l.id === id ? { ...l, locked: !l.locked } : l
										)
									)}
								onreorder={(ids, parentId) =>
									emitStageLayers(reorderSiblings(stageDoc.layers, parentId, ids))}
								onreparent={(layerId, newParentId) =>
									emitStageLayers(
										reparentLayer(stageDoc.layers, layerId, newParentId, {
											width: stageDoc.width,
											height: stageDoc.height
										})
									)}
								ondropelement={({ def, parentId }) => addElement(def, { parentId })}
								oneditwidget={(layerId) => {
									const layer = stageDoc.layers.find((l) => l.id === layerId);
									if (layer?.kind === 'widget' && layer.definitionId) {
										enterWidgetEdit(layer.definitionId);
									}
								}}
							/>
						</Panel>
					{/snippet}
				</SplitPane>
			{/snippet}

			{#snippet workspace()}
				<div class="h-full min-h-0">
					<MediaStage
						document={stageDoc}
						{selectedIds}
						{zoom}
						{showGrid}
						{showGuides}
						{snap}
						{cellSize}
						{drawMode}
						expandWidgets={!editingWidget}
						onselect={(ids) => (selectedIds = ids)}
						onzoom={setZoom}
						onlayerchange={patchLayer}
						ondocumentchange={(doc) => {
							if (editingWidget) {
								emitStageLayers(doc.layers, {
									width: doc.width,
									height: doc.height,
									background: doc.background
								});
							} else {
								emit(doc);
								if ((doc.guides?.length ?? 0) > 0) showGuides = true;
							}
						}}
						oncontextlayer={({ id, x, y }) => {
							ctxLayerId = id;
							ctxAnchor = { x, y };
							ctxOpen = true;
						}}
						ondropelement={({ def, x, y }) => addElement(def, { x, y })}
						ondrawcomplete={({ points, closed }) => {
							const layer = createPathFromDocPoints(points, {
								closed,
								zIndex: stageDoc.layers.length
							});
							addLayer(layer);
							drawMode = false;
						}}
						ondrawcancel={() => (drawMode = false)}
						onenterlayer={enterLayer}
					/>
				</div>
			{/snippet}

			{#snippet inspector()}
				<CanvasInspector
					document={editingWidget ? stageDoc : value}
					layer={selectedLayer}
					selectionCount={selectedIds.length}
					widgetDefinition={editingWidget}
					ondocumentchange={(doc) => {
						if (editingWidget) {
							emitStageLayers(doc.layers, {
								width: doc.width,
								height: doc.height,
								background: doc.background
							});
						} else {
							emit(doc);
						}
					}}
					onchange={patchLayer}
					onalign={alignSelected}
					onexpose={({ layerId, field, exposed, label }) => {
						if (!editingWidgetId) return;
						emit(
							updateWidgetDefinition(value, editingWidgetId, (d) =>
								setExposedProp(d, layerId, field, exposed, label)
							)
						);
					}}
					onoverride={({ propId, value: v }) => {
						if (!selectedLayer || selectedLayer.kind !== 'widget') return;
						emit(setInstanceOverride(value, selectedLayer.id, propId, v));
					}}
					oneditwidget={(definitionId) => {
						enterWidgetEdit(definitionId);
					}}
					onbreakwidget={() => {
						if (!selectedLayer || selectedLayer.kind !== 'widget') return;
						emit(breakWidgetInstance(value, selectedLayer.id));
						selectedIds = [];
					}}
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
						maxPrimary={4}
						actions={[
							{ id: 'duplicate', label: 'Duplicate', icon: Copy, variant: 'secondary' },
							{ id: 'front', label: 'Front', icon: BringToFront, variant: 'secondary' },
							{ id: 'back', label: 'Back', icon: ArrowDownToLine, variant: 'secondary' },
							{ id: 'detach', label: 'Remove from parent', icon: Ungroup, variant: 'secondary' },
							{ id: 'lock', label: 'Lock', icon: Lock, variant: 'secondary', overflow: true },
							{ id: 'hide', label: 'Hide', icon: EyeOff, variant: 'secondary', overflow: true },
							{
								id: 'delete',
								label: 'Delete',
								icon: Trash2,
								variant: 'destructive',
								confirm: true,
								overflow: true
							}
						]}
						onaction={handleBulk}
						onclear={() => (selectedIds = [])}
					>
						{#snippet extra()}
							<DropdownMenu
								size="sm"
								align="start"
								side="top"
								label="Add parent"
								items={wrapItems}
								onselect={handleWrapMenu}
							>
								{#snippet trigger()}
									<span
										class="inline-flex items-center gap-1.5 text-xs font-medium text-secondary"
									>
										<Group class="h-3.5 w-3.5" />
										Parent
									</span>
								{/snippet}
							</DropdownMenu>
						{/snippet}
					</BulkActionBar>
				</div>
			</div>
		{/if}
	</div>
</div>

<ContextMenu
	items={ctxItems}
	bind:open={ctxOpen}
	bind:anchor={ctxAnchor}
	searchable
	searchPlaceholder="Filter actions…"
	onselect={handleCtx}
/>
