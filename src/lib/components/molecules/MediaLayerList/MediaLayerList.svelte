<script lang="ts">
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import type { CanvasLayerKind } from '$lib/utils/canvasDocument.js';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Lock from '@lucide/svelte/icons/lock';
	import LockOpen from '@lucide/svelte/icons/lock-open';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';

	export interface MediaLayerListItem {
		id: string;
		name: string;
		kind: CanvasLayerKind;
		visible?: boolean;
		locked?: boolean;
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
		onreorder?: (orderedIds: string[]) => void;
	}

	let {
		layers = [],
		selectedIds,
		selectedId = null,
		class: className = '',
		onselect,
		ontogglevisible,
		ontogglelocked,
		onreorder
	}: MediaLayerListProps = $props();

	/** Top of list = front (highest z). */
	const display = $derived([...layers].slice().reverse());
	const activeIds = $derived(selectedIds ?? (selectedId ? [selectedId] : []));
	const activeSet = $derived(new Set(activeIds));

	let dragId = $state<string | null>(null);

	function onDragStart(id: string, e: DragEvent) {
		dragId = id;
		e.dataTransfer?.setData('text/plain', id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function onDrop(targetId: string, e: DragEvent) {
		e.preventDefault();
		const sourceId = dragId ?? e.dataTransfer?.getData('text/plain');
		dragId = null;
		if (!sourceId || sourceId === targetId) return;
		const idsTopFirst = display.map((l) => l.id);
		const from = idsTopFirst.indexOf(sourceId);
		const to = idsTopFirst.indexOf(targetId);
		if (from < 0 || to < 0) return;
		const next = [...idsTopFirst];
		next.splice(from, 1);
		next.splice(to, 0, sourceId);
		onreorder?.([...next].reverse());
	}
</script>

<ul
	class={['flex flex-col gap-0.5 p-1', className]}
	role="listbox"
	aria-label="Layers"
	aria-multiselectable="true"
>
	{#each display as layer (layer.id)}
		<li ondragover={(e) => e.preventDefault()} ondrop={(e) => onDrop(layer.id, e)}>
			<div
				role="option"
				aria-selected={activeSet.has(layer.id)}
				tabindex="0"
				draggable="true"
				ondragstart={(e) => onDragStart(layer.id, e)}
				ondragend={() => (dragId = null)}
				class={[
					'flex w-full items-center gap-1 rounded-md px-1 py-1 text-left text-xs transition-colors',
					activeSet.has(layer.id)
						? 'bg-brand-500/15 text-primary'
						: 'text-secondary hover:bg-surface-overlay hover:text-primary',
					dragId === layer.id && 'opacity-50'
				]}
				onclick={(e) => onselect?.(layer.id, e)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onselect?.(layer.id);
					}
				}}
			>
				<span class="shrink-0 cursor-grab text-muted active:cursor-grabbing" aria-hidden="true">
					<GripVertical class="h-3.5 w-3.5" />
				</span>
				<MediaKindIcon kind={layer.kind} size="sm" class="shrink-0 opacity-80" />
				<span class="min-w-0 flex-1 truncate font-medium">{layer.name}</span>
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
