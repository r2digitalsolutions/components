<script lang="ts">
	export interface DescriptionItem {
		label: string;
		value: string;
		span?: 1 | 2;
	}

	interface DescriptionsProps {
		items?: DescriptionItem[];
		title?: string;
		columns?: 1 | 2 | 3;
		bordered?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	let {
		items = [],
		title,
		columns = 2,
		bordered = true,
		size = 'md',
		class: className = ''
	}: DescriptionsProps = $props();

	const gridCols: Record<1 | 2 | 3, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
	};
</script>

<div
	class={[
		'w-full overflow-hidden rounded-xl',
		bordered && 'border border-border bg-surface-elevated',
		className
	]}
>
	{#if title}
		<div
			class={[
				'border-b border-border font-semibold text-primary',
				size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm'
			]}
		>
			{title}
		</div>
	{/if}
	<dl class={['grid', gridCols[columns], bordered && 'divide-y divide-border sm:divide-y-0']}>
		{#each items as item, i (i)}
			<div
				class={[
					size === 'sm' ? 'px-3 py-2' : 'px-4 py-3',
					bordered && columns > 1 && 'sm:border-b sm:border-border',
					item.span === 2 && columns >= 2 && 'sm:col-span-2',
					item.span === 2 && columns >= 3 && 'lg:col-span-2'
				]}
			>
				<dt class={['font-medium text-muted', size === 'sm' ? 'text-xs' : 'text-xs']}>{item.label}</dt>
				<dd class={['mt-0.5 text-primary', size === 'sm' ? 'text-sm' : 'text-sm']}>{item.value}</dd>
			</div>
		{/each}
	</dl>
</div>
