<script lang="ts">
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import {
		CANVAS_ELEMENT_MIME,
		type CanvasElementDef
	} from '$lib/components/molecules/CanvasElementsPanel/CanvasElementsPanel.svelte';
	import type { CanvasLayerKind } from '$lib/utils/canvasDocument.js';
	import { isContainerKind } from '$lib/utils/canvasHierarchy.js';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Lock from '@lucide/svelte/icons/lock';
	import LockOpen from '@lucide/svelte/icons/lock-open';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Pencil from '@lucide/svelte/icons/pencil';

	export 	interface MediaLayerListItem {
		id: string;
		name: string;
		kind: CanvasLayerKind;
		visible?: boolean;
		locked?: boolean;
		parentId?: string | null;
		zIndex?: number;
		/** Named slots available on a widget definition (for badge). */
		namedSlotCount?: number;
	}

	interface MediaLayerListProps {
		layers?: MediaLayerListItem[];
		selectedIds?: string[];
		/** @deprecated use selectedIds */
		selectedId?: string | null;
		class?: string;
		onselect?: (id: string, event?: MouseEvent) => void;
		ontogglevisible?: (id: string) => void;
		ontogglelocked?: (id: string) => void;
		/** Sibling reorder within a parent (bottom-first / document z order). */
		onreorder?: (orderedIds: string[], parentId: string | null) => void;
		/** Drop onto a container to reparent. */
		onreparent?: (layerId: string, newParentId: string | null) => void;
		/** Drop a catalog element onto a layer (nested if container). */
		ondropelement?: (payload: { def: CanvasElementDef; parentId: string | null }) => void;
		/** Edit a User Widget blueprint (layer id of the instance). */
		oneditwidget?: (layerId: string) => void;
	}

	let {
		layers = [],
		selectedIds,
		selectedId = null,
		class: className = '',
		onselect,
		ontogglevisible,
		ontogglelocked,
		onreorder,
		onreparent,
		ondropelement,
		oneditwidget
	}: MediaLayerListProps = $props();

	const activeIds = $derived(selectedIds ?? (selectedId ? [selectedId] : []));
	const activeSet = $derived(new Set(activeIds));

	let dragId = $state<string | null>(null);
	let dropTargetId = $state<string | null>(null);
	let dropAsChild = $state(false);
	let dropElement = $state(false);
	let collapsed = $state<Set<string>>(new Set());

	function hasElementDrag(dt: DataTransfer | null) {
		return !!dt && [...dt.types].includes(CANVAS_ELEMENT_MIME);
	}

	type TreeNode = MediaLayerListItem & { depth: number };

	const tree = $derived.by(() => {
		const byParent = new Map<string | null, MediaLayerListItem[]>();
		for (const l of layers) {
			const pid = l.parentId ?? null;
			const list = byParent.get(pid) ?? [];
			list.push(l);
			byParent.set(pid, list);
		}
		for (const [, list] of byParent) {
			list.sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
		}
		const out: TreeNode[] = [];
		const walk = (parentId: string | null, depth: number) => {
			const kids = byParent.get(parentId) ?? [];
			for (const k of kids) {
				out.push({ ...k, depth });
				const childCount = byParent.get(k.id)?.length ?? 0;
				if (!collapsed.has(k.id) && childCount > 0) {
					walk(k.id, depth + 1);
				}
			}
		};
		walk(null, 0);
		return out;
	});

	function toggleCollapse(id: string, e: MouseEvent) {
		e.stopPropagation();
		const next = new Set(collapsed);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		collapsed = next;
	}

	/** Expand ancestors so the current selection is visible in the tree. */
	$effect(() => {
		const ids = activeIds;
		if (!ids.length) return;
		const map = new Map(layers.map((l) => [l.id, l]));
		const next = new Set(collapsed);
		let changed = false;
		for (const id of ids) {
			let cur = map.get(id);
			while (cur?.parentId) {
				if (next.has(cur.parentId)) {
					next.delete(cur.parentId);
					changed = true;
				}
				cur = map.get(cur.parentId);
			}
		}
		if (changed) collapsed = next;
	});

	/** Scroll the primary selection into view after expand. */
	$effect(() => {
		const id = activeIds[0];
		if (!id) return;
		const frame = requestAnimationFrame(() => {
			const el = document.querySelector(`[data-layer-row="${CSS.escape(id)}"]`);
			el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		});
		return () => cancelAnimationFrame(frame);
	});

	function onDragStart(id: string, e: DragEvent) {
		dragId = id;
		e.dataTransfer?.setData('text/plain', id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onDragOver(targetId: string, e: DragEvent) {
		const target = layers.find((l) => l.id === targetId);
		if (!target) return;
		if (hasElementDrag(e.dataTransfer)) {
			e.preventDefault();
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
			dropTargetId = targetId;
			dropElement = true;
			dropAsChild = isContainerKind(target.kind);
			return;
		}
		e.preventDefault();
		dropTargetId = targetId;
		dropElement = false;
		// Drop on container nests; Shift keeps sibling reorder
		dropAsChild = isContainerKind(target.kind) && !e.shiftKey;
	}

	function onDrop(targetId: string, e: DragEvent, forceChild?: boolean) {
		e.preventDefault();
		e.stopPropagation();
		const asChild = forceChild ?? dropAsChild;
		const wasElement = dropElement;
		const sourceId = dragId ?? e.dataTransfer?.getData('text/plain');
		dragId = null;
		dropTargetId = null;
		dropAsChild = false;
		dropElement = false;

		if (wasElement || hasElementDrag(e.dataTransfer)) {
			const raw = e.dataTransfer?.getData(CANVAS_ELEMENT_MIME);
			if (!raw || !ondropelement) return;
			try {
				const def = JSON.parse(raw) as CanvasElementDef;
				const target = layers.find((l) => l.id === targetId);
				if (!target) return;
				const parentId =
					asChild && isContainerKind(target.kind) ? targetId : (target.parentId ?? null);
				ondropelement({ def, parentId });
			} catch {
				/* ignore bad payload */
			}
			return;
		}

		if (!sourceId || sourceId === targetId) return;

		const target = layers.find((l) => l.id === targetId);
		const source = layers.find((l) => l.id === sourceId);
		if (!target || !source) return;

		if (asChild && isContainerKind(target.kind)) {
			onreparent?.(sourceId, targetId);
			return;
		}

		const parentId = target.parentId ?? null;
		const siblings = layers
			.filter((l) => (l.parentId ?? null) === parentId)
			.sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
		const idsTopFirst = siblings.map((l) => l.id);
		const from = idsTopFirst.indexOf(sourceId);
		const to = idsTopFirst.indexOf(targetId);
		if (from >= 0 && to >= 0 && (source.parentId ?? null) === parentId) {
			const next = [...idsTopFirst];
			next.splice(from, 1);
			next.splice(to, 0, sourceId);
			onreorder?.([...next].reverse(), parentId);
			return;
		}

		// Drop beside → same parent as target
		onreparent?.(sourceId, parentId);
	}
</script>

<ul
	class={['flex flex-col gap-0.5 p-1', className]}
	role="listbox"
	aria-label="Layers"
	aria-multiselectable="true"
>
	{#each tree as layer (layer.id)}
		{@const hasKids = layers.some((l) => (l.parentId ?? null) === layer.id)}
		{@const nesting = dropTargetId === layer.id && dropAsChild}
		<li
			ondragover={(e) => onDragOver(layer.id, e)}
			ondragleave={() => {
				if (dropTargetId === layer.id) {
					dropTargetId = null;
					dropAsChild = false;
					dropElement = false;
				}
			}}
			ondrop={(e) => onDrop(layer.id, e)}
		>
			<div
				role="option"
				aria-selected={activeSet.has(layer.id)}
				tabindex="0"
				data-layer-row={layer.id}
				draggable="true"
				ondragstart={(e) => onDragStart(layer.id, e)}
				ondragend={() => {
					dragId = null;
					dropTargetId = null;
					dropAsChild = false;
					dropElement = false;
				}}
				class={[
					'flex w-full items-center gap-0.5 rounded-md px-1 py-1 text-left text-xs transition-colors',
					activeSet.has(layer.id)
						? 'bg-brand-500/15 text-primary'
						: 'text-secondary hover:bg-surface-overlay hover:text-primary',
					dragId === layer.id && 'opacity-50',
					nesting && 'ring-1 ring-brand-500 bg-brand-500/10'
				]}
				style:padding-left={`${4 + layer.depth * 12}px`}
				title={isContainerKind(layer.kind)
					? 'Drop to nest inside · Shift+drop to reorder'
					: undefined}
				onclick={(e) => onselect?.(layer.id, e)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onselect?.(layer.id);
					}
				}}
			>
				{#if hasKids}
					<button
						type="button"
						class="shrink-0 rounded p-0.5 text-muted hover:bg-surface-overlay hover:text-primary"
						aria-label={collapsed.has(layer.id) ? 'Expand' : 'Collapse'}
						onclick={(e) => toggleCollapse(layer.id, e)}
					>
						<ChevronRight
							class={['h-3 w-3 transition-transform', !collapsed.has(layer.id) && 'rotate-90']}
						/>
					</button>
				{:else}
					<span class="inline-block w-4 shrink-0"></span>
				{/if}
				<span class="shrink-0 cursor-grab text-muted active:cursor-grabbing" aria-hidden="true">
					<GripVertical class="h-3.5 w-3.5" />
				</span>
				<MediaKindIcon kind={layer.kind} size="sm" class="shrink-0 opacity-80" />
				<span class="min-w-0 flex-1 truncate font-medium">{layer.name}</span>
				{#if layer.kind === 'widget'}
					<span
						class="shrink-0 rounded bg-brand-500/20 px-1 text-[9px] font-bold uppercase text-brand-600"
						title="User Widget"
					>W</span>
					{#if (layer.namedSlotCount ?? 0) > 0}
						<span
							class="shrink-0 rounded bg-sky-500/15 px-1 text-[9px] font-bold uppercase text-sky-600"
							title="{layer.namedSlotCount} named slot(s) — nest a child and set Fill slot"
						>
							S{layer.namedSlotCount}
						</span>
					{/if}
					{#if oneditwidget}
						<IconButton
							label="Edit widget"
							size="xs"
							onclick={(e) => {
								e.stopPropagation();
								oneditwidget(layer.id);
							}}
						>
							<Pencil class="h-3.5 w-3.5" />
						</IconButton>
					{/if}
				{/if}
				{#if layer.parentId}
					<Tooltip
						content="Remove from parent — move this layer out of its group / wrapper"
						side="top"
					>
						<button
							type="button"
							class="shrink-0 rounded px-1 text-[9px] font-semibold uppercase tracking-wide text-muted hover:bg-surface-overlay hover:text-primary"
							aria-label="Remove from parent group"
							onclick={(e) => {
								e.stopPropagation();
								onreparent?.(layer.id, (() => {
									const parent = layers.find((l) => l.id === layer.parentId);
									return parent?.parentId ?? null;
								})());
							}}
						>
							Out
						</button>
					</Tooltip>
				{/if}
				{#if isContainerKind(layer.kind)}
					<Tooltip
						content="Nest inside — drop a layer or element here to make it a child of this container"
						side="top"
					>
						<button
							type="button"
							class="shrink-0 rounded px-1 text-[9px] font-semibold uppercase tracking-wide text-muted hover:bg-surface-overlay hover:text-primary"
							aria-label="Drop target: nest inside this container"
							ondragover={(e) => {
								e.preventDefault();
								e.stopPropagation();
								dropTargetId = layer.id;
								dropAsChild = true;
							}}
							ondrop={(e) => onDrop(layer.id, e, true)}
						>
							In
						</button>
					</Tooltip>
				{/if}
				<IconButton
					label={layer.visible === false ? 'Show' : 'Hide'}
					size="xs"
					onclick={(e) => {
						e.stopPropagation();
						ontogglevisible?.(layer.id);
					}}
				>
					{#if layer.visible === false}
						<EyeOff class="h-3.5 w-3.5" />
					{:else}
						<Eye class="h-3.5 w-3.5" />
					{/if}
				</IconButton>
				<IconButton
					label={layer.locked ? 'Unlock' : 'Lock'}
					size="xs"
					onclick={(e) => {
						e.stopPropagation();
						ontogglelocked?.(layer.id);
					}}
				>
					{#if layer.locked}
						<Lock class="h-3.5 w-3.5" />
					{:else}
						<LockOpen class="h-3.5 w-3.5" />
					{/if}
				</IconButton>
			</div>
		</li>
	{:else}
		<li class="px-2 py-4 text-center text-xs text-muted">No layers</li>
	{/each}
</ul>
