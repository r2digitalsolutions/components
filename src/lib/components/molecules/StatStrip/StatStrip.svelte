<script lang="ts">
	export interface StatStripItem {
		id: string;
		label: string;
		value: string | number;
		hint?: string;
	}

	interface StatStripProps {
		items?: StatStripItem[];
		class?: string;
	}

	const { items = [], class: className = '' }: StatStripProps = $props();
</script>

<div
	class={[
		'grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4',
		className
	]}
>
	{#each items as item (item.id)}
		<div class="bg-surface-elevated px-4 py-3">
			<p class="text-xs font-medium text-muted">{item.label}</p>
			<p class="mt-1 text-lg font-semibold tabular-nums text-primary">{item.value}</p>
			{#if item.hint}
				<p class="mt-0.5 text-[11px] text-secondary">{item.hint}</p>
			{/if}
		</div>
	{/each}
</div>
