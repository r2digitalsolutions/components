<script lang="ts">
	export interface ChipBarItem {
		id: string;
		label: string;
		disabled?: boolean;
	}

	interface ChipBarProps {
		items?: ChipBarItem[];
		value?: string;
		multi?: boolean;
		values?: string[];
		class?: string;
		onchange?: (id: string) => void;
		onchangeMulti?: (ids: string[]) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		multi = false,
		values = $bindable<string[]>([]),
		class: className = '',
		onchange,
		onchangeMulti
	}: ChipBarProps = $props();

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		if (multi) {
			values = values.includes(id) ? values.filter((v) => v !== id) : [...values, id];
			onchangeMulti?.(values);
			return;
		}
		value = id;
		onchange?.(id);
	}

	function active(id: string) {
		return multi ? values.includes(id) : value === id;
	}
</script>

<div
	class={[
		'flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
		className
	]}
	role="listbox"
	aria-multiselectable={multi}
>
	{#each items as item (item.id)}
		<button
			type="button"
			role="option"
			aria-selected={active(item.id)}
			disabled={item.disabled}
			class={[
				'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-40',
				active(item.id)
					? 'border-brand-500 bg-brand-500 text-white'
					: 'border-border bg-surface-elevated text-secondary hover:bg-surface-overlay hover:text-primary'
			]}
			onclick={() => select(item.id, item.disabled)}
		>
			{item.label}
		</button>
	{/each}
</div>
