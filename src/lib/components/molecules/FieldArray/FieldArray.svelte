<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface FieldArrayItem {
		id: string;
		[key: string]: unknown;
	}

	interface FieldArrayProps<T extends FieldArrayItem = FieldArrayItem> {
		items?: T[];
		/** Minimum number of rows */
		min?: number;
		/** Maximum number of rows */
		max?: number;
		addLabel?: string;
		emptyLabel?: string;
		sortable?: boolean;
		disabled?: boolean;
		class?: string;
		/** Render each row; receives item and index via snippet args */
		item?: Snippet<[T, number]>;
		/** Called when items change */
		onchange?: (items: T[]) => void;
		/** Factory for a new empty item */
		createItem?: () => T;
	}

	let {
		items = $bindable<FieldArrayItem[]>([]),
		min = 0,
		max = Infinity,
		addLabel = 'Add item',
		emptyLabel = 'No items yet',
		sortable = false,
		disabled = false,
		class: className = '',
		item,
		onchange,
		createItem
	}: FieldArrayProps = $props();

	function uid() {
		return `fa-${Math.random().toString(36).slice(2, 9)}`;
	}

	function defaultCreate(): FieldArrayItem {
		return { id: uid() };
	}

	function add() {
		if (disabled || items.length >= max) return;
		const next = [...items, (createItem ?? defaultCreate)()];
		items = next;
		onchange?.(next);
	}

	function remove(index: number) {
		if (disabled || items.length <= min) return;
		const next = items.filter((_, i) => i !== index);
		items = next;
		onchange?.(next);
	}

	function move(from: number, to: number) {
		if (disabled || !sortable || to < 0 || to >= items.length) return;
		const next = [...items];
		const [row] = next.splice(from, 1);
		next.splice(to, 0, row);
		items = next;
		onchange?.(next);
	}

	const canAdd = $derived(!disabled && items.length < max);
	const canRemove = $derived(!disabled && items.length > min);
</script>

<div class={['flex flex-col gap-3', className]}>
	{#if items.length === 0}
		<p class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
			{emptyLabel}
		</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each items as row, index (row.id)}
				<li
					class="flex items-start gap-2 rounded-xl border border-border bg-surface-elevated p-3"
				>
					{#if sortable}
						<div class="flex shrink-0 flex-col gap-0.5 pt-1">
							<button
								type="button"
								class="rounded p-0.5 text-muted hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
								disabled={disabled || index === 0}
								aria-label="Move up"
								onclick={() => move(index, index - 1)}
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6" /></svg>
							</button>
							<button
								type="button"
								class="rounded p-0.5 text-muted hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
								disabled={disabled || index === items.length - 1}
								aria-label="Move down"
								onclick={() => move(index, index + 1)}
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" /></svg>
							</button>
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						{#if item}
							{@render item(row, index)}
						{:else}
							<span class="text-sm text-secondary">Item {index + 1}</span>
						{/if}
					</div>

					<button
						type="button"
						class="shrink-0 rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-950/40"
						disabled={!canRemove}
						aria-label="Remove item"
						onclick={() => remove(index)}
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if canAdd}
		<div>
			<Button variant="outline" size="sm" onclick={add}>{addLabel}</Button>
		</div>
	{/if}
</div>
