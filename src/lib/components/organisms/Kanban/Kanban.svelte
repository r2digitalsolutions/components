<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface KanbanColumn {
		id: string;
		title: string;
		color?: string;
		/** Soft WIP limit — shown as warning when exceeded. */
		limit?: number;
	}

	export interface KanbanAssignee {
		name: string;
		avatar?: string;
	}

	export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent';

	export interface KanbanCard {
		id: string;
		columnId: string;
		title: string;
		description?: string;
		tags?: string[];
		priority?: KanbanPriority;
		assignee?: KanbanAssignee;
		dueDate?: string;
	}

	interface KanbanProps {
		columns?: KanbanColumn[];
		cards?: KanbanCard[];
		/**
		 * Max height for the scrollable card list inside each column.
		 * Use `null` / omit with a stretched board (`class` + parent height) so
		 * columns fill available height via flex instead.
		 */
		columnMaxHeight?: string | null;
		class?: string;
		/** Custom card body — receives the card. */
		card?: Snippet<[KanbanCard]>;
		oncardmove?: (cardId: string, toColumnId: string, index: number) => void;
		oncardclick?: (card: KanbanCard) => void;
	}

	let {
		columns = [],
		cards = $bindable([]),
		columnMaxHeight = null,
		class: className = '',
		card: cardSnippet,
		oncardmove,
		oncardclick
	}: KanbanProps = $props();

	let draggingCardId = $state<string | null>(null);
	let dragOverColumnId = $state<string | null>(null);
	/** Insert before this card id, or null = append to column. */
	let dropBeforeCardId = $state<string | null>(null);

	const tagColors = [
		'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300',
		'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
		'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
		'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
		'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
		'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
	];

	const priorityMeta: Record<
		KanbanPriority,
		{ label: string; className: string; dot: string }
	> = {
		low: {
			label: 'Low',
			className: 'text-secondary bg-surface-overlay',
			dot: 'bg-slate-400'
		},
		medium: {
			label: 'Medium',
			className: 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/50',
			dot: 'bg-sky-500'
		},
		high: {
			label: 'High',
			className: 'text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/50',
			dot: 'bg-amber-500'
		},
		urgent: {
			label: 'Urgent',
			className: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/50',
			dot: 'bg-red-500'
		}
	};

	function getTagColor(tag: string): string {
		let hash = 0;
		for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) & 0xffff;
		return tagColors[hash % tagColors.length];
	}

	function initials(name: string): string {
		return name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase() ?? '')
			.join('');
	}

	function cardsForColumn(columnId: string): KanbanCard[] {
		return cards.filter((c) => c.columnId === columnId);
	}

	function handleDragStart(e: DragEvent, card: KanbanCard) {
		draggingCardId = card.id;
		e.dataTransfer!.effectAllowed = 'move';
		e.dataTransfer!.setData('text/plain', card.id);
		if (e.dataTransfer) {
			e.dataTransfer.setData('application/x-kanban-card', card.id);
		}
	}

	function handleDragEnd() {
		draggingCardId = null;
		dragOverColumnId = null;
		dropBeforeCardId = null;
	}

	function handleColumnDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
		dragOverColumnId = columnId;
		// If hovering the empty column body (not a card), append
		const target = e.target as HTMLElement;
		if (target.closest('[data-kanban-card]')) return;
		dropBeforeCardId = null;
	}

	function handleCardDragOver(e: DragEvent, cardId: string) {
		e.preventDefault();
		e.stopPropagation();
		if (cardId === draggingCardId) return;

		const el = e.currentTarget as HTMLElement;
		const rect = el.getBoundingClientRect();
		const before = e.clientY < rect.top + rect.height / 2;
		dropBeforeCardId = before ? cardId : nextCardId(cardId);
		dragOverColumnId =
			cards.find((c) => c.id === cardId)?.columnId ?? dragOverColumnId;
	}

	function nextCardId(cardId: string): string | null {
		const card = cards.find((c) => c.id === cardId);
		if (!card) return null;
		const col = cardsForColumn(card.columnId);
		const idx = col.findIndex((c) => c.id === cardId);
		if (idx < 0 || idx >= col.length - 1) return null;
		return col[idx + 1].id;
	}

	function handleDrop(e: DragEvent, columnId: string) {
		e.preventDefault();
		const cardId =
			e.dataTransfer?.getData('application/x-kanban-card') ||
			e.dataTransfer?.getData('text/plain') ||
			draggingCardId;
		if (!cardId) return;

		const moving = cards.find((c) => c.id === cardId);
		if (!moving) return;

		const without = cards.filter((c) => c.id !== cardId);
		const colCards = without.filter((c) => c.columnId === columnId);
		const others = without.filter((c) => c.columnId !== columnId);

		let insertIndex = colCards.length;
		if (dropBeforeCardId) {
			const idx = colCards.findIndex((c) => c.id === dropBeforeCardId);
			if (idx !== -1) insertIndex = idx;
		}

		const moved: KanbanCard = { ...moving, columnId };
		colCards.splice(insertIndex, 0, moved);
		cards = [...others, ...colCards];
		oncardmove?.(cardId, columnId, insertIndex);

		draggingCardId = null;
		dragOverColumnId = null;
		dropBeforeCardId = null;
	}

	function overLimit(column: KanbanColumn, count: number) {
		return typeof column.limit === 'number' && count > column.limit;
	}
</script>

<div
	class={['kanban flex h-full min-h-0 items-stretch gap-3 overflow-x-auto', className]}
	role="region"
	aria-label="Kanban board"
