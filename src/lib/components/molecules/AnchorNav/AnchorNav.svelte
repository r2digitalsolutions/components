<script lang="ts">
	export interface AnchorItem {
		id: string;
		label: string;
	}

	interface AnchorNavProps {
		items?: AnchorItem[];
		activeId?: string;
		orientation?: 'vertical' | 'horizontal';
		class?: string;
		onselect?: (id: string) => void;
	}

	let {
		items = [],
		activeId = $bindable(''),
		orientation = 'vertical',
		class: className = '',
		onselect
	}: AnchorNavProps = $props();

	function select(id: string) {
		activeId = id;
		onselect?.(id);
		const el = document.getElementById(id);
		el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<nav
	aria-label="On this page"
	class={[
		'flex gap-1',
		orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
		className
	]}
>
	{#each items as item (item.id)}
		{@const active = activeId === item.id}
		<button
			type="button"
			class={[
				'rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
				active
					? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
					: 'text-secondary hover:bg-surface-overlay hover:text-primary'
			]}
			aria-current={active ? 'location' : undefined}
			onclick={() => select(item.id)}
		>
			{item.label}
		</button>
	{/each}
</nav>
