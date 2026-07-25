<script lang="ts">
	export interface SortableItem {
		id: string;
		label: string;
		description?: string;
		meta?: string;
		disabled?: boolean;
	}

	type SortableSize = 'sm' | 'md';
	type SortableVariant = 'card' | 'plain';

	interface SortableListProps {
		items?: SortableItem[];
		size?: SortableSize;
		variant?: SortableVariant;
		showIndex?: boolean;
		class?: string;
		onreorder?: (items: SortableItem[]) => void;
	}

	let {
		items = $bindable<SortableItem[]>([]),
		size = 'md',
		variant = 'card',
		showIndex = true,
		class: className = '',
		onreorder
	}: SortableListProps = $props();

	let listEl = $state<HTMLUListElement | null>(null);
	let dragId = $state<string | null>(null);
	let dragHeight = $state(48);
	let floatPos = $state({ x: 0, y: 0, w: 0 });
	let offset = $state({ x: 0, y: 0 });

	const draggingItem = $derived(dragId ? items.find((i) => i.id === dragId) : null);
	const draggingIndex = $derived(dragId ? items.findIndex((i) => i.id === dragId) : -1);

	function moveToIndex(sourceId: string, toIndex: number) {
		const from = items.findIndex((i) => i.id === sourceId);
		if (from < 0 || toIndex < 0 || toIndex >= items.length || from === toIndex) return;
		const next = [...items];
		const [moved] = next.splice(from, 1);
		next.splice(toIndex, 0, moved);
		items = next;
		onreorder?.(next);
	}

	function indexFromPoint(clientY: number): number {
		if (!listEl) return -1;
		const rows = [...listEl.querySelectorAll<HTMLElement>('[data-sortable-row]')];
		if (!rows.length) return -1;

		for (let i = 0; i < rows.length; i++) {
			const rect = rows[i].getBoundingClientRect();
			const mid = rect.top + rect.height / 2;
			if (clientY < mid) return i;
		}
		return rows.length - 1;
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragId) return;
		floatPos = {
			x: e.clientX - offset.x,
			y: e.clientY - offset.y,
			w: floatPos.w
		};

		const to = indexFromPoint(e.clientY);
		if (to >= 0) moveToIndex(dragId, to);
	}

	function endDrag() {
		dragId = null;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', endDrag);
		window.removeEventListener('pointercancel', endDrag);
	}

	function startDrag(item: SortableItem, e: PointerEvent) {
		if (item.disabled) return;
		const handle = e.currentTarget as HTMLElement;
		const row = handle.closest('[data-sortable-row]') as HTMLElement | null;
		if (!row) return;

		const rect = row.getBoundingClientRect();
		dragHeight = rect.height;
		offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		floatPos = { x: rect.left, y: rect.top, w: rect.width };
		dragId = item.id;

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', endDrag);
		window.addEventListener('pointercancel', endDrag);
	}

	function onHandleKeydown(item: SortableItem, index: number, e: KeyboardEvent) {
		if (item.disabled) return;
		if (e.key === 'ArrowUp' && index > 0) {
			e.preventDefault();
			moveToIndex(item.id, index - 1);
		}
		if (e.key === 'ArrowDown' && index < items.length - 1) {
			e.preventDefault();
			moveToIndex(item.id, index + 1);
		}
	}
</script>

<ul
	bind:this={listEl}
	class={[
		'relative flex w-full flex-col',
		variant === 'card' ? 'gap-1.5' : 'gap-0 divide-y divide-border overflow-hidden rounded-2xl border border-border',
		className
	]}
	role="list"
	aria-label="Sortable list"
