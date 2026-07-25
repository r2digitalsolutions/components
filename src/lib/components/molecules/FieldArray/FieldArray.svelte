<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import { fieldPath, getFormContext } from '$lib/utils/formContext.js';
	import { i18n } from '$lib/utils/i18n.svelte.js';

	export interface FieldArrayItem {
		id: string;
		[key: string]: unknown;
	}

	export interface FieldArrayMeta {
		/** Build a dotted path under this array, e.g. `path('email')` → `items.0.email` */
		path: (field: string) => string;
		getError: (field: string) => string | undefined;
		disabled: boolean;
	}

	interface FieldArrayProps<T extends FieldArrayItem = FieldArrayItem> {
		items?: T[];
		/**
		 * Key in `form.data` when `bindData` is true.
		 * Also used as the prefix for nested error paths.
		 */
		name?: string;
		/** Sync `items` with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		/** Minimum number of rows */
		min?: number;
		/** Maximum number of rows */
		max?: number;
		addLabel?: string;
		emptyLabel?: string;
		sortable?: boolean;
		disabled?: boolean;
		class?: string;
		/** Render each row; receives item, index, and path helpers */
		item?: Snippet<[T, number, FieldArrayMeta]>;
		/** Called when items change */
		onchange?: (items: T[]) => void;
		/** Factory for a new empty item */
		createItem?: () => T;
	}

	let {
		items = $bindable<FieldArrayItem[]>([]),
		name,
		bindData = false,
		min = 0,
		max = Infinity,
		addLabel,
		emptyLabel,
		sortable = false,
		disabled = false,
		class: className = '',
		item,
		onchange,
		createItem
	}: FieldArrayProps = $props();

	const form = getFormContext();
	const resolvedAddLabel = $derived(addLabel ?? i18n.t('addItem'));
	const resolvedEmptyLabel = $derived(emptyLabel ?? i18n.t('noItems'));
	const resolvedDisabled = $derived(
		disabled || Boolean(form?.loading) || Boolean(form?.disabled)
	);
	const arrayError = $derived(name && form ? form.getError(name) : undefined);

	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.data[name];
		if (Array.isArray(fromCtx) && fromCtx !== items) {
			items = fromCtx as FieldArrayItem[];
		}
	});

	function uid() {
		return `fa-${Math.random().toString(36).slice(2, 9)}`;
	}

	function defaultCreate(): FieldArrayItem {
		return { id: uid() };
	}

	function commit(next: FieldArrayItem[]) {
		items = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}

	function add() {
		if (resolvedDisabled || items.length >= max) return;
		commit([...items, (createItem ?? defaultCreate)()]);
	}

	function remove(index: number) {
		if (resolvedDisabled || items.length <= min) return;
		commit(items.filter((_, i) => i !== index));
	}

	function move(from: number, to: number) {
		if (resolvedDisabled || !sortable || to < 0 || to >= items.length) return;
		const next = [...items];
		const [row] = next.splice(from, 1);
		next.splice(to, 0, row);
		commit(next);
	}

	function metaFor(index: number): FieldArrayMeta {
		return {
			path: (field: string) => (name ? fieldPath(name, index, field) : fieldPath(index, field)),
			getError: (field: string) => {
				const key = name ? fieldPath(name, index, field) : fieldPath(index, field);
				return form?.getError(key);
			},
			disabled: resolvedDisabled
		};
	}

	const canAdd = $derived(!resolvedDisabled && items.length < max);
	const canRemove = $derived(!resolvedDisabled && items.length > min);
</script>

<div class={['flex flex-col gap-3', className]}>
	{#if arrayError}
		<FormError message={arrayError} />
	{/if}

	{#if items.length === 0}
		<p class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
			{resolvedEmptyLabel}
		</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each items as row, index (row.id)}
				{@const meta = metaFor(index)}
				<li
					class="flex items-start gap-2 rounded-xl border border-border bg-surface-elevated p-3"
				>
					{#if sortable}
						<div class="flex shrink-0 flex-col gap-0.5 pt-1">
							<button
								type="button"
								class="rounded p-0.5 text-muted hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
								disabled={resolvedDisabled || index === 0}
								aria-label="Move up"
								onclick={() => move(index, index - 1)}
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6" /></svg>
							</button>
							<button
								type="button"
								class="rounded p-0.5 text-muted hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
								disabled={resolvedDisabled || index === items.length - 1}
								aria-label="Move down"
								onclick={() => move(index, index + 1)}
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" /></svg>
							</button>
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						{#if item}
							{@render item(row, index, meta)}
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
			<Button variant="outline" size="sm" onclick={add}>{resolvedAddLabel}</Button>
		</div>
	{/if}
</div>
