<script lang="ts">
	export interface ListItem {
		id: string;
		label: string;
		description?: string;
		disabled?: boolean;
	}

	interface ListProps {
		items?: ListItem[];
		value?: string;
		selectable?: boolean;
		class?: string;
		onchange?: (id: string) => void;
		onclick?: (item: ListItem) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		selectable = false,
		class: className = '',
		onchange,
		onclick
	}: ListProps = $props();

	function activate(item: ListItem) {
		if (item.disabled) return;
		onclick?.(item);
		if (selectable) {
			value = item.id;
			onchange?.(item.id);
		}
	}
</script>

<ul class={['flex w-full flex-col gap-1', className]} role={selectable ? 'listbox' : 'list'}>
	{#each items as item (item.id)}
		<li role={selectable ? 'option' : 'listitem'} aria-selected={selectable ? value === item.id : undefined}>
			<button
				type="button"
				disabled={item.disabled}
				onclick={() => activate(item)}
				class={[
					'flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
					value === item.id
						? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
						: 'text-primary hover:bg-surface-overlay',
					item.disabled && 'cursor-not-allowed opacity-40'
				]}
			>
				<span class="text-sm font-medium">{item.label}</span>
				{#if item.description}
					<span class="text-xs text-secondary">{item.description}</span>
				{/if}
			</button>
		</li>
	{/each}
</ul>
