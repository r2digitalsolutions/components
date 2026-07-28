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
		type CanvasAlign,
		type CanvasDocument,
		type CanvasLayer
	} from '$lib/utils/canvasDocument.js';
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
		class?: string;
		ondocumentchange?: (doc: CanvasDocument) => void;
		onchange?: (layer: CanvasLayer) => void;
		onalign?: (align: CanvasAlign) => void;
	}

	let {
		document: doc = null,
		layer = null,
		selectionCount = 0,
		class: className = '',
		ondocumentchange,
		onchange,
		onalign
	}: CanvasInspectorProps = $props();

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
		'sticky'
	];

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

	function patchRect(partial: Partial<CanvasLayer['rect']>) {
		if (!layer) return;
		onchange?.({ ...layer, rect: { ...layer.rect, ...partial } });
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
			<PropertyField label="Name">
				<Input
					size="sm"
					value={layer.name}
					oninput={(e) => patch({ name: (e.currentTarget as HTMLInputElement).value })}
				/>
			</PropertyField>
			<PropertyField label="Visible">
				<Toggle
					checked={layer.visible}
					onchange={(v) => patch({ visible: v })}
					size="sm"
				/>
			</PropertyField>
			<PropertyField label="Locked">
				<Toggle checked={layer.locked} onchange={(v) => patch({ locked: v })} size="sm" />
			</PropertyField>
			<PropertyField label="Opacity">
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
						value={String(Math.round(layer.rect.x))}
						oninput={(e) =>
							patchRect({ x: Number((e.currentTarget as HTMLInputElement).value) })}
					/>
				</PropertyField>
				<PropertyField label="Y">
					<Input
						type="number"
						size="sm"
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
			<PropertyField label="Rotation">
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
			<PropertyField label="Shadow blur">
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
			<PropertyField label="Shadow color">
				<ColorPicker
					value={layer.shadowColor ?? '#000000'}
					showSwatches={false}
					onchange={(v) => patch({ shadowColor: v })}
				/>
			</PropertyField>
			<PropertyField label="Blur">
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
				<PropertyField label="Fit">
					<Select
						size="sm"
						options={fitOptions}
						value={layer.objectFit ?? 'cover'}
						onchange={(v) => patch({ objectFit: v as CanvasLayer['objectFit'] })}
					/>
				</PropertyField>
				<PropertyField label="Corner radius">
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
				<PropertyField label="Content">
					<Textarea
						rows={3}
						value={layer.text ?? ''}
						oninput={(e) => patch({ text: (e.currentTarget as HTMLTextAreaElement).value })}
					/>
				</PropertyField>
				<PropertyField label="Size">
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
				<PropertyField label="Color">
					<ColorPicker
						value={layer.color ?? '#0f172a'}
						onchange={(v) => patch({ color: v })}
					/>
				</PropertyField>
				{#if layer.kind === 'text'}
					<PropertyField label="Background">
						<ColorPicker
							value={layer.textBackground ?? '#ffffff'}
							alpha
							onchange={(v) => patch({ textBackground: v })}
						/>
					</PropertyField>
				{/if}
				{#if layer.kind === 'sticky'}
					<PropertyField label="Note color">
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
				<PropertyField label="Fill">
					<ColorPicker
						value={layer.fill ?? '#3b82f6'}
						onchange={(v) => patch({ fill: v })}
					/>
				</PropertyField>
				{#if layer.kind === 'rect' || layer.kind === 'roundRect'}
					<PropertyField label="Corner radius">
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
				{#if layer.kind === 'line' || layer.kind === 'arrow'}
					<PropertyField label="Stroke width">
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
		<PropertyGroup title="Artboard">
			<p class="px-1 text-[11px] text-muted">{doc.width} × {doc.height}px</p>
			<PropertyField label="Background">
				<ColorPicker
					value={doc.background || '#ffffff'}
					alpha
					onchange={(v) => patchDoc({ background: v })}
				/>
			</PropertyField>
		</PropertyGroup>
	{/if}
</div>
