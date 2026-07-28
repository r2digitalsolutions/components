<script lang="ts">
	import PropertyGroup from '$lib/components/molecules/PropertyGroup/PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import ColorPicker from '$lib/components/molecules/ColorPicker/ColorPicker.svelte';
	import FileUploader from '$lib/components/organisms/FileUploader/FileUploader.svelte';
	import {
		alignLayerRect,
		isCanvasFieldModified,
		resetCanvasField,
		type CanvasAlign,
		type CanvasDocument,
		type CanvasExposedProp,
		type CanvasLayer,
		type CanvasResettableField,
		type CanvasWidgetDefinition
	} from '$lib/utils/canvasDocument.js';
	import {
		ANCHOR_PRESETS,
		LAYOUT_BOX_KINDS,
		computeAbsoluteRects,
		contentPadding,
		isContainerKind,
		slotFromLocalRect,
		syncSlotFromRect
	} from '$lib/utils/canvasHierarchy.js';
	import {
		groupExposedPropsByLayer,
		isPropExposed,
		listFillableSlotsForInstance,
		resolveExposedPropValue
	} from '$lib/utils/canvasWidget.js';
	import type { Component } from 'svelte';
	import FlipHorizontal2 from '@lucide/svelte/icons/flip-horizontal-2';
	import FlipVertical2 from '@lucide/svelte/icons/flip-vertical-2';
	import AlignStartVertical from '@lucide/svelte/icons/align-start-vertical';
	import AlignCenterVertical from '@lucide/svelte/icons/align-center-vertical';
	import AlignEndVertical from '@lucide/svelte/icons/align-end-vertical';
	import AlignStartHorizontal from '@lucide/svelte/icons/align-start-horizontal';
	import AlignCenterHorizontal from '@lucide/svelte/icons/align-center-horizontal';
	import AlignEndHorizontal from '@lucide/svelte/icons/align-end-horizontal';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import Maximize2 from '@lucide/svelte/icons/maximize-2';

	type IconComp = Component<{ class?: string }>;

	interface CanvasInspectorProps {
		document?: CanvasDocument | null;
		layer?: CanvasLayer | null;
		selectionCount?: number;
		/** When editing inside a User Widget definition — enables eye toggles. */
		widgetDefinition?: CanvasWidgetDefinition | null;
		class?: string;
		ondocumentchange?: (doc: CanvasDocument) => void;
		onchange?: (layer: CanvasLayer) => void;
		onalign?: (align: CanvasAlign) => void;
		onexpose?: (payload: { layerId: string; field: string; exposed: boolean; label: string }) => void;
		onoverride?: (payload: { propId: string; value: unknown }) => void;
		oneditwidget?: (definitionId: string) => void;
		onbreakwidget?: () => void;
	}

	let {
		document: doc = null,
		layer = null,
		selectionCount = 0,
		widgetDefinition = null,
		class: className = '',
		ondocumentchange,
		onchange,
		onalign,
		onexpose,
		onoverride,
		oneditwidget,
		onbreakwidget
	}: CanvasInspectorProps = $props();

	const exposeMode = $derived(!!widgetDefinition);
	const instanceDef = $derived(
		layer?.kind === 'widget' && layer.definitionId
			? (doc?.widgets ?? []).find((w) => w.id === layer.definitionId) ?? null
			: null
	);
	const exposedGroups = $derived(instanceDef ? groupExposedPropsByLayer(instanceDef) : []);

	function exposedValue(prop: CanvasExposedProp): unknown {
		if (!layer || !instanceDef) return undefined;
		return resolveExposedPropValue(layer, instanceDef, prop);
	}

	/** Parent content box used for slot ↔ rect sync (local X/Y). */
	const parentContentSize = $derived.by((): { width: number; height: number } => {
		if (!doc) return { width: 1, height: 1 };
		const parentId = layer?.parentId ?? null;
		if (!parentId) return { width: doc.width, height: doc.height };
		const absMap = computeAbsoluteRects(doc.layers, { width: doc.width, height: doc.height });
		const parent = doc.layers.find((l) => l.id === parentId);
		const parentAbs = absMap.get(parentId);
		if (!parent || !parentAbs) return { width: doc.width, height: doc.height };
		const pad = contentPadding(parent);
		return {
			width: Math.max(1, parentAbs.w - pad.left - pad.right),
			height: Math.max(1, parentAbs.h - pad.top - pad.bottom)
		};
	});

	const parentLayoutLocked = $derived.by(() => {
		if (!doc || !layer?.parentId) return false;
		const parent = doc.layers.find((l) => l.id === layer.parentId);
		return !!parent && LAYOUT_BOX_KINDS.has(parent.kind);
	});

	function exposedFlag(field: string): boolean | null {
		if (!exposeMode || !layer || !widgetDefinition) return null;
		return isPropExposed(widgetDefinition, layer.id, field);
	}

	function toggleExpose(field: string, label: string, next: boolean) {
		if (!layer) return;
		onexpose?.({ layerId: layer.id, field, exposed: next, label });
	}

	const fitOptions = [
		{ value: 'cover', label: 'Cover' },
		{ value: 'contain', label: 'Contain' },
		{ value: 'fill', label: 'Fill' }
	];
	const weightOptions = [
		{ value: '400', label: 'Regular' },
		{ value: '500', label: 'Medium' },
		{ value: '600', label: 'Semibold' },
		{ value: '700', label: 'Bold' },
		{ value: '800', label: 'Extra bold' }
	];
	const alignOptions = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];
	const styleOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'italic', label: 'Italic' }
	];
	const decoOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'underline', label: 'Underline' },
		{ value: 'line-through', label: 'Strike' }
	];
	const shapeKinds = [
		'rect',
		'roundRect',
		'ellipse',
		'triangle',
		'star',
		'hexagon',
		'pentagon',
		'diamond',
		'heart',
		'line',
		'arrow',
		'sticky',
		'border'
	];

	const anchorOptions = [
		{ value: 'topLeft', label: 'Top left' },
		{ value: 'topCenter', label: 'Top center' },
		{ value: 'topRight', label: 'Top right' },
		{ value: 'centerLeft', label: 'Center left' },
		{ value: 'center', label: 'Center' },
		{ value: 'centerRight', label: 'Center right' },
		{ value: 'bottomLeft', label: 'Bottom left' },
		{ value: 'bottomCenter', label: 'Bottom center' },
		{ value: 'bottomRight', label: 'Bottom right' },
		{ value: 'stretch', label: 'Stretch' },
		{ value: 'stretchHorizontal', label: 'Stretch H' },
		{ value: 'stretchVertical', label: 'Stretch V' }
	];

	const sizeRuleOptions = [
		{ value: 'fixed', label: 'Fixed' },
		{ value: 'fill', label: 'Fill' }
	];

	const alignAxisOptions = [
		{ value: '0', label: 'Start' },
		{ value: '0.5', label: 'Center' },
		{ value: '1', label: 'End' }
	];

	const parentKind = $derived(
		layer?.parentId && doc
			? (doc.layers.find((l) => l.id === layer.parentId)?.kind ?? null)
			: null
	);
	const showChildAlignment = $derived(
		parentKind === 'hBox' || parentKind === 'vBox'
	);
	const showContainerPadding = $derived(
		!!layer && (isContainerKind(layer.kind) || layer.kind === 'widget')
	);

	function currentAnchorPreset(): string {
		const a = layer?.slot?.anchors;
		if (!a) return 'topLeft';
		for (const [key, val] of Object.entries(ANCHOR_PRESETS)) {
			if (
				val.minX === a.minX &&
				val.minY === a.minY &&
				val.maxX === a.maxX &&
				val.maxY === a.maxY
			) {
				return key;
			}
		}
		return 'topLeft';
	}

	function setAnchorPreset(id: string) {
		if (!layer) return;
		const anchors = ANCHOR_PRESETS[id as keyof typeof ANCHOR_PRESETS];
		if (!anchors) return;
		const size = parentContentSize;
		const next = syncSlotFromRect(
			{
				...layer,
				slot: {
					...(layer.slot ?? slotFromLocalRect(size, layer.rect, anchors)),
					anchors: { ...anchors }
				}
			},
			size
		);
		onchange?.(next);
	}

	const alignDock: { id: CanvasAlign; label: string; icon: IconComp }[] = [
		{ id: 'left', label: 'Align left', icon: AlignStartVertical },
		{ id: 'center-h', label: 'Align center', icon: AlignCenterVertical },
		{ id: 'right', label: 'Align right', icon: AlignEndVertical },
		{ id: 'top', label: 'Align top', icon: AlignStartHorizontal },
		{ id: 'center-v', label: 'Align middle', icon: AlignCenterHorizontal },
		{ id: 'bottom', label: 'Align bottom', icon: AlignEndHorizontal },
		{ id: 'center', label: 'Center on canvas', icon: AlignCenter },
		{ id: 'full', label: 'Fill canvas', icon: Maximize2 }
	];

	function patchDoc(partial: Partial<CanvasDocument>) {
		if (!doc) return;
		ondocumentchange?.({ ...doc, ...partial });
	}

	function patch(partial: Partial<CanvasLayer>) {
		if (!layer) return;
		onchange?.({ ...layer, ...partial });
	}

	function fieldModified(field: CanvasResettableField): boolean {
		return !!layer && isCanvasFieldModified(layer, field);
	}

	function resetField(field: CanvasResettableField) {
		if (!layer) return;
		patch(resetCanvasField(layer, field));
	}

	function patchRect(partial: Partial<CanvasLayer['rect']>) {
		if (!layer || !doc) return;
		const rect = { ...layer.rect, ...partial };
		onchange?.(syncSlotFromRect({ ...layer, rect }, parentContentSize));
	}

	function applyAlign(align: CanvasAlign) {
		if (onalign) {
			onalign(align);
			return;
		}
		if (!layer || !doc) return;
		patch({
			rect: alignLayerRect(layer.rect, { width: doc.width, height: doc.height }, align)
		});
	}

	function replaceMedia(files: File[]) {
		const file = files[0];
		if (!file || !layer) return;
		const src = URL.createObjectURL(file);
		const kind = file.type.startsWith('video/')
			? 'video'
			: layer.kind === 'video'
				? 'video'
				: 'image';
		patch({ src, name: file.name, kind });
	}