>
	{#each columns as column (column.id)}
		{@const colCards = cardsForColumn(column.id)}
		{@const isDragTarget = dragOverColumnId === column.id && Boolean(draggingCardId)}
		{@const limited = overLimit(column, colCards.length)}

		<section
			class={[
				'flex w-[17.5rem] shrink-0 flex-col self-stretch rounded-2xl border transition-colors duration-150',
				'bg-surface/80 dark:bg-surface-overlay/40',
				isDragTarget
					? 'border-brand-400 ring-2 ring-brand-500/15'
					: 'border-border/80'
			]}
			ondragover={(e) => handleColumnDragOver(e, column.id)}
			ondrop={(e) => handleDrop(e, column.id)}
			ondragleave={(e) => {
				const related = e.relatedTarget as Node | null;
				if (related && (e.currentTarget as HTMLElement).contains(related)) return;
				if (dragOverColumnId === column.id) {
					dragOverColumnId = null;
					dropBeforeCardId = null;
				}
			}}
			aria-label={column.title}
		>
			<header class="flex shrink-0 items-start gap-2.5 px-3.5 pb-2.5 pt-3.5">
				{#if column.color}
					<span
						class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/60 dark:ring-black/20"
						style={`background-color: ${column.color}`}
						aria-hidden="true"
					></span>
				{/if}
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<h3 class="truncate text-sm font-semibold tracking-tight text-primary">
							{column.title}
						</h3>
						<span
							class={[
								'inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold tabular-nums',
								limited
									? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
									: 'bg-surface-elevated text-secondary shadow-sm'
							]}
						>
							{colCards.length}{#if column.limit}<span class="opacity-50"
									>/{column.limit}</span
								>{/if}
						</span>
					</div>
					{#if limited}
						<p class="mt-0.5 text-[11px] font-medium text-red-600 dark:text-red-400">
							Over WIP limit
						</p>
					{/if}
				</div>
			</header>

			<div
				class="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 pb-3"
				style={columnMaxHeight ? `max-height: ${columnMaxHeight}` : undefined}
			>
				{#if colCards.length === 0}
					<div
						class={[
							'flex min-h-[4.5rem] flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-3 py-4 text-center',
							isDragTarget
								? 'border-brand-400 bg-brand-50/40 dark:bg-brand-950/20'
								: 'border-border/70 text-muted'
						]}
					>
						<p class="text-xs text-muted">
							{isDragTarget ? 'Drop here' : 'No cards'}
						</p>
					</div>
				{:else}
					{#each colCards as card (card.id)}
						{@const isDragging = draggingCardId === card.id}
						{@const showDropBefore =
							isDragTarget && dropBeforeCardId === card.id && !isDragging}

						{#if showDropBefore}
							<div
								class="-my-1 h-0.5 shrink-0 rounded-full bg-brand-500 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]"
								aria-hidden="true"
							></div>
						{/if}

						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<article
							data-kanban-card={card.id}
							draggable="true"
							tabindex="0"
							ondragstart={(e) => handleDragStart(e, card)}
							ondragend={handleDragEnd}
							ondragover={(e) => handleCardDragOver(e, card.id)}
							onclick={() => oncardclick?.(card)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									oncardclick?.(card);
								}
							}}
							class={[
								'relative shrink-0 cursor-grab rounded-xl border bg-surface-elevated p-3 shadow-sm outline-none transition-all duration-150',
								'border-border/90 hover:border-border-strong hover:shadow-md',
								'focus-visible:ring-2 focus-visible:ring-brand-500/30 active:cursor-grabbing',
								isDragging && 'scale-[0.98] opacity-35 ring-2 ring-brand-400/40'
							]}
						>
							{#if cardSnippet}
								{@render cardSnippet(card)}
							{:else}
								{#if card.priority}
									<span
										class={[
											'mb-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
											priorityMeta[card.priority].className
										]}
									>
										<span
											class={['h-1.5 w-1.5 rounded-full', priorityMeta[card.priority].dot]}
										></span>
										{priorityMeta[card.priority].label}
									</span>
								{/if}

								<p class="text-sm font-medium leading-snug text-primary">
									{card.title}
								</p>

								{#if card.description}
									<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-secondary">
										{card.description}
									</p>
								{/if}

								{#if card.tags?.length}
									<div class="mt-2.5 flex flex-wrap gap-1">
										{#each card.tags as tag (tag)}
											<span
												class={[
													'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
													getTagColor(tag)
												]}
											>
												{tag}
											</span>
										{/each}
									</div>
								{/if}

								{#if card.assignee || card.dueDate}
									<div
										class="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2"
									>
										{#if card.assignee}
											<div class="flex min-w-0 items-center gap-1.5">
												{#if card.assignee.avatar}
													<img
														src={card.assignee.avatar}
														alt=""
														class="h-5 w-5 rounded-full object-cover ring-1 ring-border"
													/>
												{:else}
													<span
														class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white"
													>
														{initials(card.assignee.name)}
													</span>
												{/if}
												<span class="truncate text-[11px] text-secondary"
													>{card.assignee.name}</span
												>
											</div>
										{:else}
											<span></span>
										{/if}
										{#if card.dueDate}
											<span
												class="inline-flex items-center gap-1 text-[11px] tabular-nums text-muted"
											>
												<svg
													class="h-3 w-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												{card.dueDate}
											</span>
										{/if}
									</div>
								{/if}
							{/if}
						</article>
					{/each}

					{#if isDragTarget && dropBeforeCardId === null && draggingCardId}
						<div class="h-0.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true"></div>
					{/if}
				{/if}
			</div>
		</section>
	{/each}
</div>
