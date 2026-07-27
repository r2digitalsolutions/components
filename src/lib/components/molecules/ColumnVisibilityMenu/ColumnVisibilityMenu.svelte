<script lang="ts">
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface ColumnVisibilityItem {
		id: string;
		label: string;
		visible?: boolean;
		locked?: boolean;
	}

	interface ColumnVisibilityMenuProps {
		columns?: ColumnVisibilityItem[];
		/** Alternative API: ids that are hidden */
		hiddenIds?: string[];
		title?: string;
		class?: string;
		onchange?: (columns: ColumnVisibilityItem[]) => void;
		onhiddenchange?: (hiddenIds: string[]) => void;
	}

	let {
		columns = $bindable<ColumnVisibilityItem[]>([]),
		hiddenIds = $bindable<string[]>([]),
		title = 'Columns',
		class: className = '',
		onchange,
		onhiddenchange
	}: ColumnVisibilityMenuProps = $props();

	const items = $derived.by(() => {
		if (columns.length) {
			return columns.map((c) => ({
				...c,
				visible: hiddenIds.length
					? !hiddenIds.includes(c.id)
					: (c.visible ?? true)
			}));
		}
		return [];
	});

	function emit(next: ColumnVisibilityItem[]) {
		columns = next;
		const hidden = next.filter((c) => c.visible === false).map((c) => c.id);
		hiddenIds = hidden;
		onchange?.(next);
		onhiddenchange?.(hidden);
	}

	function toggle(id: string) {
		const next = items.map((c) =>
			c.id === id && !c.locked ? { ...c, visible: !(c.visible ?? true) } : c
		);
		emit(next);
	}

	function showAll() {
		emit(items.map((c) => (c.locked ? c : { ...c, visible: true })));
	}

	function hideOptional() {
		emit(items.map((c) => (c.locked ? c : { ...c, visible: false })));
	}
</script>

<div
	class={[
		'w-56 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg',
		className
	]}
	data-column-visibility-menu
	role="group"
	aria-label={title}
>
	<div class="flex items-center justify-between border-b border-border px-3 py-2">
		<span class="text-xs font-semibold uppercase tracking-wide text-muted">{title}</span>
		<div class="flex gap-1">
			<Button size="sm" variant="ghost" onclick={showAll}>All</Button>
			<Button size="sm" variant="ghost" onclick={hideOptional}>None</Button>
		</div>
	</div>
	<ul class="max-h-64 overflow-auto p-1">
		{#each items as col (col.id)}
			<li>
				<label
					class={[
						'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-primary hover:bg-surface-overlay',
						col.locked ? 'opacity-60' : ''
					]}
				>
					<Checkbox
						checked={col.visible !== false}
						disabled={!!col.locked}
						onchange={(checked) => {
							if (checked === (col.visible !== false)) return;
							toggle(col.id);
						}}
					/>
					<span class="truncate">{col.label}</span>
				</label>
			</li>
		{/each}
		{#if !items.length}
			<li class="px-2 py-4 text-center text-xs text-muted">No columns</li>
		{/if}
	</ul>
</div>