</script>

<div class={['min-w-0', className]}>
	{#if selectionCount > 1}
		<p class="px-3 py-6 text-center text-xs text-muted">
			{selectionCount} layers selected — use the bulk dock
		</p>
	{:else if !layer}
		<p class="px-3 py-6 text-center text-xs text-muted">Select a layer to edit</p>
	{:else}
		<PropertyGroup title="Layer">
			<PropertyField
				label="Name"
				modified={fieldModified('name')}
				onreset={() => resetField('name')}
			>
				<Input
					size="sm"
					value={layer.name}
					oninput={(e) => patch({ name: (e.currentTarget as HTMLInputElement).value })}
				/>
			</PropertyField>
			<PropertyField
				label="Visible"
				exposed={exposedFlag('visible')}
				onexpose={(v) => toggleExpose('visible', 'Visible', v)}
				modified={fieldModified('visible')}
				onreset={() => resetField('visible')}
			>
				<Toggle
					checked={layer.visible}
					onchange={(v) => patch({ visible: v })}
					size="sm"
				/>
			</PropertyField>
			<PropertyField
				label="Locked"
				modified={fieldModified('locked')}
				onreset={() => resetField('locked')}
			>
				<Toggle checked={layer.locked} onchange={(v) => patch({ locked: v })} size="sm" />
			</PropertyField>
			<PropertyField
				label="Opacity"
				exposed={exposedFlag('opacity')}
				onexpose={(v) => toggleExpose('opacity', 'Opacity', v)}
				modified={fieldModified('opacity')}
				onreset={() => resetField('opacity')}
			>
				<Slider
					size="sm"
					min={0}
					max={1}
					step={0.01}
					value={layer.opacity}
					showValue
					valuePosition="header"
					oninput={(v) => patch({ opacity: v })}
				/>
			</PropertyField>
		</PropertyGroup>

		{#if instanceDef && layer.kind === 'widget'}
			<PropertyGroup title="Widget · {instanceDef.name}">
				{#each exposedGroups as group (group.layerId)}
					<div class="space-y-0.5 border-b border-border/60 py-1 last:border-b-0">
						<p
							class="px-2 pt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted"
							title="Blueprint layer"
						>
							{group.layerName}
						</p>
						{#each group.props as prop (prop.id)}
							{@const current = exposedValue(prop)}
							{@const hasOverride = layer.overrides != null && prop.id in layer.overrides}
							<PropertyField
								label={prop.label}
								modified={hasOverride}
								onreset={() => onoverride?.({ propId: prop.id, value: undefined })}
							>
								{#if prop.field === 'visible'}
									<Toggle
										checked={Boolean(current ?? true)}
										onchange={(v) => onoverride?.({ propId: prop.id, value: v })}
										size="sm"
									/>
								{:else if prop.field === 'opacity' || prop.field === 'fontSize' || prop.field === 'borderRadius' || prop.field === 'strokeWidth'}
									<Input
										type="number"
										size="sm"
										value={current == null || current === '' ? '' : String(current)}
										oninput={(e) =>
											onoverride?.({
												propId: prop.id,
												value: Number((e.currentTarget as HTMLInputElement).value)
											})}
									/>
								{:else if prop.field === 'fill' || prop.field === 'color' || prop.field === 'stroke' || prop.field === 'textBackground'}
									<ColorPicker
										value={String(current ?? '#000000')}
										showSwatches={false}
										onchange={(v) => onoverride?.({ propId: prop.id, value: v })}
									/>
								{:else}
									<Input
										size="sm"
										value={String(current ?? '')}
										oninput={(e) =>
											onoverride?.({
												propId: prop.id,
												value: (e.currentTarget as HTMLInputElement).value
											})}
									/>
								{/if}
							</PropertyField>
						{/each}
					</div>
				{:else}
					<p class="px-2 py-2 text-[11px] text-muted">
						No exposed properties — edit the widget and use the eye icon on fields
					</p>
				{/each}
				<div class="flex flex-col gap-1 px-1 py-1">
					<button
						type="button"
						class="rounded-md border border-border px-2 py-1.5 text-xs hover:bg-surface-overlay"
						onclick={() => layer.definitionId && oneditwidget?.(layer.definitionId)}
					>
						Edit widget blueprint
					</button>
					<button
						type="button"
						class="rounded-md border border-border px-2 py-1.5 text-xs text-danger hover:bg-surface-overlay"
						onclick={() => onbreakwidget?.()}
					>
						Break instance
					</button>
				</div>
			</PropertyGroup>
		{/if}

		<PropertyGroup title="Slot">
			{#if layer.kind === 'namedSlot'}
				<PropertyField label="Slot name">
					<Input
						size="sm"
						value={layer.slotName ?? layer.name}
						oninput={(e) => {
							const v = (e.currentTarget as HTMLInputElement).value;
							patch({ slotName: v, name: layer.name === (layer.slotName ?? layer.name) ? v : layer.name });
						}}
					/>
				</PropertyField>
			{/if}
			{#if layer.parentId && doc?.layers.find((l) => l.id === layer.parentId)?.kind === 'widget'}
				{@const parentWidget = doc.layers.find((l) => l.id === layer.parentId)}
				{@const slots = listFillableSlotsForInstance(doc, parentWidget?.id ?? '')}
				<PropertyField label="Fill slot">
					<Select
						size="sm"
						options={[
							{ value: '', label: 'Host (default)' },
							...slots.map((s) => ({ value: s, label: s }))
						]}
						value={layer.fillSlot ?? ''}
						onchange={(v) => patch({ fillSlot: v || undefined })}
					/>
				</PropertyField>
			{/if}
			<PropertyField label="Anchors">
				<Select
					size="sm"
					options={anchorOptions}
					value={currentAnchorPreset()}
					onchange={(v) => setAnchorPreset(v)}
				/>
			</PropertyField>
			<p class="px-1 pb-1 text-[10px] leading-snug text-muted">
				Cómo se sujeta al padre al redimensionarlo: esquina fija, centro, o Stretch para
				estirarse con el contenedor (como UMG).
			</p>
			<PropertyField label="Size rule">
				<Select
					size="sm"
					options={sizeRuleOptions}
					value={layer.slot?.sizeRule === 'auto' ? 'fixed' : (layer.slot?.sizeRule ?? 'fixed')}
					onchange={(v) =>
						patch({
							slot: {
								...(layer.slot ?? {
									anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
									offsets: { left: 0, top: 0, right: 0, bottom: 0 }
								}),
								sizeRule: v as 'fill' | 'fixed'
							}
						})}
				/>
			</PropertyField>
			{#if showChildAlignment}
				<div class="grid grid-cols-2 gap-2">
					<PropertyField label={parentKind === 'hBox' ? 'Align Y' : 'Align X'}>
						<Select
							size="sm"
							options={alignAxisOptions}
							value={String(
								parentKind === 'hBox'
									? (layer.slot?.alignment?.y ?? 0)
									: (layer.slot?.alignment?.x ?? 0)
							)}
							onchange={(v) => {
								const n = Number(v);
								const alignment =
									parentKind === 'hBox'
										? { x: layer.slot?.alignment?.x ?? 0, y: n }
										: { x: n, y: layer.slot?.alignment?.y ?? 0 };
								patch({
									slot: {
										...(layer.slot ?? {
											anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
											offsets: { left: 0, top: 0, right: 0, bottom: 0 }
										}),
										alignment
									}
								});
							}}
						/>
					</PropertyField>
				</div>
			{/if}
			{#if showContainerPadding}
				<div class="grid grid-cols-2 gap-2">
					<PropertyField label="Pad L">
						<Input
							type="number"
							size="sm"
							value={String(layer.slot?.padding?.left ?? 0)}
							oninput={(e) => {
								const left = Number((e.currentTarget as HTMLInputElement).value) || 0;
								patch({
									slot: {
										...(layer.slot ?? {
											anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
											offsets: { left: 0, top: 0, right: 0, bottom: 0 }
										}),
										padding: {
											left,
											top: layer.slot?.padding?.top ?? 0,
											right: layer.slot?.padding?.right ?? 0,
											bottom: layer.slot?.padding?.bottom ?? 0
										}
									}
								});
							}}
						/>
					</PropertyField>
					<PropertyField label="Pad T">
						<Input
							type="number"
							size="sm"
							value={String(layer.slot?.padding?.top ?? 0)}
							oninput={(e) => {
								const top = Number((e.currentTarget as HTMLInputElement).value) || 0;
								patch({
									slot: {
										...(layer.slot ?? {
											anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
											offsets: { left: 0, top: 0, right: 0, bottom: 0 }
										}),
										padding: {
											left: layer.slot?.padding?.left ?? 0,
											top,
											right: layer.slot?.padding?.right ?? 0,
											bottom: layer.slot?.padding?.bottom ?? 0
										}
									}
								});
							}}
						/>
					</PropertyField>
					<PropertyField label="Pad R">
						<Input
							type="number"
							size="sm"
							value={String(layer.slot?.padding?.right ?? 0)}
							oninput={(e) => {
								const right = Number((e.currentTarget as HTMLInputElement).value) || 0;
								patch({
									slot: {
										...(layer.slot ?? {
											anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
											offsets: { left: 0, top: 0, right: 0, bottom: 0 }
										}),
										padding: {
											left: layer.slot?.padding?.left ?? 0,
											top: layer.slot?.padding?.top ?? 0,
											right,
											bottom: layer.slot?.padding?.bottom ?? 0
										}
									}
								});
							}}
						/>
					</PropertyField>
					<PropertyField label="Pad B">
						<Input
							type="number"
							size="sm"
							value={String(layer.slot?.padding?.bottom ?? 0)}
							oninput={(e) => {
								const bottom = Number((e.currentTarget as HTMLInputElement).value) || 0;
								patch({
									slot: {
										...(layer.slot ?? {
											anchors: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
											offsets: { left: 0, top: 0, right: 0, bottom: 0 }
										}),
										padding: {
											left: layer.slot?.padding?.left ?? 0,
											top: layer.slot?.padding?.top ?? 0,
											right: layer.slot?.padding?.right ?? 0,
											bottom
										}
									}
								});
							}}
						/>
					</PropertyField>
				</div>
			{/if}
			<PropertyField
				label="Clip children"
				modified={fieldModified('clipChildren')}
				onreset={() => resetField('clipChildren')}
			>
				<Toggle
					checked={!!layer.clipChildren || layer.kind === 'scrollBox'}
					onchange={(v) => patch({ clipChildren: v })}
					size="sm"
				/>
			</PropertyField>
			{#if layer.kind === 'hBox' || layer.kind === 'vBox' || layer.kind === 'wrapBox' || layer.kind === 'uniformGrid'}
				<PropertyField
					label="Gap"
					modified={fieldModified('gap')}
					onreset={() => resetField('gap')}
				>
					<Input
						type="number"
						size="sm"
						value={String(layer.gap ?? 0)}
						oninput={(e) =>
							patch({ gap: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
			{/if}
			{#if layer.kind === 'uniformGrid'}
				<PropertyField
					label="Columns"
					modified={fieldModified('columns')}
					onreset={() => resetField('columns')}
				>
					<Input
						type="number"
						size="sm"
						min={1}
						value={String(layer.columns ?? 2)}
						oninput={(e) =>
							patch({ columns: Math.max(1, Number((e.currentTarget as HTMLInputElement).value) || 1) })}
					/>
				</PropertyField>
			{/if}
		</PropertyGroup>

		<PropertyGroup title="Transform">
			<div class="mx-1 mb-1.5 flex w-full min-w-0 flex-col gap-1.5">
				<div
					class="flex w-full flex-nowrap items-center justify-between gap-0 overflow-x-auto rounded-xl border border-border bg-surface-elevated p-0.5 shadow-sm"
					role="toolbar"
					aria-label="Position"
				>
					{#each alignDock as action (action.id)}
						{@const Icon = action.icon}
						<Tooltip content={action.label} side="top" class="shrink-0">
							<IconButton
								label={action.label}
								size="xs"
								variant="ghost"
								onclick={() => applyAlign(action.id)}
							>
								<Icon class="h-3.5 w-3.5" />
							</IconButton>
						</Tooltip>
					{/each}
				</div>
				<div
					class="mx-auto flex w-fit flex-nowrap items-center gap-0 rounded-xl border border-border bg-surface-elevated p-0.5 shadow-sm"
					role="toolbar"
					aria-label="Flip"
				>
					<Tooltip content="Flip horizontal" side="top" class="shrink-0">
						<IconButton
							label="Flip horizontal"
							size="xs"
							variant="ghost"
							class={layer.flipX ? 'bg-brand-500/15 text-brand-600' : undefined}
							aria-pressed={!!layer.flipX}
							onclick={() => patch({ flipX: !layer.flipX })}
						>
							<FlipHorizontal2 class="h-3.5 w-3.5" />
						</IconButton>
					</Tooltip>
					<Tooltip content="Flip vertical" side="top" class="shrink-0">
						<IconButton
							label="Flip vertical"
							size="xs"
							variant="ghost"
							class={layer.flipY ? 'bg-brand-500/15 text-brand-600' : undefined}
							aria-pressed={!!layer.flipY}
							onclick={() => patch({ flipY: !layer.flipY })}
						>
							<FlipVertical2 class="h-3.5 w-3.5" />
						</IconButton>
					</Tooltip>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<PropertyField label="X">
					<Input
						type="number"
						size="sm"
						disabled={parentLayoutLocked}
						value={String(Math.round(layer.rect.x))}
						oninput={(e) =>
							patchRect({ x: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="Y">
					<Input
						type="number"
						size="sm"
						disabled={parentLayoutLocked}
						value={String(Math.round(layer.rect.y))}
						oninput={(e) =>
							patchRect({ y: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="W">
					<Input
						type="number"
						size="sm"
						value={String(Math.round(layer.rect.w))}
						oninput={(e) =>
							patchRect({ w: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="H">
					<Input
						type="number"
						size="sm"
						value={String(Math.round(layer.rect.h))}
						oninput={(e) =>
							patchRect({ h: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
			</div>
			{#if parentLayoutLocked}
				<p class="px-1 pb-1 text-[10px] leading-snug text-muted">
					X/Y los controla el layout del padre (HBox, VBox, Grid…). Usa Group / Border /
					Overlay / Canvas Panel para posición libre.
				</p>
			{:else if layer.parentId}
				<p class="px-1 pb-1 text-[10px] leading-snug text-muted">
					X/Y relativos al padre (0,0 = esquina superior izquierda del contenido).
				</p>
			{/if}
			<PropertyField
				label="Rotation"
				modified={fieldModified('rotation')}
				onreset={() => resetField('rotation')}
			>
				<Slider
					size="sm"
					min={-180}
					max={180}
					step={1}
					value={layer.rotation ?? 0}
					showValue
					valuePosition="header"
					unit="°"
					oninput={(v) => patch({ rotation: v })}
				/>
			</PropertyField>
		</PropertyGroup>

		<PropertyGroup title="Effects">
			<PropertyField
				label="Shadow blur"
				modified={fieldModified('shadowBlur')}
				onreset={() => resetField('shadowBlur')}
			>
				<Slider
					size="sm"
					min={0}
					max={64}
					step={1}
					value={layer.shadowBlur ?? 0}
					showValue
					valuePosition="header"
					unit="px"
					oninput={(v) => patch({ shadowBlur: v })}
				/>
			</PropertyField>
			<PropertyField
				label="Shadow color"
				modified={fieldModified('shadowColor')}
				onreset={() => resetField('shadowColor')}
			>
				<ColorPicker
					value={layer.shadowColor ?? '#000000'}
					showSwatches={false}
					onchange={(v) => patch({ shadowColor: v })}
				/>
			</PropertyField>
			<PropertyField
				label="Blur"
				modified={fieldModified('blur')}
				onreset={() => resetField('blur')}
			>
				<Slider
					size="sm"
					min={0}
					max={40}
					step={1}
					value={layer.blur ?? 0}
					showValue
					valuePosition="header"
					unit="px"
					oninput={(v) => patch({ blur: v })}
				/>
			</PropertyField>
		</PropertyGroup>

		{#if layer.kind === 'image' || layer.kind === 'video'}
			<PropertyGroup title={layer.kind === 'video' ? 'Video' : 'Image'}>
				{#key layer.id}
					<FileUploader
						variant="single"
						label=""
						helperText=""
						accept={layer.kind === 'video' ? 'video/*' : 'image/*'}
						src={layer.src}
						srcName={layer.name}
						maxSizeMb={200}
						onchange={replaceMedia}
						onclear={() => patch({ src: undefined })}
					/>
				{/key}
				<PropertyField
					label="Source"
					exposed={exposedFlag('src')}
					onexpose={(v) => toggleExpose('src', 'Source', v)}
				>
					<Input
						size="sm"
						value={layer.src ?? ''}
						placeholder="https://…"
						oninput={(e) => patch({ src: (e.currentTarget as HTMLInputElement).value || undefined })}
					/>
				</PropertyField>
				<PropertyField
					label="Fit"
					modified={fieldModified('objectFit')}
					onreset={() => resetField('objectFit')}
				>
					<Select
						size="sm"
						options={fitOptions}
						value={layer.objectFit ?? 'cover'}
						onchange={(v) => patch({ objectFit: v as CanvasLayer['objectFit'] })}
					/>
				</PropertyField>
				<PropertyField
					label="Corner radius"
					exposed={exposedFlag('borderRadius')}
					onexpose={(v) => toggleExpose('borderRadius', 'Corner radius', v)}
					modified={fieldModified('borderRadius')}
					onreset={() => resetField('borderRadius')}
				>
					<Slider
						size="sm"
						min={0}
						max={200}
						step={1}
						value={layer.borderRadius ?? 0}
						showValue
						valuePosition="header"
						unit="px"
						oninput={(v) => patch({ borderRadius: v })}
					/>
				</PropertyField>
			</PropertyGroup>
		{/if}

		{#if layer.kind === 'text' || layer.kind === 'sticky'}
			<PropertyGroup title={layer.kind === 'sticky' ? 'Sticky note' : 'Text'}>
				<PropertyField
					label="Content"
					exposed={exposedFlag('text')}
					onexpose={(v) => toggleExpose('text', 'Content', v)}
					modified={fieldModified('text')}
					onreset={() => resetField('text')}
				>
					<Textarea
						rows={3}
						value={layer.text ?? ''}
						oninput={(e) => patch({ text: (e.currentTarget as HTMLTextAreaElement).value })}
					/>
				</PropertyField>
				<PropertyField
					label="Size"
					exposed={exposedFlag('fontSize')}
					onexpose={(v) => toggleExpose('fontSize', 'Size', v)}
					modified={fieldModified('fontSize')}
					onreset={() => resetField('fontSize')}
				>
					<Input
						type="number"
						size="sm"
						value={String(layer.fontSize ?? 32)}
						oninput={(e) =>
							patch({ fontSize: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="Weight">
					<Select
						size="sm"
						options={weightOptions}
						value={String(layer.fontWeight ?? 600)}
						onchange={(v) => patch({ fontWeight: v })}
					/>
				</PropertyField>
				<PropertyField label="Style">
					<Select
						size="sm"
						options={styleOptions}
						value={layer.fontStyle ?? 'normal'}
						onchange={(v) => patch({ fontStyle: v as CanvasLayer['fontStyle'] })}
					/>
				</PropertyField>
				<PropertyField label="Decoration">
					<Select
						size="sm"
						options={decoOptions}
						value={layer.textDecoration ?? 'none'}
						onchange={(v) => patch({ textDecoration: v as CanvasLayer['textDecoration'] })}
					/>
				</PropertyField>
				<PropertyField label="Align">
					<Select
						size="sm"
						options={alignOptions}
						value={layer.textAlign ?? 'left'}
						onchange={(v) => patch({ textAlign: v as CanvasLayer['textAlign'] })}
					/>
				</PropertyField>
				<PropertyField
					label="Color"
					exposed={exposedFlag('color')}
					onexpose={(v) => toggleExpose('color', 'Color', v)}
					modified={fieldModified('color')}
					onreset={() => resetField('color')}
				>
					<ColorPicker
						value={layer.color ?? '#0f172a'}
						onchange={(v) => patch({ color: v })}
					/>
				</PropertyField>
				{#if layer.kind === 'text'}
					<PropertyField
						label="Background"
						exposed={exposedFlag('textBackground')}
						onexpose={(v) => toggleExpose('textBackground', 'Background', v)}
						modified={fieldModified('textBackground')}
						onreset={() => resetField('textBackground')}
					>
						<ColorPicker
							value={layer.textBackground ?? '#ffffff'}
							alpha
							onchange={(v) => patch({ textBackground: v })}
						/>
					</PropertyField>
				{/if}
				{#if layer.kind === 'sticky'}
					<PropertyField
						label="Note color"
						exposed={exposedFlag('fill')}
						onexpose={(v) => toggleExpose('fill', 'Note color', v)}
						modified={fieldModified('fill')}
						onreset={() => resetField('fill')}
					>
						<ColorPicker
							value={layer.fill ?? '#fef08a'}
							onchange={(v) => patch({ fill: v })}
						/>
					</PropertyField>
				{/if}
				<PropertyField label="Letter spacing">
					<Input
						type="number"
						size="sm"
						value={String(layer.letterSpacing ?? 0)}
						oninput={(e) =>
							patch({ letterSpacing: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="Line height">
					<Input
						type="number"
						size="sm"
						step={0.05}
						value={String(layer.lineHeight ?? 1.15)}
						oninput={(e) =>
							patch({ lineHeight: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
			</PropertyGroup>
		{/if}

		{#if shapeKinds.includes(layer.kind) && layer.kind !== 'sticky'}
			<PropertyGroup title="Appearance">
				<PropertyField
					label="Fill"
					exposed={exposedFlag('fill')}
					onexpose={(v) => toggleExpose('fill', 'Fill', v)}
					modified={fieldModified('fill')}
					onreset={() => resetField('fill')}
				>
					<ColorPicker
						value={layer.fill ?? '#3b82f6'}
						onchange={(v) => patch({ fill: v })}
					/>
				</PropertyField>
				{#if layer.kind === 'rect' || layer.kind === 'roundRect' || layer.kind === 'border'}
					<PropertyField
						label="Corner radius"
						exposed={exposedFlag('borderRadius')}
						onexpose={(v) => toggleExpose('borderRadius', 'Corner radius', v)}
						modified={fieldModified('borderRadius')}
						onreset={() => resetField('borderRadius')}
					>
						<Slider
							size="sm"
							min={0}
							max={200}
							step={1}
							value={layer.borderRadius ?? 0}
							showValue
							valuePosition="header"
							unit="px"
							oninput={(v) => patch({ borderRadius: v })}
						/>
					</PropertyField>
				{/if}
				<PropertyField
					label="Stroke"
					exposed={exposedFlag('stroke')}
					onexpose={(v) => toggleExpose('stroke', 'Stroke', v)}
					modified={fieldModified('stroke')}
					onreset={() => resetField('stroke')}
				>
					<ColorPicker
						value={layer.stroke ?? '#000000'}
						onchange={(v) => patch({ stroke: v })}
					/>
				</PropertyField>
				{#if layer.kind === 'line' || layer.kind === 'arrow' || layer.stroke}
					<PropertyField
						label="Stroke width"
						exposed={exposedFlag('strokeWidth')}
						onexpose={(v) => toggleExpose('strokeWidth', 'Stroke width', v)}
					>
						<Input
							type="number"
							size="sm"
							value={String(layer.strokeWidth ?? 4)}
							oninput={(e) =>
								patch({ strokeWidth: Number((e.currentTarget as HTMLInputElement).value) })}
						/>
					</PropertyField>
				{/if}
			</PropertyGroup>
		{/if}
	{/if}

	{#if doc && !layer && selectionCount <= 1}
		<PropertyGroup title={widgetDefinition ? 'Widget artboard' : 'Artboard'}>
			{#if widgetDefinition}
				<div class="grid grid-cols-2 gap-2 px-1">
					<PropertyField label="Width">
						<Input
							type="number"
							size="sm"
							value={String(doc.width)}
							oninput={(e) =>
								patchDoc({
									width: Math.max(24, Number((e.currentTarget as HTMLInputElement).value) || 24)
								})}
						/>
					</PropertyField>
					<PropertyField label="Height">
						<Input
							type="number"
							size="sm"
							value={String(doc.height)}
							oninput={(e) =>
								patchDoc({
									height: Math.max(24, Number((e.currentTarget as HTMLInputElement).value) || 24)
								})}
						/>
					</PropertyField>
				</div>
			{:else}
				<p class="px-1 text-[11px] text-muted">{doc.width} × {doc.height}px</p>
			{/if}
			<PropertyField label="Background">
				<ColorPicker
					value={doc.background || '#ffffff'}
					alpha
					onchange={(v) => patchDoc({ background: v })}
				/>
			</PropertyField>
			{#if widgetDefinition}
				<p class="px-1 pt-1 text-[10px] text-muted">
					Select a layer to edit it. Use the eye icon on properties to expose them on instances.
				</p>
			{/if}
		</PropertyGroup>
	{/if}
</div>
