<script lang="ts">
	export interface FilterChipItem {
		id: string;
		label: string;
		count?: number;
	}

	interface FilterChipsProps {
		items?: FilterChipItem[];
		value?: string[];
		multiple?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		items = [],
		value = $bindable([] as string[]),
		multiple = true,
		class: className = '',
		onchange
	}: FilterChipsProps = $props();

	function toggle(id: string) {
		if (multiple) {
			value = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
		} else {
			value = value.includes(id) ? [] : [id];
		}
		onchange?.(value);
	}
</script>

<div class={['flex flex-wrap gap-1.5', className]} role="group" aria-label="Filters">
	{#each items as item (item.id)}
		{@const active = value.includes(item.id)}
		<button
			type="button"
			aria-pressed={active}
			class={[
				'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
				active
					? 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300'
					: 'border-border bg-surface-elevated text-secondary hover:bg-surface-overlay hover:text-primary'
			]}
			onclick={() => toggle(item.id)}
		>
			{item.label}
			{#if item.count !== undefined}
				<span
					class={[
						'rounded-full px-1.5 py-px text-[10px] tabular-nums',
						active ? 'bg-brand-500/20' : 'bg-surface-overlay text-muted'
					]}
				>
					{item.count}
				</span>
			{/if}
		</button>
	{/each}
</div>