>
	{#each items as item, index (item.id)}
		{@const isDragging = dragId === item.id}
		<li
			data-sortable-row
			data-id={item.id}
			class={[
				variant === 'card' && !isDragging && 'rounded-xl border border-border bg-surface-elevated',
				variant === 'plain' && !isDragging && 'bg-surface-elevated',
				isDragging && 'rounded-xl border border-dashed border-brand-400 bg-brand-50/40 dark:bg-brand-950/20',
				item.disabled && 'opacity-40'
			]}
			style:height={isDragging ? `${dragHeight}px` : undefined}
			aria-hidden={isDragging || undefined}
		>
			{#if isDragging}
				<div class="flex h-full items-center justify-center px-3">
					<span class="text-xs font-medium text-brand-600/70 dark:text-brand-400/70">Drop here</span>
				</div>
			{:else}
				<div
					class={[
						'flex items-center',
						size === 'sm' ? 'gap-1.5 px-2 py-1.5' : 'gap-2 px-2.5 py-2'
					]}
				>
					<button
						type="button"
						class={[
							'flex shrink-0 cursor-grab items-center justify-center rounded-md text-muted transition-colors',
							'hover:bg-surface-overlay hover:text-secondary active:cursor-grabbing',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
							'touch-none select-none',
							size === 'sm' ? 'h-7 w-6' : 'h-8 w-7',
							item.disabled && 'cursor-not-allowed'
						]}
						aria-label={`Reorder ${item.label}. Use arrow keys to move.`}
						disabled={item.disabled}
						onpointerdown={(e) => {
							e.preventDefault();
							startDrag(item, e);
						}}
						onkeydown={(e) => onHandleKeydown(item, index, e)}
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<circle cx="9" cy="7" r="1.5" />
							<circle cx="15" cy="7" r="1.5" />
							<circle cx="9" cy="12" r="1.5" />
							<circle cx="15" cy="12" r="1.5" />
							<circle cx="9" cy="17" r="1.5" />
							<circle cx="15" cy="17" r="1.5" />
						</svg>
					</button>

					{#if showIndex}
						<span
							class={[
								'flex shrink-0 items-center justify-center font-mono tabular-nums text-muted',
								size === 'sm' ? 'w-4 text-[10px]' : 'w-5 text-xs'
							]}
						>
							{index + 1}
						</span>
					{/if}

					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-primary">{item.label}</p>
						{#if item.description}
							<p class="truncate text-xs text-secondary">{item.description}</p>
						{/if}
					</div>

					{#if item.meta}
						<span class="shrink-0 text-[11px] tabular-nums text-muted">{item.meta}</span>
					{/if}
				</div>
			{/if}
		</li>
	{/each}
</ul>

{#if draggingItem && dragId}
	<div
		class={[
			'pointer-events-none fixed z-[100] rounded-xl border border-brand-400 bg-surface-elevated shadow-xl',
			'ring-2 ring-brand-500/20'
		]}
		style:left="{floatPos.x}px"
		style:top="{floatPos.y}px"
		style:width="{floatPos.w}px"
		aria-hidden="true"
	>
		<div
			class={[
				'flex items-center',
				size === 'sm' ? 'gap-1.5 px-2 py-1.5' : 'gap-2 px-2.5 py-2'
			]}
		>
			<span class="flex h-8 w-7 items-center justify-center text-muted">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<circle cx="9" cy="7" r="1.5" />
					<circle cx="15" cy="7" r="1.5" />
					<circle cx="9" cy="12" r="1.5" />
					<circle cx="15" cy="12" r="1.5" />
					<circle cx="9" cy="17" r="1.5" />
					<circle cx="15" cy="17" r="1.5" />
				</svg>
			</span>
			{#if showIndex && draggingIndex >= 0}
				<span class="w-5 text-center font-mono text-xs tabular-nums text-muted">{draggingIndex + 1}</span>
			{/if}
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-primary">{draggingItem.label}</p>
				{#if draggingItem.description}
					<p class="truncate text-xs text-secondary">{draggingItem.description}</p>
				{/if}
			</div>
			{#if draggingItem.meta}
				<span class="shrink-0 text-[11px] tabular-nums text-muted">{draggingItem.meta}</span>
			{/if}
		</div>
	</div>
{/if}
