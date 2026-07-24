<script lang="ts">
	export interface KanbanColumn {
		id: string;
		title: string;
		color?: string;
	}

	export interface KanbanCard {
		id: string;
		columnId: string;
		title: string;
		description?: string;
		tags?: string[];
	}

	interface KanbanProps {
		columns?: KanbanColumn[];
		cards?: KanbanCard[];
		class?: string;
		oncardmove?: (cardId: string, toColumnId: string, index: number) => void;
	}

	let {
		columns = [],
		cards = $bindable([]),
		class: className = '',
		oncardmove
	}: KanbanProps = $props();

	let draggingCardId = $state<string | null>(null);
	let dragOverColumnId = $state<string | null>(null);
	let dragOverCardId = $state<string | null>(null);

	const tagColors = [
		'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
		'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
		'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
		'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
		'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
	];

	function getTagColor(tag: string): string {
		let hash = 0;
		for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) & 0xffff;
		return tagColors[hash % tagColors.length];
	}

	function cardsForColumn(columnId: string): KanbanCard[] {
		return cards.filter((c) => c.columnId === columnId);
	}

	function handleDragStart(e: DragEvent, card: KanbanCard) {
		draggingCardId = card.id;
		e.dataTransfer!.effectAllowed = 'move';
		e.dataTransfer!.setData('text/plain', card.id);
	}

	function handleDragEnd() {
		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function handleColumnDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
		dragOverColumnId = columnId;
	}

	function handleCardDragOver(e: DragEvent, cardId: string) {
		e.preventDefault();
		e.stopPropagation();
		dragOverCardId = cardId;
	}

	function handleDrop(e: DragEvent, columnId: string) {
		e.preventDefault();
		const cardId = e.dataTransfer?.getData('text/plain') ?? draggingCardId;
		if (!cardId) return;

		const colCards = cardsForColumn(columnId).filter((c) => c.id !== cardId);
		let insertIndex = colCards.length;

		if (dragOverCardId && dragOverCardId !== cardId) {
			const overIdx = colCards.findIndex((c) => c.id === dragOverCardId);
			if (overIdx !== -1) insertIndex = overIdx;
		}

		// Build new cards array
		const cardsCopy = cards.filter((c) => c.id !== cardId);
		const colCardsCopy = cardsCopy.filter((c) => c.columnId === columnId);
		const otherCards = cardsCopy.filter((c) => c.columnId !== columnId);

		const movedCard = { ...cards.find((c) => c.id === cardId)!, columnId };
		colCardsCopy.splice(insertIndex, 0, movedCard);

		cards = [...otherCards, ...colCardsCopy];
		oncardmove?.(cardId, columnId, insertIndex);

		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}
</script>

<div class={['flex gap-4 overflow-x-auto pb-3', className]}>
	{#each columns as column (column.id)}
		{@const colCards = cardsForColumn(column.id)}
		{@const isDragTarget = dragOverColumnId === column.id}

		<div
			class={[
				'flex w-72 shrink-0 flex-col rounded-xl border border-border bg-surface-elevated transition-colors duration-150',
				isDragTarget && draggingCardId && 'border-brand-400 bg-brand-50/30 dark:bg-brand-950/20'
			]}
			ondragover={(e) => handleColumnDragOver(e, column.id)}
			ondrop={(e) => handleDrop(e, column.id)}
			ondragleave={() => { if (dragOverColumnId === column.id) dragOverColumnId = null; }}
			role="list"
			aria-label={column.title}
		>
			<!-- Column header -->
			<div class="flex items-center gap-2 px-3.5 py-3 border-b border-border">
				{#if column.color}
					<span class="h-2.5 w-2.5 rounded-full shrink-0" style={`background-color: ${column.color}`}></span>
				{/if}
				<h3 class="min-w-0 flex-1 text-sm font-semibold text-primary truncate">{column.title}</h3>
				<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-overlay px-1.5 text-xs font-medium text-secondary">
					{colCards.length}
				</span>
			</div>

			<!-- Cards -->
			<div class="flex flex-col gap-2 p-2 min-h-[80px]">
				{#each colCards as card (card.id)}
					{@const isDragging = draggingCardId === card.id}
					{@const isDragOver = dragOverCardId === card.id}

					<div
						draggable="true"
						role="listitem"
						ondragstart={(e) => handleDragStart(e, card)}
						ondragend={handleDragEnd}
						ondragover={(e) => handleCardDragOver(e, card.id)}
						ondragleave={() => { if (dragOverCardId === card.id) dragOverCardId = null; }}
						class={[
							'cursor-grab active:cursor-grabbing rounded-lg border border-border bg-surface-overlay p-3 shadow-sm transition-all duration-150',
							isDragging && 'opacity-40 scale-95',
							isDragOver && !isDragging && 'border-brand-400 shadow-md translate-y-0.5'
						]}
					>
						<p class="text-sm font-medium text-primary leading-snug">{card.title}</p>
						{#if card.description}
							<p class="mt-1 text-xs text-secondary leading-relaxed line-clamp-2">{card.description}</p>
						{/if}
						{#if card.tags?.length}
							<div class="mt-2 flex flex-wrap gap-1">
								{#each card.tags as tag (tag)}
									<span class={['rounded-full px-2 py-0.5 text-[11px] font-medium', getTagColor(tag)]}>
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				<!-- Drop placeholder when dragging over empty space -->
				{#if isDragTarget && draggingCardId && dragOverCardId === null}
					<div class="h-16 rounded-lg border-2 border-dashed border-brand-400/50 bg-brand-50/20 dark:bg-brand-950/10"></div>
				{/if}
			</div>
		</div>
	{/each}
</div>
